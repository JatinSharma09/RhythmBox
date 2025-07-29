import React, { useContext, useMemo } from "react";
import { FaPlay } from "react-icons/fa";
import { PlayerContext } from "../context/PlayerContext";

const Card = ({ songData }) => {
  const data = songData;
  // console.log(data);
  const { cleanTitle, playSong } = useContext(PlayerContext);

  const song = {
    id: data.id,
    title: data.name,
    artist: data.artists.all[0].name,
    album: "Coexist",
    image: data.image[2].url,
    url: data.downloadUrl[4].url,
  };

  const handlePlay = () => {
    playSong(song);
  };

  return (
    <div className="relative w-full group bg-[#111] hover:bg-[#1c1c1c] transition duration-300 rounded-lg overflow-hidden p-3 cursor-pointer w-full max-w-[170px] hover:scale-105">
      {/* Album Art */}
      <div className="relative w-full h-[170px] rounded-md overflow-hidden">
        <img
          src={data.image[2].url}
          alt={data.name}
          className="object-cover w-full h-full rounded-md"
          loading="lazy"
        />

        {/* Play Overlay */}
        <div
          className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition duration-300"
          onClick={handlePlay}
        >
          <div className="bg-green-500 p-3 rounded-full text-white">
            <FaPlay className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Title & Artist */}
      <div className="mt-3 text-white text-center">
        <h3 className="font-bold text-sm truncate">{cleanTitle(data.name)}</h3>
        <p className="text-xs text-gray-400 truncate">{data.artists.all[0].name}</p>
      </div>
    </div>
  );
};

export default React.memo(Card);
