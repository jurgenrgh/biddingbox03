///////////////////////////////////////////////////////////////////////////////
// Functions related to the popup box -- Version 2
// Using the Materialize library
// 
// This is a simple modal overlay containing a text message
// and 0, 1 or 2 buttons (ok; yes/no).
//
// msgText: any string
// id     : string identifier used to determine the action when the box is dismissed
// okText : label for the button, if blank - no button
// yesText: dito
// noText : dito
// 
var currentModalId;
var currentModalData;
var currentYesCallback;
var currentNoCallback;

var textSample = "<strong>Lorem ipsum dolor sit amet,</strong> " +
    "consectetur adipiscing elit, sed do eiusmod " +
    "tempor incididunt ut labore et dolore magna " +
    "aliqua. Ut enim ad minim veniam, quis nostrud " +
    "exercitation ullamco laboris nisi ut aliquip " +
    "ex ea commodo consequat. Duis aute irure dolor " +
    "in reprehenderit in voluptate velit esse cillum " +
    "dolore eu fugiat nulla pariatur. Excepteur sint " +
    "occaecat cupidatat non proident, sunt in culpa qui " +
    "officia deserunt mollit <br/> anim <br/> id est laborum.";

function popupBox(msgTitle, msgText, id, okText, yesText, noText) {
    console.log("popup",msgTitle, msgText, id, okText, yesText, noText);
    currentModalId = id;

    var head = document.getElementById("dialog-header");
    head.innerHTML = msgTitle;
    var box = document.getElementById("dialog-text");
    box.innerHTML = msgText;

    var okBtn = document.getElementById("ok-button");
    var okSpan = document.getElementById("ok-span");
    if (okText != "") {
        okSpan.innerHTML = okText;
        okBtn.style.display = "inline-block";
    } else {
        okBtn.style.display = "none";
    }

    var yesBtn = document.getElementById("yes-button");
    var yesSpan = document.getElementById("yes-span");
    if (yesText != "") {
        yesSpan.innerHTML = yesText;
        yesBtn.style.display = "inline-block";
    } else {
        yesBtn.style.display = "none";
    }

    var noBtn = document.getElementById("no-button");
    var noSpan = document.getElementById("no-span");
    if (noText != "") {
        noSpan.innerHTML = noText;
        noBtn.style.display = "inline-block";
    } else {
        noBtn.style.display = "none";
    }

    var el = document.getElementById("modalDialog");
    var instance = M.Modal.getInstance(el);
    instance.open();
}

function hidePopupBox() {
    var el = document.getElementById("modalDialog");
    var instance = M.Modal.getInstance(el);
    instance.close();
}

function okModalClicked() {
    console.log("okModal ID= " + currentModalId);
    if(currentModalId == "callback"){
        currentYesCallback();
    }
    if(currentModalId == "connect-next-client"){
        makeBtConnection();
    }
}

function yesModalClicked() {
    if(currentModalId == "callback"){
        currentYesCallback();
    }
    if (currentModalId == "box-reset") {
        console.log("calling resetBiddingBox");
        resetBiddingBox();
    }
    if (currentModalId == "new-seat") {
        doSeatChange(currentModalData);
        
    }
    if(currentModalId == "new-board"){
        startNewBoard();
    }

    if (currentModalId == "bt-reset") {
        doBtReset();
    }
    if(currentModalId == "confirm-passout"){
        console.log("modal to confirm passout");
    }
    if(currentModalId == "confirm-bid"){
        console.log("end modal to confirm bid");
    }
}

function noModalClicked() {
    if(currentModalId == "callback"){
        currentNoCallback();
    }
    if (currentModalId == "box-reset") {
        return;
    }
    if (currentModalId == "bt-reset") {
        return;
    }
    if(currentModalId == "confirm-passout"){
        console.log("modal to cancel passout");
    }
    if(currentModalId == "confirm-bid"){
        console.log("end modal to cancel bid");
    }
}

// This is a version of the modal box that accepts two callbacks,
// one for YES or OK, one for CANCEL or NO
// For this to work set
// id = "callback"; otherwise it works just like popupBox()
function popupBoxCallback(msgTitle, msgText, id, okText, yesText, noText, yesCallback, noCallback ) {
    console.log("popup",msgTitle, msgText, okText, yesText, noText);

    currentModalId = id;
    currentYesCallback = yesCallback;
    currentNoCallback = noCallback;

    var head = document.getElementById("dialog-header");
    head.innerHTML = msgTitle;
    var box = document.getElementById("dialog-text");
    box.innerHTML = msgText;

    var okBtn = document.getElementById("ok-button");
    var okSpan = document.getElementById("ok-span");
    if (okText != "") {
        okSpan.innerHTML = okText;
        okBtn.style.display = "inline-block";
    } else {
        okBtn.style.display = "none";
    }

    var yesBtn = document.getElementById("yes-button");
    var yesSpan = document.getElementById("yes-span");
    if (yesText != "") {
        yesSpan.innerHTML = yesText;
        yesBtn.style.display = "inline-block";
    } else {
        yesBtn.style.display = "none";
    }

    var noBtn = document.getElementById("no-button");
    var noSpan = document.getElementById("no-span");
    if (noText != "") {
        noSpan.innerHTML = noText;
        noBtn.style.display = "inline-block";
    } else {
        noBtn.style.display = "none";
    }

    var el = document.getElementById("modalDialog");
    var instance = M.Modal.getInstance(el);
    instance.open();
}

function testPopupYesCallback(){
    console.log("Here is Popup Yes Callback");
}
function testPopupNoCallback(){
    console.log("Here is Popup No Callback");
}