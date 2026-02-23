import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const rootNode = document.getElementById("root");

if (!rootNode) {
  throw new Error("#root element not found.");
}

createRoot(rootNode).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
