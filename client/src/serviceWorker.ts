// Listen for messages sent from other parts of the extension
import browser from "webextension-polyfill";

let ws: WebSocket | undefined;

browser.runtime.onMessage.addListener(
    (request: {
        event?: string;
        partyId?: string;
        id?: string;
        to?: string;
    }) => {
        if (request.event === "joinParty") {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const url = process.env.REACT_APP_API_URL + request.partyId;
            if (ws && ws.readyState === WebSocket.OPEN && ws.url === url) {
                return;
            }
            ws = new WebSocket(url);
            listenForMessages();
            return;
        }

        if (ws && request.event === "leaveParty") {
            ws.close();
            ws = undefined;
            return;
        }

        if (ws && ws.readyState === WebSocket.OPEN) {
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

function sendMessageToContentScript(message: {
    event: string;
    id?: string;
    to?: string;
}): void {
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        browser.tabs.sendMessage(tabs[0].id as number, message);
    });
}
