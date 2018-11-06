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
            thisTabletBtAddress = adapterInfo.address; // Our BT address
            console.log('Adapter ' + adapterInfo.address + ': ' + adapterInfo.name);
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
function assignBtFunction( names, addresses) {
    var btN = [];
    var btA = [];
    var i;
    var j;
    var len;
    var thisFlag = false;

    console.log("sort", names, addresses);

    len = names.length;
    for (i = 0; i < len; i++) {
        if (names[i] == thisTabletBtName) {
            thisFlag = true;
        }
    }

    if (thisFlag == false) {
        names[len] = thisTabletBtName;
        addresses[len] = thisTabletBtAddress;
    }

    len = names.length;
    for (i = 0; i < len; i++) {
        btN[i] = names[i];
        btA[i] = addresses[i];
    }

    btN.sort();
    for (i = 0; i < names.length; i++) {
        for (j = 0; j < names.length; j++) {
            if (btN[i] == names[j]) {
                btA[i] = addresses[j];
            }
        }
    }

    for (i = 0; i < names.length; i++) {
        names[i] = btN[i];
        addresses[i] = btA[i];
    }

    len = names.length;
    for (i = 0; i < len; i++) {
        if (names[i] == thisTabletBtName) {
            thisTabletIx = i;
        }
    }
    // The server is the first entry in the sorted list
    serverTabletBtName = names[0];
    serverTabletBtAddress = addresses[0];
    serverTabletIx = 0;

    tablet[0] = {
        type: "server",
        name: names[0],
        address: addresses[0],
        socket: -1
    };
    tablet[1] = {
        type: "client1",
        name: names[1],
        address: addresses[1],
        socket: -1
    };
    tablet[2] = {
        type: "client2",
        name: names[2],
        address: addresses[2],
        socket: -1
    };
    tablet[3] = {
        type: "client3",
        name: names[3],
        address: addresses[3],
        socket: -1
    };
}

// Bluetooth Connection //////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//If this is the server - start listening
//If it is a client - wait and the start calling
//Delay depends upon alphabetical rank, i.e. position
//in the paired list.
function makeConnection() {
    var client = "";
    if (thisTabletBtName == serverTabletBtName) { //this is the server
        //console.log("start listening", thisTabletBtName);
        setConnectionState("server", "waiting");
        startBtListening();
    } else { //this is a client
        //console.log("start calling", thisTabletBtName);
        if (thisTabletBtName == tablet[1].name) {
            client = "client1";
            setConnectionState("client1", "waiting");
            setConnectionState("client2", "unset");
            setConnectionState("client3", "unset");
        }
        if (thisTabletBtName == tablet[2].name) {
            client = "client2";
            setConnectionState("client1", "unset");
            setConnectionState("client2", "waiting");
            setConnectionState("client3", "unset");
        }
        if (thisTabletBtName == tablet[3].name) {
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

    if (tablet[thisTabletIx].socket < 0 ) { //if not connected
        deviceAddress = serverTabletBtAddress;
        networking.bluetooth.connect(deviceAddress, uuid, function (socketId) {
            thisClientSocketId = socketId;
            tablet[thisTabletIx].socket = socketId;
            //console.log("Client connected, socket = ", socketId);
            setConnectionState(client, "connected");
            setConnectionState("server", "connected");
            //Notify Server who the Client is.
            sendMessage("this", "server", "confirmConnection", thisTabletBtName);
        }, function (errorMessage) {
            console.log("error from Calling", serverTabletBtAddress, serverTabletBtName, thisClientSocketId);
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
function setConnectionState(tablet, state) {
    var el;
    //console.log("setConnectionState", tablet, state);

    if (tablet == "server") {
        el = document.getElementById("server-connection");
    }
    if (tablet == "client1") {
        el = document.getElementById("client1-connection");
    }
    if (tablet == "client2") {
        el = document.getElementById("client2-connection");
    }
    if (tablet == "client3") {
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

// Send Message, text directly given
// msgText: Any string but may have functional content interpreted
// by receiving side.
//
// source: "this" when this is the originator
// source: "client1", "client2", "client3"  when this is the server relaying a msg
// recipient: "server", "client1", "client2", "client3"
// type: a tag that determines what is to be done with the text
// msgText: the actual message; format corresponds to type
// If msgText = "" the text from the "outgoing message" field is sent
//
/////////////////////////////////
function sendMessage(source, recipient, type, msgText) {
    var senderSocketId;
    var strContent;
    var objContent = {};
    var buf;

    console.log("sendMessage: ", source, recipient, type, msgText);
    if( tablet[thisTabletIx].type == recipient){
        popupBox("Local Message", "not handled", "id", "OK", "", "");
        return;
    }

    if (source == "this") {
        senderSocketId = tablet[thisTabletIx].socket;
        objContent.from = tablet[thisTabletIx].type;
    }
    else {
        if (recipient == "client1") {
            senderSocketId = tablet[1].socket;
        }
        if (recipient == "client2") {
            senderSocketId = tablet[2].socket;
        }
        if (recipient == "client3") {
            senderSocketId = tablet[3].socket;
        }
        objContent.from = source;
    }
    objContent.to = recipient;
    objContent.type = type;
    objContent.text = msgText;

    console.log("sendMessage content", objContent);
    console.log("sendMessage socket", senderSocket);

    strContent = JSON.stringify(objContent);
    buf = arrayBufferFromString(strContent);

    if (senderSocketId > 0 ) { 
        networking.bluetooth.send(senderSocketId, buf, function (bytes_sent) {
            console.log('Sent nbr of bytes: ', bytes_sent, 'Socket: ', senderSocketId);
            console.log("Message: ", strContent);
        }, function (errorMessage) {
            console.log('Send failed: ', errorMessage, 'Message: ', strContent, 'Socket: ', senderSocketId);
            console.log(strContent);
            popupBox("Send Message Error " + senderSocketId, errorMessage, "id", "OK", "", "");
        });
    } else {
        console.log("Server not connected, message not sent");
        popupBox("Send Message Error " + senderSocketId, "Socket not connected", "id", "OK", "", "");
    }
}

////////////////////////////////////////////////////////////////////////
// Received Message
// Called in response to onReceive Event, i.e. when a Bluetooth
// message has arrived.
// 
// If not, this is considered an error
// If yes, the data is read and displayed in the inbox
//  
function onBtReceiveHandler(receiveInfo) {
    var socketId = receiveInfo.socketId;
    var strReceived = stringFromArrayBuffer(receiveInfo.data);
    var objReceived = {};

    var textField = document.getElementById("msg-rcvd");
    textField.value = "";

    console.log("Data received: ", strReceived);
    objReceived = JSON.parse(strReceived);
    console.log("Obj received: ", objReceived);

    // Message into Inbox
    textField.value = strReceived;
    M.updateTextFields();
    M.textareaAutoResize(textField);

    msgInterpreter(socketId, strReceived);
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
    var str = [];
    var org = [];

    for (i = 0; i < 4; i++) {
        str[i] = JSON.stringify(tablet[i]);
        org[i] = JSON.parse(str[i]);
        console.log("tablet: ", i, org[i]);
    }
}


// This clears everything and starts over
// To make the same connections as before
// use "reconnect"; but you must do the same for the neighbors 
function generalReset() {

    // To Reset
    // thisTabletBtName, thisTabletBtAddress

    // Clear the sockets
    if (serverSocketId > -1) {
        networking.bluetooth.close(serverSocketId);
    }
    listeningForConnectionRequest = false;
    serverSocketId = -1;

    if (thisClientSocketId > -1) {
        networking.bluetooth.close(thisClientSocketId);
    }
    thisClientSocketId = -1;
    nbrConnectedClients = 0;

    // Clear the displayed Connections
    setConnectionState("server", "disconnected");
    setConnectionState("client1", "disconnected");
    setConnectionState("client2", "disconnected");
    setConnectionState("client3", "disconnected");

    networking.bluetooth.disable();
    setTimeout(enableBT, 3000);
}

function enableBT(){
    networking.bluetooth.enable();
    getBtDevices();
    initBtSettingsPage();
}

// Some incoming messages require action
// An example is the msg that communicates client name
// allowing the server to associate it with a socket. 
// The content element "type" determines what to do.

function msgInterpreter(socketId, strMsg) {
    var objMsg = JSON.parse(strMsg);

    console.log("Msg Interpreter: ", socketId, strMsg);
    console.log("Msg Interpreter: ", objMsg);

    if (objMsg.type == "confirmConnection") {
        //Put the socketId in the right target[] object
        for (i = 0; i < tablet.length; i++) {
            if (tablet[i].name == objMsg.text) {
                tablet[i].socket = socketId;
                console.log("socket set", socketId, tablet[i].name, tablet[i].type, objMsg.text, objMsg.from);
                setConnectionState(objMsg.from, "connected");
            }
        }
        return;
    }

    //If msg not for this tablet - Relay 
    if(tablet[thisTabletIx].type != objMsg.to){
        sendMessage(objMsg.from, objMsg.to, objMsg.type, strMsg);
        console.log("Relay: ", objMsg);
        return;
    }

    if(objMsg.type == "ping"){
        var text = "from " + objMsg.from;
        console.log(objMsg);
        popupBox("Ping Received", text, "id", "OK", "", "");
    }
}

// Ping causes a message of type "ping" to be sent to the receiver
// recipient = "server", "client1", "client2", "client3"
// the message text, if any, comes from the msg input field
// the recipient replies by sending a message containing the
// same text but with type "pong" 
function pping( recipient ){
    var val = document.getElementById("msg-send").value;
    var txt = "Ping: " + val;
    sendMessage( "this", recipient, "ping", txt);
}

function pong( recipient, text ){
    var txt = "Pong: " + text;
    sendMessage( "this", recipient, "pong", txt);
}