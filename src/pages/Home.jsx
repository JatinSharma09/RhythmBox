import React, { useContext } from "react";
import CardGrid from "../components/Cardgrid";
import { PlayerContext } from "../context/PlayerContext";
import Playlists from "./Playlists";
import { FaSpinner } from "react-icons/fa";

const Home = () => {
  const { songs, loading, error } = useContext(PlayerContext);

  return (
    <div className="flex flex-col h-auto flex-1 md:h-[110vh]">
      <div className="flex flex-col gap-4 p-5">
        <div className="text-white text-2xl font-bold">Trending Now</div>

        {loading ? (
          <div className="flex flex-col items-center justify-center">
          <FaSpinner className="animate-spin text-green-500 text-4xl" />
          <div className="text-white">Loading...</div>
          </div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <CardGrid Data={songs} />
        )}
      </div>

      <div className="flex flex-col gap-4 p-2">
        <div className="text-white text-2xl font-bold px-3">Playlists</div>
        <Playlists className="hidden" />
      </div>
    </div>
  );
};

export default Home;
