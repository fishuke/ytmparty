// src/__mocks__/webextension-polyfill
// Update this file to include any mocks for the `webextension-polyfill` package
// outside the Web Extension environment provided by a compatible browser
export const browser: any = {
    tabs: {
        executeScript(currentTabId: number, details: any) {
            return Promise.resolve({ done: true });
        },
        query(params: any): Promise<Tab[]> {
            return Promise.resolve([]);
        },
    },
    runtime: {
        sendMessage: (params: { popupMounted: boolean }) => {
            return;
        },
    },
};

interface Tab {
    id: number;
}

export interface Tabs {
    Tab: Tab;
}
