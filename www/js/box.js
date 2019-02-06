///////////////////////////////////////////////////////////////////////////////
// 
//
/**
 * @description
 * Called from onClickHandler for new board <br>
 * If this is the controlling tablet send a message to each of the other 3 tablets <br>
 * All four are then initialized <br>
 * All four are alerted by a popup, the bidder is asked to bid <br> 
 * boardNbr and bidderIx were already set <br>
 */
function promptNewBoard() {
    var doc = document.getElementById("input-board-number");
    var bn = parseInt(doc.value);
    console.log("promptNewBoard", bn);
    if (newBoardControlSeat == seatOrderWord[thisSeatIx]) {
        popupBox("Starting New Board " + bn, "Check Board Number and Orientation!", "new-board", "", "OK", "CANCEL");
    } else {
        popupBox("New Board Control", newBoardControlSeat + " must start the new Board", "", "OK", "", "");
    }
    if (bidderIx == thisSeatIx) {
        bStat.boxOpen = true;
    } else {
        bStat.boxOpen = false;
    }

}

function handleBoxReset() {
    popupBox("Reset the Bidding Box", "Are you sure? This will clear all data for the current board.", "box-reset", "", "RESET", "CANCEL");
}

/**
 * @description
 * Called from OK exit of Starting New Board Popup <br>
 * on the board controller tablet <br>
 * Send notice of new board to other 3 tablets <br>
 * All 4 boards the will call setNewBoard <br>
 */
function startNewBoard() {
    var doc = document.getElementById("input-board-number"); // new board number
    var bNbr = parseInt(doc.value);
    var bIx = bNbr - 1; // new board index

    sendNewBoardNotice(bNbr, bIx);
    setNewBoard(bNbr);
}

/**
 * @description
 * Called from startNewBoard after all 4 tablets have been notified <br>
 * 
 * @param {int} bNbr New board number 
 */
function setNewBoard(bNbr) {
    var bIx = bNbr - 1; // new board index
    var dIx = bIx % 4; // new dealer index
    console.log("setNewBoard: ", bNbr);

    document.getElementById("input-board-number").value = bNbr; //set board number 
    clearBidBox();

    initBiddingRecord(boardIx + 1);

    if (dIx == thisSeatIx) {
        bStat.boxOpen = true;
    } else {
        bStat.boxOpen = false;
    }
    disableBBControlInput();
}

/**
 * @description
 * Needs description
 */
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
    //enableBBControlInput();
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
// Set up the bidding box according to bStat
//
function prepBidBox() {
    //console.log("prepBidBox: Enter", bStat);
    //Enable and disable the trick buttons acc to last bid given by bStat
    //Opens the Box
    var idSuit;
    var id;
    var i;
    var n = bStat.tricks;

    for (i = 1; i <= 7; i++) {
        id = i.toString();
        unselectBidButton(id);
    }

    for (i = 1; i < n; i++) { //disable lower levels
        id = i.toString();
        disableBidButton(id);
    }

    if (n > 0) {
        if (bStat.suit == "NT") { //disable current level if NT bid
            id = n.toString();
            disableBidButton(id);
        } else {
            id = n.toString();
            enableBidButton(id);
        }
    }

    for (i = (n + 1); i <= 7; i++) {
        id = i.toString();
        enableBidButton(id);
    }

    // Enable and disable suit buttons acc to bStat
    for (i = 0; i < 5; i++) {
        idSuit = suitNameOrder[i];
        unselectBidButton(idSuit);
        disableBidButton(idSuit);
    }

    unselectBidButton("X");
    unselectBidButton("XX");
    unselectBidButton("Pass");
    unselectBidButton("Alert");

    if ((bStat.tricks == 0) || (bStat.lastBidder == "ME") || (bStat.lastBidder == "PA") || (bStat.lastBidder == "NO") || (bStat.dbl == true) || (bStat.rdbl == true)) {
        disableBidButton('X');
    }
    if ((bStat.tricks == 0) || (bStat.lastBidder == "LH") || (bStat.lastBidder == "RH") || (bStat.lastBidder == "NO") || (bStat.dbl == false) || (bStat.rdbl == true)) {
        disableBidButton('XX');
    }

    enableBidButton('Pass');
    disableBidButton('Alert');
    disableBidButton('Submit');
    bStat.boxOpen = true;

    setCurrentBiddingRecordCell("");

    //console.log("prepBidBox: Exit", bStat);
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
    var boardNbr = boardIx + 1;
    document.getElementById("input-board-number").value = boardNbr;
    document.getElementById("btn-play-board").innerHTML = "Play Board " + boardNbr;
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
    document.getElementById("btn-play-board").innerHTML = "Play Board " + bnbr;
    //console.log("board nr change", bnbr);
}

//////////////////////////////////////////////////////////////////////////////
// After a bidding level (tricks) has been selected,
// enable appropriate suit bid buttons
//
function prepSuitBids() {
    var ixSuit = 0;
    //console.log("prepSuits", bStat);
    if (bStat.newTricks == bStat.tricks) {
        ixSuit = suitNameOrder.indexOf(bStat.suit) + 1;
    }
    enableHigherSuitBids(ixSuit);

    //disable X,XX,Pass; allow alert
    disableBidButton("X");
    disableBidButton("XX");
    disableBidButton("Pass");
    enableBidButton("Alert");
}