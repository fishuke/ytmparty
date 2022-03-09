import * as React from "react";
import { Home } from "../component";
import renderer from "react-test-renderer";

it("component renders", () => {
    const tree = renderer
        .create(
            <Home
                onJoin={() => {
                    console.log("onJoin");
                }}
            />,
        )
        .toJSON();
    expect(tree).toMatchSnapshot();
});
