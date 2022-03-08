import React from "react";
import { Hello } from "@src/components/hello";
import { Scroller } from "@src/components/scroller";
import css from "./styles.module.css";
import { runtime, Tabs, tabs, scripting } from "webextension-polyfill";

// Scripts to execute in current tab
const scrollToTopScript = `window.scroll(0,0)`;
const scrollToBottomScript = `window.scroll(0,9999999)`;

/**
 * Executes a string of Javascript on the current tab
 * @param code The string of code to execute on the current tab
 */
function executeScript(code: string): void {
    // Query for the active tab in the current window
    tabs.query({ active: true, currentWindow: true }).then(
        (tabs: Tabs.Tab[]) => {
            // Pulls current tab from browser.tabs.query response
            const currentTab: Tabs.Tab = tabs[0];

            // Short circuits function execution is current tab isn't found
            if (!currentTab) {
                return;
            }

            // Executes the script in the current tab
            scripting
                .executeScript({
                    target: {
                        tabId: currentTab.id as number,
                    },
                    files: ["js/contentScript.js"],
                })
                .then(() => {
                    console.log("Done Scrolling");
                });
        },
    );
}

export function Popup() {
    // Sends the `popupMounted` event
    React.useEffect(() => {
        runtime.sendMessage({ popupMounted: true });
    }, []);

    // Renders the component tree
    return (
        <div className={css.popupContainer}>
            <div className="mx-4 my-4">
                <Hello />
                <hr />
                <Scroller
                    onClickScrollTop={() => {
                        executeScript(scrollToTopScript);
                    }}
                    onClickScrollBottom={() => {
                        executeScript(scrollToBottomScript);
                    }}
                />
            </div>
        </div>
    );
}
