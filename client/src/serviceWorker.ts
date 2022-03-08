// Listen for messages sent from other parts of the extension
import { runtime } from "webextension-polyfill";

runtime.onMessage.addListener((request: { popupMounted: boolean }) => {
    if (request.popupMounted) {
        console.log("serviceWorker notified that Popup.tsx has mounted.");
    }
});
