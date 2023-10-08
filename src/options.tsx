// import React from "react";
import { createRoot } from "react-dom/client";
import { TokenForm } from "./components/TokenForm";
import "./App.css";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find root element");
const root = createRoot(rootElement);

root.render(
  <div className="grid h-screen w-screen grid-flow-row auto-rows-max justify-items-center p-9 dark:bg-slate-900">
    <TokenForm />
  </div>,
);
