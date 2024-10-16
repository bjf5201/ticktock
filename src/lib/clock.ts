import { capitalize } from "./helpers.js";

interface ClockConfig {
  dateStart?: Date;
  dateEnd?: Date;
  selector?: string;
  msgBefore?: string;
  msgAfter?: string;
  msgPattern?: string;
  onStart?: () => void;
  onEnd?: () => void;
  leadingZeros?: boolean;
  initialize?: boolean;
}
class Clock {
  dateStart: Date = new Date();
  dateEnd: Date = new Date(new Date().getTime() + (24 * 60 * 60 * 1000));
  selector = "#clock";
  msgBefore = `Countdown will begin on ${this.dateStart}!`;
  msgAfter = "Countdown has ended.";
  msgPattern = "{days} days, {hours} hours, {minutes} minutes and {seconds} seconds left.";
  onStart = () => console.log("Countdown has started.");
  onEnd = () => console.log("Countdown has ended.");
  leadingZeros = false;
  initialize = true;
  #started;
  #selector;
  #interval;
  #patterns;
  constructor(config: Partial<ClockConfig> = {}) {
    this.dateStart = config.dateStart || this.dateStart;
    this.dateEnd = config.dateEnd || this.dateEnd;
    this.selector = config.selector || this.selector;
    this.msgBefore = config.msgBefore || this.msgBefore;
    this.msgAfter = config.msgAfter || this.msgAfter;
    this.msgPattern = config.msgPattern || this.msgPattern;
    this.onStart = config.onStart || this.onStart;
    this.onEnd = config.onEnd || this.onEnd;
    this.leadingZeros = config.leadingZeros ?? this.leadingZeros;
    this.initialize = config.initialize ?? this.initialize;
    // default values private to the Clock class
    this.#started = false;
    this.#selector = document.querySelectorAll(this.selector);
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

    if (this.initialize !== false) {
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

  #seconds(date:Date) {
    return date.getTime() / 1000;
  }

  #hasStarted() {
    return this.#seconds(new Date()) >= this.#seconds(this.dateStart);
  }

  #isOver() {
    return this.#seconds(new Date()) >= this.#seconds(this.dateEnd);
  }

  #startClock() {
    let sec = Math.abs(this.#seconds(this.dateEnd) - this.#seconds(new Date()));

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
        if (!this.#started) {
          this.#callback("start");
          this.#started = true;
        }
        this.#display(sec);
      }
    }, this.#interval);
  }

  #display(sec) {
    let output = this.msgPattern;

    for (const { pattern, secs } of this.#patterns) {
      if (this.msgPattern.includes(pattern)) {
        const number = Math.floor(sec / secs);
        const displayed: string = this.leadingZeros && number <= 9 ? `0${number}` : number.toString();
        sec -= number * secs;
        output = output.replace(pattern, displayed);
      }
    }

    this.#selector.forEach(el => {
      el.innerHTML = output;
    });
  }

  #defineInterval() {
    for (let i = this.#patterns.length - 1; i >= 0; i--) {
      const { pattern, secs } = this.#patterns[i];
      if (this.msgPattern.includes(pattern)) {
        this.#interval = secs * 1000;
        return;
      }
    }
  }

  #outOfInterval() {
    const message = new Date() < this.dateStart ? this.msgBefore : this.msgAfter;
    this.#selector.forEach(el => {
      if (el.innerHTML !== message) {
        el.innerHTML = message;
      }
    });
  }

  #callback(event) {
    const e = capitalize(event);

    if (typeof this[`on${e}`] === "function") {
      this[`on${e}`]();
    }

    if (typeof globalThis.jQuery !== "undefined") {
      globalThis.jQuery(this.#selector).trigger(`countdown${e}`);
    }
  }
}

export default Clock;
