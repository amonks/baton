function MidiJS() {

  var API = {};

  API.input = null;
  API.inputName = null;

  API.print = function() {
    console.log("print");
    navigator.requestMIDIAccess().then(printMidiInputs, failure);
  };

  API.start = function() {
    console.log("start");
    navigator.requestMIDIAccess().then(success, failure);
  };


  var midi = null;
  var inputs = null;


  success = function(midi) {
    console.log("success");
    inputs = midi.inputs();
    var i = API.input;
    inputs[i].onmidimessage = handleMIDIMessage;
    console.log("Hooked up input # " + i + ": " + inputs[i].name);
  };

  failure = function(error) {
    console.log("failure");
    alert("Failed to initialize MIDI - " + ((error.code == 1) ? "permission denied" : ("error code " + error.code)));
  };

  printMidiInputs = function(midi) {
    console.log("printMidiInputs");
    inputs = midi.inputs();
    console.log("inputs: ", inputs);
  };

  handleMIDIMessage = function(ev) {
    console.log("handleMIDIMessage");
    if (ev.data.length == 3) {
      message = {
        input: API.input,
        channel: parseInt(ev.data[0].toString(10)) - 143,
        note: parseInt(ev.data[1].toString(10)),
        value: parseInt(ev.data[2].toString(10))
      };
      console.log(message);
    }
  };

  return API;

}
