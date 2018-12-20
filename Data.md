| Variable              | Initial Value | Setting       |Description|
| ----------------------|--------------:|---------------|-----------|
|thisTabletBtName       |(getBtDevices) |(getBtDevices) |           |
|thisTabletBTtype       |(getBtDevices) |(getBtDevices) |           |
|validPin               |   1234        | Dir           |           |
|thisSeatIx             |   1           | Dir	        |           |
|tableIx                |   0           | Dir	        |           |
|sectionId              |   "A"         | Dir           |           |	
|firstBoardNbr          |	1           | Dir	        |           |
|lastBoardNbr           |	15          | Dir	        |           |
|minPerHand             |	7.5         | Dir	        |           |
|minPerSession          |	100         | Dir	        |           |
|alertOwn               |	true        | Dir	        |           |
|alertPartner           |	true        | Dir	        |           |
|alertScreenmate        |	true        | Dir	        |           |
|alertBothOpps          |	false       | Dir	        |           |
|trayTransfer           |	"ns"        | Dir	        |           |
|                       |               |               |           |
|rotatedBoard           | 	false       | Dir	        |           |
|                       |               |               |           |
|reconfirmBidSubmission |	true        | Player        |           |	
|newBoardControlSeat    | "North"       | Player	    |           |
|                       |               |               |           |
|timerIdBoard           |  none         | system        |           |	
|timerIdSession         |	none        | system        |	        |
|                       |               |               |           |
|boardIx                | firstBoardNbr | BB            |           |	
|dealerIx               | boardIx       | BB            |           |
|vulIx                  | boardIx       | BB            |           |
|roundIx                | 0             | BB            |	        |
|bidderIx               | 0             | BB            |	        |
|                       |               |               |           |    
|bStat = {}             |			    |               |           |
|lastBidder             | "NO"          | BB            |	        |
|tricks                 | 0             | BB            |	        |
|suit                   | "none"        | BB            |	        |
|dbl                    | false         | BB            |	        |
|rdbl                   | false         | BB            |	        |
|passCount              | 0             | BB            |	        |
|boxOpen                | false         | BB            |	        |
|newTricks              | 0             | BB            |	        |
|newSuit                | "none"        | BB            |	        |
|newCall                | "none"        | BB            |	        |
|newAlert               | false         | BB            |           |
|                       |               |               |           |
|boardsRec[]            |               |               |An array of roundsRec entries	|
|roundsRec[]            |               |               |An array of nRounds seatsRec entries|
|seatsRec[]             |               |               |An array of 4 callObj	Objects|
|                       |               |               |           |
|callObj = {}           |               |               |see<sup>1</sup>       |  
|.tricks                |               |               |           |
|.suit                  |               |               |           |
|.alert                 |               |               |           |   
|			            |               |               |           |
|tablet[]={}            |               |               |           |
|.type		            |               | BT            |	        |
|.name		            |               | BT            |	        |
|.address		        |               | BT            |           |	
|.socket	            |               | BT            |           |	
|.seat		            |               | BT            |           |	
|                       |               |               |           |    
|listeningForConnectionRequest|         | BT            |           |	
|serverSocketId	        |               | BT            |           |	
|thisClientSocketId     |               | BT            |           |	
|nbrConnectedClients    |		        | BT            |           |	
|clientSocketId[]       |		        | BT            |           |	
|			            |               |               |           |
|thisTabletIx	        |	            | BT            |           |	
|thisTabletBtName       |		        | BT	        |           |
|thisTabletBtAddress    |		        | BT	        |           |
|serverTabletIx		    |               | BT	        |           |
|                       |               |               |           |
|uuidNorth		        | constant      | sys           |           |  	
|uuidEast		        | constant      | sys	        |           |  
|uuidSouth		        | constant      | sys	        |           |  
|uuidWest		        | constant      | sys	        |           |  
|			            |               |               |           |
|relaySecDelay          |               | sys           |           |	
|relayRepCount	        |               | sys           |           |	
-------------------------------------------------------------------------
## Footnotes
### (1) Call Object:
The content of a table cell and of a seatsRec[] array entry  
````
function callObj(tricks, suit, alert) {
    this.tricks = tricks
    this.suit = suit;
    this.alert = alert;
}
````
**tricks:** 0,1,....,7; the bidding level  
**suit:** if tricks != 0: "C", "D", "H", "S", "NT"  
**suit:** if tricks = 0: "empty"("&nbsp;"), "blank" ("&ndash;"), "Pass", "X", "XX"  
**alert:** " ", "S", "P", "M", "B" = none, self, partner, screenmate, both opps;  
combinations possible, e.g. "SM" self-alert screenmate, "PB" alerting partner's
bid to both opps.  
"blank" ("&ndash;") means diagram slot empty because dealer is later in rotation  
"empty" ("&nbsp;") means this seat has not bid  

### (2) Tablet Object 
tablet = {type, name, address, socket, seat}  
**type:** "server", "client", "client1", "client2", "client3", "void"  
**name:** client or server Bluetooth Name  
**address:** client or server Bluetooth Address  
**socket:** socketId
**seat:** "North", "East", "South", "West", "void"  

NB on a client tablet only the "this" socket is relevant
On the server all 3 client sockets are set

There is always an array of 4 of these objects
Initialization after discovery of paired devices, see GetBtDevices()
Server and clients are assigned according to alphabetical order of the names
Socket set when connection made
The server cannot know which client belongs to which socket until
the confirmation message is received
    
