import { createRoot } from "react-dom/client";
// Sellsuki Design System 3.0 — bootstrap (registers all ssk-* custom elements).
// Must be imported once, at the app entry, before any ssk-* element renders.
import "@uxuissk/design-system-core";
import App from "./app/App.tsx";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  // ssk-theme-provider is a required root wrapper — it injects brand tokens
  // (color/spacing/font) into every ssk-* component in the tree.
  <ssk-theme-provider brand="ccs3">
    <App />
  </ssk-theme-provider>
);
