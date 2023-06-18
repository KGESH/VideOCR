/** Client -> Background */
export const sendMessageToBackground = (message: unknown) => {
  const port = chrome.runtime.connect({ name: "service" });

  port.onMessage.addListener((msg) => {
    console.log("On Message from background", msg);
  });

  port.onDisconnect.addListener(() => console.log("Disconnected"));

  try {
    port.postMessage(message);
  } catch (e) {
    console.error(e);
  }

  const disconnect = () => port.disconnect();
  return { disconnect };
};

/** Background -> Client */
export const sendMessageToClient = (
  port: chrome.runtime.Port,
  message: unknown
) => {
  try {
    port.postMessage(message);
  } catch (e) {
    console.error(e);
  }
};
