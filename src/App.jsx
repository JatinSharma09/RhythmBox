import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PlayerProvider } from "./context/PlayerContext";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Player from "./components/Player";

// Lazy load pages
const Home = lazy(() => import("./pages/Home"));
const Explore = lazy(() => import("./pages/Explore"));
const Playlists = lazy(() => import("./pages/Playlists"));
const History = lazy(() => import("./pages/History"));
const Favorites = lazy(() => import("./pages/Favorites"));
const ForYou = lazy(() => import("./pages/ForYou"));
const PlaylistDetail = lazy(() => import("./pages/PlaylistDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center h-full text-white">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
  </div>
);

const App = () => {
  return (
    <PlayerProvider>
      <BrowserRouter>
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar - always visible */}
          <Sidebar />

          {/* Main content area */}
          <main className="flex flex-col flex-1 bg-background text-white">
            {/* Navbar - always on top */}
            <Navbar />

            {/* Page content */}
            <div className="flex-1 overflow-y-auto">
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/explore" element={<Explore />} />
                  <Route path="/playlists" element={<Playlists />} />
                  <Route path="/history" element={<History />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/foryou" element={<ForYou />} />
                  <Route path="/playlist/:id" element={<PlaylistDetail />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </div>

            {/* Music player - always at bottom */}
          </main>
          <Player />
        </div>
      </BrowserRouter>
    </PlayerProvider >
  );
};

export default App;
