function Baton() {

  var API = {};

  var input = null;
  var midi = null;
  var inputName = null;
  var connectCallback = null;

  API.callback = null;

  var inputs = null;

  API.connect = function(callback) {
    connectCallback = callback;
    navigator.requestMIDIAccess().then(success, failure);
  };

  API.check = function() {
    if ( midi === null ) {
      return false;
    } else {
      return true;
    }
  };

  API.inputs = function() {
    return inputs;
  };

  API.listen = function(i) {
    if (API.check() === true) {
      midi.inputs()[i].onmidimessage = handleMIDIMessage;
      console.log("Hooked up input # " + i + ": " + midi.inputs()[i].name );
    } else {
      console.log("Not connected.");
    }
  };



  var getInputs = function() {
    out = [];
    for (var i in midi.inputs()) {
      out.push( midi.inputs()[i].name );
    }
    inputs = out;
  };

  var success = function(m) {
    console.log("connected!");
    midi = m;
    getInputs();
    if (typeof connectCallback === 'function') {
     connectCallback();
   }
  };

  var failure = function(error) {
    alert("Failed to initialize MIDI - " + ((error.code == 1) ? "permission denied" : ("error code " + error.code)));
  };

  var handleMIDIMessage = function(ev) {
    var message = {};
    if (ev.data.length == 3) {
      if (parseInt(ev.data[0].toString(10)) > 175) {
        message.type = "control";
        message.channel = parseInt(ev.data[0].toString(10)) - 175;
      } else {
        message.type = "note";
        message.channel = parseInt(ev.data[0].toString(10)) - 143;
      }
      message.note = parseInt(ev.data[1].toString(10));
      message.value = parseInt(ev.data[2].toString(10));
      console.log(message);
      if (typeof API.callback === 'function') {
       API.callback(message);
      }
    }
  };

  return API;

}
