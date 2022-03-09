// Listen for messages sent from other parts of the extension
import browser, { Tabs, tabs } from "webextension-polyfill";

let ws: WebSocket;

browser.runtime.onMessage.addListener(
    (request: { event?: string; partyId?: string }) => {
        switch (request.event) {
            case "joinParty":
                console.log("joinParty", request.partyId);
                ws = new WebSocket(`ws://localhost:5000/${request.partyId}`);
                listenForMessages();
                break;
            case "leaveParty":
                console.log("leaveParty");
                ws.close();
                break;
        }

        return Promise.resolve();
    },
);

function listenForMessages() {
    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("received", data);
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
                    event: "pause",
                });
                break;
            case "seek":
                sendMessageToContentScript({
                    event: "seek",
                    time: data.time,
                });
                break;
        }
    };
}

function sendMessageToContentScript(message: any): void {
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        console.log(tabs);
        browser.tabs.sendMessage(tabs[0].id as number, message);
    });
}
