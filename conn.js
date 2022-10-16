// This file handles connections to the backend Swift AIO server
// Do not make changes in here as it could prevent your module from registering!

const config = require("./config.json");
const events = require("./events.json");
const WebSocketClient = require('websocket').client;

const client = new WebSocketClient();
var conn = null;

function send(event, data) {
    if (conn === null)
        return
    
    conn.send(JSON.stringify({
        module: config.id,
        event: event,
        data: data
    }));
}

function establishLocalServerConnection(token) {
    if (token === undefined) {
        console.warn("establishLocalServerConnection: token is undefined, aborted backend authentication")
        return
    }

    console.log("Connecting to backend");

    var authTimeout = null;
    var authedSuccess = false;

    client.on("connect", c => {
        conn = c;
        console.log("Connected to backend, authenticating...");

        // Timeout authntication if it takes longer than 30 sec
        authTimeout = setTimeout(() => {
            if (authedSuccess)
                return
            try {
                conn.close();
            } catch { }
            console.warn("Authentication timed out");
        }, 30e3);

        conn.on("message", d => {
            console.log(d);
            authedSuccess = true
            clearTimeout(authTimeout);
        });
        conn.on("close", () => {
            console.log("Lost connection to backend server");
        });

        // Send the token to the backend
        send(events.PING, token);
    })

     // Attempt connection to the local backend
    client.connect("ws://localhost:6072/modules");
}

module.exports = {
    connect: establishLocalServerConnection
}

// Turtlee was here...