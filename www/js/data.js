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
var seatOrderWord = ["north", "east", "south", "west"];
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

var previousPage = ""; //Save previous page when switching pages

////////////////////////////////////////////////////////////////////////////////// 
// Director Settings    //////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//
var validPin = 1234; // for access to director settings

var seatIx = 1; // Seat of this tablet (1 is East)
var tableIx = 0; // Table of this tablet
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
//
var reconfirmBidSubmission = true;
var newBoardControlSeat = "north"; //The player who triggers next board to be played 

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
// key: 'xxyyzz', xx = board nbr, yy = round nbr, zz = seatIx
// value: String(tricks) + suit + String(alert).
// or
// key: 'xxyyzz-tricks', value: String(tricks)
// key: 'xxyyzz-suit', value: suit
// key: 'xxyyzz-alert', value: String(alert)

//var boardsRec = []; // an array of roundsRec arrays
//var roundsRec = []; // an array of seatsRec arrays
//var seatsRec = []; // an array of 4 callObj objects

var boardsRec = []; // an array of roundsRec arrays
var roundsRec = []; // an array of seatsRec arrays
var seatsRec = []; // an array of 4 callObj objects

///////////////////////////////////////////////////////////////////////////////
// Call Object: The content of a table cell
// tricks: 0,1,....,7
// suit: "C", "D", "H", "S", "NT" if 0 != tricks
// suit: "empty" ("&nbsp;"),"blank" ("&ndash;") , "Pass", "X", "XX" if tricks = 0
// alert: true/false except for "blank" and "empty"
// "blank" ("&ndash;")means diagram slot empty because dealer later in rotation
// "empty"(&nbsp;) means no bid yet
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
// seat: "north", "east", "south", "west", "void"
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

// UUID must be the same on all connected devices
var uuid = '94f39d29-7d6d-437d-973b-fba39e49d4ee';

var listeningForConnectionRequest = false;

var serverSocketId = -1;
var thisClientSocketId = -1;
var nbrConnectedClients = 0;
var clientSocketId = [];

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