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
        case "noteoff":
          data.push(127 + d.channel);
          break;
        default:
        case "note":
          data.push(143 + d.channel);
          break;
        case "polypress":
          data.push(159 + d.channel);
          break;
        case "control":
          data.push(175 + d.channel);
          break;
        case "program":
          data.push(191 + d.channel);
          break;
        case "aftertouch":
          data.push(207 + d.channel);
          break;
        case "pitchbend":
          data.push(223 + d.channel);
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
      var firstBit = ev.data[0];
      switch (true) {
        case (firstBit >= 128 && firstBit < 144):
          message.type = "noteoff";
          message.channel = firstBit - 127;
          break;
        case (firstBit >= 144 && firstBit < 160):
          message.type = "note";
          message.channel = firstBit - 143;
          break;
        case (firstBit >= 160 && firstBit < 176):
          message.type = "polypress";
          message.channel = firstBit - 159;
          break;
        case (firstBit >= 176 && firstBit < 192):
          message.type = "control";
          message.channel = firstBit - 175;
          break;
        case (firstBit >= 192 && firstBit < 208):
          message.type = "program";
          message.channel = firstBit - 191;
          break;
        case (firstBit >= 208 && firstBit < 224):
          message.type = "aftertouch";
          message.channel = firstBit - 207;
          break;
        case (firstBit >= 224):
          message.type = "pitchbend";
          message.channel = firstBit - 223;
          break;
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
