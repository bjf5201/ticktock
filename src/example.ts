import Clock from "./lib/main.js";

const birthdayClock = new Clock({
  selector: "#birthday",
  dateEnd: new Date("2024-12-06"),
  msgBefore: "Countdown has not started yet.",
  msgAfter: "Countdown has ended.",
  onStart: () => {
    console.log("Countdown has started! Woohoo!");
  },
  onEnd: () => {
    console.log("Countdown has ended. Bummer!");
  },
});

const defaultClock = new Clock();