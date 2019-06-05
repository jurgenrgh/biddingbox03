/////////////////////////////////////////////////////////////////////////////
// Director Settings ////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
//
/**
 * Called whenever the user switches to this page
 * Initializes the page using current values of the settings
 */
function initDirSettingsPage() {
    var el = document.getElementById("dir-this-tablet-name");
    el.innerHTML = tablet[thisTabletIx].name;
    el = document.getElementById("dir-this-tablet-rank");
    el.innerHTML = tablet[thisTabletIx].type;

    console.log("tablet", tablet);

    if (tablet[thisTabletIx].seatIx == 0) {
        document.getElementById("radio-north").checked = 'checked';
        thisSeatIx = 0;
    }
    if (tablet[thisTabletIx].seatIx == 1) {
        document.getElementById("radio-east").checked = 'checked';
        ThisSeatIx = 1;
    }
    if (tablet[thisTabletIx].seatIx == 2) {
        document.getElementById("radio-south").checked = 'checked';
        thisSeatIx = 2;
    }
    if (tablet[thisTabletIx].seatIx == 3) {
        document.getElementById("radio-west").checked = 'checked';
        thisSeatIx = 3;
    }
    if (tablet[thisTabletIx].seatIx == -1) {
        document.getElementById("radio-east").checked = 'checked';
        thisSeatIx = 1; //arbitrarily
    }

    //Set Globals from BB02, declared in globals.js
    //
    //var thisSeatIx = 1; // Seat of this tablet set above
    //var validPin = 1234; //needs to be added

    // var tableIx = 0; // Table of this tablet
    var tnbr = tableIx + 1;
    document.getElementById("input-table-number").value = tnbr;
    document.getElementById("input-section-letter").value = sectionId;
    document.getElementById("input-first-board").value = firstBoardNbr;
    document.getElementById("input-last-board").value = lastBoardNbr;
    document.getElementById("input-hand-minutes").value = minPerHand;
    document.getElementById("input-session-minutes").value = minPerSession;

    document.getElementById("alert-own-bids").checked = alertOwn;
    document.getElementById("alert-partner-bids").checked = alertPartner;
    document.getElementById("alert-screenmate").checked = alertScreenmate;
    document.getElementById("alert-both-opps").checked = alertBothOpps;

    if (trayTransfer == "ns") {
        document.getElementById("tray-ns").checked = true;
    }
    if (trayTransfer == "ew") {
        document.getElementById("tray-ew").checked = true;
    }

    //Player Settings
    if (reconfirmBidSubmission) {
        document.getElementById("radio-reconfirm-bid").checked = true;
    }
    if (!reconfirmBidSubmission) {
        document.getElementById("radio-no-reconfirm-bid").checked = true;
    }

    if (newBoardControlSeat == "North") {
        document.getElementById("next-control-north").checked = true;
    }
    if (newBoardControlSeat == "East") {
        document.getElementById("next-control-east").checked = true;
    }
    if (newBoardControlSeat == "South") {
        document.getElementById("next-control-south").checked = true;
    }
    if (newBoardControlSeat == "West") {
        document.getElementById("next-control-west").checked = true;
    }
}

/**
 * Called directly when the seat assignment is changed
 * Followed by confirmation popup. 
 * Actual change: doSeatChange called upon confitmation
 * @param {string} newSeat 'N','E','S', or 'W' 
 */
function handleSeatChange(newSeat) {
    currentModalId = "new-seat";
    currentModalData = newSeat;
    popupBox("New Seat Assignment", "This Tablet will be " + newSeat + ". Make sure that the seat assigment is consistent!", "new-seat", "", "OK", "CANCEL");
}

/**
 * Called by the modal box confirming intent to change the seat assignment
 * @param {string} seat 'N','E','S', or 'W' 
 */
function doSeatChange(seat){
    thisSeatIx = seatOrder.indexOf(seat);
    tablet[thisTabletIx].seatIx = thisSeatIx;
    console.log("setting new seat = " + seat, thisSeatIx);
    resetBiddingBoxPage();
}

// This now directly in index.html
//document.getElementById("input-table-number").onchange = function () {
//    handleTableNumberChange();
//};

function handleTableNumberChange() {
    var x = document.getElementById("input-table-number");
    tableIx = x.value - 1;
    resetBiddingBoxPage();
    console.log("New Table Number ", x.value);
}

// This now directly in index.html
//document.getElementById("input-section-letter").onchange = function () {
//    handleSectionLetterChange();
//};

function handleSectionLetterChange() {
    var x = document.getElementById("input-section-letter");
    sectionId = x.value;
    resetBiddingBoxPage();
    console.log("Section Id ", x.value);
}

// This now directly in index.html
//document.getElementById("input-first-board").onchange = function () {
//    handleFirstBoardChange();
//};

function handleFirstBoardChange() {
    var x = document.getElementById("input-first-board");
    firstBoardNbr = x.value;
    console.log("First Board ", x.value);
}

// This now directly in index.html
document.getElementById("input-last-board").onchange = function () {
    handleLastBoardChange();
};

function handleLastBoardChange() {
    var x = document.getElementById("input-last-board");
    lastBoardNbr = x.value;
    console.log("Last Board ", x.value);
}

// This now directly in index.html
document.getElementById("input-hand-minutes").onchange = function () {
    handleHandMinutesChange();
};

function handleHandMinutesChange() {
    var x = document.getElementById("input-hand-minutes");
    minPerHand = x.value;
    console.log("Minutes per Hand ", x.value);
}

// This now directly in index.html
document.getElementById("input-session-minutes").onchange = function () {
    handleSessionMinutesChange();
};

function handleSessionMinutesChange() {
    var x = document.getElementById("input-session-minutes");
    minPerSession = x.value;
    console.log("Minutes per Session ", x.value);
}

// This now directly in index.html
document.getElementById("alert-own-bids").onchange = function () {
    handleAlertOwnChange();
};

function handleAlertOwnChange() {
    var x = document.getElementById("alert-own-bids");
    alertOwn = x.checked;
    console.log("Alert Own ", x.checked);
}

// This now directly in index.html
document.getElementById("alert-partner-bids").onchange = function () {
    handleAlertPartnerChange();
};

function handleAlertPartnerChange() {
    var x = document.getElementById("alert-partner-bids");
    alertPartner = x.checked;
    console.log("Alert Partner ", x.checked);
}

// This now directly in index.html
document.getElementById("alert-screenmate").onchange = function () {
    handleAlertScreenmateChange();
};

function handleAlertScreenmateChange() {
    var x = document.getElementById("alert-screenmate");
    alertScreenmate = x.checked;
    console.log("Alert Screenmate ", x.checked);
}

// This now directly in index.html
document.getElementById("alert-both-opps").onchange = function () {
    handleAlertBothOppsChange();
};

function handleAlertBothOppsChange() {
    var x = document.getElementById("alert-both-opps");
    alertBothOpps = x.checked;
    console.log("Alert Both Opps", x.checked);
}

function handleTrayTransferChange(par) {
    trayTransfer = par;
    console.log("Tray Transfer", par);
}

// This now directly in index.html
document.getElementById("rotate-board").onchange = function () {
    handleRotateBoardChange();
};

function handleRotateBoardChange() {
    var x = document.getElementById("rotate-board");
    rotatedBoard = x.checked;
    console.log("Rotated Board ", x.checked);
}

//////////////////////////////////////////////////////////////////////////////
// Player Settings  //////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//
function handleBidReconfirmChange(par) {
    reconfirmBidSubmission = par;
}

/**
 * Set seat that controls start of new board
 * @param {string} seat "North", "East", "South", "West" 
 */
function handleNewBoardControlChange(seat) {
    //console.log("next board control", seat);
    newBoardControlSeat = seat;
}

/**
 * Set parameter to determine whether non-bidder is notified when a new bid is shown  
 * @param {bool} par 
 */
function handleNewBidNotify(par){
    notifyNewBid = par;
}

/**
 * Initialize the Board and Session Timers
 */
function initClockScreen() {
    //console.log("Init Clock");
    var elb = document.getElementById("board-time");
    var els = document.getElementById("session-time");
    var elc = document.getElementById("contract-display");

    var hours = Math.floor(minPerHand / 60);
    var minutes = Math.floor(minPerHand - (hours * 60));
    var seconds = (minPerHand - Math.trunc(minPerHand)) * 60;
    //console.log("hms: ", hours, minutes, seconds);

    var timeString = getHMS(hours, minutes, seconds, true, false);
    elb.innerHTML = timeString;
    //console.log(timeString);

    hours = Math.floor(minPerSession / 60);
    minutes = Math.floor(minPerSession - (hours * 60));
    seconds = (minPerSession - Math.trunc(minPerSession)) * 60;
    //console.log("hms: ", hours, minutes, seconds);

    timeString = getHMS(hours, minutes, seconds, false, false);
    els.innerHTML = timeString;
    //console.log(timeString);

    elb = document.getElementById("bar-clock-board");
    els = document.getElementById("bar-clock-session");

    //console.log( elb.style.width, els.style.width);

    document.getElementById("bar-clock-board").style.width = "100%";
    document.getElementById("bar-clock-session").style.width = "100%";
    //console.log( elb.style.width, els.style.width);

    var contract = getContract();
    if( contract == ""){
        contract = "No Contract";
    }
    elc.innerHTML = contract;
}

/**
 * Called from 'Start Clocks' button 
 */
function startClocks() {
    var elBoardTime = document.getElementById("board-time");
    var elSessionTime = document.getElementById("session-time");
    var elBoardBar = document.getElementById("bar-clock-board");
    var elSessionBar = document.getElementById("bar-clock-session");

    var boardSeconds = hmsToSeconds(elBoardTime.innerHTML);
    var sessionSeconds = hmsToSeconds(elSessionTime.innerHTML);
    console.log(elBoardTime.innerHTML, boardSeconds, elSessionTime.innerHTML, sessionSeconds);

    var boardTotalSeconds = minPerHand * 60;
    var sessionTotalSeconds = minPerSession * 60;
    var boardTimeString;
    var sessionTimeString;

    var percentWidth;
    var wTxt;

    timerIdBoard = setInterval(boardFrame, 1000);
    timerIdSession = setInterval(sessionFrame, 1000);

    function boardFrame() {
        if (boardSeconds <= 0) {
            clearInterval(timerIdBoard);
        } else {
            boardSeconds = boardSeconds - 1;
            //console.log(boardSeconds);
            boardTimeString = getHMS(0, 0, boardSeconds, true, false);
            elBoardTime.innerHTML = boardTimeString;

            percentWidth = Math.trunc(100 * boardSeconds / boardTotalSeconds);
            wTxt = percentWidth + "%";
            elBoardBar.style.width = wTxt;
        }
    }

    function sessionFrame() {
        if (sessionSeconds <= 0) {
            clearInterval(timerIdSession);
        } else {
            sessionSeconds = sessionSeconds - 1;
            sessionTimeString = getHMS(0, 0, sessionSeconds, false, false);
            elSessionTime.innerHTML = sessionTimeString;

            percentWidth = Math.trunc(100 * sessionSeconds / sessionTotalSeconds);
            wTxt = percentWidth + "%";
            elSessionBar.style.width = wTxt;
        }
    }
}

/**
 * Stop the Clocks
 */
function stopClocks() {
    clearInterval(timerIdBoard);
    clearInterval(timerIdSession);
    console.log("Stop Clocks");
}

/**
 * The director deletes the current bid <br>
 * Needs a mechanism to restart bidding
 */
function backUpOneBid(){
    popupBox("Backup 1 Bid", "Todo backing up", "backup-bid", "OK", "", ""); 
}

/**
 * InitiThe boards display <br>
 * Show the bid or an earlier bid chosen 
 */
function initBoardsDisplay(){
    drawCompass("board-display");
}



