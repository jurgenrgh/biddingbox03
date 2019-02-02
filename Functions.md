# Functions
## Box.js

**promptNewBoard()**  
OnClick Handler for "Play Board n" Button.  
Only *newBoardControlSeat* can start a new board.  
Sets *bStat.boxOpen = true* if this is the dealer, else *false*.  
Brings up Modal to announce new board.

**startNewBoard**  
Called from the new board modal prompt  
Clear the Bidding Box   
Initialize Bidding Record for the new table  
Open Box if this is the bidder  
If this is the Bidder: It's your turn

TODO:
1. Message to 3 other boards: New Board
2. Same init on other boards
3. If this is the Bidder: It's your turn    

**handleBoardNumberChange(increment)**

**handleBoxReset()**  
OnClick Handler for "Reset Box" Button on Bidding Box Page.  
Clear the bidding record table taking current board into account.  
Call prepBidBox()  

**resetBiddingBox()**

**clearBidBox()**

**prepBidBox()**

**enableBidButton(idTricks)**

**enableHigherSuitBids(ixSuit)**

**disableBidButton(idTricks)**

**selectBidButton(idTricks)**

**unselectBidButton(idTricks)**

**unselectCallButtons()**

**initBiddingBoxSettings()**

**prepSuitBids()**

**handleTricksBid(idTricks)**

**handleSuitBid(idSuit)**

**handleCalls(idCall)**

**handleSubmitCall()**

**checkEnableSubmit()**

**cancelCurrentBid()**

## Record.js

**drawBiddingRecordTable(nRows)**

**initBiddingRecord(boardNbr)**

**updateBiddingRecord()**

**makeBidRecordEntry()**

**setCurrentBiddingRecordCell(newCall)**

**hiliteBiddingRecordCell(row, col)**

**unhiliteBiddingRecordCell(row, col)**

**getbStat()**

**promptBidder(popup)**

**confirmSelectedBid()**

**confirmPassout()**

**cancelPassout()**

**confirmContract()**

**cancelContract()**

**confirmBid()**

**cancelBid()**

**bidNextBoard()**

**recordNewBid()**

## Messaging.js
**sendMessage(source, receiver, type, msgText)**  
source: "this" when this tablet is the originator  
source: "client1", "client2", "client3" when this is the server relaying a msg  
source: "North", "East", "South", "West"  
recipient: "server", "client1", "client2", "client3"  
recipient: "North", "East", "South", "West"  
recipient: 'R', 'L', 'P', 'M' = RHO, LHO, Partner, Screenmate   
type: a tag that determines what is to be done with the text by receiver  
msgText: the actual message; interpreted accto type; a stringified JSON object  
If msgText = "" the text from the "outgoing message" field is sent  

**sendSeatIdToServer()**  
Message to inform the server of seatId and clientId  

**onBtReceiveHandler(receiveInfo)**  
Called when a message was received, i.e. in response to onReceive Event  
Outputs the raw message string to the HTML field on the BT page    
Parses the JSON string into a JSON object  
Calls msgInterpreter which handles input acc to message content  
The message text contains the " msg type" intormation, i.e. what to do next  

**msgInterpreter(socketId, strMsg)**  
socketId = receivibg socket on this tablet  
strMsg = string as received, unparsed stringified JSON object    
Some incoming messages require action    
An example is the msg that communicates client name    
allowing the server to associate it with a socket.   
The content element "type" determines what to do.   
The remainder of the function is specific to each message type   

**function pping(recipient)**  
This is a diagostic function to check that communication works
Ping causes a message of type "ping" to be sent to the receiver  
recipient = "server", "client1", "client2", "client3"   
The message text, if any, comes from the msg input field  
The recipient responds by displaying a modal popup with the text    
   
**sendBid(recCode, bix)**    
Send a bid another tablet  
recCode = receiver 'R', 'L', 'P', 'M'  
meaning rho, lho, partner, screenmate   
any combination, e.g. 'RLP', in any order is ok    
bix = bid index = 0, 1, 2, ... from current bid backward  
Normally this would be the current bid
