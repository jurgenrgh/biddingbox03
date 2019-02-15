/**
 * @description
 * Called when the bidder selects a nbr of tricks. <br>
 * The selection is provisional until bidder confirms. <br>
 * Selecting a selected button will undo all current choices <br>
 * 
 * @param {int} idTricks Number of tricks, i.e. bidding level 
 */
function handleTricksBid(idTricks) {
    var id = parseInt(idTricks);
    var oldTricks = bStat.newTricks;
    console.log("box open ", bStat.boxOpen);
    if (bStat.boxOpen == false) {
        popupBoxTimed("It's not your turn", "", "", "OK", fastPopupTimeout);
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

/////////////////////////////////////////////////////
// After a suit button is clicked
// 
function handleSuitBid(idSuit) {
    var id = suitNameOrder.indexOf(idSuit);
    var oldSuit = bStat.newSuit;
    console.log("box open ", bStat.boxOpen);
    if (bStat.boxOpen == false) {
        popupBoxTimed("It's not your turn", "", "", "OK", fastPopupTimeout);
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
///////////////////////////////////////////////////////////////////////////////
// A call is anything on the 3rd row of buttons, namely X, XX, Pass, Alert but
// not Submit (the check symbol), which is handles separately
//

/**
 *
 *
 * @param {*} idCall
 * 
 */
function handleCalls(idCall) {
    console.log("handle call");

    if (bStat.boxOpen == false) {
        popupBoxTimed("It's not your turn", "", "", "OK", fastPopupTimeout);
        return;
    }

    if (idCall == "Alert") {
        console.log("alert", bStat);
        if (bStat.newAlert) {
            bStat.newAlert = false;
            unselectBidButton("Alert");
        } else {
            bStat.newAlert = true;
            selectBidButton("Alert");
        }
        updateBiddingRecord();
    } else {
        if (bStat.newCall == idCall) { //Same call hit twice = undo
            unselectBidButton(idCall);
            getbStat();
            bStat.boxOpen = true;
            bStat.newTricks = 0;
            bStat.newSuit = "none";
            bStat.newCall = "none";
            bStat.newAlert = false;
            prepBidBox();
            updateBiddingRecord();
        } else { //All normal cases follow
            unselectCallButtons();
            selectBidButton(idCall);
            if (idCall == "Pass") {
                console.log("pass", bStat);
                bStat.newTricks = 0;
                bStat.newSuit = "none";
                bStat.newCall = "Pass";
                bStat.newAlert = false;

                enableBidButton("Submit");
                enableBidButton("Alert");
                updateBiddingRecord();
            }
            if (idCall == "X") {
                console.log("X", bStat);
                bStat.newTricks = 0;
                bStat.newSuit = "none";
                bStat.newCall = "X";
                bStat.newAlert = false;
                enableBidButton("Submit");
                enableBidButton("Alert");
                updateBiddingRecord();
            }
            if (idCall == "XX") {
                console.log("XX", bStat);
                bStat.newTricks = 0;
                bStat.newSuit = "none";
                bStat.newCall = "XX";
                bStat.newAlert = false;
                enableBidButton("Submit");
                enableBidButton("Alert");
                updateBiddingRecord();
            }
        }
    }
}
///////////////////////////////////////////////////////////////////////////////
// Confirms that selected bid is made
// Check-symbol lrh button
//
function handleSubmitCall() {
    if (bStat.boxOpen == false) {
        popupBoxTimed("It's not your turn", "", "", "OK", fastPopupTimeout);
        return;
    }
    confirmSelectedBid();
}

/**
 * @description
 * Enables the submit button in the bidding box if <br>
 * a valid bid is pending based on new entries in bStat. <br>
 * Can be called anytime <br>
 */
function checkEnableSubmit() {
    var bCheck = false;
    if ((bStat.newTricks > 0) && (bStat.newSuit != "none")) {
        bCheck = true;
    }
    if ((bStat.newCall == "X") || (bStat.newCall == "XX") || (bStat.newCall == "PASS")) {
        bCheck = true;
    }
    if (bCheck) {
        enableBidButton("Submit");
    } else {
        disableBidButton("Submit");
    }
}

//////////////////////////////////////////////////////////////////////////////
// The current bid is what is recorded in the new** elements
// of bStat. Retracting this bid this requires
//  - resetting the bidbox accto bStat old info
//  - clearing the bidding record cell
//  - reinitializing bStat
//
function cancelCurrentBid() {
    getbStat();
    bStat.newTricks = 0;
    bStat.newSuit = "none";
    bStat.newCall = "none";
    bStat.newAlert = false;
    updateBiddingRecord();
    prepBidBox();
}

///////////////////////////////////////////////////////////////////////////////
// The bidder has pressed the submit button (check symbol in BB)
// Now he is asked "are you sure" in different ways depending
// upon the bidding phase; namely, passout, final contract, or
// continuing.
// This function is called after the submit button is clicked but
// before any other action
//
function confirmSelectedBid() {
    var passCount = bStat.passCount;
    if (bStat.newCall == "Pass") {
        passCount += 1;
    }
    //console.log("Nbr of passes", passCount);
    // Board being passed out
    if (passCount == 4) {
        //console.log("before passout popup");
        popupBox("Board passed out", "Confirm or Cancel your Pass", "confirm-passout", "", "Confirm", "Cancel");
        //console.log("after passout popup");
    }

    // Contract being set - end of bidding
    if ((passCount == 3) && (bStat.tricks != 0)) {
        var tricks = bStat.tricks;
        var suit = bStat.suit;
        var dbl = bStat.dbl;
        var rdbl = bStat.rdbl;
        var declarer;
        var dIx;
        var x = "";
        if (dbl)
            x = "X";
        if (rdbl)
            x = "XX";

        if (suit == "Spades")
            suit = "&spades;";
        if (suit == "Hearts")
            suit = "&hearts;";
        if (suit == "Diams")
            suit = "&diams;";
        if (suit == "Clubs")
            suit = "&clubs;";
        dIx = getLastBidderIx();
        declarer = seatOrderWord[dIx];    

        var contract = tricks.toString(10) + suit + x + " " + declarer;
        //popupBox("Contract: " + contract, "", "final-contract", "OK", "", "");
        popupBoxCallback("Contract: " + contract, "", "callback", "", "OK", "CANCEL", confirmContract, cancelContract);
    }

    // Bidding not finished: normal move to next bidder
    if ((passCount < 3) || ((bStat.tricks == 0) && (passCount == 3))) {
        var bid = makeBidRecordEntry();
        //console.log("before confirm bid", bid);
        popupBoxCallback("Your Bid is " + bid, "Confirm or Cancel your Bid", "callback", "", "Confirm", "Cancel", confirmBid, cancelBid);
        //console.log("after confirm bid");
    }
    //console.log("Exit Bid Confirmation");
}

// The bidder has passed and agrees that the hand is to be passed out
function confirmPassout() {
    enableBBControlInput();
    //console.log("confirmPassout");
}

function cancelPassout() {
    //console.log("cancelPassout");
    cancelCurrentBid();
}

function confirmContract() {
    enableBBControlInput();
    unhiliteBiddingRecordCell();
    //var t = makeBidRecordEntry();
    recordNewBid();
    clearBidBox();
    getbStat();
    var contract = getContract();
    popupBox("Final Contract: " + contract, "final-contract", "OK", "", "");
}

function cancelContract() {
    cancelCurrentBid();
    //console.log("cancelContract");
}

function confirmBid() {
    var delay = 1000;
    //console.log("confirmBid entry", bStat.passCount, bStat);
    unhiliteBiddingRecordCell();
    //var t = makeBidRecordEntry();

    recordNewBid();
    //send current bid to 3 other players
    //others will not necessarily display immediately
    sendBid("R", boardIx, roundIx, bidderIx);
    setTimeout(sendBid, delay, "P", boardIx, roundIx, bidderIx);
    setTimeout(sendBid, 2 * delay, "L", boardIx, roundIx, bidderIx);

    clearBidBox();
    getbStat();
    bidderIx = (bidderIx + 1) % 4;
    console.log("confirmBid exit", bidderIx, roundIx, bStat);
}

function cancelBid() {
    console.log("cancelBid");
    cancelCurrentBid();
}

/**
 * @description
 * Return seat index of the bidder, i.e. index of bStat.lastBidder
 * @returns bIx Bidder index 
 */
function getLastBidderIx(){
    var bIx = 0;
    if(bStat.lastBidder == "ME"){
        bIx = thisSeatIx;
    } 
    if(bStat.lastBidder == "PA"){
        bIx = (thisSeatIx + 2) % 4;
    } 
    if(bStat.lastBidder == "LH"){
        bIx = (thisSeatIx + 1) % 4;
    } 
    if(bStat.lastBidder == "RH"){
        bIx = (thisSeatIx + 3) % 4;
    } 
    return bIx;
}

/**
 * @description
 * Get contract from bStat
 * Passout: tricks = 0, not end of bidding: empty string returned 
 * @returns {string} contract tricks + suit + x + declarer
 */
function getContract(){
    
    var contract = "";
    if ((bStat.passCount == 3) && (bStat.tricks != 0)) {
        var tricks = bStat.tricks;
        var suit = bStat.suit;
        var dbl = bStat.dbl;
        var rdbl = bStat.rdbl;
        var declarer;
        var dIx;
        var x = "";
        if (dbl)
            x = "X";
        if (rdbl)
            x = "XX";

        if (suit == "Spades")
            suit = "&spades;";
        if (suit == "Hearts")
            suit = "&hearts;";
        if (suit == "Diams")
            suit = "&diams;";
        if (suit == "Clubs")
            suit = "&clubs;";
        dIx = getLastBidderIx();
        declarer = seatOrderWord[dIx]; 

        contract = tricks.toString(10) + suit + x + " " + declarer;
    } 
    return contract;
}