import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import {CryptoContextProvider} from "./CryptoContext";

ReactDOM.render(
  <React.StrictMode>
    <CryptoContextProvider>
      <App />
    </CryptoContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
