//This is a js file intended solely for the BluetoothSettings.html module
//
// function initBtSettingsPage()
// function getBtDevices()
// function assignBtFunction(names, addresses)
// function makeBtConnection() 
// function callbackClientConnected
// function startBtListening()
// function startBtCalling(client)
// function setBtConnectionState(tab, state)
// function generalBtReset()
// function doBtReset()
// function findNextUnconnectedClient()
//
///////////////////////////////////////////////////////////////////////////////
////// Initializations ////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//
// Visual init on BT settings page
// This Tablet: "Client" or "Server"
// This Tablet: this-tablet-name
// Server Tablet: tablet BT name from GetBtDevices
// Client Tablets: tablet BT names from GetBtDevices
// For the server these are all 4 names
// For each client this is server and local name only
// 
function initBtSettingsPage() {
    var el = document.getElementById("this-tablet-name");
    el.innerHTML = tablet[thisTabletIx].name;

    el = document.getElementById("server-tablet-name");
    el.innerHTML = tablet[serverTabletIx].name;

    el = document.getElementById("this-tablet-seat");
    el.innerHTML = seatOrderWord[tablet[thisTabletIx].seatIx];

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
}

///////////////////////////////////////////////////////////////////////////////
// Get Adapter State and name and list of paired devices
// The names are then entered into the page slots
// Initial connection state set to "disconnected"
// Called after Phonegap event "deviceready" has been fired
//
function getBtDevices() {
    // The status of the local adapter 
    networking.bluetooth.getAdapterState(function (adapterInfo) {
            // The adapterInfo object has the following properties:
            // address: String --> The address of the adapter, in the format 'XX:XX:XX:XX:XX:XX'.
            // (The addr is always 02:00:00:00:00:00 because not locally discoverable)
            // name: String --> The human-readable name of the adapter.
            // enabled: Boolean --> Indicates whether or not the adapter is enabled.
            // discovering: Boolean --> Indicates whether or not the adapter is currently discovering.
            // discoverable: Boolean --> Indicates whether or not the adapter is currently discoverable.
            //
            thisTabletBtName = adapterInfo.name; // Our Bluetooth name
            thisTabletBtAddress = adapterInfo.address; // Our BT address
            //!!!! After Android 6 the local MAC address is no longer accessible !!!!
            // So the addr is always 02:00:00:00:00:00
            if (adapterInfo.enabled == false) {
                popupBox("Bluetooth Adapter is not enabled", "Check Android Bluetooth Settings and restart", "", "OK", "", "");
            }
            console.log('Adapter Addr and Name: ', adapterInfo.address, adapterInfo.name);
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
        drawCompass();
    });
}

// names = Paired BT Names
// addresses = Paired BT addresses 
// if this is a client there is only 1 name and 1 addr
// if this is a server there are 3
//
// Initializes the tablet array and assigns seatIx  
// tablet[].seatIx = 0,1,2,3  ~ N,E,S,W ~ (charCode + 3)(mod 4)
// where charCode is the ASCII numerical code of the last character
// Thus last character (1,2,3,4) -> (N,E,S,W)
// 
function assignBtFunction(names, addresses) {
    var i;
    var jx = 0;
    var serverSeatIx = getSeatIxFromName(names[0]);
    var seats = [];

    thisSeatIx = getSeatIxFromName(thisTabletBtName);

    //console.log("Functions", names, addresses);

    //if this is a client
    if (names.length == 1) {
        tablet[0] = { //the only paired device
            type: "server",
            name: names[0],
            address: addresses[0],
            seatIx: serverSeatIx,
            uuid: uuid[serverSeatIx],
            socket: -1
        };
        tablet[1] = { //info from getAdapterState 
            type: "client",
            name: thisTabletBtName,
            address: thisTabletBtAddress,
            seatIx: thisSeatIx,
            uuid: uuid[thisSeatIx],
            socket: -1
        };
        tablet[2] = { //unused
            type: "client",
            name: "undefined",
            address: "undefined",
            seatIx: -1,
            uuid: -1,
            socket: -1
        };
        tablet[3] = { //unused
            type: "client",
            name: "undefined",
            address: "undefined",
            seatIx: -1,
            uuid: -1,
            socket: -1
        };
        serverTabletIx = 0;
        thisTabletIx = 1;
    }
    //else this is the server
    else {
        for (i = 0; i < 3; i++) {
            seats[i] = getSeatIxFromName(names[i]);
        }
        tablet[0] = {
            type: "server",
            name: thisTabletBtName,
            address: thisTabletBtAddress,
            seatIx: thisSeatIx,
            uuid: uuid[thisSeatIx],
            socket: -1
        };
        jx = 1 + getIndex(names, 0);
        tablet[jx] = {
            type: "client" + jx,
            name: names[0],
            address: addresses[0],
            seatIx: seats[0],
            uuid: uuid[seats[0]],
            socket: -1
        };
        jx = 1 + getIndex(names, 1);
        tablet[jx] = {
            type: "client" + jx,
            name: names[1],
            address: addresses[1],
            seatIx: seats[1],
            uuid: uuid[seats[1]],
            socket: -1
        };
        jx = 1 + getIndex(names, 2);
        tablet[jx] = {
            type: "client" + jx,
            name: names[2],
            address: addresses[2],
            seatIx: seats[2],
            uuid: uuid[seats[2]],
            socket: -1
        };
        serverTabletIx = 0;
        thisTabletIx = 0;
    }

    console.log("Functions - tablet array:", tablet);
}
//////////////////////////////////////////////////////////////////
// Bluetooth Connection //////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//
// Called by pushing "Connect" on BT page, either server or client
//
function makeBtConnection() {
    var client = "";
    var tabIx; // tablet index for next connection
    console.log("Enter makeBtConnection");
    if (thisTabletIx == serverTabletIx) { //this is the server
        console.log("Branch Connect Server", "Tablets: ", tablet);
        tabIx = findNextUnconnectedClient();
        console.log("Connect server next tabIx = ", tabIx, tablet[tabIx]);
        setBtConnectionState("server", "waiting");

        startBtListening(tabIx);

    } else { //this is a client
        console.log("Branch Client Calling", thisTabletIx, tablet[thisTabletIx]);
        if (thisTabletIx == 1) {
            client = "client1";
            setBtConnectionState("client1", "waiting");
            setBtConnectionState("client2", "unset");
            setBtConnectionState("client3", "unset");
        }
        if (thisTabletIx == 2) {
            client = "client2";
            setBtConnectionState("client1", "unset");
            setBtConnectionState("client2", "waiting");
            setBtConnectionState("client3", "unset");
        }
        if (thisTabletIx == 3) {
            client = "client3";
            setBtConnectionState("client1", "unset");
            setBtConnectionState("client2", "unset");
            setBtConnectionState("client3", "waiting");
        }
        startBtCalling(client);
    }
}

// This is the 'server' side, of the socket connection
// The 'server' (listener) is an arbitrarily chosen tablet
// the others are 'clients' who requests a connection (callers)
// If tabIx <= 0 do nothing
//
function startBtListening(tabIx) {
    var seatName = seatOrderWord[tablet[tabIx].seatIx];

    console.log("Enter Listening", tabIx, seatName, listeningForConnectionRequest, tablet);

    if (tabIx > 0) {
        if (!listeningForConnectionRequest) {

            networking.bluetooth.listenUsingRfcomm(tablet[tabIx].uuid, function (socketId) {
                serverSocketId = socketId;
                listeningForConnectionRequest = true;

                console.log("startBluetoothListening socket = " + socketId);
                setBtConnectionState("server", "waiting");

                var checkListener = networking.bluetooth.onAccept.hasListeners();
                if (checkListener) {
                    console.log("Have listeners", checkListener);
                } else {
                    console.log("No Listeners", checkListener);
                }
                

            }, function (errorMessage) {
                console.log("error from Listener");
                console.error(errorMessage);
                popupBox("Bluetooth Listener Error", errorMessage, "btListenerError", "OK", "", "");
            });

        } else {
            console.log("Listening requested but already set");
        }
        console.log("Exiting Listening for Connection", nbrConnectedClients);
        if (nbrConnectedClients == 0) {
            popupBox("Connect Client Tablet", "Press OK and then press 'Connect' on the " + seatOrderWord[tablet[tabIx].seatIx] + " tablet", "connect-first-client", "OK", "", "");
        }
    }
}

// Callback for networking.bluetooth.onAccept.addListener(callback)
// Incoming connection requests from client tablets
//
function onBtAcceptConnectionHandler(acceptInfo) {
    var nextTabIx;
    var tabIx  = findNextUnconnectedClient(); //this is current client
    var seatName = seatOrderWord[tablet[tabIx].seatIx];

    if (acceptInfo.socketId !== serverSocketId) {
        console.log('onAccept -- acceptInfo.socketId != serverSocketId');
        return;
    }
    tablet[tabIx].socket = acceptInfo.clientSocketId;
    nbrConnectedClients += 1;
    console.log("Nbr clients connected", nbrConnectedClients, tablet);
    if (nbrConnectedClients == 3) {
        setBtConnectionState("server", "connected");
    }

    //Close server socket
    networking.bluetooth.close(serverSocketId);
    listeningForConnectionRequest = false;

    console.log("Accepted Connection: ", "Number: ", nbrConnectedClients, "Server Socket: ", serverSocketId);
    nextTabIx = findNextUnconnectedClient();
    console.log("next tabIx", nextTabIx, tablet);
    if (nextTabIx > 0) {
        popupBox(seatName + " Tablet Connected", "Press OK and then press 'Connect' on the " + seatOrderWord[tablet[nextTabIx].seatIx] + " tablet", "connect-next-client", "OK", "", "");
    } else {
        popupBox(seatName + " Tablet Connected", "All tablets communicate", "last-client-connected", "OK", "", "");
    }
}

// Offers to connect to the server
// client = "client1", "client2", "client3"
function startBtCalling(client) {
    var deviceAddress;
    console.log("start calling", client);
    if (tablet[thisTabletIx].socket < 0) { //if not connected
        deviceAddress = tablet[serverTabletIx].address;
        //networking.bluetooth.connect(deviceAddress, uuid, function (socketId) {
        console.log("Connect Client", thisTabletIx, tablet[thisTabletIx]);
        networking.bluetooth.connect(deviceAddress, tablet[thisTabletIx].uuid, function (socketId) {
            thisClientSocketId = socketId;
            tablet[thisTabletIx].socket = socketId;
            //console.log("Client connected, socket = ", socketId);
            setBtConnectionState(client, "connected");
            setBtConnectionState("server", "connected");
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
function setBtConnectionState(tab, state) {
    var el;
    console.log("setBtConnectionState", tab, state);

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
        "This will break all Bluetooth connections to this Tablet only.", "bt-reset", "", "YES", "CANCEL");
}

function doBtReset() {
    console.log("Starting doBtReset");
    // Clear the sockets
    if (serverSocketId > -1) {
        networking.bluetooth.close(serverSocketId);
    }

    listeningForConnectionRequest = false;
    serverSocketId = -1;

    for (i = 0; i < tablet.length; i++) {
        if (tablet[i].socket > -1) {
            networking.bluetooth.close(tablet[i].socket);
            tablet[i].socket = -1;
        }
    }
    thisClientSocketId = -1;
    nbrConnectedClients = 0;

    // Clear the displayed Connections
    setBtConnectionState("server", "disconnected");
    setBtConnectionState("client1", "disconnected");
    setBtConnectionState("client2", "disconnected");
    setBtConnectionState("client3", "disconnected");

    //initAllBtGlobals();

    //logBtGlobals();

    getBtDevices();
    //logBtGlobals();
    initBtSettingsPage();
    //logBtGlobals();
}

// Get index of the first tablet structure that doesn't 
// have a socket assigned.
// This is used to start listening for the corresponding 
// client connection using the appropriate uuid
// 
function findNextUnconnectedClient() {
    var i;
    var tabIx = 0;
    for (i = 1; i < 4; i++) {
        if (tablet[i].socket < 0) {
            tabIx = i;
        }
    }
    console.log("Find unconnected client", tabIx);
    return tabIx;
}

////////////////////////////////////////////////////////////////////////////////
// Test Functions  /////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
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