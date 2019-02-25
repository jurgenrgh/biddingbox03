//This is a js file intended solely for the BluetoothSettings.html module
//
/*jshint esversion: 6 */
///////////////////////////////////////////////////////////////////////////////
////// Initializations ////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
/**
 * @description
 * Visual initialization of the BT settings page <br>
 * This Tablet: "Client" or "Server" and this-tablet-name <br>
 * Server Tablet: tablet BT name from GetBtDevices <br>
 * Client Tablets: tablet BT names from GetBtDevices <br>
 * The server knows all 4 names, 3 from pairing <br>
 * Each client knows its own name and the server name from pairing <br>
 */
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

/**
 * @description
 * Get Adapter State and name and list of paired devices<br>
 * The names are then entered into the page slots<br>
 * Initial connection state set to "disconnected"<br>
 * Called after Phonegap event "deviceready" has been fired<br>
 * Compass is refreshed<br>
 */
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
        assignBtFunction(pairedBtNames, pairedBtAddresses);
        drawCompass("bidding-box");

        if (autoBtConnect) {
            if (tablet[thisTabletIx] == "server") {
                makeBtConnection();
            } else {
                setTimeout(makeBtConnection, autoConnectDelay);
            }
        }
    });
}

/**
 * @description
 * Called by getDevices <br><br>
 * 
 * If this is a client there is only 1 name and 1 addr <br>
 * If this is a server there are 3 <br><br>
 * 
 * Initializes the tablet array and assigns seatIx so that <br> 
 * tablet[].seatIx = 0,1,2,3  ~ N,E,S,W ~ (charCode + 3)(mod 4) <br>
 * i.e. the initial NSEW assignments come from the tablet names <br>
 * where charCode is the ASCII numerical code of the last character <br>
 * Thus last character (1,2,3,4) -> (N,E,S,W) <br><br>
 * 
 * tablet[] array initialization: <br>
 * if this is a client (i.e. names&address list length = 1) <br>
 * serverTabletIx = 0; <br>
 * thisTabletIx = 1; <br>
 * 
 * tablet[0].type = "server" <br>
 * tablet[0].seatIx = from names[0] <br> 
 * tablet[1].type = "client" <br>
 * tablet[1].seatIx = from thisTabletBtName <br>
 * also sets name, address, uuid, socket = -1 <br><br>
 * 
 * if this is the server (i.e. names&address list length = 3) <br>
 * serverTabletIx = 0; <br>
 * thisTabletIx = 0; <br>
 * tablet[0].type = "server" <br>
 * tablet[i].type = "clienti" <br>
 * etc as above for client <br>
 * 
 * @param {string} names Array of names of paired BT devices 
 * @param {string} addresses Array of paired BT addresses
 */
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

/**
 * @description
 * Called directly from onClick "Connect" on the Bluetooth page <br>
 * Called also through a modal prompt on either server or client <br>
 * If server: finds next unconnected client and calls startBtListening(tabIx), sets waiting state <br>
 * If client: sets the correct waiting state and calls chainBtClentConnection() <br>
 */
function makeBtConnection() {
    var client = "";
    var tabIx; // tablet index for next connection
    //console.log("Enter makeBtConnection");
    if (thisTabletIx == serverTabletIx) { //this is the server
        //console.log("Branch Connect Server", "Tablets: ", tablet);
        tabIx = findNextUnconnectedClient();
        if (tabIx > 0) { //the clients have index 1,2,3
            console.log("Connect server next tabIx = ", tabIx, tablet[tabIx]);
            setBtConnectionState("server", "waiting");
            startBtListening(tabIx);
        }
        else{
            popupBox("All the Clients are already Connected", "", "redundant-connect", "OK", "","");
        }
    } else { //this is a client
        console.log("Branch Client Calling", thisTabletIx, tablet[thisTabletIx]);
        if ((thisTabletIx == 1) && (tablet[1].socket < 0)){
            client = "client1";
            setBtConnectionState("client1", "waiting");
            setBtConnectionState("client2", "unset");
            setBtConnectionState("client3", "unset");
        }
        if ((thisTabletIx == 2)&& (tablet[2].socket < 0)) {
            client = "client2";
            setBtConnectionState("client1", "unset");
            setBtConnectionState("client2", "waiting");
            setBtConnectionState("client3", "unset");
        }
        if ((thisTabletIx == 3) && (tablet[3].socket < 0)){
            client = "client3";
            setBtConnectionState("client1", "unset");
            setBtConnectionState("client2", "unset");
            setBtConnectionState("client3", "waiting");
        }
        if(client != "" ){
            chainBtClientConnection();
        }
        else{
            popupBox("This Tablet is already Connected", "", "redundant-connect", "OK", "","");
        }
    }
}

/**
 * @description
 * This is the 'server' side, of the socket connection <br>
 * The 'server' (listener) is an arbitrarily chosen tablet <br>
 * The server must be paired with the 3 clients and no other BT devices <br>
 * Each client is paired with the server and no other BT devices <br>
 * The 'clients' request a connection (callers) <br>
 * If tabIx <= 0 do nothing <br>
 * 
 * @param {int} tabIx The tablet array index 
 */
function startBtListening(tabIx) {
    var seatName = seatOrderWord[tablet[tabIx].seatIx];

    //console.log("Enter Listening", tabIx, seatName, listeningForConnectionRequest, tablet);

    if (tabIx > 0) {
        if (!listeningForConnectionRequest) {
            //console.log("Before Listen", tabIx, tablet[tabIx].uuid);
            networking.bluetooth.listenUsingRfcomm(tablet[tabIx].uuid, function (socketId) {
                serverSocketId = socketId;
                listeningForConnectionRequest = true;

                //console.log("startBluetoothListening socket = " + socketId);
                setBtConnectionState("server", "waiting");

                var checkListener = networking.bluetooth.onAccept.hasListeners();
                if (checkListener) {
                    //console.log("Have listeners", checkListener);
                } else {
                    //console.log("No Listeners", checkListener);
                }
            }, function (errorMessage) {
                console.log("error from Listener");
                console.error(errorMessage);
                popupBox("Bluetooth Listener Error", errorMessage, "btListenerError", "OK", "", "");
            });
        } else {
            console.log("Listening requested but already set");
        }
        //console.log("Exiting Listening for Connection", nbrConnectedClients);
        if ((nbrConnectedClients == 0) && (autoBtConnect == false)) {
            popupBox("Connect Client Tablet", "Press OK and then press 'Connect' on any unconnected tablet", "connect-first-client", "OK", "", "");
        }
    }
}
/**
 * @description
 * Callback for networking.bluetooth.onAccept.addListener(callback) <br>
 * Handle incoming connection requests from client tablets <br>
 * 
 * @param {obj} acceptInfo 
 */
function onBtAcceptConnectionHandler(acceptInfo) {
    var nextTabIx;
    var tabIx = findNextUnconnectedClient(); //this is current client
    //var seatName = seatOrderWord[tablet[tabIx].seatIx];

    if (acceptInfo.socketId !== serverSocketId) {
        console.log('onAccept -- acceptInfo.socketId != serverSocketId');
        return;
    }
    //tablet[tabIx].socket = acceptInfo.clientSocketId;
    //console.log("socket set, socket, tabIx", acceptInfo.clientSocketId, tabIx, tablet);
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
    //if (nextTabIx > 0) {
    if (nbrConnectedClients < 3) {
        if (autoBtConnect) {
            makeBtConnection();
        } else {
            popupBox("Client Tablet Connected", "Press OK and then press 'Connect' on any unconnected tablet", "connect-next-client", "OK", "", "");
        }
    }
    if (nbrConnectedClients == 3) {
        popupBox("Client Tablets Connected", "All tablets communicate", "last-client-connected", "OK", "", "");
        //testConnections(10);
    }
}

/**
 * @description
 * This is the function called to make a connection from  <br>
 * client to server. The server must be "listening", the <br>
 * client is said to be "calling". <br>
 * There are 4 uuid's and all 4 are tried in succession. <br> 
 * The connection can succeed only if the server is listening <br>
 * for the correct uuid; so the server changes uuid after each <br>
 * successful connection. <br>
 * If the connection attempt fails the tryClient function returns <br>
 * with an implicit parameter that gives the index of the next uuid to try <br> 
 */
function chainBtClientConnection() {
    tryBtClientConnection(0)
        .then(tryBtClientConnection)
        .then(tryBtClientConnection)
        .then(tryBtClientConnection)
        .catch();
}

/**
 * @description
 * Client Connection using chained promise for retry <br>
 * Called for each try from chainBtClientConnection() <br>
 * Each time with the next uuid Index (there are currently 4) <br>
 * uuid[] is a global array - same on all tablets <br>
 *  
 * @param {int} uuidIx Index of the uuid to be tried 
 */
function tryBtClientConnection(uuidIx) {
    var deviceAddress;
    var sndObj;
    var sndText;

    console.log("Async Client Retry Calling uuidx: ", uuidIx);
    if (tablet[thisTabletIx].socket < 0) { //if not connected
        deviceAddress = tablet[serverTabletIx].address;

        var connectionPromise = new Promise((resolve, reject) => {

            networking.bluetooth.connect(deviceAddress, uuid[uuidIx], function (socketId) {
                thisClientSocketId = socketId;
                tablet[thisTabletIx].socket = socketId;
                console.log("socket set, socketId, tabIx ", socketId, thisTabletIx, tablet);
                setBtConnectionState("client1", "connected");
                setBtConnectionState("server", "connected");

                var tabName = tablet[thisTabletIx].name;
                var tabSeatIx = tablet[thisTabletIx].seatIx;
                sndObj = {
                    btName: tabName,
                    seatIx: tabSeatIx
                };
                sndText = JSON.stringify(sndObj);
                console.log("sending confirm", sndObj, sndText);
                //Notify Server who the Client is.
                sendMessage("this", "server", "confirm-connection", sndText); //Notify Server who the Client is.
                resolve(uuidIx);
            }, function (errorMessage) {
                console.log("error Calling", "server: ", tablet[serverTabletIx], "this: ", tablet[thisTabletIx], "socket: ", thisClientSocketId, "uuidIx: ", uuidIx);
                console.error(errorMessage);
                //popupBox("Bluetooth Caller Error", errorMessage, "btCallerError", "OK", "", "");
                uuidIx++;
                if (uuidIx < uuid.length) {
                    resolve(uuidIx);
                } else {
                    reject(-1);
                }
            });
        });

        return (connectionPromise);
    } else {
        console.log("Connection Request while socket already assigned");
    }
}

/**
 * @description
 * On each page there is a connectivity indicator that changes <br>
 * color according to the BT connection status <br>
 * This routine sets that status <br>
 * @param {string} state "disconnected", "waiting", "connected", or "unset"
 */
function setPageBtConnectionState(state) {
    var elDir = document.getElementById("bt-director");
    var elPlayer = document.getElementById("bt-player");
    var elBoards = document.getElementById("bt-boards");
    var elClock = document.getElementById("bt-clock");

    //console.log("Page Connection State", state);
    //console.log("Page Connection state 1", elDir, elPlayer, elClock);

    elDir.classList.remove("dot-disconnected");
    elDir.classList.remove("dot-waiting");
    elDir.classList.remove("dot-connected");
    elDir.classList.remove("dot-unset");

    elPlayer.classList.remove("dot-disconnected");
    elPlayer.classList.remove("dot-waiting");
    elPlayer.classList.remove("dot-connected");
    elPlayer.classList.remove("dot-unset");

    elBoards.classList.remove("dot-disconnected");
    elBoards.classList.remove("dot-waiting");
    elBoards.classList.remove("dot-connected");
    elBoards.classList.remove("dot-unset");

    elClock.classList.remove("dot-disconnected");
    elClock.classList.remove("dot-waiting");
    elClock.classList.remove("dot-connected");
    elClock.classList.remove("dot-unset");

    //console.log("Page Connection state 2", elDir, elPlayer, elClock);

    if (state == "disconnected") {
        elDir.classList.add("dot-disconnected");
        elPlayer.classList.add("dot-disconnected");
        elBoards.classList.add("dot-disconnected");
        elClock.classList.add("dot-disconnected");
        //console.log("Page Connection state 3 ", elDir, elPlayer, elClock);
    }
    if (state == "waiting") {
        elDir.classList.add("dot-waiting");
        elPlayer.classList.add("dot-waiting");
        elBoards.classList.add("dot-waiting");
        elClock.classList.add("dot-waiting");
        //console.log("Page Connection state 4", elDir, elPlayer, elClock);
    }
    if (state == "connected") {
        elDir.classList.add("dot-connected");
        elPlayer.classList.add("dot-connected");
        elBoards.classList.add("dot-connected");
        elClock.classList.add("dot-connected");
        //console.log("Page Connection state 5", elDir, elPlayer, elClock);
    }
    if (state == "unset") {
        elDir.classList.add("dot-unset");
        elPlayer.classList.add("dot-unset");
        elBoards.classList.add("dot-unset");
        elClock.classList.add("dot-unset");
        //console.log("Page Connection state 6", elDir, elPlayer, elClock);
    }
    //console.log("Page Connection state 7", elDir, elPlayer, elClock);
}

/**
 * @description
 * The function changes the class of the corresponding element <br>
 * in order to display the  red, yellow or green symbol <br>
 * This affects the visuals only, i.e. the red, yellow, green dots on the BT page <br>
 * These indicators occur on each page in the urh corner and on the BT page <br>
 * 
 * @param {*} tab tablet: "this", "server", "client1", "client2", or "client3" 
 * @param {*} state "disconnected", "waiting", "connected", or "unset"
 */
function setBtConnectionState(tab, state) {
    var el;
    var elBB;

    //console.log("setBtConnectionState1", tab, state, tablet);
    //console.log("this check", tablet[thisTabletIx].type);

    if (tab == "server") {
        el = document.getElementById("server-connection");
        elBB = document.getElementById("bt-bidboxs");
        //console.log("branch server", el, elBB);
    }
    if (tab == "client1") {
        el = document.getElementById("client1-connection");
        elBB = document.getElementById("bt-bidbox1");
        //console.log("branch client1", el, elBB);
    }
    if (tab == "client2") {
        el = document.getElementById("client2-connection");
        elBB = document.getElementById("bt-bidbox2");
        //console.log("branch client2", el, elBB);
    }
    if (tab == "client3") {
        el = document.getElementById("client3-connection");
        elBB = document.getElementById("bt-bidbox3");
        //console.log("branch client3", el, elBB);
    }

    el.classList.remove("dot-disconnected");
    el.classList.remove("dot-waiting");
    el.classList.remove("dot-connected");
    el.classList.remove("dot-unset");

    elBB.classList.remove("dot-disconnected");
    elBB.classList.remove("dot-waiting");
    elBB.classList.remove("dot-connected");
    elBB.classList.remove("dot-unset");

    //console.log("setBtConnectionState2", tab, state, el, elBB);

    if (state == "disconnected") {
        el.classList.add("dot-disconnected");
        elBB.classList.add("dot-disconnected");
        //console.log("branch disconnected", tab, state, el, elBB);
    }
    if (state == "waiting") {
        el.classList.add("dot-waiting");
        elBB.classList.add("dot-waiting");
    }
    if (state == "connected") {
        el.classList.add("dot-connected");
        elBB.classList.add("dot-connected");
    }
    if (state == "unset") {
        //console.log("dot unset", el, elBB);
        el.classList.add("dot-unset");
        elBB.classList.add("dot-unset");
        //console.log("branch unset", tab, state, el, elBB);
    }
    if (state != "unset") {
        setPageBtConnectionState(state);
    }
    //console.log("setBtConnectionState4", tab, state, el, elBB);
}

/**
 * @description
 * Brings up a dialog box, and if accepted doBtReset() is called <br>
 * This clears the Bluetooth system and starts over <br>
 * Try to make the same connections as before <br>
 */
function generalBtReset() {
    popupBox("Do you want to Reset the Bluetooth Connections?",
        "This will break all Bluetooth connections to this Tablet only.", "bt-reset", "", "YES", "CANCEL");
}

/**
 * @description
 * General reset of the Bluetooth Connections <br>
 * Called after popupBox thru generalBtReset() <br>
 */
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

    getBtDevices();
    initBtSettingsPage();
}
/**
 * @description
 * Get index of the first tablet structure that doesn't <br>
 * have a socket assigned. The criterion is tablet[].socket = -1. <br>
 * This is used to start listening for the corresponding <br>
 * client connection using the appropriate uuid <br>
 */
function findNextUnconnectedClient() {
    var i;
    var tabIx = -1;
    for (i = 1; i < 4; i++) {
        if (tablet[i].socket < 0) {
            tabIx = i;
        }
    }
    //console.log("Find unconnected client tabIx ", tabIx);
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
        disableBidButton('XX');
        testFlag = false;
        return;
    }
    if (!testFlag) {
        document.getElementById("client3-div").style.display = 'block';
        testFlag = true;
        return;
    }
}