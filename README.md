# ReCallMe

A micro js library to allows you to manage errors by restarting the original function.

Mainly used to restart ajax call, long polling stuff, ...

You can can provide the maximum number of fail in a given time range.

## Usage

ReCallMe has no dependencies and can be used completely standalone.

### Browser

Include *recallme.min.js* in your web app, by loading it as usual:

```html
<script src="recallme.min.js"></script>
```

### [Ender](http://ender.no.de/)

    ender build recallme

### NodeJS

    npm install recallme

## Define restart strategy

```javascript
callMe(function(errback) {
    $.ajax({
       url: 'http://example.org/',
       error: errback
    })
}).max(3) //times
  .seconds(4) // minutes, hours
  .delay(function(nbErrors) {
    return nbErrors * 2;
  })
  .onError(function() {
    alert('too many attempt')
}).run();
```

In this example, the `function` in parameter of `callMe` will be called max *3 times* in *4 seconds* if the errback parameter is called. Otherwise the `function` in parameter of `onError` will be called.

## API

`callMe(function)`: the initial contructor. You have to pass the function to *monitor*.

`max(number)`: define the number of time we have to recalled the *runnable* function. Can depends on the number of fail by seconds.

`seconds(number)`: define the number of seconds where `max` error will trigger to stop the *moitoring*.

`minutes(number)`: define the number of minutes.

`hours(number)`: define the number of hours.

`delay(function)`: should return the number of second before next restart. The function take the current number of fail. Default delay is 0.

`onError(function)`: if more than `max` number of restarts occur in the last `number` of seconds/minutes/hours, then the function in parameter will be called.

`run()`: start the *monitoring*.

## Ender Support

```javascript
$.callMe(function() {}).run();

var re = require('recallme');
re.callMe(function() {}).run()
```

## NodeJS

```javascript
var re = require('recallme');
re.callMe(function() {}).run()
```

## Why?

Because I want a standalone library to allowing to repeat an action if an error occurs.

## License

MIT License

Copyright (C) 2011 François de Metz

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
