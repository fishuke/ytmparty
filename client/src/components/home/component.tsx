import React from "react";
import { nanoid } from "nanoid";

export function Home(props: {
    onJoin: (partyId: string) => void;
}): JSX.Element {
    const [partyId, setPartyId] = React.useState("");

    return (
        <div className="flex flex-col items-center w-full gap-4">
            <span className="font-bold text-2xl">Join A Party</span>
            <input
                type="text"
                className="bg-dark-gray border-b p-2 w-2/3 focus:outline-none border-light-gray focus:border-white text-white"
                placeholder="Party ID"
                value={partyId}
                onChange={(e) => setPartyId(e.target.value)}
            />

            <button
                disabled={partyId.length === 0}
                className={`border border-light-gray rounded-sm p-2 px-8 ${
                    partyId.length === 0
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer hover:border-white"
                }`}
                onClick={() => {
                    props.onJoin(partyId);
                }}
            >
                Join
            </button>

            <hr className="h-1 border-light-gray w-2/3" />

            <button
                className="border border-light-gray hover:border-white rounded-sm p-2 px-8"
                onClick={async () => {
                    const partyId = nanoid(6);
                    await setPartyId(partyId);
                    props.onJoin(partyId);
                }}
            >
                Create
            </button>
        </div>
    );
}
