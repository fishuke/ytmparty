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
        <div className="w-full flex flex-col gap-4">
            <h3 className="font-bold text-2xl">PartyId: {props.partyId}</h3>

            <button
                className="border border-light-gray hover:border-white rounded-sm p-2 px-8"
                onClick={props.leaveParty}
            >
                Leave Party
            </button>
        </div>
    );
}
