import * as React from "react";
import { Party } from "../component";
import renderer from "react-test-renderer";

it("component renders", () => {
    const tree = renderer
        .create(<Party leaveParty={() => null} partyId={"0"} />)
        .toJSON();
    expect(tree).toMatchSnapshot();
});
