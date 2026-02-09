import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./App.css";

// Handle client-side routing for GitHub Pages
const query = window.location.search;
if (query.startsWith('?/')) {
  const path = query.slice(2);
  window.history.replaceState(null, null, path);
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter basename="/user-management/">
    <App />
  </BrowserRouter>
);
