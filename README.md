# baton.js

baton.js is a javascript library to make it easy to handle midi input using the newish WebMIDI standard.

## webmidi

WebMIDI is supported in Chrome on OSX, but you have to enable it by visiting [chrome://flags/#enable-web-midi](chrome://flags/#enable-web-midi), clicking `enable`, and relaunching Chrome.

On other browsers/OSes, you can use the [WebMIDI API Polyfill](https://github.com/cwilso/WebMIDIAPIShim), which in turn requires the [Jazz-Soft Jazz Plugin](http://jazz-soft.net/).

## Examples

### handle multiple input sources identically

    // instantiate object
    midiMulti = new Baton();

    // create a function to be called once the midi connection is made
    listenMulti = function() {
        // listen to inputs 0 and 1
        midiMulti.listen(0);
        midiMulti.listen(1);
    };

    // connect to midi, set the function to be called when connected
    midiMulti.connect(listenMulti);

    // this callback is executed when a midi event is received.
    midiMulti.callback = function(m) { console.log("multi", m); };




### handle multiple input sources differently

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
