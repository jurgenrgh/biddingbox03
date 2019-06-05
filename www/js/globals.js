//////////////////////////////////////////////////////////////
// Bluetooth Names and addresses - and all the global variables
// are initialized.
// 
function initAllBtGlobals() {

    tablet[0] = {
        type: "void",
        name: "void",
        address: "void",
        seatIx: -1,
        socket: -1
    };
    tablet[1] = {
        type: "void",
        name: "void",
        address: "void",
        seatIx: -1,
        socket: -1
    };
    tablet[2] = {
        type: "void",
        name: "void",
        address: "void",
        seatIx: -1,
        socket: -1
    };
    tablet[3] = {
        type: "void",
        name: "void",
        address: "void",
        seatIx: -1,
        socket: -1
    };

    thisTabletIx = 0;
    thisTabletBtName = "void";
    thisTabletBtAddress = "void";
    serverTabletIx = 0;

    // UUID must be the same on all connected devices
    //uuid = '94f39d29-7d6d-437d-973b-fba39e49d4ee';
    uuid[0] = '94f39d29-7d6d-437d-973b-fba39e49d4ee';
    uuid[1] = '322de69b-6359-466c-a541-c6af48348f1d';
    uuid[2] = 'f5341169-8493-452b-bc56-16e78fbb61d2';
    uuid[3] = '465191cd-a322-4fd0-b165-dd1b8caff80a';

    listeningForConnectionRequest = false;

    serverSocketId = -1;

    thisClientSocketId = -1;
    nbrConnectedClients = 0;

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
        seatIx: -1,
        socket: -1
    });
    tablet[1] = initObject("tablet1", {
        type: "void",
        name: "void",
        address: "void",
        seatIx: -1,
        socket: -1
    });
    tablet[2] = initObject("tablet2", {
        type: "void",
        name: "void",
        address: "void",
        seatIx: -1,
        socket: -1
    });
    tablet[3] = initObject("tablet3", {
        type: "void",
        name: "void",
        address: "void",
        seatIx: -1,
        socket: -1
    });

    thisTabletIx = initVariable("thisTabletIx", 0);
    thisTabletBtName = initVariable("thisTabletBtName", "void");
    thisTabletBtAddress = initVariable("thisTabletBtAddress", "void");
    serverTabletIx = initVariable("serverTabletIx", 0);

    // UUID must be the same on all connected devices
    // uuid = '94f39d29-7d6d-437d-973b-fba39e49d4ee';
    uuid[0] = '94f39d29-7d6d-437d-973b-fba39e49d4ee';
    uuid[1] = '322de69b-6359-466c-a541-c6af48348f1d';
    uuid[2] = 'f5341169-8493-452b-bc56-16e78fbb61d2';
    uuid[3] = '465191cd-a322-4fd0-b165-dd1b8caff80a';

    listeningForConnectionRequest = initVariable("listeningForConnectionRequest", false);

    serverSocketId = initVariable("serverSocketId", -1);

    thisClientSocketId = initVariable("thisClientSocketId", -1);
    nbrConnectedClients = initVariable("nbrConnectedClients", 0);

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

    //localStorage.setItem("uuid", '94f39d29-7d6d-437d-973b-fba39e49d4ee');
    localStorage.setItem("uuid01", '94f39d29-7d6d-437d-973b-fba39e49d4ee');
    localStorage.setItem("uuid02", '322de69b-6359-466c-a541-c6af48348f1d');
    localStorage.setItem("uuid03", 'f5341169-8493-452b-bc56-16e78fbb61d2');
    localStorage.setItem("uuid04", '465191cd-a322-4fd0-b165-dd1b8caff80a');

    localStorage.setItem("listeningForConnectionRequest", listeningForConnectionRequest);

    localStorage.setItem("serverSocketId", serverSocketId);

    localStorage.setItem("thisClientSocketId", thisClientSocketId);
    localStorage.setItem("nbrConnectedClients", nbrConnectedClients);

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

    //console.log("uuid", '94f39d29-7d6d-437d-973b-fba39e49d4ee');
    console.log("uuid01", '94f39d29-7d6d-437d-973b-fba39e49d4ee');
    console.log("uuid02", '322de69b-6359-466c-a541-c6af48348f1d');
    console.log("uuid03", 'f5341169-8493-452b-bc56-16e78fbb61d2');
    console.log("uuid04", '465191cd-a322-4fd0-b165-dd1b8caff80a');

    console.log("listeningForConnectionRequest", listeningForConnectionRequest);

    console.log("serverSocketId", serverSocketId);

    console.log("thisClientSocketId", thisClientSocketId);
    console.log("nbrConnectedClients", nbrConnectedClients);

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
        seconds = s + 60 * m;
    } else {
        h = parseInt(sep[0]);
        m = parseInt(sep[1]);
        s = parseInt(sep[2]);
        seconds = s + 60 * m + 3600 * h;
    }
    return (seconds);
}

/**
 * @description
 * Takes the charcode of the last character of tablet name and converts <br>
 * it to an integer so that remainder mod 4 = endInt. <br>
 * Then seatIx = (endInt + 3) mod 4  <br>
 * this makes 1,2,3,4 <-> N,E,S,W  <br>
 * Returns value of seatIx <br>
 * 
 * @param {string} strName 
 * @return {int} seatIx
 */
function getSeatIxFromName(strName) {
    var len = strName.length;
    var endInt = strName.charCodeAt(len - 1);
    var six = (endInt + 3) % 4;
    return six;
}

/**
 * @description
 * The buttons controlling the next board to be played are <br>
 * disabled while the hand is being bid <br>
 */
function disableBBControlInput() {
    var sec = document.getElementById("btn-play-board");
    sec.classList.remove("large-btn");
    sec.classList.add("large-btn-disabled");
    sec.style.color ='#666666';

    var t = document.getElementById("btn-subtract");
    t.classList.remove("standard-btn");
    t.classList.add("standard-btn-disabled");
    t.style.color ='#666666';

    var s = document.getElementById("btn-add");
    s.classList.remove("standard-btn");
    s.classList.add("standard-btn-disabled");
    s.style.color ='#666666';

    var b = document.getElementById("btn-bb-reset");
    b.classList.remove("large-btn");
    b.classList.add("large-btn-disabled");
    b.style.color ='#666666';

    var su = document.getElementById("input-board-number");
    su.classList.add("input-disabled");
    su.disabled = true;
    su.style.color ='#666666';
}

/**
 * @description
 * Enable the Board number selection mechanism <br> 
 * Active only between boards being bid <br>
 */
function enableBBControlInput() {
    var sec = document.getElementById("btn-play-board");
    sec.classList.add("large-btn");
    sec.classList.remove("large-btn-disabled");
    sec.style.color ='black';

    var t = document.getElementById("btn-subtract");
    t.classList.add("standard-btn");
    t.classList.remove("standard-btn-disabled");
    t.style.color ='black';

    var s = document.getElementById("btn-add");
    s.classList.add("standard-btn");
    s.classList.remove("standard-btn-disabled");
    s.style.color ='black';

    var b = document.getElementById("btn-bb-reset");
    b.classList.add("large-btn");
    b.classList.remove("large-btn-disabled");
    b.style.color ='black';

    var su = document.getElementById("input-board-number");
    su.classList.remove("input-disabled");
    su.disabled = false;
    su.style.color ='black';
}

///////////////////////////////////////////////////////
// Get seatIx from relative position code
// i.e. relative position 'l', 'r', 'p', 'm'
// meaning LHO, RHO, Partner, Screenmate are converted into
// seat index [0,1,2,3] meaning [N,E,S,W]
// input may also be 'n' or 'N' or 'north' or 'North' etc
// Returns -1 if not one of the above
//
function positionToSeatIx(posCode) {
    var low = posCode.toLowerCase();
    var seatIx = -1; //receiving seat index

    //console.log("pos to seatix", posCode, low, seatIx);

    if (low == 'r') {
        seatIx = (thisSeatIx + 3) % 4;
    }
    if (low == 'l') {
        seatIx = (thisSeatIx + 1) % 4;
    }
    if (low == 'p') {
        seatIx = (thisSeatIx + 2) % 4;
    }
    if (low == 'm') {
        if( thisSeatIx == 0 || thisSeatIx == 2){
            seatIx = (thisSeatIx + 1) % 4;
        }
        if( thisSeatIx == 1 || thisSeatIx == 3){
            seatIx = (thisSeatIx + 3) % 4;
        }
    }
    //console.log("pos to seatix", posCode, low, seatIx);
    if ((low == 'n') || (low == 'north')) {
        seatIx = 0;
    }
    if ((low == 'e') || (low == 'east')) {
        seatIx = 1;
    }
    if ((low == 's') || (low == 'south')) {
        seatIx = 2;
    }
    if ((low == 'w') || (low == 'west')) {
        seatIx = 3;
    }
    //console.log("pos to seatix", posCode, low, seatIx);
    return seatIx;
}

//For server tablet only: given seat name, e.g. "North"
// return client name, e.g. "client1"  
// (currently not used)
function seatToClient(seat){
    var client;
    for(i = 0; i < 4; i++)
    if(seatOrderWord[tablet[i].seatIx] == seat){
        client = tablet[i].type;
    }
    return client;
}

/**
 * Translate the destination code acc to message tag
 * 
 * @param {string} rcvCode 
 * @return {string} newCode 
 */ 
function checkMessageDestination( rcvCode, tag ){
    var newCode = "";
    if(tag == confirm-connection){

    }
    if(tag == seat-id){

    }
    if(tag == client-id){
        
    }
    if(tag == ping){

    }
    return newCode;
}

/**
 * Data sent and received on the bluetooth socket is an unstructured <br>
 * binary "arrayBuffer". <br>
 * Here Output strings are converted to the buffer format <br> 
 * @param {string} str 
 */
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
  /**
   * Data sent and received on the bluetooth socket is an unstructured <br>
   * binary "arrayBuffer". <br>
   * Output strings are converted to the buffer format <br>
   * Here we convert the buffer contents back into a string <br> 
   * @param {arrayBuffer} buf 
   */
  function stringFromArrayBuffer(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
  }
    


