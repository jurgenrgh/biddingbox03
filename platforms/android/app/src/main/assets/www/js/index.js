/*
 * Licensed to the Apache Software Foundation (ASF)
 * http://www.apache.org/licenses/LICENSE-2.0
 */
//////////////////////////////////////////////////////////////
// Bluetooth Names and addresses - BT global variables

//New - to be added to store and restore
var disconnectedColor = "red";
var connectedColor = "green";
var waitingColor = "yellow";
var unsetColor = "transparent";

var serverTabletBtName = "void";
var serverTabletBtAddress = "void";
var client1TabletBtName = "void";
var client1TabletBtAddress = "void";
var client2TabletBtName = "void";
var client2TabletBtAddress = "void";
var client3TabletBtName = "void";
var client3TabletBtAddress = "void";
var tabletSeat = [];
var thisTabletSeat;

var nbrConnectedClients = 0;
var clientSocketId = [];

///////////////////////////////////////////////
var testCount = 0;

var thisTabletBtName = "void";
var thisTabletBtAddress = "void";

var pairedBtNames = [];
var pairedBtAddresses = [];

var rhoBtName = "void";
var lhoBtName = "void";
var rhoBtAddress = "void";
var lhoBtAddress = "void";

// When Reset the old values are saved in order to reconnect
var rhoBtNameOld = "void";
var lhoBtNameOld = "void";
var rhoBtAddressOld = "void";
var lhoBtAddressOld = "void";

// Bluetooth status variables
var uuid = '94f39d29-7d6d-437d-973b-fba39e49d4ee';
var listeningForConnectionRequest = false;
var lhoConnected = false;
var rhoConnected = false;
var lhoSocketId = -1;
var rhoSocketId = -1;
var serverSocketId = -1;
var relaySecDelay = 3;
var relayRepCount = 32;

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
        restoreAllBtGlobals(); //Initializes those not stored
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

    if(pageName == "bluetoothSettings"){
        initBtSettingsPage();   
    }
}