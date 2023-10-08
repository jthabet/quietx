import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a
          className="hover:text-blue-500 hover:drop-shadow"
          href="https://react.dev"
          target="_blank"
        >
          <img src={reactLogo} className="animate-spin-slow" alt="React logo" />
        </a>
      </div>

      <h1 className="text-5xl">Vite + React</h1>
      <div className="p-2">
        <button
          onClick={() => setCount((count) => count + 1)}
          className="duration-250  cursor-pointer rounded-md border border-transparent bg-gray-700 px-5 py-2 text-base font-semibold transition ease-in-out hover:border-indigo-500"
        >
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
