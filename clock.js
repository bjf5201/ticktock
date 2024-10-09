import { setTimer, capitalize } from "./helpers.js";

export class ClockSettings {
  #started
  #selector
  #interval
  #patterns
  #config
  constructor(options) {
    // Private config set with public options?
    this.#config = {
      // Start and stop dates & times (in milliseconds)
      // Start date defaults to now, end date defaults to 24 hours from now
      startDate: options.startDate || new Date(),
      endDate: options.endDate || new Date(new Date().getTime() + (24 * 60 * 60 * 1000)),
      // Default selector uses an ID CSS selector to ensure uniqueness
      selector: options.selector || "#clock",
      startMessage: options.startMessage || `Countdown will begin on ${startDate}`,
      endMessage: options.endMessage || `The countdown ended on ${endDate}`,
      // Include config options for callback methods which would be null by default,
      // but can be set to a function to be called when the countdown starts or ends
      onStart: options.onStart || null,
      onEnd: options.onEnd || null,
      // TODO: Find out what these leading zeros are for
      leadingZeros: options.leadingZeros || false,
      // Initialize the clock on creation (pageload in browser environment) by default
      initialize: options.initialize || true
    };

    this.#started = false;
    this.#selector = document.querySelectorAll(this.#config.selector);
    this.#interval = 1000;
    this.#patterns = [
      { pattern: "{years}", secs: 31536000 },
      { pattern: "{months}", secs: 2628000 },
      { pattern: "{weeks}", secs: 604800 },
      { pattern: "{days}", secs: 86400 },
      { pattern: "{hours}", secs: 3600 },
      { pattern: "{minutes}", secs: 60 },
      { pattern: "{seconds}", secs: 1 }
    ];

    // Private methods
    if (this.#config.initialize !== false) {
      this.initialize();
    }
  }

  // Initialize the clock
  initialize() {
    this.defineInterval();

    // Return function to stop clock if endDate has already passed
    if (this.hasEnded()) {
      return this.outOfInterval();
    }

    this.run();
  }

  // Convert a date into seconds
  seconds(date) {
    return date.getTime() / 1000;
  }

  // Return if countdown has started yet
  isStarted() {
    return this.seconds(new Date()) >= this.seconds(this.#config.startDate);
  }

  // Return if countdown has ended yet
  hasEnded() {
    return this.seconds(new Date()) >= this.seconds(this.#config.endDate);
  }

  // Begin the countdown
  countdownBegin() {
    let that = this;
    let sec = Math.abs(this.seconds(this.#config.endDate) - this.seconds(new Date()));
    let timer;

    // Initial clock display before first interval (tick)
    if (this.isStarted()) {
      this.display(sec);
    } else {
      this.outOfInterval();
    }

    timer = setTimer(that, sec);
  };

  // Display the countdown
  display(sec) {
    let output = this.#config.msgPattern;

    // Loop through the patterns
    for (let i in this.#patterns) {
      let currentPattern = this.#patterns[i];

      if (this.#config.msgPattern.indexOf(currentPattern.pattern) !== -1) {
        let time = Math.floor(sec / currentPattern.secs);
        let displayedTime = this.#config.leadingZeros && time <= 9 ? `0${time}` : time;
        sec -= time * currentPattern.secs;
        output = output.replace(currentPattern.pattern, displayedTime);
      }
    }

    for (let el in this.#selector) {
      this.#selector[el].innerHTML = output;
    }      
  };

  // Define the interval (ticks) for page refresh
  defineInterval() {
    for (let pattern in this.#patterns) {
      let currentPattern = this.#patterns[pattern - 1];

      if (this.#config.msgPattern.indexOf(currentPattern.pattern) !== -1) {
        this.#interval = currentPattern.secs * 1000;
        return;
      }
    }
  };

  outOfInterval() {
    let message = new Date() < this.#config.startDate ? this.#config.startMessage : this.#config.endMessage;

    for (let el in this.#selector) {
      if (this.#selector[el].innerHTML !== message) {
        this.#selector[el].innerHTML = message;
      }
    }
  };

  callback(event) {
    let standardizedEvent = capitalize(event);

    // onStart callback
    if (typeof this.#config[`on${standardizedEvent}`] === "function") {
      this.#config[`on${standardizedEvent}`]();
    }

    // Trigger jQuery event if jQuery is loaded
    if (typeof jQuery !== "undefined") {
      jQuery(this.#selector).trigger(`countdown${standardizedEvent}`);
    }
  };

}