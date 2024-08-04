const queryString = window.location.search;
console.log(queryString);

const urlParams = new URLSearchParams(queryString);

const ws_url = urlParams.get('ws')
console.log(ws_url);

const socket = new WebSocket("ws://" + ws_url);

socket.addEventListener("open", (event) => {
    console.log("Connected to server!")
});

socket.addEventListener("close", (event) => {
    console.log("Server connection closed!")
});

socket.addEventListener("message", (event) => {
    let payload = JSON.parse(event.data)
    if (payload["connected"]) {
        console.log("Player connected: " + payload["connected"])
        document.getElementById(payload["connected"]).classList.remove("offline")
    } else if (payload["disconnected"]) {
        console.log("Player disconnected: " + payload["disconnected"])
        document.getElementById(payload["disconnected"]).classList.remove("speaking")
        document.getElementById(payload["disconnected"]).classList.add("offline")
    } else if (payload["speaking"]) {
        console.log("Player speaking: " + payload["speaking"])
        document.getElementById(payload["speaking"]).classList.remove("offline")
        document.getElementById(payload["speaking"]).classList.add("speaking")
    } else if (payload["quiet"]) {
        console.log("Player quiet: " + payload["quiet"])
        document.getElementById(payload["quiet"]).classList.remove("speaking")
    } else {
        console.log("Unknown payload!", payload)
    }
});