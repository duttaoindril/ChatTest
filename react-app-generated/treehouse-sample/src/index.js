import React from "react";
import ReactDOM from "react-dom";
// import "./index.css";
import Shell from "./App.jsx";
import registerServiceWorker from "./registerServiceWorker";
ReactDOM.render(<Shell />, document.getElementById("root"));
registerServiceWorker();
