///////////////////////////////////////////////////////////////////////////////
// Functions dealing with the table shown at the top of the screen
// and with the data it contains.
// Further, the bidding records of previous boards are maintained for
// this and the 3 other seats
///////////////////////////////////////////////////////////////////////////////
// Draw an empty table with header and nRows rows of 4 cells
//
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
                cell.innerHTML = "&nbsp;" + i;
            }
        }
    }
}

///////////////////////////////////////////////////////////////////////////////
// Reset the bidding record for a new board
// argument = Board Number
// Inserts &ndash; to left of bidder
// Set up 4 callObj's for the first round of bidding
// Set up roundCalls[0..4] with callObj's
// Set up boardRounds[0], array of rounds, with current round
// Set up seatBoards[0] with current boardArray
// Set up tableSeats[0] with this seatRecord
//
//
///////////////////////////////////////////////////////////////////////////////
function initBiddingRecord(boardNr) {
    var i, j, m, n;
    var row;
    var col;

    roundIx = 0;
    bidderIx = (dealerIx + 1) % 4;
    boardIx = boardNr - 1;

    //console.log("init bidding record board: ", boardNr);

    // All cells of the table are emptied
    var table = document.getElementById("auction");
    for (i = 1, n = table.rows.length; i < n; i++) {
        for (j = 0, m = table.rows[i].cells.length; j < m; j++) {
            table.rows[i].cells[j].innerHTML = "&nbsp;";
            unhiliteBiddingRecordCell(i, j);
            //console.log("table", i, j);
        }
    }

    //Init first round of bidding
    seatsRec = []; //array of 4 calls objects
    roundsRec = []; //array of rounds, each entry a seatsRec

    for (i = 0; i < 4; i++) {
        seatsRec[i] = new callObj(0, "&nbsp;", false); //space is code for none
    }

    if (dealerIx != 3) {
        if (dealerIx >= 0) {
            seatsRec[0].suit = "&ndash;"; //dash means no bidder this round
        }
        if (dealerIx >= 1) {
            seatsRec[1].suit = "&ndash;";
        }
        if (dealerIx >= 2) {
            seatsRec[2].suit = "&ndash;";
        }
    }
    roundsRec[0] = seatsRec;
    boardsRec[boardIx] = roundsRec;

    //First row - header is row 0. This marks dashes in row 1
    row = table.rows[1];
    for (j = 0, col; col = row.cells[j]; j++) {
        table.rows[1].cells[j].innerHTML = seatsRec[j].suit;
    }
    //if (dealerIx == seatIx) {
    if (bidderIx == ((seatIx + 1) % 4)) {
        promptBidder(true);
    }
}

///////////////////////////////////////////////////////////////////////////////
// If both row and col >= 0 then that cell is hilited
// If either arguent < 0 then the current cell is hilited
//
function hiliteBiddingRecordCell(row,col) {
    var colIx = bidderIx;
    var rowIx = roundsRec.length; //row 0 is header
  
    if((row >= 0) && (col >= 0)){
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
  function unhiliteBiddingRecordCell(row,col) {
    var colIx = bidderIx;
    var rowIx = roundsRec.length; //row 0 is header
  
    if((row >= 0) && (col >= 0)){
      colIx = col;
      rowIx = row;
    }
  
    var table = document.getElementById("auction");
    var cell = table.rows[rowIx].cells[colIx];
    cell.style.background = mainBgColor;
  }