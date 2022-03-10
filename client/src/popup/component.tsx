import React, { useEffect, useState } from "react";
import css from "./styles.module.css";
import browser from "webextension-polyfill";
import { Home } from "@src/components/home";
import { Party } from "@src/components/party";

export function Popup(): JSX.Element {
    const [partyId, setPartyId] = useState("");

    // get partyId from local storage
    useEffect(() => {
        const partyId = localStorage.getItem("partyId");
        if (partyId) {
            setPartyId(partyId);
        }
    }, []);

    const savePartyId = (partyId: string): void => {
        localStorage.setItem("partyId", partyId);
        setPartyId(partyId);
    };

    return (
        <div className={css.popupContainer}>
            <div className="mx-4 my-4 w-full">
                {partyId ? (
                    <Party
                        partyId={partyId}
                        leaveParty={() => {
                            browser.runtime.sendMessage({
                                event: "leaveParty",
                            });
                            savePartyId("");
                        }}
                    />
                ) : (
                    <Home
                        onJoin={(id) => {
                            savePartyId(id);
                        }}
                    />
                )}
            </div>
        </div>
    );
}
