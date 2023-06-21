import QueryInfo = chrome.tabs.QueryInfo;

export const getCurrentTab = async () => {
  const queryOptions: QueryInfo = { active: true, currentWindow: true };
  const [tab] = await chrome.tabs.query(queryOptions);
  return tab;
};

export const sendMessageToCurrentTab = async (message: unknown): Promise<unknown> => {
  const tab = await getCurrentTab();

  if (tab?.id) {
    return await chrome.tabs.sendMessage(tab.id, message);
  }
};
