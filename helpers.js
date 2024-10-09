// called by the run method

export function setTimer(that, sec) {
  setInterval(() => {
    sec--;

    // Time has run out
    if (sec <= 0) {
      clearInterval(timer);
      that.outOfInterval();
      that.callback("end");
    } else if (that.isStarted()) {
      if (!that.started) {
        that.callback("start");
        that.started = true;
      }

      that.display(sec);
    }
  }, this.interval);
}

export function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}