# baton.js

baton.js is a javascript library to make it easy to handle midi input using the newish WebMIDI standard.

## webmidi

WebMIDI is supported in Chrome on OSX, but you have to enable it by visiting [chrome://flags/#enable-web-midi](chrome://flags/#enable-web-midi), clicking `enable`, and relaunching Chrome.

On other browsers/OSes, you can use the [WebMIDI API Polyfill](https://github.com/cwilso/WebMIDIAPIShim), which in turn requires the [Jazz-Soft Jazz Plugin](http://jazz-soft.net/).

## API

### `callback`

`callback` stores an optional callback fucntion which is executed when midi input is received.

    Baton.callback = function(midi) { console.log(midi); };

### `connect(callback)`

`connect(callback)` connects Baton to MIDI, and calls an optional callback function once it's connected.

    Baton.connect( Baton.print() );

### `check()`

`check()` returns `true` if Baton has an active midi connection, and `false` if it doesn't.

### `inputs()`

If baton is connected, `inputs()` returns an array of the available midi inputs.

    Baton.inputs();  # ["Bus 1", "MidiKeys"]

### `listen(input)`

If baton is connected, `listen(input)` makes it start listening to the given input.

    // listen to input 0
    Baton.listen(0);

    // listen to all inputs
    for (var i = 0; i < Baton.inputs().length; i++) {
      Baton.listen(i);
    }



## Examples

### Handle all input sources identically

    // instantiate object
    midiMulti = new Baton();

    // create a function to be called once the midi connection is made
    listenMulti = function() {
        // listen to all inputs
        for (var i = 0; i < listenMulti.inputs().length; i++) {
          listenMulti.listen(i);
        }
    };

    // connect to midi, set the function to be called when connected
    midiMulti.connect(listenMulti);

    // this callback is executed when a midi event is received.
    midiMulti.callback = function(m) { console.log("multi", m); };

### handle specific input sources differently

    // instantiate objects
    midiZero = new Baton();
    midiOne = new Baton();

    // create functions to be called once the midi connections are made
    listenZero = function() { midiZero.listen(0); };
    listenOne = function() { midiOne.listen(1); };

    // connect to midi, set the functions to be called when connected
    midiZero.connect(listenZero);
    midiOne.connect(listenOne);

    // these callbacks are executed when a midi event is received.
    midiZero.callback = function(m) { console.log("midiZero", m); };
    midiOne.callback = function(m) { console.log("midiOne", m); };

