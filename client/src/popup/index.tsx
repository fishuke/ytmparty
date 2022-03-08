import * as React from "react";
import * as ReactDOM from "react-dom";
import { Popup } from "./component";
import "../css/app.css";
import { tabs } from "webextension-polyfill";

tabs.query({ active: true, currentWindow: true }).then(() => {
    ReactDOM.render(<Popup />, document.getElementById("popup"));
});
