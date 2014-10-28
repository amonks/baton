function Baton() {

  var API = {};


  var input = null;
  var midi = null;
  var inputName = null;
  var connectCallback = null;

  API.callback = null;

  var inputs = null;
  var outputs = null;


  API.checkSupport = function() {
    var supportsWebMIDI = ( function () { try { return !! navigator.requestMIDIAccess; } catch( e ) { return false; } } )();
    return supportsWebMIDI;
  };

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

  API.outputs = function() {
    return outputs;
  };

  API.listen = function(i) {
    if (API.check() === true) {
      midi.inputs()[i].onmidimessage = handleMIDIMessage;
      console.log("Hooked up input # " + i + ": " + midi.inputs()[i].name );
    } else {
      console.log("Not connected.");
    }
  };

  API.send = function(o, d) {
    if (API.check() === true) {
      var data = [];
      switch (d.type) {
        case "control":
          data.push(175 + d.channel);
          break;
        default:
          data.push(143 + d.channel);
          break;
      }
      data.push(d.note);
      data.push(d.value);
      midi.outputs()[o].send(data);
      console.log("sending to " + midi.outputs()[o].name, data);
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

  var getOutputs = function() {
    out = [];
    for (var i in midi.outputs()) {
      out.push( midi.outputs()[i].name );
    }
    outputs = out;
  };

  var success = function(m) {
    console.log("connected!");
    midi = m;
    getInputs();
    getOutputs();
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
      if (typeof API.callback === 'function') {
       API.callback(message);
      }
    }
  };




  if (API.checkSupport() === true) {
    return API;
  } else {
    console.log("Looks like your browser doesn't support WebMIDI.");
    console.log("If you're in OSX Chrome, enable the chrome://flags/#enable-web-midi flag and relaunch Chrome.");
    console.log("Otherwise try the Jazz-Soft Jazz plugin.");
    console.log("More info at http://baton.monks.co");
  }
}
