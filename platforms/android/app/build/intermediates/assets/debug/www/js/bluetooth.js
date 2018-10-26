//This is a js file intended solely for the BluetoothSettings.html module
//




////// End of Initializations ////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function initBtSettingsPage() {
    //restoreAllBtGlobals();
    //logBtGlobals();
    //getBtDevices(); //done already when loaded
    var el = document.getElementById("this-tablet-name");
    el.innerHTML = thisTabletBtName;
    console.log("Bluetooth page start", thisTabletBtName, thisTabletBtAddress);
    sortBtNames();

    serverTabletBtName = pairedBtNames[0];
    serverTabletBtAddress = pairedBtAddresses[0];
    el = document.getElementById("server-tablet-name");
    el.innerHTML = serverTabletBtName;

    client1TabletBtName = pairedBtNames[1];
    client1TabletBtAddress = pairedBtAddresses[1];
    el = document.getElementById("client1-tablet-name");
    el.innerHTML = client1TabletBtName;

    client2TabletBtName = pairedBtNames[2];
    client2TabletBtAddress = pairedBtAddresses[2];
    el = document.getElementById("client2-tablet-name");
    el.innerHTML = client2TabletBtName;

    client3TabletBtName = pairedBtNames[3];
    client3TabletBtAddress = pairedBtAddresses[3];
    el = document.getElementById("client3-tablet-name");
    el.innerHTML = client3TabletBtName;


    assignSeat();

    el = document.getElementById("this-tablet-seat");
    el.value = thisTabletSeat;
    M.FormSelect.init(el);
    M.updateTextFields();
    M.textareaAutoResize(el);

    console.log("seat", thisTabletSeat);
}

// Seat assignment of tablet has changed because user
// made selection in the dropdown.
// seat = "north", "east", "south", "west" 
function handleTabletNameChange(el, seat) {
    console.log("Call handleTabletNameChange");
}

function handleTabletSeatChange(el) {
    console.log("Call handleTabletSeatChange");
}

///////////////////////////////////////////////////////////////////////////////
// Get Adapter State and name and list of paired devices
// The names are then entered in the drop-downs for selection of RHO and LHO
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
            storeAllBtGlobals();
        },
        function (errorMessage) {
            console.error(errorMessage);
            popupBox("Bluetooth GetAdapterStat Error", errorMessage, "bt-error", "OK", "", "");
            popupBox(msgTitle, msgText, id, okText, yesText, noText)
        });

    // Information re paired devices
    networking.bluetooth.getDevices(function (devices) {
        pairedBtNames.length = 0; //reset in case called more than once
        pairedBtAddresses.length = 0;
        for (var i = 0; i < devices.length; i++) {
            // The deviceInfo object has the following properties:
            // address: String --> The address of the device, in the format 'XX:XX:XX:XX:XX:XX'.
            // name: String --> The human-readable name of the device.
            // paired: Boolean --> Indicates whether or not the device is paired with the system.
            // uuids: Array of String --> UUIDs of protocols, profiles and services advertised by the device.
            console.log(i, devices[i].name, devices[i].address);
            pairedBtNames[i] = devices[i].name;
            pairedBtAddresses[i] = devices[i].address;
            //>>>>>>>>>>>>>>addDeviceSelection(i);
        }

        // console.log("GetDevices lhoName: ", lhoBtName);
        // if (lhoBtName != null) {
        //   var el = document.getElementById("lho-name");
        //   console.log("GetDevices lhoName not null: ", lhoBtName);
        //   for (i = 0; i < el.options.length; i++) {
        //     console.log(i, el.options[i].text, el.options[i].value);
        //     if (el.options[i].text == lhoBtName) {
        //       el.selectedIndex = i;
        //       console.log("Selected: ", i, el.options[i].text, el.options[i].value);
        //     }
        //   }
        // }
    });
    //>>>>>>>>>>>>>>>>>setConnectionState("rho", "disconnected");
    //>>>>>>>>>>>>>>>>>setConnectionState("lho", "disconnected");
}



// strName = string key for this variable in localStorage
// value = its initial value
// the function assigns the given initial value to the variable
// unless there is already a value in storage.
//
function initVariable(strName, value) {
    var vName = value;
    if (localStorage.getItem(strName) != null) {
        vName = localStorage.getItem(strName);
    } else {
        localStorage.setItem(strName, value);
    }
    return vName;
}
//////////////////////////////////////////////////////////////
// Bluetooth Names and addresses - and all the global variables
// are initialized. If there is a stored value it is used; if not
// an initial value is assigned.
// So the returned value is either the initializer or the stored value,
// and the latter has preference.
// 
function restoreAllBtGlobals() {
    testCount = initVariable("testCount", 0);
    thisTabletBtName = initVariable("thisTabletBtName", "void");
    thisTabletBtAddress = initVariable("thisTabletBtAddress", "void");

    pairedBtNames[0] = initVariable("pairedBtNames0", "void");
    pairedBtNames[1] = initVariable("pairedBtNames1", "void");
    pairedBtNames[2] = initVariable("pairedBtNames2", "void");
    pairedBtNames[3] = initVariable("pairedBtNames3", "void");

    pairedBtAddresses[0] = initVariable("pairedBtAddresses0", "void");
    pairedBtAddresses[1] = initVariable("pairedBtAddresses1", "void");
    pairedBtAddresses[2] = initVariable("pairedBtAddresses2", "void");
    pairedBtAddresses[3] = initVariable("pairedBtAddresses3", "void");

    rhoBtName = initVariable("rhoBtName", "void");
    lhoBtName = initVariable("lhoBtName", "void");
    rhoBtAddress = initVariable("rhoBtAddress", "void");
    lhoBtAddress = initVariable("lhoBtAddress", "void");

    // When Reset the old values are saved in order to reconnect
    rhoBtNameOld = initVariable("rhoBtNameOld", "void");
    lhoBtNameOld = initVariable("lhoBtNameOld", "void");
    rhoBtAddressOld = initVariable("rhoBtAddressOld", "void");
    lhoBtAddressOld = initVariable("lhoBtAddressOld", "void");

    // Bluetooth status variables
    uuid = '94f39d29-7d6d-437d-973b-fba39e49d4ee';
    listeningForConnectionRequest = initVariable("listeningForConnectionRequest", false);
    lhoConnected = initVariable("lhoConnected", false);
    rhoConnected = initVariable("rhoConnected", false);
    lhoSocketId = initVariable("lhoSocketId", -1);
    rhoSocketId = initVariable("rhoSocketId", -1);
    serverSocketId = initVariable("serverSocketId", -1);
    relaySecDelay = initVariable("relaySecDelay", 3);
    relayRepCount = initVariable("relayRepCount", 32);
}

function storeAllBtGlobals() {
    localStorage.setItem("testCount", testCount);
    localStorage.setItem("thisTabletBtName", thisTabletBtName);
    localStorage.setItem("thisTabletBtAddress", thisTabletBtAddress);

    localStorage.setItem("pairedBtNames0", pairedBtNames[0]);
    localStorage.setItem("pairedBtNames1", pairedBtNames[1]);
    localStorage.setItem("pairedBtNames2", pairedBtNames[2]);
    localStorage.setItem("pairedBtNames3", pairedBtNames[3]);

    localStorage.setItem("pairedBtAddresses0", pairedBtAddresses[0]);
    localStorage.setItem("pairedBtAddresses1", pairedBtAddresses[1]);
    localStorage.setItem("pairedBtAddresses2", pairedBtAddresses[2]);
    localStorage.setItem("pairedBtAddresses3", pairedBtAddresses[3]);

    localStorage.setItem("rhoBtName", rhoBtName);
    localStorage.setItem("lhoBtName", lhoBtName);
    localStorage.setItem("rhoBtAddress", rhoBtAddress);
    localStorage.setItem("lhoBtAddress", lhoBtAddress);

    // When Reset the old values are saved in order to reconnect
    localStorage.setItem("rhoBtNameOld", rhoBtNameOld);
    localStorage.setItem("lhoBtNameOld", lhoBtNameOld);
    localStorage.setItem("rhoBtAddressOld", rhoBtAddressOld);
    localStorage.setItem("lhoBtAddressOld", lhoBtAddressOld);

    // Bluetooth status variables
    localStorage.setItem("uuid", '94f39d29-7d6d-437d-973b-fba39e49d4ee');
    localStorage.setItem("listeningForConnectionRequest", listeningForConnectionRequest);
    localStorage.setItem("lhoConnected", lhoConnected);
    localStorage.setItem("rhoConnected", rhoConnected);
    localStorage.setItem("lhoSocketId", lhoSocketId);
    localStorage.setItem("rhoSocketId", rhoSocketId);
    localStorage.setItem("serverSocketId", serverSocketId);
    localStorage.setItem("relaySecDelay", relaySecDelay);
    localStorage.setItem("relayRepCount", relayRepCount);
}

function logBtGlobals() {
    console.log("testCount", testCount);
    console.log("thisTabletBtName", thisTabletBtName);
    localStorage.setItem("thisTabletBtAddress", thisTabletBtAddress);

    console.log("pairedBtNames0", pairedBtNames[0]);
    console.log("pairedBtNames1", pairedBtNames[1]);
    console.log("pairedBtNames2", pairedBtNames[2]);
    console.log("pairedBtNames3", pairedBtNames[3]);

    console.log("pairedBtAddresses0", pairedBtAddresses[0]);
    console.log("pairedBtAddresses1", pairedBtAddresses[1]);
    console.log("pairedBtAddresses2", pairedBtAddresses[2]);
    console.log("pairedBtAddresses3", pairedBtAddresses[3]);

    console.log("rhoBtName", rhoBtName);
    console.log("lhoBtName", lhoBtName);
    console.log("rhoBtAddress", rhoBtAddress);
    console.log("lhoBtAddress", lhoBtAddress);

    // When Reset the old values are saved in order to reconnect
    console.log("rhoBtNameOld", rhoBtNameOld);
    console.log("lhoBtNameOld", lhoBtNameOld);
    console.log("rhoBtAddressOld", rhoBtAddressOld);
    console.log("lhoBtAddressOld", lhoBtAddressOld);

    // Bluetooth status variables
    console.log("uuid", '94f39d29-7d6d-437d-973b-fba39e49d4ee');
    console.log("listeningForConnectionRequest", listeningForConnectionRequest);
    console.log("lhoConnected", lhoConnected);
    console.log("rhoConnected", rhoConnected);
    console.log("lhoSocketId", lhoSocketId);
    console.log("rhoSocketId", rhoSocketId);
    console.log("serverSocketId", serverSocketId);
    console.log("relaySecDelay", relaySecDelay);
    console.log("relayRepCount", relayRepCount);
}

// Sets color of the directed connection between two players
// source, sink = "N", "E", "S", "W"
// status = "disconnected", "waiting", "connected", "nocomm"
function setConnectionStatus(source, sink, status) {
    var c = noCommunicationColor;

    if (status == "disconnected") {
        c = disconnectedColor;
    }
    if (status == "waiting") {
        c = waitingColor;
    }
    if (status == "connected") {
        c = connectedColor;
    }

    if (source == "N") {
        if (sink == "N") {
            el = document.getElementById("nn");
        }
        if (sink == "E") {
            el = document.getElementById("ne");
        }
        if (sink == "S") {
            el = document.getElementById("ns");
        }
        if (sink == "W") {
            el = document.getElementById("nw");
        }
    }
    if (source == "E") {
        if (sink == "N") {
            el = document.getElementById("en");
        }
        if (sink == "E") {
            el = document.getElementById("ee");
        }
        if (sink == "S") {
            el = document.getElementById("es");
        }
        if (sink == "W") {
            el = document.getElementById("ew");
        }
    }
    if (source == "S") {
        if (sink == "N") {
            el = document.getElementById("sn");
        }
        if (sink == "E") {
            el = document.getElementById("se");
        }
        if (sink == "S") {
            el = document.getElementById("ss");
        }
        if (sink == "W") {
            el = document.getElementById("sw");
        }
    }
    if (source == "W") {
        if (sink == "N") {
            el = document.getElementById("wn");
        }
        if (sink == "E") {
            el = document.getElementById("we");
        }
        if (sink == "S") {
            el = document.getElementById("ws");
        }
        if (sink == "W") {
            el = document.getElementById("ww");
        }
    }

    el.setAttribute("fill", c);
}

//Sort the tablet names (including this tablet)
//reorder the paired..[] arrays accordingly
// 
function sortBtNames() {
    var btN = [];
    var btA = [];
    var i;
    var j;
    var len;

    len = pairedBtNames.length;
    pairedBtNames[len] = thisTabletBtName;
    pairedBtAddresses[len] = thisTabletBtAddress;

    len = pairedBtNames.length;
    for (i = 0; i < len; i++) {
        btN[i] = pairedBtNames[i];
        btA[i] = pairedBtAddresses[i];
    }

    btN.sort();
    for (i = 0; i < pairedBtNames.length; i++) {
        for (j = 0; j < pairedBtNames.length; j++) {
            if (btN[i] == pairedBtNames[j]) {
                btA[i] = pairedBtAddresses[j];
            }
        }
    }

    for (i = 0; i < pairedBtNames.length; i++) {
        pairedBtNames[i] = btN[i];
        pairedBtAddresses[i] = btA[i];
    }
}

// The seat is assigned provisionally and can be changed 
// at will. The assignment is made according to the
// alphobetical order of the tablet names.
function assignSeat() {
    var s = ["North", "East", "South", "West"];
    for (var i = 0; i < 4; i++) {
        tabletSeat[i] = s[i];
        if (thisTabletBtName == pairedBtNames[i]) {
            thisTabletSeat = s[i];
        }
    }
}

//If this is the server - start listening
//If it is a client - wait and the start calling
//Delay depends upon alphabetical rank, i.e. position
//in the paired list.
function makeConnections() {
    if (thisTabletBtName == serverTabletBtName) { //this is the server
        startBtListening();
    } else { //this is a client
        startCalling();
    }
}

// This is the 'server' side, of the socket connection
// The 'server' (listener) is an arbitrarily chosen tablet
// the others are 'clients' who requests a connection (callers)
function startBtListening() {
    console.log("Enter Listening");

    if (!listeningForConnectionRequest) {
        networking.bluetooth.listenUsingRfcomm(uuid, function (socketId) {
            serverSocketId = socketId;
            listeningForConnectionRequest = true;

            console.log("startBluetoothListening " + socketId);

            setConnectionState(thisTabletSeat, "waiting");

            networking.bluetooth.onAccept.addListener(function (acceptInfo) {
                if (acceptInfo.socketId !== serverSocketId) {
                    console.log('onAccept -- acceptInfo.socketId != serverSocketId');
                    return;
                }
                clientSocketId[nbrConnectedClients] = acceptInfo.clientSocketId;
                nbrConnectedClients += 1;

                setConnectionState(thisTabletSeat, "connected");
                //Closing server socket was removed on advice stackoverflow
                // but no noticeable effect.
                //networking.bluetooth.close(serverSocketId);
                //listeningForConnectionRequest = false;
                console.log("Accepted Connection: ", "Server Socket: ", serverSocketId, "Client Socket: ", clientSocketId);
            });
        }, function (errorMessage) {
            console.log("error from Listener");
            console.error(errorMessage);
            popupBox("Bluetooth Listener Error", errorMessage, "btListenerError", "OK", "", "");

        });
    }
}

// Offers to connect to LHO
function startCalling() {
    console.log("startCalling");
    var deviceAddress;

    if (!lhoConnected) {
        //var elLho = document.getElementById("lho-name");
        //deviceAddress = elLho.value;
        deviceAddress = lhoBtAddress;
        setConnectionState("lho", "waiting");
        console.log("connectClient waiting ", deviceAddress);
        networking.bluetooth.connect(deviceAddress, uuid, function (socketId) {
            lhoSocketId = socketId;
            lhoConnected = true;
            console.log("Client connected. LHO socket = ", socketId, lhoBtAddress, lhoBtName);
            setConnectionState("lho", "connected");
            //Notify LHO who the RHO is.
            //Do not change the format in any way. The other side depends upon it.  
            msgToLho("rho-name: " + thisTabletBtName + " rho-addr: " + thisTabletBtAddress + " ");
        }, function (errorMessage) {
            console.log("error from Calling", lhoBtAddress, lhoBtName, lhoSocketId);
            console.error(errorMessage);
            popupBox("Bluetooth Caller Error", errorMessage, "btCallerError", "OK", "", "");
        });
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// client is "client1", "client2", or "client3"
// state is "disconnected", "waiting", "connected", or "unset"
// The function changes the class of the corresponding element
// in order to display the  red, yellow or green symbol
//
function setConnectionState(client, state) {
    var elDis;
    var elWat;
    var elCon;
    console.log("setConnectionState", client, state);
    if (client == "client1") {
        elDis = document.getElementById("client1-dis");
        elWat = document.getElementById("client1-wait");
        elCon = document.getElementById("client1-connect");
    }
    if (client == "client2") {
        elDis = document.getElementById("client2-dis");
        elWat = document.getElementById("client2-wait");
        elCon = document.getElementById("client2-connect");
    }
    if (client == "client3") {
        elDis = document.getElementById("client3-dis");
        elWat = document.getElementById("client3-wait");
        elCon = document.getElementById("client3-connect");
    }

    elDis.setAttribute("fill", unsetColor);
    elWat.setAttribute("fill", unsetColor);
    elCon.setAttribute("fill", unsetColor);

    if (state == "disconnected") {
        elDis.setAttribute("fill", disconnectedColor);
    }
    if (state == "waiting") {
        elWat.setAttribute("fill", waitingColor);
    }
    if (state == "connected") {
        elCon.setAttribute("fill", connectedColor);
    }
}