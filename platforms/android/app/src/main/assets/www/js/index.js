/*
 * Licensed to the Apache Software Foundation (ASF)
 * http://www.apache.org/licenses/LICENSE-2.0
 */
var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        console.log('Received Event: ' + id);

        var elems = document.querySelectorAll('.modal');
        var instances = M.Modal.init(elems, {
            inDuration: 0,
            outDuration: 0,
            startingTop: 0,
            endingTop: 0
        });

        $(document).ready(function () {
            $('.sidenav').sidenav();
        });
    }
};