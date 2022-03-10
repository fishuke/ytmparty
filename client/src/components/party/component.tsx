import React, { useEffect } from "react";
import browser from "webextension-polyfill";

export function Party(props: {
    partyId: string;
    leaveParty: () => void;
}): JSX.Element {
    useEffect(() => {
        // send a message to background extension
        browser.runtime.sendMessage({
            event: "joinParty",
            partyId: props.partyId,
        });
    }, []);

    return (
        <div className="grid gap-3 grid-cols-2 mt-3 w-full">
            <h3>PartyId: {props.partyId}</h3>

            <button onClick={props.leaveParty}>Leave Party</button>
        </div>
    );
}
