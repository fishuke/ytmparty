// Listen for messages sent from other parts of the extension
import browser from "webextension-polyfill";

let ws: WebSocket;

browser.runtime.onMessage.addListener(
    (request: {
        event?: string;
        partyId?: string;
        id?: string;
        to?: string;
    }) => {
        console.log(request);

        if (request.event === "joinParty") {
            ws = new WebSocket(`ws://localhost:5000/${request.partyId}`);
            listenForMessages();
        } else if (request.event === "leaveParty") {
            ws.close();
        }
        if (ws) {
            if (request.event === "unpause") {
                ws.send(JSON.stringify({ event: "unpause" }));
            } else if (request.event === "pause") {
                ws.send(JSON.stringify({ event: "pause" }));
            } else if (request.event === "play") {
                ws.send(JSON.stringify({ event: "play", id: request.id }));
            } else if (request.event === "seek") {
                ws.send(JSON.stringify({ event: "seek", to: request.to }));
            }
        }

        return Promise.resolve();
    },
);

function listenForMessages() {
    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log(data);
        switch (data.event) {
            case "play":
                sendMessageToContentScript({
                    event: "play",
                    id: data.id,
                });
                break;
            case "pause":
                sendMessageToContentScript({
                    event: "pause",
                });
                break;
            case "unpause":
                sendMessageToContentScript({
                    event: "unpause",
                });
                break;
            case "seek":
                sendMessageToContentScript({
                    event: "seek",
                    to: data.to,
                });
                break;
        }
    };
}

function sendMessageToContentScript(message: any): void {
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        browser.tabs.sendMessage(tabs[0].id as number, message);
    });
}
