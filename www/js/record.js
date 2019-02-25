/*jshint esversion: 6 */
///////////////////////////////////////////////////////////////////////////////
// Functions dealing with the table shown at the top of the screen
// and with the data it contains.
// Further, the bidding records of previous boards are maintained for
// this and the 3 other seats
///////////////////////////////////////////////////////////////////////////////
//
//

/**
 * Class Bid representing a bid
 *
 * @param {number} boardNbr --- Physical number of board
 * @param {number} roundIx  --- Round (0..) of bidding; n the table row 0 is the header  
 * @param {number} bidderIx --- Bidder 0,1,2,3 = W,N,E,S (this is 'bid-order'), same as table column
 * @param {number} tricks   --- Number of tricks or zero
 * @param {string} suit     --- If tricks != 0, suit: "C", "D", "H", "S", "NT"; if tricks = 0, call: 'X', 'XX', 'Pass'
 * @param {string} alert_by --- '' or 'S' or 'P' for None or Self or Bidder's Partner (unimplemented 'SP') 
 * @param {string} alert_to --- '' or 'M' or 'B' for None or Screenmate or Both Opps
 */
class Bid {
    constructor(boardNbr, roundIx, bidderIx, tricks, suit, alert_by, alert_to) {
        this.boardNbr = boardNbr;
        this.roundIx = roundIx;
        this.bidderIx = bidderIx;
        this.tricks = tricks;
        this.suit = suit;
        this.alert_by = alert_by;
        this.alert_to = alert_to;
    }
    /**
     * Returns seat: ['W', 'N', 'E', 'S']   
     * @return {string} bs Bidder
     */
    get bidderSeatAlpha() {
        var bs = bidOrder[this.bidderIx];
        return bs;
    }
    /**
     * Return seat: ['West', 'North', 'East', 'South']   
     */
    get bidderSeatWord() {
        var ix = (this.bidderIx + 3) % 4;
        var bs = seatOrderWord[ix];
        return bs;
    }
    /**
     * Return suit: If tricks != 0, suit: "C", "D", "H", "S", "NT"; if tricks = 0, call: 'X', 'XX', 'Pass'
     */
    get suitAlpha() {
        return this.suit;
    }
    /**
     * Return ["Clubs", "Diams", "Hearts", "Spades", "NT"] if tricks != 0;
     * Return  call: 'X', 'XX', 'Pass' if tricks = 0.
     */
    get suitWord() {
        var i;
        var suitName;
        if (this.tricks == 0) {
            return this.suit;
        } else {
            i = suitLetterOrder.indexOf(this.suit);
            suitName = suitNameOrder[i];
            return suitName;
        }
    }
    /**
     * @returns s ["&clubs;", "&diams;", "&hearts;", "&spades;", "NT"] when tricks != 0
     * Return  lteral call: 'X', 'XX', 'Pass' if tricks = 0. 
     */
    get suitSymbol() {
        var s;
        if (this.tricks != 0) {
            s = suitSymbols[this.suit];
        } else {
            s = this.suit;
        }
        return s;
    }
    /**
     * @returns {string} htmlSpan Current bid for direct insertion into DOM
     */
    makeHTMLSpan() {
        var htmlSpan;
        if (this.tricks > 0) {
            htmlSpan = '<span class="record-tricks">' + this.tricks + '</span>';
        } else {
            htmlSpan = '<span>' + '' + '</span>';
        }

        if (this.suit == "Clubs") {
            htmlSpan = htmlSpan + '<span class="clubs">' + '&clubs;' + '</span>';
        }
        if (this.suit == "Diams") {
            htmlSpan = htmlSpan + '<span class="diams">' + '&diams;' + '</span>';
        }
        if (this.suit == "Hearts") {
            htmlSpan = htmlSpan + '<span class="hearts">' + '&hearts;' + '</span>';
        }
        if (this.suit == "Spades") {
            htmlSpan = htmlSpan + '<span class="spades">' + '&spades;' + '</span>';
        }
        if (this.suit == "NT") {
            htmlSpan = htmlSpan + '<span class="nt">' + 'NT' + '</span>';
        }
        if (this.suit == "none") {
            htmlSpan = htmlSpan + '<span>' + '' + '</span>';
        }

        if (this.suit == "X") {
            htmlSpan = htmlSpan + '<span class="dbl">' + 'X' + '</span>';
        }
        if (this.suit == "XX") {
            htmlSpan = htmlSpan + '<span class="rdbl">' + 'XX' + '</span>';
        }
        if (this.suit == "Pass") {
            htmlSpan = htmlSpan + '<span class="pass">' + 'Pass' + '</span>';
        }
        if (this.suit == "none") {
            htmlSpan = htmlSpan + '<span>' + '' + '</span>';
        }
        return htmlSpan;
    }
}
/**
 * @description
 * Test Function for the Bid Class
 */
function bidClassTest(){
    //popupBox("Bid Class Test Function Call", "", "bid-class-test", "OK", "", "");
    var testBid = new Bid(1, 0, 1, 3, 'D', 'S', 'M' );
    console.log("Bid Class", testBid.boardNbr, testBid.roundIx, testBid.bidderIx, testBid.tricks, testBid.suit, testBid.alert_by, testBid.alert_to);
    var bsa = testBid.bidderSeatAlpha;
    var bsw = testBid.bidderSeatWord;
    var sa  = testBid.suitAlpha;
    var sw  = testBid.suitWord;
    var ss  = testBid.suitSymbol;
    var mhs = testBid.makeHTMLSpan();
    console.log("Bid Class Methods", bsa, bsw, sa, sw, ss, mhs);
}
/**
 * @description
 * Test Function for the Record Class
 */
function recordClassTest(){
    popupBox("Record Class Test Function Call", "", "record-class-test", "OK", "", "");
}

/**
 * @description
 * If both row and col >= 0 then that cell is hilited
 * If either arguent < 0 then the current cell is hilited
 * @param {int} row if < 0 current row index
 * @param {int} col if < 0 current column index
 */
function hiliteBiddingRecordCell(row, col) {
    var colIx = bidderIx;
    var rowIx = roundIx + 1;
    if ((row >= 0) && (col >= 0)) {
        colIx = col;
        rowIx = row;
    }
    var table = document.getElementById("auction");
    var cell = table.rows[rowIx].cells[colIx];
    cell.style.background = modalBgColor;
    console.log("hilite", rowIx, colIx, bidderIx, roundIx);
}

/**
 * @description
 * If both row and col >= 0 then that cell is unhilited
 * If either arguent < 0 then the current cell is unhilited
 * @param {int} row if < 0 current row 
 * @param {int} col if < 0 current column
 */
function unhiliteBiddingRecordCell(row, col) {
    var colIx = bidderIx;
    var rowIx = roundIx + 1;
    if ((row >= 0) && (col >= 0)) {
        colIx = col;
        rowIx = row;
    }
    var table = document.getElementById("auction");
    var cell = table.rows[rowIx].cells[colIx];
    cell.style.background = mainBgColor;
    console.log("unhilite", row, col, rowIx, colIx, bidderIx, roundIx);
}

/**
 *  Makes the actual HTML for the bidding table cell <br>
 * 
 * @param {int} nTricks Bidding Level or 0 <br>
 * @param {string} cSuit Suit bid <br>
 * @param {string} nCall X, XX, Pass and then ntricks = 0 <br>
 * 
 * @returns string newEntry for direct insertion into DOM
 */
function makeBidTableEntry(nTricks, cSuit, nCall) {
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
/**
 * Draw an empty table with header and nRows rows of 4 cells <br>
 * @param {number} nRows Number of rows to be shown
 * @param {string} page "biddng-box" or "board-display" for BB page or Board page
 */
function drawBiddingRecordTable(nRows, page) {
    //popupBox("Draw Rows", nRows, "id", "OK", "", "");
    //console.log("Bidding Record Table Rows:", nRows);
    var pgId;
    var cell;
    if (page == "bidding-box") {
        pgId = "auction";
    }
    if (page == "board-display") {
        pgId = "auction2";
    }
    var table = document.getElementById(pgId);
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

/**
 * @description
 * Reset the bidding record (i.e. the boardsRec array) and the auction table (visually) for a new board <br>
 * The table cells are already empty but the dashes to the left of bidder are entered <br>
 * Inserts &ndash; to left of bidder <br>
 * Set up 4 callObj's for the first round of bidding in boardsRec[boardIx][0][i], i = 0,...,3 <br>
 * 
 * @param {int} boardNbr Board Number
 */
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
            //unhiliteBiddingRecordCell(i, j);
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
    setCurrentBiddingTableCell(newCall);
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
    }
    return (newEntry);
}



/**
 * @description
 * Find cell coordinates and sets auction cell contents to newCall <br>
 * Set Current Bid on director's page <br>
 * 
 * @param {html} newCall  
 */
function setCurrentBiddingTableCell(newCall) {
    console.log("setCurrentBiddingRecordCell", newCall);
    var colIx = bidderIx;
    var sIx = (bidderIx + 3) % 4;
    var rowIx = roundIx + 1;
    var bidder = seatOrderWord[sIx];

    var table = document.getElementById("auction");
    var lastBid = document.getElementById("last-bid");
    var lastBidder = document.getElementById("last-bidder");
    var lastRound = document.getElementById("last-round");

    console.log("setCurrentBiddingTableCell", lastBid, lastRound, lastBidder, newCall, bidder, rowIx);
    //Set last bid in Director's Table
    if (newCall != "") {
        lastBid.innerHTML = "Last Bid: " + newCall;
        lastBidder.innerHTML = "Bidder: " + bidder;
        lastRound.innerHTML = "Round: " + rowIx;
    }
    //Set current auction table entry
    table.rows[rowIx].cells[colIx].innerHTML = newCall;
    console.log("Set Cell: ", bidderIx, roundIx, newCall, rowIx);
    console.log("table row index", rowIx, roundIx);
}

/**
 * @description
 * Set last bid, bidder and round on the director settings page
 * Gets info directly from 
 */
function setDirectorPageLastBid() {
    var lastBid = document.getElementById("last-bid");
    var lastBidder = document.getElementById("last-bidder");
    var lastRound = document.getElementById("last-round");
}

/**
 * @description
 * Sets a specific cell in the bidding table according to
 * the bid specified in a message from another tablet
 * 
 * @param {obj} msgObj {from: senderSeat, to: receiverSeat, board: brdIx, round: rndIx, bidder: bidIx, tricks: nTricks, suit: cSuit};
 */
function setBiddingRecordCell(msgObj) {
    //console.log("setBiddingRecordCell", msgObj);
    var colIx = msgObj.bidder;
    var sIx = (colIx + 3) % 4;

    roundIx = msgObj.round;
    var rowIx = roundIx + 1; //Global round index
    var bidder = seatOrderWord[sIx];

    var nTricks = msgObj.tricks;
    var cSuit = msgObj.suit;
    var newCall = makeBidTableEntry(nTricks, cSuit, cSuit);

    var table = document.getElementById("auction");
    var lastBid = document.getElementById("last-bid");
    var lastBidder = document.getElementById("last-bidder");
    var lastRound = document.getElementById("last-round");

    //console.log("setBiddingRecordCell", colIx, sIx, rowIx, bidder, lastBid, lastBidder, lastRound);
    //console.log("setBiddingRecordCell", msgObj, colIx, rowIx, nTricks, cSuit, newCall);

    table.rows[rowIx].cells[colIx].innerHTML = newCall;

    lastBid.innerHTML = "Last Bid: " + newCall;
    lastBidder.innerHTML = "Bidder: " + bidder;
    lastRound.innerHTML = "Round: " + rowIx;
    console.log("setCurrent", newCall, bidder, rowIx);
    console.log("table row index", rowIx, roundIx);
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
function acceptIncomingBid(msgObj) {
    // Display the bid in the bidding table
    var newCall = setBiddingRecordCell(msgObj);
    console.log("accept incoming bid", msgObj, newCall);

    // Record the bid in the boardsRec array
    boardsRec[msgObj.board][msgObj.round][msgObj.bidder].tricks = msgObj.tricks;
    boardsRec[msgObj.board][msgObj.round][msgObj.bidder].suit = msgObj.suit;
    boardsRec[msgObj.board][msgObj.round][msgObj.bidder].alert = "";

    var bidderSeatIx = (msgObj.bidder + 3) % 4;
    var bidder = seatOrderWord[bidderSeatIx];

    bidderIx = msgObj.bidder;
    console.log("Incoming Bid", bidderSeatIx, bidder, roundIx, newCall);

    clearBidBox();
    getbStat();
    if (bStat.newCall == "Pass") {
        bStat.passCount += 1;
    }

    var contract = getContract();
    console.log("Get Contract", contract);
    if (contract == "") { //Bidding continues
        bidderIx = (bidderIx + 1) % 4;
        if (bidderIx == 0) {
            roundIx++;
        }
        if (thisSeatIx == ((bidderSeatIx + 1) % 4)) {
            promptBidder(true);
        } else {
            promptNonBidder();
        }
    } else { //final contract
        if (contract == "Passout") { //Board passed out
            popupBox("Board passed out", "", "callback",
                "OK", "", "", handleFinalContract);
        } else {
            popupBoxCallback("Contract: " + contract, "", "callback",
                "OK", "", "", handleFinalContract);
        }
    }
    return newCall;
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

/**
 * @description
 * Prepare the bidding box and prompt the bidder by hiliting the auction cell
 * Optionally prompt with popup
 * @param {bool} popup Show popup if true, elese just hilite the auction cell 
 */
function promptBidder(popup) {
    getbStat();
    console.log("prompt status", bStat);
    prepBidBox();
    hiliteBiddingRecordCell(-1, -1);
    if (popup == true) {
        popupBox("Your turn: Please bid", "", "pls-bid", "OK", "", "");
    }
    disableBBControlInput();
}
/**
 * @description
 * Popup to notify the non-bidder when the bidder is prompted to bid
 * Controlled by flag - not useful
 */
function promptNonBidder() {
    //console.log("NonBidder");
    if (notifyNonBidder == true) {
        popupBox("Nonbidder", "", "pls-bid", "OK", "", "");
    }
}

function bidNextBoard() {
    boardIx += 1;
    var bnbr = boardIx + 1;
    document.getElementById("input-board-nbr").value = bnbr;
    handleNewBoardNumber();
}
/**
 * @description
 * Fills a new entry in boardsRec when a new bid is received <br> 
 * from another player
 */
function recordNewBid() {
    var bl = boardsRec.length;
    var rl = boardsRec[bl - 1].length;
    var pl = boardsRec[bl - 1][rl - 1].length;
    //console.log("roundsRec length", bl, rl, pl);
    //console.log("recordNewBid", boardIx, roundIx, bidderIx, bStat);
    //console.log("boardsRec", boardsRec);
    //boardsRec[boardIx][roundIx][bidderIx] = new callObj(0, "&nbsp;", ""); //space is code for none
    boardsRec[boardIx][roundIx][bidderIx].tricks = bStat.newTricks;
    if (bStat.newTricks == 0) {
        boardsRec[boardIx][roundIx][bidderIx].suit = bStat.newCall;
    } else {
        boardsRec[boardIx][roundIx][bidderIx].suit = bStat.newSuit;
    }
    boardsRec[boardIx][roundIx][bidderIx].alert = "";
    //console.log("recordNewBid", boardsRec);
    //console.log("round", roundIx);
}