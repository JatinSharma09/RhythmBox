import React, { useContext } from "react";
import CardGrid from "../components/Cardgrid";
import { PlayerContext } from "../context/PlayerContext";
import Playlists, { PlaylistsContent } from "./Playlists";
import { FaSpinner } from "react-icons/fa";

const Home = () => {
  const { songs, loading, error, playSong, cleanTitle, homePlaylists } = useContext(PlayerContext);

  return (
    <div className="flex flex-col h-full flex-1 overflow-y-auto bg-background pb-24 md:pb-0">
      {/* Hero Section / Trending */}
      <div className="flex flex-col p-6 md:p-6">
        {error ? (
          <div className="text-red-400 bg-red-500/10 p-4 rounded-xl border border-red-500/20 text-center">
            {error}
          </div>
        ) : (
          <CardGrid
            Data={songs}
            title="Trending Now"
            loading={loading}
            playSong={playSong}
            cleanTitle={cleanTitle}
          />
        )}
      </div>

      {/* Playlists Section */}
      <div className="flex flex-col gap-6 p-6 md:p-6 pt-0 mb-16">
        <PlaylistsContent
          compact={true}
          title="Playlists"
          homePlaylists={homePlaylists}
          loading={loading}
          cleanTitle={cleanTitle}
        />
      </div>
    </div>
  );
};

export default Home;
