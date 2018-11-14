/*
 * Licensed to the Apache Software Foundation (ASF)
 * http://www.apache.org/licenses/LICENSE-2.0
 */
var app = {
  // Application Constructor
  initialize: function () {
    this.bindEvents();
  },
  // Bind Event Listeners
  //
  // Bind any events that are required on startup. Common events are:
  // 'load', 'deviceready', 'offline', and 'online'.
  bindEvents: function () {
    document.addEventListener('deviceready', this.onDeviceReady, false);
  },
  // deviceready Event Handler
  //
  // The scope of 'this' is the event. In order to call the 'receivedEvent'
  // function, we must explicitly call 'app.receivedEvent(...);'
  onDeviceReady: function () {
    app.receivedEvent('deviceready');
  },
  // Update DOM on a Received Event
  receivedEvent: function (id) {
    console.log('Received Event: ' + id);
    console.log("window width: ", window.innerWidth, "window height: ", window.innerHeight);
    console.log("inner width: ", window.innerWidth, "inner height: ", window.innerHeight);
    console.log("outer width: ", window.outerWidth, "outer height: ", window.outerHeight);
    console.log("screen width: ", screen.width, "screen height: ", screen.height);
    console.log("pixel ratio: ", window.devicePixelRatio);
    
    
    //Listener for bluetooth message
    networking.bluetooth.onReceive.addListener(onBtReceiveHandler);
    //restoreAllBtGlobals(); //Initializes those not stored
    //Get paired Bluetooth devices
    getBtDevices();
  }
};

////// End of Initializations ////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//Show the selected page, hide the others
function showPage(pageName) {
  console.log(pageName);
  document.getElementById("biddingBox").style.display = 'none';
  document.getElementById("playerSettings").style.display = 'none';
  document.getElementById("directorSettings").style.display = 'none';
  document.getElementById("bluetoothSettings").style.display = 'none';
  document.getElementById(pageName).style.display = 'block';

  if (pageName == "bluetoothSettings") {
    initBtSettingsPage();
  }
  if (pageName == "directorSettings") {
    initDirSettingsPage();
  }
}

///////////////////////////////////////////////////////////////////
// Data sent and received on the bluetooth socket is an unstructured
// binary "arrayBuffer". 
// We send strings and need to convert from and to the buffer format   
function arrayBufferFromString(str) {
  var buf, bufView, i, j, ref, strLen;

  strLen = str.length;
  buf = new ArrayBuffer(strLen);
  bufView = new Uint8Array(buf);
  for (i = j = 0, ref = strLen; j < ref; i = j += 1) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

///////////////////////////////////////////////////////////////////
// Data sent and received on the bluetooth socket is an unstructured
// binary "arrayBuffer". 
// We send strings and need to convert from and to the buffer format  
function stringFromArrayBuffer(buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}