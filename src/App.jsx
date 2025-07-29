import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PlayerProvider } from "./context/PlayerContext";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Player from "./components/Player";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Playlists from "./pages/Playlists";
import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <PlayerProvider>
      <BrowserRouter>
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar - always visible */}
          <Sidebar />

          {/* Main content area */}
          <div className="flex flex-col flex-1 bg-black text-white">
            {/* Navbar - always on top */}
            <Navbar />

            {/* Page content */}
            <div className="flex-1 overflow-y-auto">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/playlists" element={<Playlists />} />
                 <Route path="*" element={<NotFound />} />
              </Routes>
            </div>

            {/* Music player - always at bottom */}
          </div>
          <Player />
        </div>
      </BrowserRouter>
    </PlayerProvider>
  );
};

export default App;
