const queryString = window.location.search;
console.log(queryString);

const urlParams = new URLSearchParams(queryString);

const guild_id = urlParams.get('gid')
console.log(guild_id);

function run_websocket(address) {
    console.log("Connecting to Greenscreen [" + address + "]")
    socket = new WebSocket(address);

    socket.addEventListener("open", (event) => {
        console.log("Connected to server!")
    });

    socket.addEventListener("close", (event) => {
        console.log("Server connection closed! Retrying...")
        socket = null;
        setTimeout(function() { run_websocket(address) }, 5000);
    });

    socket.addEventListener("message", (event) => {
        let payload = JSON.parse(event.data)
        if (payload["connected"]) {
            console.log("Player connected: " + payload["connected"])
            let character = document.getElementById(payload["connected"])
            character.classList.remove("offline")
        } else if (payload["disconnected"]) {
            console.log("Player disconnected: " + payload["disconnected"])
            let character = document.getElementById(payload["disconnected"])
            let portrait = character.getElementsByClassName("portrait")[0]
            portrait.classList.remove("speaking")
            character.classList.add("offline")
        } else if (payload["speaking"]) {
            console.log("Player speaking: " + payload["speaking"])
            let character = document.getElementById(payload["speaking"])
            let portrait = character.getElementsByClassName("portrait")[0]
            character.classList.remove("offline")
            portrait.classList.add("speaking")
        } else if (payload["quiet"]) {
            console.log("Player quiet: " + payload["quiet"])
            let character = document.getElementById(payload["quiet"])
            let portrait = character.getElementsByClassName("portrait")[0]
            portrait.classList.remove("speaking")
        } else if (payload === "heartbeat") {
        } else {
            console.log("Unknown payload!", payload)
        }
    });
}

run_websocket("wss://greenscreen.ftl.sh/" + guild_id);
// run_websocket("ws://localhost:47336/" + guild_id);