//////////////////////////////////////////////////////////////
// Bluetooth Names and addresses - and all the global variables
// are initialized.
// 
function initAllBtGlobals() {

    tablet[0] = {
        type: "void",
        name: "void",
        address: "void",
        seat: "void",
        socket: -1
    };
    tablet[1] = {
        type: "void",
        name: "void",
        address: "void",
        seat: "void",
        socket: -1
    };
    tablet[2] = {
        type: "void",
        name: "void",
        address: "void",
        seat: "void",
        socket: -1
    };
    tablet[3] = {
        type: "void",
        name: "void",
        address: "void",
        seat: "void",
        socket: -1
    };

    thisTabletIx = 0;
    thisTabletBtName = "void";
    thisTabletBtAddress = "void";
    serverTabletIx = 0;

    // UUID must be the same on all connected devices
    uuid = '94f39d29-7d6d-437d-973b-fba39e49d4ee';

    listeningForConnectionRequest = false;

    serverSocketId = -1;

    thisClientSocketId = -1;
    nbrConnectedClients = 0;
    clientSocketId[0] = -1;
    clientSocketId[1] = -1;
    clientSocketId[2] = -1;

    relaySecDelay = 3;
    relayRepCount = 32;
}

//////////////////////////////////////////////////////////////
// Bluetooth Names and addresses - and all the global variables
// are initialized. If there is a stored value it is used; if not
// an initial value is assigned.
// So the returned value is either the initializer or the stored value,
// and the latter has preference.
// 
function restoreAllBtGlobals() {

    tablet[0] = initObject("tablet0", {
        type: "void",
        name: "void",
        address: "void",
        seat: "void",
        socket: -1
    });
    tablet[1] = initObject("tablet1", {
        type: "void",
        name: "void",
        address: "void",
        seat: "void",
        socket: -1
    });
    tablet[2] = initObject("tablet2", {
        type: "void",
        name: "void",
        address: "void",
        seat: "void",
        socket: -1
    });
    tablet[3] = initObject("tablet3", {
        type: "void",
        name: "void",
        address: "void",
        seat: "void",
        socket: -1
    });

    thisTabletIx = initVariable("thisTabletIx", 0);
    thisTabletBtName = initVariable("thisTabletBtName", "void");
    thisTabletBtAddress = initVariable("thisTabletBtAddress", "void");
    serverTabletIx = initVariable("serverTabletIx", 0);

    // UUID must be the same on all connected devices
    uuid = '94f39d29-7d6d-437d-973b-fba39e49d4ee';

    listeningForConnectionRequest = initVariable("listeningForConnectionRequest", false);

    serverSocketId = initVariable("serverSocketId", -1);

    thisClientSocketId = initVariable("thisClientSocketId", -1);
    nbrConnectedClients = initVariable("nbrConnectedClients", 0);
    if (nbrConnectedClients > 0) {
        clientSocketId[0] = initVariable("clientSocketId0", -1);
    }
    if (nbrConnectedClients > 1) {
        clientSocketId[1] = initVariable("clientSocketId1", -1);
    }
    if (nbrConnectedClients > 2) {
        clientSocketId[2] = initVariable("clientSocketId2", -1);
    }

    relaySecDelay = initVariable("relaySecDelay", 3);
    relayRepCount = initVariable("relayRepCount", 32);
}

function storeAllBtGlobals() {
    var strObj0 = JSON.stringify(tablet[0]);
    var strObj1 = JSON.stringify(tablet[1]);
    var strObj2 = JSON.stringify(tablet[2]);
    var strObj3 = JSON.stringify(tablet[3]);
    localStorage.setItem("tablet0", strObj0);
    localStorage.setItem("tablet1", strObj1);
    localStorage.setItem("tablet2", strObj2);
    localStorage.setItem("tablet3", strObj3);

    localStorage.setItem("thisTabletIx", thisTabletIx);
    localStorage.setItem("thisTabletBtName", thisTabletBtName);
    localStorage.setItem("thisTabletBtAddress", thisTabletBtAddress);
    localStorage.setItem("serverTabletIx", serverTabletIx);

    localStorage.setItem("uuid", '94f39d29-7d6d-437d-973b-fba39e49d4ee');

    localStorage.setItem("listeningForConnectionRequest", listeningForConnectionRequest);

    localStorage.setItem("serverSocketId", serverSocketId);

    localStorage.setItem("thisClientSocketId", thisClientSocketId);
    localStorage.setItem("nbrConnectedClients", nbrConnectedClients);

    if (nbrConnectedClients > 0) {
        localStorage.setItem("clientSocketId0", clientSocketId[0]);
    }
    if (nbrConnectedClients > 1) {
        localStorage.setItem("clientSocketId1", clientSocketId[1]);
    }
    if (nbrConnectedClients > 2) {
        localStorage.setItem("clientSocketId2", clientSocketId[2]);
    }

    localStorage.setItem("relaySecDelay", relaySecDelay);
    localStorage.setItem("relayRepCount", relayRepCount);
}

function logBtGlobals() {
    console.log("tablet0", tablet[0]);
    console.log("tablet1", tablet[1]);
    console.log("tablet2", tablet[2]);
    console.log("tablet3", tablet[3]);

    console.log("thisTabletIx", thisTabletIx);
    console.log("thisTabletBtName", thisTabletBtName);
    console.log("thisTabletBtAddress", thisTabletBtAddress);
    console.log("serverTabletIx", serverTabletIx);

    console.log("uuid", '94f39d29-7d6d-437d-973b-fba39e49d4ee');

    console.log("listeningForConnectionRequest", listeningForConnectionRequest);

    console.log("serverSocketId", serverSocketId);

    console.log("thisClientSocketId", thisClientSocketId);
    console.log("nbrConnectedClients", nbrConnectedClients);

    if (nbrConnectedClients > 0) {
        console.log("clientSocketId0", clientSocketId[0]);
    }
    if (nbrConnectedClients > 1) {
        console.log("clientSocketId1", clientSocketId[1]);
    }
    if (nbrConnectedClients > 2) {
        console.log("clientSocketId2", clientSocketId[2]);
    }

    console.log("relaySecDelay", relaySecDelay);
    console.log("relayRepCount", relayRepCount);
}

// strName = string key for this variable in localStorage
// value = its initial value
// the function assigns the given initial value to the variable
// unless there is already a value in storage.
//
function initVariable(strName, value) {
    var restoredValue = value;
    var vstr;

    if (localStorage.getItem(strName) != null) {
        vStr = localStorage.getItem(strName);
        if (vstr == "false") restoredValue = false;
        if (vstr == "true") restoredValue = true;
    }
    return restoredValue;
}

// When the stored value is a stringified object
function initObject(strName, obj) {
    var restoredValue = obj;
    var vstr;

    if (localStorage.getItem(strName) != null) {
        vstr = localStorage.getItem(strName);
        restoredValue = JSON.parse(vstr);
    }
    return restoredValue;
}

//arr: array of strings
//Return index of ix-th element in alphabetical order
function getIndex(arr, ix) {
    var k = 0;
    for (j = 0; j < arr.length; j++) {
        if (arr[j] < arr[ix]) {
            k++;
        }
    }
    return k;
}

// Given h, m, s numerically, get string HH:MM:SS
// Leading zeros included
// hTruncate = true -> no leading zero hours
// mTruncate = true -> no leading zero minutes
//
function getHMS(hours, minutes, seconds, hTruncate, mTruncate) {
    var totSecs = 3600 * hours + 60 * minutes + seconds;

    var h = Math.floor(totSecs / 3600);
    var m = Math.floor((totSecs - (h * 3600)) / 60);
    var s = Math.floor(totSecs - (h * 3600) - (m * 60));
    var timeTxt;

    if (totSecs < 3600) {
        h = '00';
    } else {
        if (h < 10) {
            h = '0' + h;
        }
    }
    if (totSecs < 60) {
        m = '00';
    } else {
        if (m < 10) {
            m = '0' + m;
        }
    }
    if (totSecs < 1) {
        s = '00';
    } else {
        if (s < 10) {
            s = '0' + s;
        }
    }

    timeTxt = h + ':' + m + ':' + s;
    if ((totSecs < 3600) && hTruncate) {
        timeTxt = m + ':' + s;
    }
    if ((totSecs < 60) && mTruncate) {
        timeTxt = '' + s;
    }

    return timeTxt;
}

// Input hh:mm:ss string
// Output total seconds
//
function hmsToSeconds(hms) {
    var sep = hms.split(':');
    var h, m, s;
    var len = sep.length;
    var seconds;

    if (len == 2) {
        m = parseInt(sep[0]);
        s = parseInt(sep[1]);
        seconds = s + 60*m;
    } else {
        h = parseInt(sep[0]);
        m = parseInt(sep[1]);
        s = parseInt(sep[2]);
        seconds = s + 60 * m + 3600 * h;
    }

    

    return (seconds);
}