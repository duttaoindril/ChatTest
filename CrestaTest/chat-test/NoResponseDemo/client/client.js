// file:///C:/Users/dutta/Documents/GitHub/ChatTest/CrestaTest/chat-test/index.html
var timeoutTime = 5; // Amount of time in seconds needed to consider a timeout
var timeoutResendTime = 3; // Amount of time to wait in seconds after a determined timeout to resend request
var requests = [];
setInterval(() => console.log(requests), 1500); // Shows the state of requests
function start() {
    // Toggle on and off commented lines below to see polling behavior
    // sendRequest("http://localhost:3000/noserver", genID()); // No API endpoint; no server
    // sendRequest("http://localhost:3001/respond", genID()); // API endpoint reponds withtin timeout time of 5 seconds
    sendRequest("http://localhost:3001/delay", genID()); // API endpoint never responds
}

function sendRequest(getURL, id) {
    console.log("Sending new request for", getURL, " with id:", id);
    let xhr = new XMLHttpRequest();
    xhr.open("GET", getURL, true);
    xhr.onreadystatechange = function() {
        console.log("Handling state change for id:", id);
        if (xhr.status === 0 && requests[requests.findIndex(req => req.id === id)].status !== "timedOut") {
            // No response due to no API endpoint
            console.log("No Server");
            requests[requests.findIndex(req => req.id === id)].data.push("no server");
            requests[requests.findIndex(req => req.id === id)].status = "no server";
            setTimeout(function() {
                // Special handling can be added here to not send another request and instead consider it a dead api url
                sendRequest(getURL, id);
            }, timeoutTime * 1000);
        } else if (xhr.readyState === 4 && xhr.status === 200 && requests[requests.findIndex(req => req.id === id)].status !== "timedOut") {
            // Valid response & handling
            console.log(xhr.responseText);
            requests[requests.findIndex(req => req.id === id)].data.push(JSON.parse(xhr.responseText));
            requests[requests.findIndex(req => req.id === id)].status = "done";
            setTimeout(function() {
                sendRequest(getURL, id);
            }, timeoutTime * 1000);
        }
    };
    // Manages request data handling
    if (requests.findIndex(req => req.id === id) < 0) requests.push({ id: id, time: [Date.now()], status: "sent", data: [] });
    else {
        let index = requests.findIndex(req => req.id === id);
        requests[index].time.push(Date.now());
        requests[index].status = "sent";
    }
    // Creates timeout; there are other ways to implement this with xhr.timeout; marks as unresponsive in requests and resends request
    setTimeout(function() {
        markUnresponsive(getURL, id);
    }, timeoutTime * 1000);
    xhr.send();
}

function markUnresponsive(url, id) {
    // Simply marks a request as timed out/unresponsive...
    console.log("Request with id", id, "has timed out.");
    var index = requests.findIndex(req => req.id === id);
    if (requests[index].status === "sent") {
        requests[index].status = "timedOut";
        setTimeout(function() {
            // ...and then resends request in a little bit.
            sendRequest(url, id);
        }, timeoutResendTime * 1000);
    }
}

function genID() {
    // Ripped from Google to generate unique ID.
    let array = new Uint32Array(8);
    window.crypto.getRandomValues(array);
    let str = "";
    for (let i = 0; i < array.length; i++) str += (i < 2 || i > 5 ? "" : "-") + array[i].toString(16).slice(-4);
    return str;
}
