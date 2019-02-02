////////////////////////////////////////////////////////////////////////////////
/**
 * @description
 * Special Message ("this", "server", "confirm-connection", btName)
 * 
 * 
 * 
 * @param {string} sndCode "this" when this tablet is the originator      
 * @param {} sndCode "client1", "client2", "client3" when this is the server relaying a msg       
 * @param {} sndCode "North", "East", "South", "West"  
 *   
 * @param {string} rcvCode "server", "client1", "client2", "client3"  
 * @param {} rcvCode "North", "East", "South", "West"  
 * @param {} rcvCode 'R', 'L', 'P', 'M' = RHO, LHO, Partner, Screenmate  
 *  
 * @param {string} tag that determines what is to be done with the text by the receiver 
 *   
 * @param {string} msgText the actual message; interpreted accto tag; a stringified JSON object   
 * @param {} msgText if = "" the text from the "outgoing message" field is sent
 */
function sendMessage(sndCode, rcvCode, tag, msgText) {
    var recipient = rcvCode;
    var senderSocketId = -1;
    var strContent;
    var objContent = {};
    var buf;
    var posIx = -1;

    console.log("sendMessage call 1 ", senderSocketId, posIx, recipient, sndCode, rcvCode, tag, msgText);

    if (sndCode == "this") {
        sndCode = tablet[thisTabletIx].type;
    }

    posIx = positionToSeatIx(rcvCode);
    if (posIx >= 0) {
        recipient = seatOrderWord[posIx];
    }
    console.log("sendMessage call 2 ", senderSocketId, posIx, recipient, sndCode, rcvCode, tag, msgText);

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

    console.log("sendMessage content", objContent);
    console.log("sendMessage socket", senderSocketId);

    strContent = JSON.stringify(objContent);
    buf = arrayBufferFromString(strContent);

    console.log("sendMessage call 4 ", senderSocketId, posIx, recipient, sndCode, rcvCode, tag, msgText);
    if (senderSocketId > 0) {
        networking.bluetooth.send(senderSocketId, buf, function (bytes_sent) {
            console.log('Sent nbr of bytes: ', bytes_sent, 'Socket: ', senderSocketId);
            console.log("Message: ", strContent);
        }, function (errorMessage) {
            console.log('Send failed: ', errorMessage, 'Message: ', strContent, 'Socket: ', senderSocketId);
            console.log(strContent);
            popupBox("Send Message Error " + senderSocketId, errorMessage, "id", "OK", "", "");
        });
    } else {
        console.log("Server not connected, message not sent");
        popupBox("Send Message Error " + senderSocketId, "Socket not connected", "id", "OK", "", "");
    }
}

//////////////////////////////////////////////////////////////////////
// Message to inform the server of seatId and clientId
// (not yet used - needed for chabging seats)
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

    console.log("Data received: ", strReceived);
    objReceived = JSON.parse(strReceived);
    console.log("Obj received: ", objReceived);

    // Message into Input field
    textField.value = "From " + objReceived.from + ": " + objReceived.text;

    M.updateTextFields();
    M.textareaAutoResize(textField);
    // Process the Message 
    msgInterpreter(socketId, strReceived);
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
        console.log("after if type: ", objMsg.tag);
        //Put the socketId in the right tablet[] object
        for (i = 0; i < tablet.length; i++) {
            if (tablet[i].name == objMsg.text) {
                tablet[i].socket = socketId;
                clientIx = i;
                console.log("socket set", socketId, tablet[i].name, tablet[i].type, objMsg.text, objMsg.from);
                setBtConnectionState(tablet[i].type, "connected");
            }
        }

        clientTextName = "client" + clientIx;

        //Server sends communicates client's own id nbr to client
        sendMessage("server", clientTextName, "client-id", clientTextName);
        return;
    }

    //If msg not for this tablet - Relay 
    // except if the name is not yet determined - i.e. msg to set the name
    if ((tablet[thisTabletIx].type != objMsg.to) && (objMsg.tag != "client-id") && (seatOrderWord[tablet[thisTabletIx].seatIx] != objMsg.to)) {
        sendMessage(objMsg.from, objMsg.to, objMsg.tag, strMsg);
        console.log("Relay: ", objMsg);
        return;
    }

    if (objMsg.tag == "ping") {
        text = "from " + objMsg.from;
        console.log(objMsg);
        popupBox("Ping Received", text, "id", "OK", "", "");
    }

    //Client receives its id number
    if (objMsg.tag == "client-id") {
        console.log("Msg Interpreter", objMsg);
        var el = document.getElementById("this-tablet-rank");
        el.innerHTML = objMsg.text;
        tablet[thisTabletIx].type = objMsg.text;
        document.getElementById("client1-div").style.display = 'none';
        document.getElementById("client2-div").style.display = 'none';
        document.getElementById("client3-div").style.display = 'none';
    }

    if (objMsg.tag == "new-bid") {
        console.log("Msg Interpreter", objMsg);
        rcvdTextObj = JSON.parse(objMsg.text);
        console.log("new Bid received", rcvdTextObj);
        text = objMsg.from + " to " + objMsg.to + " Bid: " + rcvdTextObj.tricks + " " + rcvdTextObj.suit;
        popupBox("New Bid", text, "id", "OK", "", "");
        //Now update the bidding record visually and logically
        storeExternalBid(rcvdTextObj);
    }

    if (objMsg.tag == "new-board") {
        console.log("Msg Interpreter", objMsg);
        rcvdTextObj = JSON.parse(objMsg.text);
        console.log("new Board starts", rcvdTextObj);
        var text1 = "New Board Number " + rcvdTextObj.boardNbr;
        var text2 = "You are the Dealer. Please Bid"
        popupBox( text1, text2, "id", "OK", "", "");
    }
}

////////////////////////////////////////////////////////////////////////////
// This is a diagostic function to check that communication works
// Ping causes a message of type "ping" to be sent to the receiver  
// recipient = "server", "client1", "client2", "client3"   
// The message text, if any, comes from the msg input field  
// The recipient responds by displaying a modal popup with the text   
////////////////////////////////////////////////////////////////////////////
function pping(recipient) {
    var val = document.getElementById("msg-send").value;
    var txt = "Ping: " + val;
    //console.log("Tablet Ping: ", tablet);
    sendMessage("this", recipient, "ping", txt);
}

//////////////////////////////////////////////////////
// Bidding Messages
//////////////////////////////////////////////////////
// Send a bid another tablet  
// recCode = receiver 'R', 'L', 'P', 'M'  
// meaning rho, lho, partner, screenmate   
// any combination, e.g. 'RLP', in any order is ok    
// rix = relative bid index = 0, 1, 2, ... from current bid backward
// rix = 0 means bidderIx  
// Normally this will be the current bid
//////////////////////////////////////////////////////////// 
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

// The originator sends a message to the three other
// players when a new board is started
//  
/**
 * @description
 * When a new board is started the newBoardControlSeat sends
 * a message to each of the other boards:
 * From the onClickHandler for the new board
 * - Call this function to notify the other 3 players
 * - On each tablet initialize the bidding box
 * - Prompt the dealer to bid  
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
            sendMessage("this", rcvSeat, "new-board", msgText);
        }
    }
}