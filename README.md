# Bidding Box, version 3

Includes Bluetooth, Director's and Player Settings, Timer Page

## Bluetooth Setup

### 1. Android Settings
NB Different Android devices differ in the arrangement and naming of settings

->Settings: Make sure Bluetooth is ON

->Settings->Bluetooth: There are 3 sections, one each for *This Device*, *Paired Devices* and *Available Devices*.
Remove all paired devices on all 4 tablets. (There should be an "unpair" option somewhere. Try clicking on the name itself.)
 
->Settings->Bluetooth->Visibility: Make sure that all 4 tablets are *visible*. The visibility setting is either explicit (you need to put a checkmark in a box) or implicit (the device is visible whenever you are on the BT settings page). Usually this setting times out automatically after a few minutes - if this isn't the case, make sure to turn it off when finished because this broadcast function consumes power. 

->Settings->Bluetooth->Available Devices: When all 4 tablets have visibility turned on and are near each other, the names of the other 3 should appear as *Available Devices* on each tablet. This process is flaky. It can take a long time (minutes). It may help to turn BT on and off a few times. Also there may be a "scan" or "search" function that needs to be activated. 

->Settings->Bluetooth->Available->Device Names: The names that appear here are arbitrary, i.e. they are not used by the system but are meant to allow the user to distinguish between devices. When you have identical tablets they will all have the same name and this needs to be changed. Some tablets have specific BT names, some use the WIFI name for BT. The Amazon Tablets have a "Device Name" that can be changed, but I am not sure that this
is the name used for BT. 

->Settings->Bluetooth->Pairing: When all the tablets recognize each other as "available devices" they can be "paired". To accomplish this click on the name or the pairing function button, if provided, and wait a few seconds. You should then be prompted to allow the pairing on the remote device. This process is also flaky. If it doesn't succeed immediately it may nevertheless succeed after a few attempts.

Specific pairing: Choose one of the 4 devices as the "server" and pair the other 3 with it as "clients". That's it for the Android settings.

### 2. Bidding Box Settings
First do the Android Setup as described above. Then load the BiddingBox app. If the app
is already loaded one will be able to reset the system using the button at the bottom, but that isn't working at the moment.

In the BiddingBox03 app go to the Bluetooth Settings Screen by selecting it from the Hamburger Menu on the upper left of any screen. The appearance on the 4 devices should be identical, except that each tablet displays its own name and its function as "client" or "server". 

Now click the **Connect** button on the server. Wait a few seconds and then click **Connect** on one of the clients. Same for the other two. What you should see is that the red dots turn yellow while processing and then green when connected. Also each client tablet will, once connected, display only the connection to the server, i.e. the only direct connection.

Once connected you can ping any tablet from any other using the buttons provided, i.e. send a test message, which will cause a confirmation to pop up on the remote device. 

### 3. Jan Martel's testing on Fire 7 tablets (091218)
Connection from server to the first client works, connection to more clients doesn't - times out.
This is the status of the 121218 Backup. The plan is to assign distinct uuid's to the 3 clients. 
The director assigns the seat and N,E,S,W as before; i.e. clientId, server not bound to seat.   

