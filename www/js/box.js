///////////////////////////////////////////////////////////////////////////////
// Suit selection becomes available after level (tricks) is selected
//
function handleBoxReset() {
    popupBox("Reset the Bidding Box", "Are you sure? This will clear all data for the current board.", "reset", "", "RESET", "CANCEL");
}

function playSelectedBoard() {
    var boardNr = boardIx + 1;

    if (newBoardControlSeat == seatOrderWord[seatIx]) {
        popupBox("Starting Board " + boardNr, "Check Board Number and Orientation!", "new-board", "", "OK", "CANCEL");
    } else {
        popupBox("New Board Control", newBoardControlSeat + " must start the new Board", "", "OK", "", "");
    }
}

function executePlaySelectedBoard() {
    clearBidBox();
    if (bidderIx == seatIx) {
        bStat.boxOpen = true;
    }
    else{
        bStat.boxOpen = false;
    }
    initBiddingRecord(boardIx + 1);
    
    ///>>>>>>>>>>>>>>>>>>>> Message to all 3 other seats: Next Board //////
}

function resetBiddingBox() {
    console.log("reset bidding box");
    boardIx = 0; // Board index
    dealerIx = 0; // Dealer; function of boardIx
    vulIx = 0; // Vulnerability; function of boardIx

    roundIx = 0; //current round of bidding
    bidderIx = 1; //current bidder (bid order ix)
    hidePopupBox();
    drawCompass();
    initBiddingBoxSettings();
    clearBidBox();
    initBiddingRecord(1);
    /////////////////// not needed because director settings ///
    //enableInput();
}

///////////////////////////////////////////////////////////////////////////////
// Reset the bidding status (bStat) and the bidding box
// 1) first unselect (i.e. take away hilite), then enble trick buttons
// 2) same for suit buttons
// 3) same for calls
// 4) initialize the bStat object for start of bidding
//
function clearBidBox() {

    var idSuit;
    var id;
    var i;
    //console.log("clearBidBox Enter", bStat);

    //Enable the trick buttons
    for (i = 1; i <= 7; i++) {
        id = i.toString();
        unselectBidButton(id);
        enableBidButton(id);
    }

    // Enable suit buttons
    for (i = 0; i < 5; i++) {
        idSuit = suitNameOrder[i];
        unselectBidButton(idSuit);
        enableBidButton(idSuit);

    }
    // enable the calls
    unselectBidButton("X");
    unselectBidButton("XX");
    unselectBidButton("Pass");
    unselectBidButton("Alert");
    unselectBidButton("Submit");
    enableBidButton("X");
    enableBidButton("XX");
    enableBidButton("Pass");
    enableBidButton("Alert");
    enableBidButton("Submit");

    bStat = {
        lastBidder: "NO",
        tricks: 0,
        suit: "none",
        dbl: false,
        rdbl: false,
        boxOpen: false,
        newTricks: 0,
        newSuit: "none",
        newCall: "none",
        newAlert: false
    };

    //console.log("clearBidBox Exit", bStat);
}

///////////////////////////////////////////////////////////////////////////////
//Disable and grey out the bids and calls individually /////
//////////////////////////////////////////////////////////////////////////////
function enableBidButton(idTricks) {
    var targetDiv = document.getElementById(idTricks);
    if (targetDiv != null) {
        targetDiv.classList.remove("disabled");
    }
}

//enable only suits higher ranking or same as argument
function enableHigherSuitBids(ixSuit) {
    for (var i = ixSuit; i < 5; i++) {
        var targetDiv = document.getElementById(suitNameOrder[i]);
        targetDiv.classList.remove("disabled");
    }
}

function disableBidButton(idTricks) {
    var targetDiv = document.getElementById(idTricks);
    if (targetDiv != null) {
        targetDiv.classList.add("disabled");
    }
}

///////////////////////////////////////////////////////////////////////////////
// Select means highlight the provisional choice
//
function selectBidButton(idTricks) {
    var targetDiv = document.getElementById(idTricks);
    if (targetDiv != null) {
        targetDiv.classList.add("hiliteBid");
    }
}

function unselectBidButton(idTricks) {
    var targetDiv = document.getElementById(idTricks);
    if (targetDiv != null) {
        targetDiv.classList.remove("hiliteBid");
    }
}

function unselectCallButtons() {
    unselectBidButton("XX");
    unselectBidButton("Pass");
    unselectBidButton("X");
    unselectBidButton("Alert");
}


//This sets the Board number field - nothing else for now
function initBiddingBoxSettings() {
    var boardNr = boardIx + 1;
    document.getElementById("input-board-number").value = boardNr;
    document.getElementById("btn-selected-board").innerHTML = "Play Board " + boardNr;
    //console.log("init box", boardNr);
}

function handleBoardNumberChange(increment) {
    var x = document.getElementById("input-board-number");
    var bnbr = parseInt(x.value) + increment;
    //console.log("bnbr type: ", typeof(bnbr), "Value type: ", typeof(x.value), "Increment type: ", typeof(increment));
    if (bnbr > 0) {
        x.value = bnbr;
        boardIx = bnbr - 1;
        dealerIx = boardIx % 4;
        vulIx = (Math.floor(boardIx / 4) + dealerIx) % 4;
        //console.log("New Board Number ", x.value);
        drawCompass();
        //console.log("New Board Number ", boardIx + 1, dealerIx, vulIx);
    }
    document.getElementById("btn-selected-board").innerHTML = "Play Board " + bnbr;
    //console.log("board nr change", bnbr);
}

///////////////////////////////////////////////////////////////////////////////
// Called when the bidder selects a nbr of tricks. The selection is provisional
// until bidder confirms.
// Selecting a selected button will undo all current choices
//
function handleTricksBid(idTricks) {
    var id = parseInt(idTricks);
    var oldTricks = bStat.newTricks;

    if (bStat.boxOpen == false) {
        popupBox("It's not your turn", "", "", "OK", "", "");
        return;
    }

    if (oldTricks != 0) {
        unselectBidButton(oldTricks.toString());
    }

    if (id == oldTricks) {
        unselectBidButton(oldTricks.toString());
        bStat.newTricks = 0;
        bStat.newSuit = "none";
        bStat.newCall = "none";
        bStat.newAlert = false;
        updateBiddingRecord();
        prepBidBox();
    } else {
        selectBidButton(idTricks);
        bStat.newTricks = id;
        updateBiddingRecord();
        prepSuitBids();
    }
    checkEnableSubmit();
}

function handleSuitBid(idSuit) {
    var id = suitNameOrder.indexOf(idSuit);
    var oldSuit = bStat.newSuit;

    if (bStat.boxOpen == false) {
        popupBox("It's not your turn", "", "", "OK", "", "");
        return;
    }

    if (oldSuit != "none") { //if a suit was selected - unselect
        unselectBidButton(oldSuit);
    }

    if (idSuit == oldSuit) { //if same suit selected twice - restart
        unselectBidButton(oldSuit);
        bStat.newSuit = "none";
    } else {
        selectBidButton(idSuit);
        bStat.newSuit = idSuit;
    }
    updateBiddingRecord();
    checkEnableSubmit();
}