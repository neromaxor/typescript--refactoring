import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = createRoot(rootElement); // Створюємо корінь
  root.render(<App />); // Рендеримо компонент
} else {
  console.error('Element with id "root" not found');
}
