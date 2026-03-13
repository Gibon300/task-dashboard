import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App } from "./App.tsx";
import "./index.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);

// --- AI Admin Agent: inject contact button ---
const aiBtnId = "ai-telegram-btn";
const existingBtn = document.getElementById(aiBtnId);
if (!existingBtn) {
  const btn = document.createElement("a");
  btn.id = aiBtnId;
  btn.className = "ai-btn";
  btn.href = "#";
  btn.target = "_blank";
  btn.rel = "noreferrer";
  btn.textContent = "Contact";
  document.body.appendChild(btn);
} else {
  existingBtn.setAttribute("href", "#");
  existingBtn.textContent = "Contact";
}
// --- end inject ---


