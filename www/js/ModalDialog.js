///////////////////////////////////////////////////////////////////////////////
// Functions related to the popup box -- Version 2
// Using the Materialize library
// 
// This is a simple modal overlay containing a text message
// and 0, 1 or 2 buttons (ok; yes/no).
// There is a version with callbacks
//
// msgText: any string
// id     : string identifier used to determine the action when the box is dismissed
// okText : label for the button, if blank - no button
// yesText: dito
// noText : dito
////////////////////////////////////////////////////////////////////////////////// 
var currentModalId;
var currentModalData;
var currentYesCallback;
var currentNoCallback;

/**
 * This is a simple modal overlay containing a text message <br>
 * and 0, 1 or 2 buttons (ok; yes/no). <br>
 * 
 * @param {string} msgTitle any string for top line, large font 
 * @param {string} msgText  any string, second line, smaller font
 * @param {string} id identifier used to determine the next action when the box is dismissed
 * @param {string} okText label for OK button, if blank - no button
 * @param {string} yesText label for YES button, if blank - no button
 * @param {string} noText label for NO button, if blank - no button
 */
function popupBox(msgTitle, msgText, id, okText, yesText, noText) {
    console.log("popup", msgTitle, msgText, id, okText, yesText, noText);
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

/**
 * This is a simple modal overlay containing a text message <br>
 * and 0, 1 or 2 buttons (ok; yes/no). <br>
 * 
 * @param {string} msgTitle any string for top line, large font 
 * @param {string} msgText  any string, second line, smaller font
 * @param {string} id identifier used to determine the next action when the box is dismissed
 * @param {string} okText label for OK button, if blank - no button
 * @param {int} timeout Time in seconds for message to show
 */
function popupBoxTimed(msgTitle, msgText, id, okText, timeout) {
    clearTimeout(popupTimeOutRunning);
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
    yesBtn.style.display = "none";

    var noBtn = document.getElementById("no-button");
    noBtn.style.display = "none";

    var el = document.getElementById("modalDialog");
    var instance = M.Modal.getInstance(el);
    instance.open();

    if (timeout > 0) {
        timeout = timeout * 1000;
        popupTimeOutRunning = setTimeout(hidePopupBox, timeout);
    }
}

/**
 * Make popup disappear
 */
function hidePopupBox() {
    var el = document.getElementById("modalDialog");
    var instance = M.Modal.getInstance(el);
    instance.close();
}

/**
 * Called after OK button clicked in a modal popupbox
 * Message id determines what happens next 
 */
function okModalClicked() {
    console.log("okModal ID= " + currentModalId);
    if (currentModalId == "callback") {
        currentYesCallback();
    }
    if (currentModalId == "connect-next-client") {
        makeBtConnection();
    }
    //Alert own bid to the screenmate 
    if(currentModalId == "alert-screen-mate"){
        sendAlert();
    }
}
/**
 * Called after YES button clicked in a modal popupbox
 * Message id determines what happens next 
 */
function yesModalClicked() {
    if (currentModalId == "callback") {
        currentYesCallback();
    }
    if (currentModalId == "box-reset") {
        //console.log("calling resetBiddingBoxPage");
        resetBiddingBoxPage();
    }
    if (currentModalId == "new-seat") {
        doSeatChange(currentModalData);

    }
    if (currentModalId == "new-board") {
        selectNewBoard();
    }

    if (currentModalId == "bt-reset") {
        doBtReset();
    }
    
    if (currentModalId == "confirm-bid") {
        console.log("end modal to confirm bid");
    }
    //Alert partner's bid to the screenmate 
    if(currentModalId == "alert-screen-mate"){
        sendAlert();
    }
}

/**
 * Called after NO button clicked in a modal popupbox
 * Message id determines what happens next 
 */
function noModalClicked() {
    if (currentModalId == "callback") {
        currentNoCallback();
    }
    if (currentModalId == "box-reset") {
        return;
    }
    if (currentModalId == "bt-reset") {
        return;
    }
    
    if (currentModalId == "confirm-bid") {
        console.log("end modal to cancel bid");
    }
}

/**
 * This is a version of the modal box that accepts two callbacks,
 * one for YES or OK, one for CANCEL or NO
 * For this to work set id = "callback"; otherwise it works just like popupBox()
 * 
 * @param {string} msgTitle First line of message in large letters
 * @param {string} msgText  Second line in smaller font
 * @param {string} id       Tag to identify the message  
 * @param {string} okText   OK button text
 * @param {string} yesText  YES button text
 * @param {string} noText   NO button text
 * @param {string} yesCallback Callback function in response to YES or OK
 * @param {string} noCallback  Callback function in response to NO 
 */
function popupBoxCallback(msgTitle, msgText, id, okText, yesText, noText, yesCallback, noCallback) {
    console.log("popup", msgTitle, msgText, okText, yesText, noText);

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

function testPopupYesCallback() {
    console.log("Here is Popup Yes Callback");
}

function testPopupNoCallback() {
    console.log("Here is Popup No Callback");
}