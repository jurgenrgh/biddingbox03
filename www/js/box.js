///////////////////////////////////////////////////////////////////////////////
// Suit selection becomes available after level (tricks) is selected
//
function handleBoxReset() {
    popupBox("Reset the Bidding Box", "Are you sure? This will clear all data for the current hand.", "reset", "", "RESET", "CANCEL");
}

function resetBiddingBox() {
    boardIx = 0; // Board index
    dealerIx = 0; // Dealer; function of boardIx
    vulIx = 0; // Vulnerability; function of boardIx

    roundIx = 0; //current round of bidding
    bidderIx = 1; //current bidder (bid order ix)
    hidePopupBox();
    drawCompass();
    initBiddingBoxSettings();
    /////////////////// all need to be added ///
    //clearBidBox();
    //initBiddingRecord(1);
    //enableInput();
}

function cancelRestart() {
    hidePopupBox();
}

function handleSuitBid(idSuit) {
    var id = suitNameOrder.indexOf(idSuit);
    var oldSuit = bStat.newSuit;

    if (bStat.boxOpen == false) {
        popupBox("It's not your turn", 5);
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
//This sets the Board number field - nothing else for now
function initBiddingBoxSettings() {
    var boardNr = boardIx  + 1;
    document.getElementById("input-board-number").value = boardNr;
    document.getElementById("btn-selected-board").innerHTML = "Play Board " + boardNr;
    console.log("inint box", boardNr);
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
    console.log("board nr change", bnbr);
}