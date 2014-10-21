var midi = null;
var inputs = null;

function start() {
  console.log("Starting up MIDI...\n");
  navigator.requestMIDIAccess().then(success, failure);
}

function handleMIDIMessage(ev) {
  if (ev.data.length == 3) {
    message = {
      channel: parseInt(ev.data[0].toString(10)) - 143,
      note: parseInt(ev.data[1].toString(10)),
      value: parseInt(ev.data[2].toString(10))
    };
    console.log(message);
  }
}

function success(midi) {
  console.log("MIDI ready!\n");
  inputs = midi.inputs();
  console.log(inputs.length + " inputs:\n");
  for (var input in inputs) {
    console.log(input + ": " + inputs[input].name + "\n");
    inputs[input].onmidimessage = handleMIDIMessage;
    console.log("Hooked up input # " + input + " .\n");
  }
}

function failure(error) {
  alert("Failed to initialize MIDI - " + ((error.code == 1) ? "permission denied" : ("error code " + error.code)));
}
