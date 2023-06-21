import React from "react";
import logo from "@assets/img/logo.svg";
import "@pages/popup/Popup.css";

const Popup = () => {
  // const port = chrome.runtime.connect({ name: "popup" });
  const openShortcutsTab = () =>
    chrome.tabs.create({ url: "chrome://extensions/shortcuts" });

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/pages/popup/Popup.tsx</code> and save to reload.
        </p>
      </header>
      <h1>Hello world!</h1>
      <button onClick={openShortcutsTab}>Shortcuts</button>
    </div>
  );
};

export default Popup;
