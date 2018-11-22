//This is a js file intended solely for the BluetoothSettings.html module
//
////// Initializations ////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//
// Visual init only
//
function initBtSettingsPage() {
    var el = document.getElementById("this-tablet-name");
    el.innerHTML = tablet[thisTabletIx].name;

    el = document.getElementById("server-tablet-name");
    el.innerHTML = tablet[serverTabletIx].name;

    el = document.getElementById("client1-tablet-name");
    el.innerHTML = tablet[1].name;

    el = document.getElementById("client2-tablet-name");
    el.innerHTML = tablet[2].name;

    el = document.getElementById("client3-tablet-name");
    el.innerHTML = tablet[3].name;

    el = document.getElementById("this-tablet-rank");
    if (thisTabletIx == serverTabletIx) {
        el.innerHTML = "Server";
    } else {
        el.innerHTML = "Client";
    }
    //storeAllBtGlobals();
}

///////////////////////////////////////////////////////////////////////////////
// Get Adapter State and name and list of paired devices
// The names are then entered into the page slots
// Initial connection state set to "disconnected"
// Called when Phonegap event "deviceready" has been fired
//
function getBtDevices() {
    // The status of the local adapter 
    networking.bluetooth.getAdapterState(function (adapterInfo) {
            // The adapterInfo object has the following properties:
            // address: String --> The address of the adapter, in the format 'XX:XX:XX:XX:XX:XX'.
            // name: String --> The human-readable name of the adapter.
            // enabled: Boolean --> Indicates whether or not the adapter is enabled.
            // discovering: Boolean --> Indicates whether or not the adapter is currently discovering.
            // discoverable: Boolean --> Indicates whether or not the adapter is currently discoverable.
            //
            thisTabletBtName = adapterInfo.name; // Our Bluetooth name
            //!!!! After Android 6 the local MAC address is no longer accessible !!!!
            // So the addr is always 02:00:00:00:00:00
            if(adapterInfo.enabled == false){
                popupBox("Bluetooth Adapter is not enabled", "Check Android Bluetooth Settings and restart", "", "OK", "", "");
            }
            thisTabletBtAddress = adapterInfo.address; // Our BT address
            console.log('Adapter ', adapterInfo.address, adapterInfo.name);
            //storeAllBtGlobals();
        },
        function (errorMessage) {
            console.error(errorMessage);
            popupBox("Bluetooth GetAdapterStat Error", errorMessage, "bt-error", "OK", "", "");
        });

    // Information re paired devices
    networking.bluetooth.getDevices(function (devices) {
        var pairedBtNames = [];
        var pairedBtAddresses = [];

        for (var i = 0; i < devices.length; i++) {
            // The deviceInfo object has the following properties:
            // address: String --> The address of the device, in the format 'XX:XX:XX:XX:XX:XX'.
            // name: String --> The human-readable name of the device.
            // paired: Boolean --> Indicates whether or not the device is paired with the system.
            // uuids: Array of String --> UUIDs of protocols, profiles and services advertised by the device.
            console.log(i, devices[i].name, devices[i].address);
            pairedBtNames[i] = devices[i].name;
            pairedBtAddresses[i] = devices[i].address;
        }
        assignBtFunction(pairedBtNames, pairedBtAddresses); // adds thisTablet if necessary and sorts alphabetically

    });
}

//Sort the tablet names (including this tablet)
//reorder the paired..[] arrays accordingly
// 
function assignBtFunction(names, addresses) {
    var jx = 0;
    //if this is a client
    if (names.length == 1) {
        tablet[0] = {
            type: "server",
            name: names[0],
            address: addresses[0],
            seat: "north",
            socket: -1
        };
        tablet[1] = {
            type: "client",
            name: thisTabletBtName,
            address: thisTabletBtAddress,
            seat: "east",
            socket: -1
        };
        tablet[2] = {
            type: "client",
            name: "undefined",
            address: "undefined",
            seat: "void",
            socket: -1
        };
        tablet[3] = {
            type: "client",
            name: "undefined",
            address: "undefined",
            seat: "void",
            socket: -1
        };
        serverTabletIx = 0;
        thisTabletIx = 1;
    }
    //else this is the server
    else {
        tablet[0] = {
            type: "server",
            name: thisTabletBtName,
            address: thisTabletBtAddress,
            seat: "north",
            socket: -1
        };
        jx = 1 + getIndex(names, 0);
        tablet[jx] = {
            type: "client" + jx,
            name: names[0],
            address: addresses[0],
            seat: "east",
            socket: -1
        };
        jx = 1 + getIndex(names, 1);
        tablet[jx] = {
            type: "client" + jx,
            name: names[1],
            address: addresses[1],
            seat: "south",
            socket: -1
        };
        jx = 1 + getIndex(names, 2);
        tablet[jx] = {
            type: "client" + jx,
            name: names[2],
            address: addresses[2],
            seat: "west",
            socket: -1
        };
        serverTabletIx = 0;
        thisTabletIx = 0;
    }

    console.log("tablet array:", tablet);
}
//////////////////////////////////////////////////////////////////
// Bluetooth Connection //////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//If this is the server - start listening
//If it is a client - wait and the start calling
//Delay depends upon alphabetical rank, i.e. position
//in the paired list.
function makeConnection() {
    var client = "";
    logBtGlobals();
    if (thisTabletIx == serverTabletIx) { //this is the server
        console.log("start listening", tablet[serverTabletIx]);
        setConnectionState("server", "waiting");
        startBtListening();
    } else { //this is a client
        console.log("start calling", tablet[thisTabletIx]);
        if (thisTabletIx == 1) {
            client = "client1";
            setConnectionState("client1", "waiting");
            setConnectionState("client2", "unset");
            setConnectionState("client3", "unset");
        }
        if (thisTabletIx == 2) {
            client = "client2";
            setConnectionState("client1", "unset");
            setConnectionState("client2", "waiting");
            setConnectionState("client3", "unset");
        }
        if (thisTabletIx == 3) {
            client = "client3";
            setConnectionState("client1", "unset");
            setConnectionState("client2", "unset");
            setConnectionState("client3", "waiting");
        }
        startCalling(client);
    }
}

// This is the 'server' side, of the socket connection
// The 'server' (listener) is an arbitrarily chosen tablet
// the others are 'clients' who requests a connection (callers)
function startBtListening() {
    //console.log("Enter Listening", listeningForConnectionRequest);

    if (!listeningForConnectionRequest) {
        networking.bluetooth.listenUsingRfcomm(uuid, function (socketId) {
            serverSocketId = socketId;
            listeningForConnectionRequest = true;

            //console.log("startBluetoothListening socket = " + socketId);
            setConnectionState("server", "waiting");

            networking.bluetooth.onAccept.addListener(function (acceptInfo) {
                if (acceptInfo.socketId !== serverSocketId) {
                    console.log('onAccept -- acceptInfo.socketId != serverSocketId');
                    return;
                }
                clientSocketId[nbrConnectedClients] = acceptInfo.clientSocketId;
                nbrConnectedClients += 1;

                if (nbrConnectedClients == 3) {
                    setConnectionState("server", "connected");
                }
                //Server socket is never closed, i.e. server keeps listening
                //networking.bluetooth.close(serverSocketId);
                //listeningForConnectionRequest = false;
                //console.log("Accepted Connection: ", "Number: ", nbrConnectedClients, "Server Socket: ", serverSocketId, "Client Socket: ", clientSocketId);
            });
        }, function (errorMessage) {
            console.log("error from Listener");
            console.error(errorMessage);
            popupBox("Bluetooth Listener Error", errorMessage, "btListenerError", "OK", "", "");

        });
    } else {
        console.log("Listening requested but already set");
    }
}

// Offers to connect to the server
// client = "client1", "client2", "client3"
function startCalling(client) {
    var deviceAddress;
    console.log("start calling", client);
    if (tablet[thisTabletIx].socket < 0) { //if not connected
        deviceAddress = tablet[serverTabletIx].address;
        networking.bluetooth.connect(deviceAddress, uuid, function (socketId) {
            thisClientSocketId = socketId;
            tablet[thisTabletIx].socket = socketId;
            //console.log("Client connected, socket = ", socketId);
            setConnectionState(client, "connected");
            setConnectionState("server", "connected");
            //Notify Server who the Client is.
            sendMessage("this", "server", "confirmConnection", tablet[thisTabletIx].name);
        }, function (errorMessage) {
            console.log("error Calling", "server: ", tablet[serverTabletIx], "this: ", tablet[thisTabletIx], "socket: ", thisClientSocketId);
            console.error(errorMessage);
            popupBox("Bluetooth Caller Error", errorMessage, "btCallerError", "OK", "", "");
        });
    } else {
        console.log("Connection Request while socket already assigned");
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// tablet = "this", "server", "client1", "client2", or "client3"
// state is "disconnected", "waiting", "connected", or "unset"
// The function changes the class of the corresponding element
// in order to display the  red, yellow or green symbol
//
function setConnectionState(tab, state) {
    var el;
    console.log("setConnectionState", tab, state);

    if (tab == "server") {
        el = document.getElementById("server-connection");
    }
    if (tab == "client1") {
        el = document.getElementById("client1-connection");
    }
    if (tab == "client2") {
        el = document.getElementById("client2-connection");
    }
    if (tab == "client3") {
        el = document.getElementById("client3-connection");
    }
    el.classList.remove("dot-disconnected");
    el.classList.remove("dot-waiting");
    el.classList.remove("dot-connected");
    el.classList.remove("dot-unset");

    if (state == "disconnected") {
        el.classList.add("dot-disconnected");
    }
    if (state == "waiting") {
        el.classList.add("dot-waiting");
    }
    if (state == "connected") {
        el.classList.add("dot-connected");
    }
    if (state == "unset") {
        el.classList.add("dot-unset");
    }
}

// This clears everything and starts over
// To make the same connections as before
// use "reconnect"; but you must do the same for the neighbors 
function generalBtReset() {

    popupBox("Do you want to Reset the Bluetooth Connections?",
        "This will break all Bluetooth connections to this Tablet only.", "reset", "", "YES", "CANCEL");
}

function doReset() {
    console.log("Starting doReset");
    // Clear the sockets
    if (serverSocketId > -1) {
        networking.bluetooth.close(serverSocketId);
    }
    
    listeningForConnectionRequest = false;
    serverSocketId = -1;

    for(i=0; i<tablet.length;i++ ){
        if( tablet[i].socket > -1 ){
            networking.bluetooth.close(tablet[i].socket);
        }
    }
    thisClientSocketId = -1;
    nbrConnectedClients = 0;

    // Clear the displayed Connections
    setConnectionState("server", "disconnected");
    setConnectionState("client1", "disconnected");
    setConnectionState("client2", "disconnected");
    setConnectionState("client3", "disconnected");

    initAllBtGlobals();

    logBtGlobals();

    getBtDevices();
    logBtGlobals();
    initBtSettingsPage();
    logBtGlobals();
}

function testGlobals() {
    console.log("All Globals");
    logBtGlobals();
    storeAllBtGlobals();
    restoreAllBtGlobals();
    console.log("All Globals stored and restored");
    logBtGlobals();
}

function testObject() {
    if (testFlag) {
        document.getElementById("client3-div").style.display = 'none';
        testFlag = false;
        return;
    }
    if (!testFlag) {
        document.getElementById("client3-div").style.display = 'block';
        testFlag = true;
        return;
    }
}