function MidiJS() {

  var API = {};

  var input = null;
  var midi = null;
  var inputName = null;

  API.print = function() {
    console.log("print");
    var out = navigator.requestMIDIAccess().then(printMidiInputs, failure);
    return out;
  };

  API.start = function(i) {
    console.log("start");
    API.setInput(i);
    navigator.requestMIDIAccess().then(success, failure);
  };

  API.setInput = function(i) {
    input = i;
  };

  API.getInput = function() {
    return input;
  };

  setInputName = function(i) {
    inputName = i;
  };

  API.getInputName = function() {
    return inputName;
  };

  inputs = null;


  success = function(m) {
    midi = m;
    console.log("success");
    var i = API.getInput();
    setInputName(midi.inputs()[i].name);
    midi.inputs()[i].onmidimessage = handleMIDIMessage;
    console.log("Hooked up input # " + i + ": " + API.getInputName() );
  };

  failure = function(error) {
    console.log("failure");
    alert("Failed to initialize MIDI - " + ((error.code == 1) ? "permission denied" : ("error code " + error.code)));
  };

  printMidiInputs = function(m) {
    midi = m;
    console.log("printMidiInputs");
    out = midi.inputs();
    console.log("inputs: ", out);
    return out;
  };

  handleMIDIMessage = function(ev) {
    console.log("handleMIDIMessage");
    if (ev.data.length == 3) {
      message = {
        input: API.getInput(),
        channel: parseInt(ev.data[0].toString(10)) - 143,
        note: parseInt(ev.data[1].toString(10)),
        value: parseInt(ev.data[2].toString(10))
      };
      console.log(message);
    }
  };

  return API;

}
