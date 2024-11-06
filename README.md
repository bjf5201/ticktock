ticktock
============

*ticktock* is a little yet customizable countdown made with TypeScript using zero dependencies.

## Features
* [Jest](https://jestjs.io/) powered-tests
* ~2.2kb (~1kb once gzipped)
* Zero-dependencies

## Examples

```javascript
// Instanciating a new countdown clock with all defaults
new Clock();

// Instanciating a custom countdown clock
var countdownClock = new Clock({
    name: 'Christmas Clock',
    selector: '#timer', #default selector is #clock
    startMessage: "Will on December first at midnight!",
    endMessage: "Happy New Years!",
    msgPattern: "{days} days, {hours} hours, {minutes} minutes, and {seconds} seconds before New Years!",
    startDate: new Date('2024/12/01 12:00'),
    endDate: new Date('Jan 1, 2025 12:00:00')
});
```

You can also play around with the code at [CodePen](https://codepen.io/bjf5201/pen/ExqgPzZ).

## Options

You can pass the constructor number of options, including:

#### `selector`

The selector you want to inject the Clock into. It should be a valid string for `document.querySelector()`.

*Default*: `#clock`

#### `startMessage`

The message to display before reaching `dateStart`.

*Default*: `"Countdown will begin on {startDate}"`

#### `endMessage`

The message to display once reaching `dateEnd`.

*Default*: `"Countdown ended on {endDate}"`

#### `msgPattern`

The message to display during the countdown where values between braces get replaced by actual numeric values.
Possible patterns:

* `{years}`
* `{months}`
* `{weeks}`
* `{days}`
* `{hours}`
* `{minutes}`
* `{seconds}`

*Default*: `"{days} days, {hours} hours, {minutes} minutes and {seconds} seconds left."`

#### `startDate`

The date to start the countdown to. Should be a valid instance of class `Date`. Documentation [here at MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date).

*Default*: `new Date()` (now)

#### `endDate`

The date to end the countdown to. Should be a valid instance of class `Date`. Documentation [here at MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date).

*Default*: `new Date(new Date().getTime() + (24 * 60 * 60 * 1000))` (tomorrow)

#### `onStart`

The function to be called whenever the countdown starts.

*Default*: `null`

#### `onEnd`

The function to be called whenever the countdown stops.

*Default*: `null`

#### `leadingZeros`

Defines whether or not leading zeros are displayed when numbers are between `0` and `9`.

*Default*: `null`

#### `initialize`

Defines whether or not the countdown should be initialized when instancied. If set to `false`, you can manually launch it with `.initialize()`.

*Default*: `true`

## jQuery events

The script doesn't require jQuery at all meanwhile it fires two events on your element if you happen to have jQuery loaded: `countdownStart` and `countdownEnd`. You can use them this way:

``` javascript
new Countdown({
    selector: '#alarm'
})

$('#alarm').on('countdownStart', function() {
    // do something
});
```

