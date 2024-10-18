import Clock from "./lib/main.js";

const birthdayClock = new Clock({
  dateEnd: new Date("2024-12-06"), 
  selector: "#birthday",
  onStart: () => console.log("The countdown until my birthday has started!"),
  onEnd: () => alert("Happy Birthday to me!"),
});

const newYearsClock = new Clock({
  dateStart: new Date("2024-11-21"),
  dateEnd: new Date("2025-01-01"),
  selector: "#new-years",
  msgBefore: "Countdown begins on Thanksgiving Day!",
  msgAfter: "Happy New Year!",
  msgPattern: "New Years Countdown: {days} days, {hours} hours, {minutes} minutes and {seconds} seconds.",
  leadingZeros: true,
});

const defaultClock = new Clock();