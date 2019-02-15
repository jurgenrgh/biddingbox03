/////////////////////////////////////////////////////////////////////////////////
// Data /////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
// Conventions
////////////////////////////////////////////////////////////////
//
// Global colors are controlled from CSS
// The CSS values will override the colors listed here
var mainBgColor = '#26a69a';
var modalBgColor = '#bf360C';
var hiliteBidColor = '#1A237E';
var vulColor = '#d50000';
var nvulColor = '#2e7d32';

var seatOrder = ["N", "E", "S", "W"];
var seatOrderWord = ["North", "East", "South", "West"];
var bidOrder = ["W", "N", "E", "S"];
var vulOrder = ["None", "NS", "EW", "All"];
var suitNameOrder = ["Clubs", "Diams", "Hearts", "Spades", "NT"];
var suitLetterOrder = ["C", "D", "H", "S", "NT"];
var suitSymbols = {
  C: "&clubs;",
  D: "&diams;",
  H: "&hearts;",
  S: "&spades;",
  NT: "NT"
};

var testConnectionCount = 0; //Used for messages that test BT connection
var testConnectionTimeIncrement = 5; //Seconds between connection test messages
var testConnectionRepeater; //Token used for stopping repetitions
var popupTimeOutRunning;
var fastPopupTimeout = 3;
var slowPopupTimeout = 6;

var notifyNonBidder = false; //when true a modal message pops up for nonbidder 
var autoBtConnect = true; // if true BT connections are handled automatically upon startup
var autoConnectDelay = 3000; //Wait 3ms before requesting the connection
var previousPage = ""; //Save previous page when switching pages

////////////////////////////////////////////////////////////////////////////////// 
// Director Settings    //////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
// Variables set on the Director Settings Page ///////////////////////////////////
//
var validPin = 1234; // for access to director settings

var thisSeatIx = 1; // Seat of this tablet (1 is East); (0,1,2,3) = (n,e,s,w); 
var tableIx = 0; // Table of this tablet; just a count from 0..
var sectionId = "A"; // an additional id for table/tournament/session

var firstBoardNbr = 1; //can be set by the director as first of current series
var lastBoardNbr = 15; //dito

var minPerHand = 7.5; //to be shown as countdown on rest screen 
var minPerSession = 100; // dito

var timerIdBoard;
var timerIdSession;

var alertOwn = true; // self-alert
var alertPartner = true; // alert partner's bids 
var alertScreenmate = true; // alert screenmate
var alertBothOpps = false; // alert both opps

var trayTransfer = "ns"; // who controls when the "tray" is passed thru screen "ns" or "ew"

var rotatedBoard = false; // change seats n<->s, e<->w for 1 round

//////////////////////////////////////////////////////////////////////////////////
// Player Settings  //////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
// Variables set on Player Settings Page /////////////////////////////////////////
//
var reconfirmBidSubmission = true;
var newBoardControlSeat = "North"; //The player who triggers next board to be played 

///////////////////////////////////////////////////////////////////////////////////
// Bidding Box Status   ///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
//
var boardIx = 0; // Board index
var dealerIx = 0; // Dealer; function of boardIx
var vulIx = 0; // Vulnerability; function of boardIx

var roundIx = 0; //current round of bidding
var bidderIx = 1; //current bidder (bid order ix: WNES)

//////////////////////////////////////////////////////////////////////////////////
// Bidding Status Object    /////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
// The state of the bidding; there is exactly one such object
//
// The information concerning the last bidder is used in order to
// determine the admissible actions of the current bidder
//
// lastBidder: "ME", "PA", "LH", "RH", "NO"
// tricks: #d the level bids
// suit: "Clubs", "Diams", "Hearts", "Spades", "NT", "none"
// dbl and rdble: true/false
// boxOpen: true/false this seat is bidding
// newCall: "X", "XX", "Pass", "none"
//
var bStat = {
  lastBidder: "NO",
  tricks: 0,
  suit: "none",
  dbl: false,
  rdbl: false,
  passCount: 0,
  boxOpen: false,
  newTricks: 0,
  newSuit: "none",
  newCall: "none",
  newAlert: false
};

//////////////////////////////////////////////////////////////////////
// Bidding Record for this and previous boards  //////////////////////
//////////////////////////////////////////////////////////////////////
// The bidding record has been skipped for the moment.
// Has to be handled seperately
// The current idea is an entry for each call;
// the form could be:
// key: 'xxyyzz', xx = board nbr, yy = round nbr, zz = thisSeatIx
// value: String(tricks) + suit + String(alert).
// or
// key: 'xxyyzz-tricks', value: String(tricks)
// key: 'xxyyzz-suit', value: suit
// key: 'xxyyzz-alert', value: String(alert)
//
// boardsRec has been  changed to a single 3D array
// boardsRec[i][j][k] is a callObj (see below)
// k = 0,...,3 calls of one round
// j = 0,...   rounds of one board
// i = 0,...   boards
//
var maxBoards = 36;
var maxRounds = 36;
var maxBids = 4;
var boardsId = []; //Board identifier = boardN
var boardsRec = [];

for (i = 0; i < maxBoards; i++) {
  boardsRec[i] = [];
  for (j = 0; j < maxRounds; j++) {
    boardsRec[i][j] = [];
    for (k = 0; k < maxBids; k++) {
      boardsRec[i][j][k] = new callObj(0, "&nbsp;", ""); //space is code for none;
    }
  }
}


///////////////////////////////////////////////////////////////////////////////
// Call Object: The content of a table cell
// tricks: 0,1,....,7
// suit: "C", "D", "H", "S", "NT" if 0 != tricks
// suit: "empty" ("&nbsp;"),"blank" ("&ndash;") , "Pass", "X", "XX" if tricks = 0
// alert: true/false except for "blank" and "empty"
// "blank" ("&ndash;")means diagram slot empty because dealer later in rotation
// "empty"(&nbsp;) means no bid yet
// Callable as call = new callObj(t,s,a);
// 
function callObj(tricks, suit, alert) {
  this.tricks = tricks;
  this.suit = suit;
  this.alert = alert;
}


//////////////////////////////////////////////////////////////
// Bluetooth Names and addresses - BT global variables
//////////////////////////////////////////////////////////////
//
var disconnectedColor = "red";
var connectedColor = "green";
var waitingColor = "yellow";
var unsetColor = "transparent";

var testFlag = true;

//The Tablet Object 
/////////////////////////////////////
// type: "server", "client1", "client2", "client3", "void"
// name: client or server BtName
// address: client or server BtAddress
// socket: socketId
// seatIx: 0,1,2,3 = "North", "East", "South", "West"
// uuid: uuid[0], .... , uuid[3]; accto seatIx
// NB on a client tablet only the "this" socket is relevant
// On the server all 3 client sockets are set
//
// There is always an array of 4 of these objects
// Initialization after discovery of paired devices, see GetBtDevices()
// Server and clients are assigned according to alphabetical order of the names
// Socket set when connection made
// The server cannot know which client belongs to which socket until
// the confirmation message is received
var tablet = []; //each entry an object   

var thisTabletIx = 0; //index in  tablet[] objects
var thisTabletBtName = "void";
var thisTabletBtAddress = "void";
var serverTabletIx = 0;

// UUID must be the same on both ends of a connection
// distinct UUIDs are used for the 3 clients
// clients are assigned seats and uuid is determined by the seat
// the server changes uuid for each connection
var uuid = [];
uuid[0] = '94f39d29-7d6d-437d-973b-fba39e49d4ee';
uuid[1] = '322de69b-6359-466c-a541-c6af48348f1d';
uuid[2] = 'f5341169-8493-452b-bc56-16e78fbb61d2';
uuid[3] = '465191cd-a322-4fd0-b165-dd1b8caff80a';

var listeningForConnectionRequest = false;

var serverSocketId = -1;
var thisClientSocketId = -1;
var nbrConnectedClients = 0;

var relaySecDelay = 3;
var relayRepCount = 32;

// Some color variables are defined in the :root element in index.css
// This routine fetches them for use in js
//
function getCommonCssColors() {
  var root = document.querySelector(':root');
  var rootStyles = getComputedStyle(root);
  mainBgColor = rootStyles.getPropertyValue('--main-bg-color');
  modalBgColor = rootStyles.getPropertyValue('--modal-bg-color');
  hiliteBidColor = rootStyles.getPropertyValue('--hilite-bid-color');
}