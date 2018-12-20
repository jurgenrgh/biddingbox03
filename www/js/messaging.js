// Send Message, text directly given
// msgText: Any string but may have functional content interpreted
// by receiving side.
//
// source: "this" when this is the originator
// source: "client1", "client2", "client3"  when this is the server relaying a msg
// recipient: "server", "client1", "client2", "client3"
// type: a tag that determines what is to be done with the text
// msgText: the actual message; format corresponds to type
// If msgText = "" the text from the "outgoing message" field is sent
//
/////////////////////////////////
function sendMessage(source, recipient, type, msgText) {
    var senderSocketId;
    var strContent;
    var objContent = {};
    var buf;

    console.log("sendMessage: ", source, recipient, type, msgText);

    if (tablet[thisTabletIx].type == recipient) {
        popupBox("Local Message", "not handled", "id", "OK", "", "");
        return;
    }

    if (source == "this") {
        source = tablet[thisTabletIx].type;
    }

    if (tablet[thisTabletIx].type == "server") {
        if (recipient == "client1") {
            senderSocketId = tablet[1].socket;
        }
        if (recipient == "client2") {
            senderSocketId = tablet[2].socket;
        }
        if (recipient == "client3") {
            senderSocketId = tablet[3].socket;
        }
    }

    if (tablet[thisTabletIx].type != "server") {
        senderSocketId = tablet[thisTabletIx].socket;
    }

    objContent.from = source;
    objContent.to = recipient;
    objContent.type = type;
    objContent.text = msgText;

    console.log("sendMessage content", objContent);
    console.log("sendMessage socket", senderSocketId);

    strContent = JSON.stringify(objContent);
    buf = arrayBufferFromString(strContent);

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

////////////////////////////////////////////////////////////////////////
// Received Message
// Called in response to onReceive Event, i.e. when a Bluetooth
// message has arrived.
// 
// If not, this is considered an error
// If yes, the data is read and displayed in the inbox
//  
function onBtReceiveHandler(receiveInfo) {
    var socketId = receiveInfo.socketId;
    var strReceived = stringFromArrayBuffer(receiveInfo.data);
    var objReceived = {};

    var textField = document.getElementById("msg-rcvd");
    textField.value = "";

    console.log("Data received: ", strReceived);
    objReceived = JSON.parse(strReceived);
    console.log("Obj received: ", objReceived);

    // Message into Inbox
    textField.value = "From " + objReceived.from + ": " + objReceived.text;
    //textField.value = strReceived;
    M.updateTextFields();
    M.textareaAutoResize(textField);

    msgInterpreter(socketId, strReceived);
}

// Some incoming messages require action
// An example is the msg that communicates client name
// allowing the server to associate it with a socket. 
// The content element "type" determines what to do.

function msgInterpreter(socketId, strMsg) {
    var objMsg = JSON.parse(strMsg);
    var clientIx;
    var clientTextName;
    var text;

    console.log("Msg Interpreter Socket: ", socketId, strMsg);
    console.log("Msg Interpreter Msg: ", objMsg);

    ////////////////////////////////////////////////////////////////
    // Confirm Connection:
    // Server sends this message to the client to assign the ClientId  
    if (objMsg.type == "confirmConnection") {
        console.log("after if type: ", objMsg.type);
        //Put the socketId in the right tablet[] object
        for (i = 0; i < tablet.length; i++) {
            if (tablet[i].name == objMsg.text) {
                tablet[i].socket = socketId;
                clientIx = i;
                //console.log("socket set", socketId, tablet[i].name, tablet[i].type, objMsg.text, objMsg.from);
                setBtConnectionState(tablet[i].type, "connected");
            }
        }

        clientTextName = "client" + clientIx;

        //console.log("sending Message: ", "server", clientTextName, "clientId", clientTextName);
        sendMessage("server", clientTextName, "clientId", clientTextName);
        return;
    }

    //If msg not for this tablet - Relay 
    // except if the name is not yet determined - i.e. msg to set the name
    if ((tablet[thisTabletIx].type != objMsg.to) && (objMsg.type != "clientId")) {
        sendMessage(objMsg.from, objMsg.to, objMsg.type, strMsg);
        console.log("Relay: ", objMsg);
        return;
    }

    if (objMsg.type == "ping") {
        text = "from " + objMsg.from;
        console.log(objMsg);
        popupBox("Ping Received", text, "id", "OK", "", "");
    }

    if (objMsg.type == "clientId") {
        var el = document.getElementById("this-tablet-rank");
        el.innerHTML = objMsg.text;
        tablet[thisTabletIx].type = objMsg.text;
        document.getElementById("client1-div").style.display = 'none';
        document.getElementById("client2-div").style.display = 'none';
        document.getElementById("client3-div").style.display = 'none';
    }
}

// Ping causes a message of type "ping" to be sent to the receiver
// recipient = "server", "client1", "client2", "client3"
// the message text, if any, comes from the msg input field
// the recipient replies by sending a message containing the
// same text but with type "pong" 
function pping(recipient) {
    var val = document.getElementById("msg-send").value;
    var txt = "Ping: " + val;
    console.log("Tablet Ping: ", tablet);
    sendMessage("this", recipient, "ping", txt);
}