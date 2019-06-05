/*
 * Licensed to the Apache Software Foundation (ASF)
 * http://www.apache.org/licenses/LICENSE-2.0
 */
/**
 * The app: a pure function representing the whole thing <br>
 * Does a number of initializations, namely <br>
 * - Waits for 'deviceready' signal <br>
 * - Adds listeners  <br>
 * - Calls getBtDevices for Bluetooth initialization <br>
 * - Does initial setup of Bidding Box Page etc <br>
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

    screen.orientation.lock("portrait");

    //Listener for bluetooth message
    networking.bluetooth.onReceive.addListener(onBtReceiveHandler);
    networking.bluetooth.onAccept.addListener(onBtAcceptConnectionHandler);
    networking.bluetooth.onReceiveError.addListener(onBtReceiveError);
         
    // Actual app Initialization /////////////////////////////////////////////
    //Get paired Bluetooth devices
    getBtDevices();

    getCommonCssColors();
    drawBiddingRecordTable(36, "bidding-box"); //Bidding Box Page
    drawBiddingRecordTable(36, "board-display"); //Board Display Page
    //drawCompass("bidding-box");
    initBiddingBoxPageSettings();
    initClockScreen();
    //restoreAllBtGlobals(); //Initializes those not stored
  }
};

////// End of Initializations ////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
/**
 * Called from the main menu on any page <br>
 * Display the selected page <br>
 * @param {string} pageName The name of the new page
 * @param {string} originPage The name of the page from which we came (for return)
 */
function showPage(pageName, originPage) {
  console.log(pageName);
  previousPage = originPage;
  document.getElementById("biddingBox").style.display = 'none';
  document.getElementById("playerSettings").style.display = 'none';
  document.getElementById("directorSettings").style.display = 'none';
  document.getElementById("bluetoothSettings").style.display = 'none';
  document.getElementById("boardsDisplay").style.display = 'none';
  document.getElementById("clockScreen").style.display = 'none';
  document.getElementById(pageName).style.display = 'block';

  if (pageName == "bluetoothSettings") {
    initBtSettingsPage();
  }
  if (pageName == "directorSettings") {
    initDirSettingsPage();
  }
  if (pageName == "playerSettings") {
    initDirSettingsPage();
  }
  if (pageName == "boardsDisplay") {
    initBoardsDisplay();
  }
  if (pageName == "clockScreen") {
    initClockScreen();
  }
}
/**
 * @name hideKeyboard
 * @function
 * @description
 * Hide the keyboard when Enter (key 13) is clicked <br>
 * The mechanism used is that taking focus from the currently <br>
 * hilited element causes the keyboard to hide <br>
 * The focus removal is called "blur" 
 */
document.onkeypress = function (e) {
  if (e.keyCode == 13) {
    document.activeElement.blur();
  }
};