/* eslint-disable @typescript-eslint/no-explicit-any */
import browser from "webextension-polyfill";

const nullthrows = (v: any) => {
    if (v == null) throw new Error("it's a null");
    return v;
};

function injectScript(src: any) {
    const script = document.createElement("script");
    // This is why it works!
    script.src = src;
    script.onload = function () {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.remove();
    };

    // This script runs before the <head> element is created,
    // so we add the script to <html> instead.
    nullthrows(document.head || document.documentElement).appendChild(script);
}

injectScript(chrome.runtime.getURL("js/inject.js"));

function sendMessage(message: any): void {
    window.postMessage(
        {
            from: "ytmparty",
            ...message,
        },
        "*",
    );
}

browser.runtime.onMessage.addListener((request) => {
    if (request) {
        sendMessage(request);
    }

    return Promise.resolve();
});
