/**
 * Sending a message requires <br>
 * - finding the socketId of the recipient <br>
 * - constructing the text to be transmissed <br>
 * 
 * The text is a stringified JSON object:<br>
 * - objContent.from = sndCode<br>
 * - objContent.to = recipient<br>
 * - objContent.tag = tag<br>
 * - objContent.text = msgText<br>
 * 
 * @param {string} sndCode "this" when this tablet is the originator <br>   
 * "client1", "client2", "client3" when this is the server relaying a msg <br>       
 * "North", "East", "South", "West"<br>
 *   
 * @param {string} rcvCode "server", "client1", "client2", "client3"  <br>
 * "North", "East", "South", "West"  <br>
 * 'R', 'L', 'P', 'M' = RHO, LHO, Partner, Screenmate <br>  
 *  
 * @param {string} tag that determines what is to be done with the text by the receiver <br>
 *   
 * @param {string} msgText the actual message; interpreted accto tag; a stringified JSON object <br>  
 * if = "" the text from the "outgoing message" field is sent<br>
 */
function sendMessage(sndCode, rcvCode, tag, msgText) {
    var recipient = rcvCode;
    var senderSocketId = -1;
    var strContent;
    var objContent = {};
    var buf;
    var posIx = -1;

    //console.log("sendMessage call 1 ", senderSocketId, posIx, recipient, sndCode, rcvCode, tag, msgText);

    if (sndCode == "this") {
        sndCode = tablet[thisTabletIx].type;
    }

    posIx = positionToSeatIx(rcvCode);
    if (posIx >= 0) {
        recipient = seatOrderWord[posIx];
    }
    //console.log("sendMessage call 2 ", senderSocketId, posIx, recipient, sndCode, rcvCode, tag, msgText);

    if (tablet[thisTabletIx].type == rcvCode) {
        popupBox("Local Message", "not handled", "id", "OK", "", "");
        return -1;
    }

    // When this tablet is the server: Get socket
    if (tablet[thisTabletIx].type == "server") {
        if ((rcvCode == "client1") || (tablet[1].seatIx == posIx)) {
            senderSocketId = tablet[1].socket;
        }
        if ((rcvCode == "client2") || (tablet[2].seatIx == posIx)) {
            senderSocketId = tablet[2].socket;
        }
        if ((rcvCode == "client3") || (tablet[3].seatIx == posIx)) {
            senderSocketId = tablet[3].socket;
        }
        console.log("from server", rcvCode, senderSocketId);
        console.log("tablets", tablet);
    }

    //If not the server - there is only one socket
    if (tablet[thisTabletIx].type != "server") {
        senderSocketId = tablet[thisTabletIx].socket;
    }
    //console.log("sendMessage call 3 ", senderSocketId, posIx, recipient, sndCode, rcvCode, tag, msgText);

    objContent.from = sndCode;
    objContent.to = recipient;
    objContent.tag = tag;
    objContent.text = msgText;

    //console.log("sendMessage content", objContent);
    //console.log("sendMessage socket", senderSocketId);

    strContent = JSON.stringify(objContent);
    buf = arrayBufferFromString(strContent);

    //console.log("sendMessage call 4 ", senderSocketId, posIx, recipient, sndCode, rcvCode, tag, msgText);
    if (senderSocketId > 0) {
        networking.bluetooth.send(senderSocketId, buf, function (bytes_sent) {
            //console.log('Sent nbr of bytes: ', bytes_sent, 'Socket: ', senderSocketId);
            //console.log("Message: ", strContent);
        }, function (errorMessage) {
            console.log('Send failed: ', errorMessage, 'Message: ', strContent, 'Socket: ', senderSocketId);
            //console.log(strContent);
            popupBox("Send Message Error " + senderSocketId, errorMessage, "id", "OK", "", "");
        });
    } else {
        console.log("Server not connected, message not sent");
        popupBox("Send Message Error " + senderSocketId, "Socket not connected", "id", "OK", "", "");
    }
}

/**
 * @description
 * Message from client to server when the seat id is changed <br>
 * (not yet in use) <br> 
 */
function sendSeatIdToServer() {
    var sIx = tablet[thisTabletIx].seatIx;
    var seatId = seatOrderWord[sIx];
    var clientId = tablet[thisTabletIx].type;
    var sndObj = {
        seat: seatId,
        client: clientId
    };
    var msgText = JSON.stringify(sndObj);
    sendMessage("this", "server", "seat-id", msgText);
}

/**
 * @description 
 * Called when a message was received, i.e. in response to onReceive Event <br> 
 * Outputs the raw message string to the HTML field on the BT page    <br>
 * objReceived = JSON object <= parsed JSON string <= receiveInfo.data  <br>
 * Calls msgInterpreter which handles input acc to message content  <br>
 * The message text contains the "msg type" information, i.e. what to do next <br>
 * @param {arrayBuffer} receiveInfo 
 */
function onBtReceiveHandler(receiveInfo) {
    var socketId = receiveInfo.socketId;
    var strReceived = stringFromArrayBuffer(receiveInfo.data);
    var objReceived = {};

    var textField = document.getElementById("msg-rcvd");
    textField.value = "";

    //console.log("Data received: ", strReceived);
    objReceived = JSON.parse(strReceived);
    //console.log("Obj received: ", objReceived);

    // Message into Input field
    textField.value = "From " + objReceived.from + ": " + objReceived.text;

    M.updateTextFields();
    M.textareaAutoResize(textField);
    // Process the Message 
    msgInterpreter(socketId, strReceived);
}

/**
 * @description
 * Response to onReceiveError Listener
 * 
 * @param {string} errorInfo Raw Text Message
 */
function onBtReceiveError(errorInfo) {
    console.log("BT Error from Listener", errorInfo.errorMessage, errorInfo.socketId, errorInfo);
    popupBox("Bluetooth Receive Error (Listener)", errorInfo.errorMessage + " socket " + errorInfo.socketId, "bt-error", "OK", "", "");

    // if (errorInfo.socketId !== socketId) {
    //     return;
    //}
}

/**
 * @description
 * Most incoming messages require action <br>    
 * An example is the msg that communicates the client name  <br>  
 * allowing the server to associate it with a socket.   <br>
 * msgObj.tag determines what to do.   <br>
 * The remainder of the function is specific to each message type <br>
 * 
 * @param {number} socketId = receiving socket on this table
 * @param {string} strMsg = string as received, unparsed stringified JSON object
 */
function msgInterpreter(socketId, strMsg) {
    var objMsg = JSON.parse(strMsg);
    var clientIx;
    var clientTextName;
    var text;
    var rcvdTextObj;

    console.log("Msg Interpreter Socket: ", socketId, strMsg);
    console.log("Msg Interpreter Msg: ", objMsg);

    ////////////////////////////////////////////////////////////////
    // Confirm Connection:
    // Client sends this message to the server to assign the socketId
    // and to set the BTname   
    if (objMsg.tag == "confirm-connection") {
        //Put the socketId in the right tablet[] object
        rcvdTextObj = JSON.parse(objMsg.text);
        var tabSeatIx = rcvdTextObj.seatIx;
        var tabName = rcvdTextObj.btName;
        for (i = 0; i < tablet.length; i++) {
            //if (tablet[i].name == objMsg.text) {
            if (tablet[i].name == tabName) {
                tablet[i].socket = socketId;
                tablet[i].seatIx = tabSeatIx;
                clientIx = i;
                console.log("socket set socketId, tabIx", socketId, i, tablet[i].name, tablet[i].type, objMsg.text, objMsg.from);
                setBtConnectionState(tablet[i].type, "connected");
            }
        }
        console.log("received confirm-confirmation", objMsg, tablet);
        clientTextName = "client" + clientIx;

        //Server communicates client's own id nbr to client
        sendMessage("server", clientTextName, "client-id", clientTextName);
        return;
    }

    //If msg not for this tablet - Relay 
    // except if the name is not yet determined - i.e. msg to set the name
    if ((tablet[thisTabletIx].type != objMsg.to) && (objMsg.tag != "client-id") && (seatOrderWord[tablet[thisTabletIx].seatIx] != objMsg.to)) {
        sendMessage(objMsg.from, objMsg.to, objMsg.tag, objMsg.text);
        console.log("Relay: ", objMsg);
        return;
    }

    // Message sent by pressing button on BT page
    // to test connectivity
    if (objMsg.tag == "ping") {
        text = "from " + objMsg.from;
        console.log(objMsg);
        popupBox("Ping Received", text, "id", "OK", "", "");
    }

    // Message sent periodically by the server in order to
    // test the connection
    if (objMsg.tag == "ping-pong") {
        text = "from " + objMsg.from;
        console.log(objMsg);
        //popupBox("Ping-Pong Received", text, "id", "OK", "", "");
        sendMessage(objMsg.to, objMsg.from, "pong-ping", objMsg.Text);
    }

    //Response to ping-pong is pong-ping
    // Can only br client to server
    if (objMsg.tag == "pong-ping") {
        text = "from " + objMsg.from;
        console.log(objMsg);
        popupBox("Pong-Ping Received", text, "id", "OK", "", "");
    }

    //Client receives its id number
    if (objMsg.tag == "client-id") {
        console.log("Msg Interpreter", objMsg);
        var el = document.getElementById("this-tablet-rank");
        el.innerHTML = objMsg.text;
        tablet[thisTabletIx].type = objMsg.text;

        setBtConnectionState("client1", "unset");
        setBtConnectionState("client2", "unset");
        setBtConnectionState("client3", "unset");

        document.getElementById("client1-div").style.display = 'none';
        document.getElementById("client2-div").style.display = 'none';
        document.getElementById("client3-div").style.display = 'none';
    }

    if (objMsg.tag == "new-bid") {
        rcvdTextObj = JSON.parse(objMsg.text);
        // console.log("new Bid received", rcvdTextObj);
        var newCall = acceptIncomingBid(rcvdTextObj);
        if (notifyNewBid) {
            popupBox(bidder + " bids " + newCall, "", "id", "OK", "", "");
        }
    }

    if (objMsg.tag == "new-board") {
        var text1;
        var text2;
        rcvdTextObj = JSON.parse(objMsg.text);
        var brdNbr = rcvdTextObj.boardNbr;
        var dIx = (brdNbr - 1) % 4;
        console.log("Msg Interpreter", objMsg);
        rcvdTextObj = JSON.parse(objMsg.text);
        console.log("new Board starts", rcvdTextObj);
        text1 = "New Board: #" + brdNbr;
        text2 = seatOrderWord[dIx] + " is the Dealer. Check Board Number and Orientation!";
        if (thisSeatIx == (brdNbr - 1) % 4) {
            text2 = "You are the Dealer. Please Bid";
        }
        popupBox(text1, text2, "id", "OK", "", "");
        startNewBoard(brdNbr);
    }

    if(objMsg.tag == "new-alert"){
        rcvdTextObj = JSON.parse(objMsg.text);
        console.log("Msg Interpreter", objMsg);
        popupBox("New Alert", "", "id", "OK", "", "");
    }
}

/**
 * @description
 * This is a diagostic function to check that communication works <br>
 * Ping causes a message of type "ping" to be sent to the receiver  <br>
 * recipient = "server", "client1", "client2", "client3" <br>
 * or "north", "south","east","west" <br>
 * The message text, if any, comes from the msg input field  <br>
 * The recipient responds by displaying a modal popup with the text <br>
 * 
 * @param {string} recipient 
 */
function pping(recipient) {
    var val = document.getElementById("msg-send").value;
    var txt = "Ping: " + val;
    //console.log("Tablet Ping: ", tablet);
    sendMessage("this", recipient, "ping", txt);
}

//////////////////////////////////////////////////////////////////////
// Bidding Messages //////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
/**
 * @description
 * Send a bid to another tablet <br>
 * The parameters specifying board, round, bidder are the indices in boardsRec[][][] <br> 
 * 
 * @param {string} rcvCode  'R', 'L', 'P', 'M' meaning rho, lho, partner, screenmate <br>
 * @param {int} brdIx Board index
 * @param {int} rndIx Round index
 * @param {int} bidIx Bidder index
 */
function sendBid(rcvCode, brdIx, rndIx, bidIx) {
    // receiving seat
    var rcvSeatIx = positionToSeatIx(rcvCode);
    var rcvSeat = seatOrderWord[rcvSeatIx];
    // Sending Seat
    var sndSeat = seatOrderWord[thisSeatIx];
    // Bid
    var nTricks = boardsRec[brdIx][rndIx][bidIx].tricks;
    var cSuit = boardsRec[brdIx][rndIx][bidIx].suit;
    // Message Text
    var msgObj = {
        from: sndSeat,
        to: rcvSeat,
        board: brdIx,
        round: rndIx,
        bidder: bidIx,
        tricks: nTricks,
        suit: cSuit
    };
    var msgText = JSON.stringify(msgObj);
    console.log("sendBid", rcvCode, msgText);
    sendMessage("this", rcvSeat, "new-bid", msgText);
}

/*
 * @description
 * The player can alert either his screenmate(M) or both opponents (B)
 * The alert refers to either her own bid or partner's last bid 
 * An appropriate message is sent
 * 
 * @param {string} rcvCode 'M' or 'B' meaning screenmate or both opps  
 * @param {int} bidRef "own" or "partner" 
 */
function sendAlert(rcvCode, bidRef) {
    var bidIx;
    var rndIx;
    var sndSeat = seatOrderWord[thisSeatIx];
    var rcvSeat1Ix = -1;
    var rcvSeat2Ix = -1;
    var rcvSeat1 = "";
    var rcvSeat2 = "";
    var msgObj1;
    var msgObj2;
    var msgText1;
    var msgText2;

    if (bidRef == "own") {
        bidIx = (thisSeatIx + 1) % 4;
        rndIx = roundIx;
    }
    if (bidRef == "partner") {
        bidIx = (thisSeatIx + 3) % 4;
        if ((bidIx == 2) || (bidIx == 3))
            rndIx = roundIx - 1;
    }
    if (rcvCode == "M") {
        rcvSeat1Ix = positionToSeatIx(rcvCode);
        rcvSeat1 = seatOrderWord[rcvSeat1Ix];
    } else {
        rcvSeat1Ix = positionToSeatIx('L');
        rcvSeat1 = seatOrderWord[rcvSeat1Ix];
        rcvSeat2Ix = positionToSeatIx('R');
        rcvSeat2 = seatOrderWord[rcvSeat2Ix];
    }

    msgObj1 = {
        from: sndSeat,
        to: rcvSeat1,
        board: boardIx,
        round: rndIx,
        bidder: bidIx,
        tricks: 0,
        suit: "alert"
    };
    msgText1 = JSON.stringify(msgObj1);
    sendMessage("this", rcvSeat1, "new-alert", msgText1);

    msgObj2 = {
        from: sndSeat,
        to: rcvSeat2,
        board: boardIx,
        round: rndIx,
        bidder: bidIx,
        tricks: 0,
        suit: "alert"
    };
    msgText2 = JSON.stringify(msgObj2);
    
    setTimeout(sendMessage, sendBidDelay, "this", rcvSeat2, "new-alert", msgText2);
}

/**
 * @description
 * When a new board is started the newBoardControlSeat sends <br>
 * a message to each of the other boards: <br>
 * From the onClickHandler for the new board <br>
 * - Call this function to notify the other 3 players <br>
 * - On each tablet initialize the bidding box <br>
 * - Prompt the dealer to bid  <br>
 * 
 * @param {int} nbr Board Number 
 * @param {int} ix Board Index in the boardRecord array 
 */
function sendNewBoardNotice(nbr, ix) {
    var sndSeat = newBoardControlSeat;
    var rcvSeat;
    var sndIx = seatOrderWord.indexOf(sndSeat);
    var msgObj = {};
    var msgText;
    var i;
    var delay = 0;

    for (i = 0; i < 4; i++) {
        if (i != sndIx) {
            rcvSeat = seatOrderWord[i];
            msgObj = {
                from: sndSeat,
                to: rcvSeat,
                boardNbr: nbr,
                boardIx: ix
            };
            msgText = JSON.stringify(msgObj);

            setTimeout(sendMessage, sendNewBoardDelay * i, "this", rcvSeat, "new-board", msgText);
        }
    }
}

function pingPong(rcvCode) {
    var d = new Date();
    var t = d.toLocaleTimeString();

    var msgObj = {
        time: t,
        to: rcvCode,
        serial: testConnectionCount
    };

    var msgText = JSON.stringify(msgObj);
    sendMessage("this", rcvCode, "ping-pong", msgText);

    console.log("testMessage", t, rcvCode, testConnectionCount, msgObj, msgText);
}
/**
 * @description
 * Calling this function on the server causes test messages to be sent <br>
 * to each client every deltaT seconds <br>
 * The client responds by confirming receipt immediately <br>
 * The message text consists of a serial number and the time.
 * 
 * @param {int} deltaT Time period between test messages in seconds 
 */
function startBtConnectionTest(deltaT) {
    popupBox("Connection Test Started", "", "connection-test", "OK", "", "");
    testConnectionRepeater = setInterval(function () {
        testConnectionCount++;
        var colIx = 1 + testConnectionCount % 3;
        var rcvCode = "client" + colIx;
        pingPong(rcvCode);
    }, deltaT * 1000);
}
/**
 * Stops the periodic connection test
 */
function stopBtConnectionTest() {
    clearInterval(testConnectionRepeater);
    popupBox("Connection Test Stopped", "", "connection-test", "OK", "", "");
}