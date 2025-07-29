import { createRoot } from "react-dom/client";
import React from 'react'; // Don't forget to import React
import "./index.css";
import "./App.css";
import App from "./App.jsx";
import { PlayerProvider } from "./context/PlayerContext";

createRoot(document.getElementById("root")).render(
  <React.StrictMode> {/* Add React.StrictMode here */}
    <PlayerProvider>
      <App />
    </PlayerProvider>
  </React.StrictMode>
);