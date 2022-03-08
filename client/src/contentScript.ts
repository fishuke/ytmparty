/* eslint-disable @typescript-eslint/no-explicit-any */
const nullthrows = (v: any) => {
    if (v == null) throw new Error("it's a null");
    return v;
};

function injectCode(src: any) {
    const script = document.createElement("script");
    // This is why it works!
    script.src = src;
    script.onload = function () {
        console.log("script injected");
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.remove();
    };

    // This script runs before the <head> element is created,
    // so we add the script to <html> instead.
    nullthrows(document.head || document.documentElement).appendChild(script);
}

injectCode(chrome.runtime.getURL("js/inject.js"));
