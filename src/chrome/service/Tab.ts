import QueryInfo = chrome.tabs.QueryInfo;

export const getCurrentTab = async () => {
// export const getCurrentTab = () => {
    const queryOptions: QueryInfo = {active: true, lastFocusedWindow: true};
    const [tab] = await chrome.tabs.query(queryOptions);
    console.log("tab", tab);
    return tab;
    // return {
    //     active: true, height: 1296, id: 692358154, index: 7,
    //     selected: true, status: "complete",
    //     title: "chrome.runtime - Chrome Developers",
    //     url: "https://developer.chrome.com/docs/extensions/reference/runtime/#method-sendMessage",
    //     width: 843,
    //     windowId: 692357910
    // };

};

export const sendMessageToActiveTab = async (message: unknown) => {
    const tab = await getCurrentTab();

    if (tab?.id) {
        const response = await chrome.tabs.sendMessage(tab.id, message);
        // TODO: Do something with the response.
    }
};
