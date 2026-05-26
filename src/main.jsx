import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./hrms.css";
import App from "./App";

// Hide boot splash after first paint
window.addEventListener("load", () => {
  setTimeout(() => {
    const b = document.getElementById("boot");
    if (b) {
      b.classList.add("gone");
      setTimeout(() => b.remove(), 500);
    }
  }, 600);
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
