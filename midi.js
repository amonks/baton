
var midi=null;
var inputs=null;
var outputs=null;
var input=null;
var input2=null;
var output=null;
var radix = 10;

function start() {
    console.log( "Starting up MIDI...\n" );
    navigator.requestMIDIAccess().then( success, failure );
}

function handleMIDIMessage1( ev ) {
    // testing - just reflect.
    if (ev.data.length == 3)
        console.log( "Message on input 1: " + ev.data[0].toString(radix) + " " + ev.data[1].toString(radix) + " " + ev.data[2].toString(radix) + "\n" );
    if (output)
        output.send( ev.data );
}

function handleMIDIMessage2( ev ) {
    // testing - just reflect.
    if (ev.data.length == 3)
        console.log( "Message on input 2: " + ev.data[0].toString(radix) + " " + ev.data[1].toString(radix) + " " + ev.data[2].toString(radix) + "\n" );
    if (output)
        output.send( ev.data );
}

function success( m ) {
    console.log( "MIDI ready!\n" );
    midi = m;

    inputs = midi.inputs();
    console.log( inputs.length+" inputs:\n" );
    for (var i=0;i<inputs.length;i++) {
        console.log( i + ": " + inputs[i].name + "\n" );
    }
    if (inputs.length>=2) {
        input1 = inputs[0];
        input1.onmidimessage = handleMIDIMessage1;
        console.log( "Hooked up first input.\n" );
        input2 = inputs[1];
        input2.addEventListener( "midimessage", handleMIDIMessage2 );
        console.log( "Hooked up second input.\n" );
    }

    outputs = midi.outputs();
    console.log( outputs.length+" outputs:\n" );
    for (var i=0;i<outputs.length;i++) {
        console.log( i + ": " + outputs[i].name + "\n" );
    }
    if (outputs.length) {
        output = outputs[0];
        output.send( [0xb0, 0x00, 0x7f] );  // If the first device is a Novation Launchpad, this will light it up!
        output = outputs[outputs.length-1];
    }
}

function failure( error ) {
    alert( "Failed to initialize MIDI - " + ((error.code==1) ? "permission denied" : ("error code " + error.code)) );
}
