import React from "react";
import { nanoid } from "nanoid";

export function Home(props: {
    onJoin: (partyId: string) => void;
}): JSX.Element {
    const [partyId, setPartyId] = React.useState("");

    return (
        <div className="flex flex-col items-center w-full">
            <span className="lead mb-0">Join A Party.</span>
            <input
                type="text"
                className="form-control"
                placeholder="Party ID"
                value={partyId}
                onChange={(e) => setPartyId(e.target.value)}
            />

            <button
                disabled={partyId.length === 0}
                className="btn btn-primary"
                onClick={() => {
                    props.onJoin(partyId);
                }}
            >
                Join
            </button>

            <hr />

            <button
                className="btn btn-primary"
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
