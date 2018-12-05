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
    console.log("Bidding Record Table Rows:", nRows);
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