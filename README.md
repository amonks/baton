# baton.js *v1.4.1*

baton.js is a javascript library to make it easy to handle midi input and output using the newish WebMIDI standard.

## [demo](http://baton.monks.co/examples/demo.html)

## webmidi

WebMIDI is supported in Chrome on OSX, but you have to enable it by visiting [chrome://flags/#enable-web-midi](chrome://flags/#enable-web-midi), clicking `enable`, and relaunching Chrome.

On other browsers/OSes, you can use the [WebMIDI API Polyfill](https://github.com/cwilso/WebMIDIAPIShim), which in turn requires the [Jazz-Soft Jazz Plugin](http://jazz-soft.net/).

### Caveat

In my experience, I need to relaunch Chrome every time I plug in a new MIDI source or (or open a DAW, or whatever) before it's recognized.

## Examples

You can check out the following example files to see how Baton works. Remember to enable the [web-midi flag](chrome://flags/#enable-web-midi) in Chrome.

They all require a MIDI source. You can either plug in a controller, or use [MidiKeys](http://www.manyetas.com/creed/midikeys.html)

*   [Use baton with a single input source callback](http://baton.monks.co/examples/single.html) shows basic midi input, with all controllers handled by the same function.

*   [use Baton with multiple input source callbacks](http://baton.monks.co/examples/multi.html) uses different functions to handle input from two different midi sources.

*   [Automatic MIDI Mapping with Baton](http://baton.monks.co/examples/mapping.html) shows how to easily map a variable to any midi control by clicking a button then twiddling that control.

*   [use Baton with processing.js](http://baton.monks.co/examples/processing.html) draws velocity-sized circle at note-position, at a color set from midi control signals

*   [use Baton to make sound with webPd](http://baton.monks.co/examples/sound.html) plays sine waves

*   [use Baton to control an external midi instrument](http://baton.monks.co/examples/send.html) sends midi notes

*   [use Baton with threejs](http://baton.monks.co/examples/3d.html) uses midi input to affect a 3d scene

*   [use the WebMIDIAPI shim](http://baton.monks.co/examples/shim.html) uses the WebMIDIAPI shim to add midi functionality to browsers that don't support WebMID3

*   [route midi over WebRTC](http://baton.monks.co/examples/rtc.html) uses webrtc to send midi data peer-to-peer over the internet. Use your controller to control your friend's synth over the internet.

## API

### Types

Here's a list of midi event types supported by baton.

*   noteoff

*   note

*   polypress

*   control

*   program

*   aftertouch

*   pitchbend

### `checkSupport()`

`checkSupport()` returns true if the browser supports WebMIDI or false if the browser does not.

### `connect(function callback)`

`connect(callback)` connects Baton to MIDI, and calls an optional callback function once it's connected.

    Baton.connect( Baton.print() );

### `check()`

`check()` returns `true` if Baton has an active midi connection, and `false` if it doesn't.

### `inputs()`

If baton is connected, `inputs()` returns an array of the available midi inputs.

    Baton.inputs();  # ["Bus 1", "MidiKeys"]

### `send(int output, object data)`

If baton is connected, `send(output, data)` sends a data packet out of the given output.

    var data = {
      type: "note",
      channel: 1,
      note: 100,
      value: 127
    };
    for (var o = 0; o < Baton.outputs().length; o++) {
      console.log("data to send", data);
      Baton.send(o, data);
    }

### `listen(int input)`

If baton is connected, `listen(input)` makes it start listening to the given input.

    // listen to input 0
    Baton.listen(0);

    // listen to all inputs
    for (var i = 0; i < Baton.inputs().length; i++) {
      Baton.listen(i);
    }

### `callback`

`callback` stores an optional callback fucntion which is executed when midi input is received.

    Baton.callback = function(midi) { console.log(midi); };

### `autoMap(string name, function fn)`

`autoMap(name, fn)` waits until the next MIDI input message, then maps that midi control to the function `fn`. The mapping is named `name`.

    var loudness;

    $('#map-button').on('click', function() {
        Baton.autoMap('loudness', function(m) {
            loudness = m.value;
        });
    });

### `autoMapObj(string name, object obj)`

`autoMapObj(name, obj)` waits until the next MIDI input message, then maps that midi control to the `value` of the object `obj`. The mapping is named `name`.

    var loudness = {value: 0};

    $('#map-button').on('click', function() {
        Baton.autoMapObj('loudness', loudness);
    });

### `mappings`

`mappings` is the array of mappings used by Baton. If you're careful, you can edit it manually, or you can simply use the `autoMap()` or `autoMapObj()` functions described above.

    Baton.mappings = [
      {
        'name': 'loudness',
        'midi': { channel: 1, note: 1, type: "control" },
        'fn': function(m) { loudness = m.value; }
      }
    ]

## Design Patterns

### Automap

[online demo](http://baton.monks.co/examples/mapping.html)

    // instantiate object
    var baton = new Baton();

    // instantiate mapped variable
    var paramVal = {value: null};

    // map function
    // perhaps use a button:
    // $('button#map-param').on('click', mapParam);
    function mapParam() {
      // call autoMap
      baton.autoMapObj('param', paramVal);
    });

    // create a function to be called once the midi connection is made
    listen = function() {
      // listen to all inputs
      for (var i = 0; i < baton.inputs().length; i++) {
        baton.listen(i);
      }
    };

    // connect to midi, set the function to be called when connected
    baton.connect(listen);

### Handle all input sources identically

[online demo](http://baton.monks.co/examples/single.html)

    // instantiate object
    baton = new Baton();

    // create a function to be called once the midi connection is made
    listenMulti = function() {
      // listen to all inputs
      for (var i = 0; i < baton.inputs().length; i++) {
        baton.listen(i);
      }
    };


    // connect to midi, set the function to be called when connected
    baton.connect(listenMulti);

    // this callback is executed when a midi event is received.
    baton.callback = function(m) { console.log("multi", m); };

### handle specific input sources differently

[online demo](http://baton.monks.co/examples/multi.html)

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

### send

[online demo](http://baton.monks.co/examples/send.html)

    // instantiate object
    baton = new Baton();

    // create a function to be called once the midi connection is made
    sender = function() {
      // every 5 seconds
      setInterval(function() {
        // turn the note on
        console.log("note on");
        for (var o = 0; o < baton.outputs().length; o++) {
          var data = {
            type: "note",
            channel: 1,
            note: 100,
            value: 127
          };
          baton.send(o, data);
        }
        // then one second later
        setTimeout(function() {
          // turn the note off
          console.log("note off");
          for (var o = 0; o < baton.outputs().length; o++) {
            var data = {
              type: "noteoff",
              channel: 1,
              note: 100,
              value: 0
            };
            baton.send(o, data);
          }
        }, 1000);
      }, 2000);
    };

    // connect to midi, set the function to be called when connected
    baton.connect(sender);
