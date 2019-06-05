/**
 * @description
 * Called from onClickHandler for new board <br>
 * If this is the controlling tablet send a message to each of the other 3 tablets <br>
 * All four are then initialized <br>
 * All four are alerted by a popup, the bidder is asked to bid <br> 
 * boardNbr and bidderIx were already set <br>
 */
function handleNewBoard() {
    var doc = document.getElementById("input-board-number");
    var bn = parseInt(doc.value);
    console.log("handleNewBoard", bn);
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
/**
 * @description
 * Called from OK exit of "new-board" Popup <br>
 * on the board controller tablet <br>
 * Send notice of new board to other 3 tablets <br>
 * All 4 boards the will call startNewBoard <br>
 */
function selectNewBoard() {
    var doc = document.getElementById("input-board-number"); // new board number
    var bNbr = parseInt(doc.value);
    var bIx = bNbr - 1; // new board index

    sendNewBoardNotice(bNbr, bIx);
    startNewBoard(bNbr);
}
/**
 * @description
 * Called from selectNewBoard after all 4 tablets have been notified <br>
 * Called on each tablet
 * @param {int} bNbr New board number 
 */
function startNewBoard(bNbr) {
    var bIx = bNbr - 1; // new board index
    var dIx = bIx % 4; // new dealer index
    
    disableBBControlInput();
    document.getElementById("input-board-number").value = bNbr; //set board number 

    boardIx = bNbr - 1;
    dealerIx = boardIx % 4;
    vulIx = (Math.floor(boardIx / 4) + dealerIx) % 4;
    drawCompass("bidding-box");

    clearBidBox();
    initBiddingRecord(boardIx + 1);
    
    if (dIx == thisSeatIx) {
        bStat.boxOpen = true;
    } else {
        bStat.boxOpen = false;
    }
}

/**
 * @description
 * Called by pressing "Reset Box" button on bidding box or director page <br>
 * Calls resetBiddingBoxPage if the user chooses "RESET" <br>
 */
function handleBoxReset() {
    popupBox("Reset the Bidding Box", "Are you sure? This will clear all data for the current board.", "box-reset", "", "RESET", "CANCEL");
}

/**
 * @description
 * Called through "Reset Box" on the Bidding Box or the Director Settings page <br>
 * Called also after seat, section or table number change <br>
 * Does complete reinitialization of the box  <br>
 */
function resetBiddingBoxPage() {
    console.log("reset bidding box");
    boardIx = 0; // Board index
    dealerIx = 0; // Dealer; function of boardIx
    vulIx = 0; // Vulnerability; function of boardIx

    roundIx = 0; //current round of bidding
    bidderIx = 1; //current bidder (bid order ix)
    hidePopupBox();
    drawCompass("bidding-box");
    initBiddingBoxPageSettings();
    clearBidBox();
    initBiddingRecord(1);
}

/**
 * @description
 * Called to initialize the box for a new bid, i.e. whenever this <br>
 * player is prompted to bid <br>
 * Reset the bidding status (bStat) and the bidding box  <br>
 * 1) first unselect (i.e. take away hilite), then enble trick buttons  <br>
 * 2) same for suit buttons  <br>
 * 3) same for calls  <br>
 * 4) initialize the bStat object for start of bidding  <br>
 */
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
}

/**
 * @description
 * Set up the bidding box according to bStat
 */
function prepBidBox() {
    console.log("prepBidBox: Enter", bStat);
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

    console.log("prepBidBox: Exit", bStat);
}

/**
 * @description
 * Called from resetBiddingBoxPage and onLoad initialization <br>
 * This sets the Board number field - nothing else for now <br>
 */
function initBiddingBoxPageSettings() {
    var boardNbr = boardIx + 1;
    document.getElementById("input-board-number").value = boardNbr;
    document.getElementById("btn-play-board").innerHTML = "Play Board " + boardNbr;
    //console.log("init box", boardNr);
}

/**
 * @description
 * Response to changing board number on the bidding box page 
 * @param {int} increment Changes are in steps of +-1
 */
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
        drawCompass("bidding-box");
        //console.log("New Board Number ", boardIx + 1, dealerIx, vulIx);
    }
    document.getElementById("btn-play-board").innerHTML = "Play Board " + bnbr;
    //console.log("board nr change", bnbr);
}

/**
 * @description
 * Response to changing board number on the Display Board page 
 * @param {int} increment Changes are in steps of +-1
 */
function handleDisplayBoardNumberChange(increment) {
    var x = document.getElementById("input2-board-number");
    var bnbr = parseInt(x.value) + increment;
    //console.log("bnbr type: ", typeof(bnbr), "Value type: ", typeof(x.value), "Increment type: ", typeof(increment));
    if (bnbr > 0) {
        x.value = bnbr;
        //boardIx = bnbr - 1;
        //dealerIx = boardIx % 4;
        //vulIx = (Math.floor(boardIx / 4) + dealerIx) % 4;
        //console.log("New Board Number ", x.value);
        drawCompass("board-display");
        //console.log("New Board Number ", boardIx + 1, dealerIx, vulIx);
    }
    //document.getElementById("btn2-play-board").innerHTML = "Show Board " + bnbr;
    //console.log("board nr change", bnbr);
}

/**
 * @description
 * Respond to onClick of "Show" button on the Display Board Page
 * Scan the boardsRec array and display the contents in the auction2 table
 * @param{int} bIx Board Ix in boardsRec array
 */
function handleDisplayBoard(bIx){
    var i = 0;
    var j = 0;
    var t; //tricks
    var s; //suit
    var a; //alert
    var newEntry;

    var passCount = 0;

    while((passCount < 3) && (i < 12)){
        t = boardsRec[bIx][i][j].tricks;
        s = boardsRec[bIx][i][j].suit;
        a = boardsRec[bIx][i][j].alert;
        newEntry = makeBiddingRecordEntry(t,s,s);
        console.log("Display Board", newEntry, t, s, a);
    } 
}


//////////////////////////////////////////////////////////////////////////////
// Enable, disable, hilite, unhilite bid buttons /////////////////////////////
///////////////////////////////////////////////////////////////////////////////
/**
 * @description
 * Enable a single bid button
 * @param {string} idBid Any bid or call button selector id
 */
function enableBidButton(idBid) {
    var targetDiv = document.getElementById(idBid);
    if (targetDiv != null) {
        targetDiv.classList.remove("disabled");
    }
}

/**
 * @description
 * Disable a single bid button
 * @param {string} idBid Any bid or call button selector id 
 */
function disableBidButton(idBid) {
    var targetDiv = document.getElementById(idBid);
    if (targetDiv != null) {
        targetDiv.classList.add("disabled");
    }
}

/**
 * @description
 * Select a single bid button <br>
 * Select means highlight the provisional choice <br>
 * @param {string} idBid Any bid or call button selector id 
 */
function selectBidButton(idBid) {
    var targetDiv = document.getElementById(idBid);
    if (targetDiv != null) {
        targetDiv.classList.add("hiliteBid");
    }
}

/**
 * @description
 * Unselect a single bid button <br>
 * Unselect means un-hilite the provisional choice <br>
 * @param {string} idBid Any bid or call button selector id
 */
function unselectBidButton(idBid) {
    var targetDiv = document.getElementById(idBid);
    if (targetDiv != null) {
        targetDiv.classList.remove("hiliteBid");
    }
}

/**
 * @description
 * Enable all suit bids higher than or equal to ixSuit by removing class "disabled" 
 * @param {int} ixSuit Lowest suit enabled
 */
function enableHigherSuitBids(ixSuit) {
    for (var i = ixSuit; i < 5; i++) {
        var targetDiv = document.getElementById(suitNameOrder[i]);
        targetDiv.classList.remove("disabled");
    }
}

/**
 * @description
 * Unselect all 4 call buttons
 */
function unselectCallButtons() {
    unselectBidButton("XX");
    unselectBidButton("Pass");
    unselectBidButton("X");
    unselectBidButton("Alert");
}

/**
 * @description
 * After the bidding level (tricks) has been selected,
 * enable the appropriate suit buttons and disable calls 
 */
function prepSuitBids() {
    var ixSuit = 0;
    
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