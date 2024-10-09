import { ClockSettings } from "./clock";

export class Clock extends ClockSettings {
  constructor(options) {
    super(options);
    this.name = "Countdown Timer";
  }
}

