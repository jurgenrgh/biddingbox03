///////////////////////////////////////////////////////////////////////////////
// Functions dealing with the table shown at the top of the screen
// and with the data it contains.
// Further, the bidding records of previous boards are maintained for
// this and the 3 other seats
///////////////////////////////////////////////////////////////////////////////
//
/**
 * @description
 * Draw an empty table with header and nRows rows of 4 cells <br>
 * 
 * @param {int} nRows 
 */
function drawBiddingRecordTable(nRows) {
    //popupBox("Draw Rows", nRows, "id", "OK", "", "");
    //console.log("Bidding Record Table Rows:", nRows);
    var cell;
    var table = document.getElementById("auction");
    for (var i = 1; i <= nRows; i++) {
        var row = table.insertRow(i);
        for (var j = 0; j < 4; j++) {
            cell = row.insertCell(j);
            if (j == 0) {
                cell.innerHTML = "&nbsp;";
            }
        }
    }
}

///////////////////////////////////////////////////////////////////////////////
// Reset the bidding record (i.e. the array) and the table (visually) for a new board
// The table cells are already empty but the dashes to the left of bidder are entered
// argument = Board Number
// Inserts &ndash; to left of bidder
// Set up 4 callObj's for the first round of bidding
// in boardsRec[boardIx][0][i], i = 0,...,3
///////////////////////////////////////////////////////////////////////////////
//
function initBiddingRecord(boardNbr) {
    var i, j, m, n;
    var row;
    var col;

    roundIx = 0;
    bidderIx = (dealerIx + 1) % 4;
    boardIx = boardNbr - 1;

    console.log("init bidding record board: ", boardNbr);

    // All cells of the table are emptied by inserting a space character
    var table = document.getElementById("auction");
    for (i = 1, n = table.rows.length; i < n; i++) {
        for (j = 0, m = table.rows[i].cells.length; j < m; j++) {
            table.rows[i].cells[j].innerHTML = "&nbsp;";
            unhiliteBiddingRecordCell(i, j);
            //console.log("table", i, j);
        }
    }

    // Init first round of bidding
    // All bids empty
    for (i = 0; i < 4; i++) {
        //seatsRec[i] = new callObj(0, "&nbsp;", false); //space is code for none
        boardsRec[boardIx][0][i] = new callObj(0, "&nbsp;", ""); //space is code for none
    }

    // Initialize fields to left of bidder
    if (dealerIx != 3) {
        if (dealerIx >= 0) {
            boardsRec[boardIx][0][0].suit = "&ndash;"; //dash means no bidder this round
        }
        if (dealerIx >= 1) {
            boardsRec[boardIx][0][1].suit = "&ndash;";
        }
        if (dealerIx >= 2) {
            boardsRec[boardIx][0][2].suit = "&ndash;";
        }
    }

    //First row - header is row 0. This marks dashes in row 1
    row = table.rows[1];
    for (j = 0; j < 4; j++) {
        row.cells[j].innerHTML = boardsRec[boardIx][0][j].suit;
    }

    if (bidderIx == ((thisSeatIx + 1) % 4)) {
        promptBidder(true);
    }
}
/**
 * @description
 * Adds the most recent bid to the table <br>
 * Info comes from bStat; the table entry coordinates <br>
 * from the corresponding round and boardRounds <br>
 */
function updateBiddingRecord() {
    var newCall = makeBidRecordEntry();
    setCurrentBiddingRecordCell(newCall);
    //console.log("UpdateBiddingRec", newCall);
}

/**
 * @description
 * Construct the text to be shown in the table cell <br>
 * The information comes from the "new" part of bStat <br>
 * 
 * @returns string newEntry <br>
 * The string consists of 3 <span> elements and goes into the innerHTML <br>
 * of the current cell <br>
 */
function makeBidRecordEntry() {
    var newSuit = bStat.newSuit;
    var newTricks = bStat.newTricks;
    var newCall = bStat.newCall;
    var newAlert = bStat.newAlert;
    var newEntry = "";

    newEntry = makeBidTableEntry(newTricks, newSuit, newCall);
    
    if (newAlert == true) {
        newEntry = newEntry + '<span class="record-alert">' + '!!' + '</span>';
        //newEntry = newEntry + '<span class="record-alert">' + '&#x26a0;' + '</span>';
    }

    return (newEntry);
}

/**
 * @description
 * Makes the actual HTML for the bidding table cell <br>
 * 
 * @param {int} nTricks Bidding Level or 0 <br>
 * @param {string} cSuit Suit bid <br>
 * @param {string} nCall X, XX, Pass and then ntricks = 0 <br>
 * 
 * @returns string newEntry for direct insertion into DOM
 */
function makeBidTableEntry(nTricks, cSuit, nCall){
    console.log("makeBidTableEntry", nTricks, cSuit, bStat);
    if (nTricks > 0) {
        newEntry = '<span class="record-tricks">' + nTricks + '</span>';
    } else {
        newEntry = '<span>' + '' + '</span>';
    }

    if (cSuit == "Clubs") {
        newEntry = newEntry + '<span class="clubs">' + '&clubs;' + '</span>';
    }
    if (cSuit == "Diams") {
        newEntry = newEntry + '<span class="diams">' + '&diams;' + '</span>';
    }
    if (cSuit == "Hearts") {
        newEntry = newEntry + '<span class="hearts">' + '&hearts;' + '</span>';
    }
    if (cSuit == "Spades") {
        newEntry = newEntry + '<span class="spades">' + '&spades;' + '</span>';
    }
    if (cSuit == "NT") {
        newEntry = newEntry + '<span class="nt">' + 'NT' + '</span>';
    }
    if (cSuit == "none") {
        newEntry = newEntry + '<span>' + '' + '</span>';
    }

    if (nCall == "X") {
        newEntry = newEntry + '<span class="dbl">' + 'X' + '</span>';
    }
    if (nCall == "XX") {
        newEntry = newEntry + '<span class="rdbl">' + 'XX' + '</span>';
    }
    if (nCall == "Pass") {
        newEntry = newEntry + '<span class="pass">' + 'Pass' + '</span>';
    }
    if (nCall == "none") {
        newEntry = newEntry + '<span>' + '' + '</span>';
    }
    return (newEntry);
} 

///////////////////////////////////////////////////////////////////////////////
//  Finds cell coordinates and sets contents to newCall
//
function setCurrentBiddingRecordCell(newCall) {
    var colIx = bidderIx;
    var rowIx = roundIx + 1;
    var table = document.getElementById("auction");
    var cell = table.rows[rowIx].cells[colIx];

    //cell.style.background = "yellow";
    //cell.style.color = red;
    table.rows[rowIx].cells[colIx].innerHTML = newCall;

    //console.log("Set Cell: ", newCall);
}

///////////////////////////////////////////////////////////////////////////////
//  Sets specific bidding table cell with info from message
//  msgObj = {from: senderSeat, to: receiverSeat, board: brdIx, round: rndIx, bidder: bidIx, tricks: nTricks, suit: cSuit};
function setBiddingRecordCell(msgObj) {
    var colIx = msgObj.bidder;
    var rowIx = msgObj.round + 1;
    var nTricks = msgObj.tricks;
    var cSuit = msgObj.suit;
    var table = document.getElementById("auction");
    var newCall = makeBidTableEntry(nTricks, cSuit);
    console.log("setBiddingRecordCell", msgObj, colIx, rowIx, nTricks, cSuit, newCall);
    table.rows[rowIx].cells[colIx].innerHTML = newCall;
    return newCall;
}
/**
 * @description
 * Called after "new-bid" external message received<br>
 * Calls setBiddingRecordCell(msgObj)<br>
 * 
 * @param {obj} msgObj = {tricks: int, suit: int, alert: <not used>}
 * @returns newCall displayable format of the bid 
 */
function storeExternalBid(msgObj){
    // Display the bid in the bidding table
    var newCall = setBiddingRecordCell(msgObj);
    // Record the bid in the boardsRec array
    boardsRec[msgObj.board][msgObj.round][msgObj.bidder].tricks = msgObj.tricks;
    boardsRec[msgObj.board][msgObj.round][msgObj.bidder].suit = msgObj.suit; 
    //boardsRec[msgObj.board][msgObj.round][msgObj.bidder].alert = msgObj.suit;
    return newCall;
}

///////////////////////////////////////////////////////////////////////////////
// If both row and col >= 0 then that cell is hilited
// If either arguent < 0 then the current cell is hilited
//
function hiliteBiddingRecordCell(row, col) {
    var colIx = bidderIx;
    rowIx = roundIx + 1;
    if ((row >= 0) && (col >= 0)) {
        colIx = col;
        rowIx = row;
    }
    var table = document.getElementById("auction");
    var cell = table.rows[rowIx].cells[colIx];
    cell.style.background = modalBgColor;
}

///////////////////////////////////////////////////////////////////////////////
// If both row and col >= 0 then that cell is unhilited
// If either argument < 0 then the current cell is unhilited
//
function unhiliteBiddingRecordCell(row, col) {
    var colIx = bidderIx;
    rowIx = roundIx + 1;
    if ((row >= 0) && (col >= 0)) {
        colIx = col;
        rowIx = row;
    }
    var table = document.getElementById("auction");
    var cell = table.rows[rowIx].cells[colIx];
    cell.style.background = mainBgColor;
}

/**
 * @description
 * Called when player is prompted to bid. <br>
 * The bidding status is a structure that contains all the information <br>
 * necessary to manage the bidding box. This initialization obtains the <br>
 * necessary info from the bidding record contents, which is contained <br>
 * in the boardsRec array. <br>
 *
 * The state of the bidding: bStat <br>
 * lastBidder: "ME", "PA", "LH", "RH", "NO"  <br>
 * tricks: #d the bid level  <br>
 * suit: "C", "D", "H", "S", "NT", "none"  <br>
 * dbl and rdble: true/false  <br>
 * var bStat = {lastBidder: "NO", tricks: 0, suit: "none", dbl: false,  <br>
 * rdbl: false, newTricks: 0, newSuit: "none", newCall: "none", newAlert: false};  <br>
 * 
 * further, the bStat structure contains the current (unconfirmed)  <br>
 * (tricks,suit,call) selections:  <br>
 * newTricks: 0, newSuit: "none", newCall: "none", newAlert: false  <br>
 */
function getbStat() {
    var lastBidder = "NO";
    var bidIx = -1;
    var tricks = 0;
    var suit = "none";
    var dbl = false;
    var rdbl = false;
    var passCount = 0;

    var nRounds = boardsRec[boardIx].length;
    console.log("getStatus rounds: ", nRounds, boardsRec);

    // Get the last bid(bidder,tricks,suit) bid by anyone
    for (var i = 0; i < nRounds; i++) {
        for (var j = 0; j < 4; j++) {
            if (boardsRec[boardIx][i][j].tricks != 0) {
                bidIx = j;
                bidder = bidOrder[j];
                tricks = boardsRec[boardIx][i][j].tricks;
                suit = boardsRec[boardIx][i][j].suit;
                dbl = false;
                rdbl = false;
                passCount = 0;
            } else {
                if (boardsRec[boardIx][i][j].suit == "X") {
                    dbl = true;
                    passCount = 0;
                }
                if (boardsRec[boardIx][i][j].suit == "XX") {
                    rdbl = true;
                    passCount = 0;
                }
                if (boardsRec[boardIx][i][j].suit == "Pass") {
                    passCount += 1;
                }
            }
        }
    }
    if (tricks == 0) { //there is no prior bid
        bStat.lastBidder = "NO";
        bStat.tricks = 0;
        bStat.suit = "none";
        bStat.dbl = false;
        bStat.rdbl = false;
    } else { // there is a prior bid
        if (((thisSeatIx + 0) % 4) == bidIx) {
            bStat.lastBidder = "RH";
        }
        if (((thisSeatIx + 1) % 4) == bidIx) {
            bStat.lastBidder = "ME";
        }
        if (((thisSeatIx + 2) % 4) == bidIx) {
            bStat.lastBidder = "LH";
        }
        if (((thisSeatIx + 3) % 4) == bidIx) {
            bStat.lastBidder = "PA";
        }

        bStat.tricks = tricks;
        bStat.suit = suit;

        bStat.dbl = dbl;
        bStat.rdbl = rdbl;
    }
    bStat.passCount = passCount;
    bStat.newTricks = 0;
    bStat.newSuit = "none";
    bStat.newCall = "none";
    bStat.newAlert = false;
    //console.log("Status ", nRounds, bStat);
}

//New Board has been started 
//Bidder is prompted by hiliting the entry in the auction record
function promptBidder(popup) {
    //console.log("prompt");
    getbStat();
    console.log("prompt status", bStat);
    prepBidBox();
    hiliteBiddingRecordCell();
    if (popup == true) {
        popupBox("Your turn: Please bid", "",  "pls-bid", "OK", "", "");
    }
    disableBBControlInput();
}

function promptNonBidder(){
    console.log("NonBidder");
    popupBox("Nonbidder", "",  "pls-bid", "OK", "", "");
}


function bidNextBoard() {
    boardIx += 1;
    var bnbr = boardIx + 1;
    document.getElementById("input-board-nbr").value = bnbr;
    handleNewBoardNumber();
}

function recordNewBid(){
    boardsRec[boardIx][roundIx][bidderIx].tricks = bStat.newTricks;
    boardsRec[boardIx][roundIx][bidderIx].suit = bStat.newSuit;
    boardsRec[boardIx][roundIx][bidderIx].alert = "";
}