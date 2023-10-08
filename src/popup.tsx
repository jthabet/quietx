import React from "react";
import { createRoot } from "react-dom/client";
import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { List } from "./components/List.tsx";

const queryClient = new QueryClient();

const rootElement = document.getElementById("popup");
if (!rootElement) throw new Error("Failed to find root element");
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <div className="h-96 w-72 dark:bg-slate-900">
        <div className=" max-h-full min-h-full min-w-full max-w-full place-items-center overflow-auto overscroll-auto scroll-auto p-8 font-sans font-normal text-white antialiased">
          <List />
        </div>
      </div>
    </QueryClientProvider>
  </React.StrictMode>,
);
