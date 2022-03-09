import React, { useState } from "react";
import css from "./styles.module.css";
import { runtime } from "webextension-polyfill";
import { Home } from "@src/components/home";
import { Party } from "@src/components/party";

export function Popup(): JSX.Element {
    const [inParty, setInParty] = useState(false);
    const [partyId, setPartyId] = useState("");

    return (
        <div className={css.popupContainer}>
            <div className="mx-4 my-4">
                {inParty ? (
                    <Party
                        partyId={partyId}
                        leaveParty={() => {
                            runtime.sendMessage({ event: "leaveParty" });
                            setInParty(false);
                            setPartyId("");
                        }}
                    />
                ) : (
                    <Home
                        onJoin={(id) => {
                            setPartyId(id);
                            setInParty(true);
                        }}
                    />
                )}
            </div>
        </div>
    );
}
