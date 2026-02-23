import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

const rootNode = document.getElementById("root");

if (!rootNode) {
  throw new Error("#root element not found.");
}

createRoot(rootNode).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
