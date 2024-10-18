import Clock from '../src/lib/clock.ts';

describe('Clock', () => {
  let clock: Clock;
  let customClock: Clock;
  const defaultConfig = {
    dateStart: new Date(),
    dateEnd: new Date(new Date().getTime() + 1000 * 60 * 60 * 24),
    selector: '#clock',
    msgBefore: 'Countdown begins soon!',
    msgAfter: 'Countdown has ended.',
    msgPattern: '{days} days, {hours} hours, {minutes} minutes and {seconds} seconds left.',
    onStart: () => console.log('Countdown has started.'),
    onEnd: () => console.log('Countdown has ended.'),
    leadingZeros: false,
    initialize: true,
  };
  
  const customConfig = {
    dateStart: new Date(),
    dateEnd: new Date('2025-01-01'),
    selector: '#new-years',
    msgBefore: 'Countdown begins now!',
    msgAfter: 'Happy New Years!',
    msgPattern: 'NEW YEARS COUNTDOWN: {days}:{hours}:{minutes}:{seconds}',
    onStart: () => console.log('3..2..1..'),
    onEnd: () => console.log('..Happy New Years!'),
    leadingZeros: true,
    initialize: true,
  };

  clock = new Clock(defaultConfig);
  customClock = new Clock(customConfig);

  describe('Default Clock constructor', () => {
    it('should create a new Clock instance', () => {
      expect(clock).toBeInstanceOf(Clock);
    });
    it('should create the correct default Config object options', () => {
      expect(clock.dateStart).toEqual(defaultConfig.dateStart);
      expect(clock.dateEnd).toEqual(defaultConfig.dateEnd);
      expect(clock.selector).toEqual(defaultConfig.selector);
      expect(clock.msgBefore).toEqual(defaultConfig.msgBefore);
      expect(clock.msgAfter).toEqual(defaultConfig.msgAfter);
      expect(clock.msgPattern).toEqual(defaultConfig.msgPattern);
      expect(clock.onStart).toEqual(defaultConfig.onStart);
      expect(clock.onEnd).toEqual(defaultConfig.onEnd);
      expect(clock.leadingZeros).toEqual(defaultConfig.leadingZeros);
      expect(clock.initialize).toEqual(defaultConfig.initialize);
    });
  })

  describe('Custom Clock constructor', () => {
    it('should create a new Clock instance', () => {
      expect(customClock).toBeInstanceOf(Clock);
    });
    it('should create the correct custom Config object options', () => {
      expect(customClock.dateStart).toEqual(customConfig.dateStart);
      expect(customClock.dateEnd).toEqual(customConfig.dateEnd);
      expect(customClock.selector).toEqual(customConfig.selector);
      expect(customClock.msgBefore).toEqual(customConfig.msgBefore);
      expect(customClock.msgAfter).toEqual(customConfig.msgAfter);
      expect(customClock.msgPattern).toEqual(customConfig.msgPattern);
      expect(customClock.onStart).toEqual(customConfig.onStart);
      expect(customClock.onEnd).toEqual(customConfig.onEnd);
      expect(customClock.leadingZeros).toEqual(customConfig.leadingZeros);
      expect(customClock.initialize).toEqual(customConfig.initialize);
    });
  });

  jest.mock('node:fs');

  describe('Clock.prototype.onStart', () => {
    it('should log the correct message to the console', () => {
      const consoleSpy = jest.spyOn(console, 'log');
      clock.onStart();
      customClock.onStart();
      expect(consoleSpy).toHaveBeenCalledWith('Countdown has started.');
      expect(consoleSpy).toHaveBeenCalledWith('3..2..1..');
    });
  });
});