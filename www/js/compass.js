//////////////////////////////////////////////////////////////////////
// The "Compass" is an SVG that appears at the upper lh corner
// of the Bidding Box Page
//////////////////////////////////////////////////////////////////// 
/**
 * @description
 * Redraw the Compass svg using current values of <br>
 * the globals for board, table etc. <br>
 * This is a refresh action callable at any time (even periodically) <br>
 * @param {string} page "bidding-box" or "board-display" for BB page or Board page
 */
function drawCompass(page) {
  var textTableNbr;
  var textBoardNbr;
  var inputBoardNbr;
  var rectNorth;
  var textNorth;
  var rectEast;
  var textEast;
  var rectSouth;
  var textSouth;
  var rectWest;
  var textWest;
  var tnbr;
  var bnbr;
  var seat;
  var bIx; // board Index
  var dIx; //dealer
  var vIx; //vul

  if(page == "bidding-box"){
    textTableNbr = document.getElementById("svgTextTableNbr");
    textBoardNbr = document.getElementById("svgTextBoardNbr");
    inputBoardNbr = document.getElementById("input-board-number");
  
    rectNorth = document.getElementById("svgRectNorth");
    textNorth = document.getElementById("svgTextNorth");
    rectEast = document.getElementById("svgRectEast");
    textEast = document.getElementById("svgTextEast");
    rectSouth = document.getElementById("svgRectSouth");
    textSouth = document.getElementById("svgTextSouth");
    rectWest = document.getElementById("svgRectWest");
    textWest = document.getElementById("svgTextWest");

    bnbr = boardIx + 1;
    textBoardNbr.textContent = bnbr;
  }

  
  if (page == "board-display") {
    textTableNbr = document.getElementById("svg2TextTableNbr");
    textBoardNbr = document.getElementById("svg2TextBoardNbr");
    inputBoardNbr = document.getElementById("input2-board-number");
  
    rectNorth = document.getElementById("svg2RectNorth");
    textNorth = document.getElementById("svg2TextNorth");
    rectEast = document.getElementById("svg2RectEast");
    textEast = document.getElementById("svg2TextEast");
    rectSouth = document.getElementById("svg2RectSouth");
    textSouth = document.getElementById("svg2TextSouth");
    rectWest = document.getElementById("svg2RectWest");
    textWest = document.getElementById("svg2TextWest");

    bnbr = parseInt(inputBoardNbr.value);
    if( !((bnbr > 0) && (bnbr < 37)) ){
      bnbr = 1;
    } 
    textBoardNbr.textContent = bnbr;
    inputBoardNbr.value = bnbr; //Only on Board display not Bid Box
  }

  // Table Nbr and seat direction
  seat = seatOrder[thisSeatIx];
  tnbr = tableIx + 1;
  textTableNbr.textContent = "Table " + sectionId + tnbr + seat;

  bIx = bnbr - 1; //board
  dIx = bIx % 4;  //dealer
  vIx = (Math.floor(bIx / 4) + dIx) % 4; //vulnerability

  //dealer
  if (dIx == 0) {
    textNorth.textContent = "Dealer";
  } else {
    textNorth.textContent = "North";
  }
  if (dIx == 1) {
    textEast.textContent = "Dealer";
  } else {
    textEast.textContent = "East";
  }
  if (dIx == 2) {
    textSouth.textContent = "Dealer";
  } else {
    textSouth.textContent = "South";
  }
  if (dIx == 3) {
    textWest.textContent = "Dealer";
  } else {
    textWest.textContent = "West";
  }

  //vulnerability
  if (vIx == 0) {
    rectNorth.style.fill = nvulColor;
    rectEast.style.fill = nvulColor;
    rectSouth.style.fill = nvulColor;
    rectWest.style.fill = nvulColor;
  }
  if (vIx == 1) {
    rectNorth.style.fill = vulColor;
    rectEast.style.fill = nvulColor;
    rectSouth.style.fill = vulColor;
    rectWest.style.fill = nvulColor;
  }
  if (vIx == 2) {
    rectNorth.style.fill = nvulColor;
    rectEast.style.fill = vulColor;
    rectSouth.style.fill = nvulColor;
    rectWest.style.fill = vulColor;
  }
  if (vIx == 3) {
    rectNorth.style.fill = vulColor;
    rectEast.style.fill = vulColor;
    rectSouth.style.fill = vulColor;
    rectWest.style.fill = vulColor;
  }
}