import QueryInfo = chrome.tabs.QueryInfo;

export const getCurrentTab = async () => {
  const queryOptions: QueryInfo = { active: true, lastFocusedWindow: true };
  const [tab] = await chrome.tabs.query(queryOptions);
  console.log("tab", tab);
  return tab;
};

export const sendMessageToActiveTab = async (message: unknown) => {
  const tab = await getCurrentTab();

  if (tab?.id) {
    const response = await chrome.tabs.sendMessage(tab.id, message);
    // TODO: Do something with the response.
  }
};
