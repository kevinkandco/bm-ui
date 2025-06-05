import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import App from "./App.tsx";
import "./index.css";
import FeedbackButton from "@/components/FeedbackButton.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
    <FeedbackButton />
  </StrictMode>
);
