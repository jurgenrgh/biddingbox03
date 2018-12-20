// Redraw the Compass svg using current values of
// the globals for board, table etc.
// A refresh callable at any time (maybe even periodically)
// Also sets input fields for seat, board, table consistently
//
function drawCompass() {
    //var rectTableNbr = document.getElementById("svgRectTableNbr");
    var textTableNbr = document.getElementById("svgTextTableNbr");
    //var rectBoardNbr = document.getElementById("svgRectBoardNbr");
    var textBoardNbr = document.getElementById("svgTextBoardNbr");
  
    var rectNorth = document.getElementById("svgRectNorth");
    var textNorth = document.getElementById("svgTextNorth");
    var rectEast = document.getElementById("svgRectEast");
    var textEast = document.getElementById("svgTextEast");
    var rectSouth = document.getElementById("svgRectSouth");
    var textSouth = document.getElementById("svgTextSouth");
    var rectWest = document.getElementById("svgRectWest");
    var textWest = document.getElementById("svgTextWest");
  
    var tnbr = textTableNbr.textContent;
    var bnbr = textBoardNbr.textContent;
    var seat = seatOrder[thisSeatIx];

    //var north = textNorth.textContent;
    //var east = textEast.textContent;
    //var south = textSouth.textContent;
    //var west = textWest.textContent;
  
    console.log("drawCompass", "TableIx: " + tableIx, "SectionId: " + sectionId, "BoardIx: " + boardIx, "DealerIx: " + dealerIx, "VulIx: " + vulIx );
    console.log("compass", thisSeatIx);
    // Table Nbr and seat direction
    tnbr = tableIx + 1;
    textTableNbr.textContent = "Table " + sectionId + tnbr + seat;

    //Board number
    bnbr = boardIx + 1;
    textBoardNbr.textContent = bnbr;
  
    //dealer
    if (dealerIx == 0) {
      textNorth.textContent = "Dealer";
    } else {
      textNorth.textContent = "North";
    }
    if (dealerIx == 1) {
      textEast.textContent = "Dealer";
    } else {
      textEast.textContent = "East";
    }
    if (dealerIx == 2) {
      textSouth.textContent = "Dealer";
    } else {
      textSouth.textContent = "South";
    }
    if (dealerIx == 3) {
      textWest.textContent = "Dealer";
    } else {
      textWest.textContent = "West";
    }
  
    //vulnerability
    if (vulIx == 0) {
      rectNorth.style.fill = nvulColor;
      rectEast.style.fill = nvulColor;
      rectSouth.style.fill = nvulColor;
      rectWest.style.fill = nvulColor;
    }
    if (vulIx == 1) {
      rectNorth.style.fill = vulColor;
      rectEast.style.fill = nvulColor;
      rectSouth.style.fill = vulColor;
      rectWest.style.fill = nvulColor;
    }
    if (vulIx == 2) {
      rectNorth.style.fill = nvulColor;
      rectEast.style.fill = vulColor;
      rectSouth.style.fill = nvulColor;
      rectWest.style.fill = vulColor;
    }
    if (vulIx == 3) {
      rectNorth.style.fill = vulColor;
      rectEast.style.fill = vulColor;
      rectSouth.style.fill = vulColor;
      rectWest.style.fill = vulColor;
    }
  }