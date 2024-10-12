import { capitalize } from "./helpers.js";

class Clock {
  constructor({
    // TODO: Make it so that Date constructor is created automatically and user
    // does not have to implement it themselves.
    dateStart = new Date(),
    dateEnd = new Date(new Date().getTime() + (24 * 60 * 60 * 1000)),
    selector = "#clock",
    msgBefore = `Countdown will begin on ${this.dateStart}!`,
    msgAfter = "Countdown has ended.",
    msgPattern = "{days} days, {hours} hours, {minutes} minutes and {seconds} seconds left.",
    onStart = function () {
      console.log("Countdown has started.");
    },
    onEnd = function () {
      console.log("Countdown has ended.");
    },
    leadingZeros = false,
    initialize = true
  } = {}) {
    this.config = {
      dateStart,
      dateEnd,
      selector,
      msgBefore,
      msgAfter,
      msgPattern,
      onStart,
      onEnd,
      leadingZeros,
      initialize
    };

    this.started = false;
    this.selector = document.querySelectorAll(this.config.selector);
    this.interval = 1000;
    this.patterns = [
      { pattern: "{years}", secs: 31536000 },
      { pattern: "{months}", secs: 2628000 },
      { pattern: "{weeks}", secs: 604800 },
      { pattern: "{days}", secs: 86400 },
      { pattern: "{hours}", secs: 3600 },
      { pattern: "{minutes}", secs: 60 },
      { pattern: "{seconds}", secs: 1 }
    ];

    if (this.config.initialize !== false) {
      this.#initialize();
    }
  }

  #initialize() {
    this.#defineInterval();

    if (this.#isOver()) {
      return this.#outOfInterval();
    }

    this.#startClock();
  }

  #seconds(date) {
    return date.getTime() / 1000;
  }

  #hasStarted() {
    return this.#seconds(new Date()) >= this.#seconds(this.config.dateStart);
  }

  #isOver() {
    return this.#seconds(new Date()) >= this.#seconds(this.config.dateEnd);
  }

  #startClock() {
    let sec = Math.abs(this.#seconds(this.config.dateEnd) - this.#seconds(new Date()));

    if (this.#hasStarted()) {
      this.#display(sec);
    } else {
      this.#outOfInterval();
    }

    const timer = setInterval(() => {
      sec--;

      if (sec <= 0) {
        clearInterval(timer);
        this.#outOfInterval();
        this.#callback("end");
      } else if (this.#hasStarted()) {
        if (!this.started) {
          this.#callback("start");
          this.started = true;
        }
        this.#display(sec);
      }
    }, this.interval);
  }

  #display(sec) {
    let output = this.config.msgPattern;

    for (const { pattern, secs } of this.patterns) {
      if (this.config.msgPattern.includes(pattern)) {
        const number = Math.floor(sec / secs);
        const displayed = this.config.leadingZeros && number <= 9 ? `0${number}` : number;
        sec -= number * secs;
        output = output.replace(pattern, displayed);
      }
    }

    this.selector.forEach(el => {
      el.innerHTML = output;
    });
  }

  #defineInterval() {
    for (let i = this.patterns.length - 1; i >= 0; i--) {
      const { pattern, secs } = this.patterns[i];
      if (this.config.msgPattern.includes(pattern)) {
        this.interval = secs * 1000;
        return;
      }
    }
  }

  #outOfInterval() {
    const message = new Date() < this.config.dateStart ? this.config.msgBefore : this.config.msgAfter;
    this.selector.forEach(el => {
      if (el.innerHTML !== message) {
        el.innerHTML = message;
      }
    });
  }

  #callback(event) {
    const e = capitalize(event);

    if (typeof this.config[`on${e}`] === "function") {
      this.config[`on${e}`]();
    }

    if (typeof jQuery !== "undefined") {
      jQuery(this.config.selector).trigger(`countdown${e}`);
    }
  }
}

export default Clock;
