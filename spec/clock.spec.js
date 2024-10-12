import Clock from '../src/clock.js';
import jest from 'jest';

describe('Clock', () => {
  let clock;

  beforeEach(() => {
    jest.useFakeTimers();
    document.body.innerHTML = '<div id="clock"></div>';
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should initialize with default values', () => {
    clock = new Clock();
    expect(clock.config.selector).toBe('#clock');
    expect(clock.config.msgBefore).toBe('Be ready!');
    expect(clock.config.msgAfter).toBe("It's over, sorry folks!");
  });

  it('should display the correct countdown message', () => {
    const now = new Date('2023-01-01T00:00:00');
    const end = new Date('2023-01-02T00:00:00');
    jest.setSystemTime(now);

    clock = new Clock({
      dateEnd: end,
      msgPattern: '{days} days, {hours} hours left'
    });

    const clockElement = document.querySelector('#clock');
    expect(clockElement.innerHTML).toBe('1 days, 0 hours left');
  });

  it('should display msgBefore when current time is before start time', () => {
    const start = new Date('2023-01-02T00:00:00');
    const end = new Date('2023-01-03T00:00:00');
    jest.setSystemTime(new Date('2023-01-01T00:00:00'));

    clock = new Clock({
      dateStart: start,
      dateEnd: end,
      msgBefore: 'Not started yet'
    });

    const clockElement = document.querySelector('#clock');
    expect(clockElement.innerHTML).toBe('Not started yet');
  });

  it('should display msgAfter when current time is after end time', () => {
    const end = new Date('2023-01-01T00:00:00');
    jest.setSystemTime(new Date('2023-01-02T00:00:00'));

    clock = new Clock({
      dateEnd: end,
      msgAfter: 'Countdown finished'
    });

    const clockElement = document.querySelector('#clock');
    expect(clockElement.innerHTML).toBe('Countdown finished');
  });

  it('should use leading zeros when configured', () => {
    const now = new Date('2023-01-01T00:00:00');
    const end = new Date('2023-01-01T00:09:09');
    jest.setSystemTime(now);

    clock = new Clock({
      dateEnd: end,
      msgPattern: '{minutes}:{seconds}',
      leadingZeros: true
    });

    const clockElement = document.querySelector('#clock');
    expect(clockElement.innerHTML).toBe('09:09');
  });

  it('should call onStart callback when countdown starts', () => {
    const now = new Date('2023-01-01T00:00:00');
    const start = new Date('2023-01-01T00:00:01');
    const end = new Date('2023-01-01T00:00:10');
    jest.setSystemTime(now);

    const onStart = jest.fn();
    clock = new Clock({
      dateStart: start,
      dateEnd: end,
      onStart
    });

    jest.advanceTimersByTime(1000);
    expect(onStart).toHaveBeenCalledTimes(1);
  });

  it('should call onEnd callback when countdown ends', () => {
    const now = new Date('2023-01-01T00:00:00');
    const end = new Date('2023-01-01T00:00:05');
    jest.setSystemTime(now);

    const onEnd = jest.fn();
    clock = new Clock({
      dateEnd: end,
      onEnd
    });

    jest.advanceTimersByTime(5000);
    expect(onEnd).toHaveBeenCalledTimes(1);
  });
});

