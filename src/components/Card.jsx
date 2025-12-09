import React, { useContext, useMemo } from "react";
import { FaPlay } from "react-icons/fa";
import { MdMoreVert } from "react-icons/md";


const Card = ({ songData, compact = false, playSong, cleanTitle }) => {
  const song = useMemo(() => {
    // Check if it's raw API data (has 'artists' and 'downloadUrl' arrays)
    if (songData.artists && songData.downloadUrl) {
      return {
        id: songData.id,
        title: songData.name,
        artist: songData.artists?.all?.[0]?.name || "Unknown Artist",
        album: songData.album?.name || "Coexist",
        image: songData.image?.[2]?.url || songData.image?.[0]?.url,
        url: songData.downloadUrl?.[4]?.url || songData.downloadUrl?.[0]?.url,
      };
    }
    // Otherwise assume it's already normalized (from History/Favorites)
    return songData;
  }, [songData]);

  const handlePlay = () => {
    if (playSong) {
      playSong(song);
    }
  };

  // Compact horizontal card for mobile
  if (compact) {
    return (
      <div
        className="flex items-center gap-3 p-2 rounded-xl bg-surface hover:bg-white/5 transition-colors cursor-pointer group"
        onClick={handlePlay}
      >
        {/* Small Thumbnail */}
        <img
          src={song.image}
          alt={song.title}
          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
          loading="lazy"
        />

        {/* Song Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-white text-sm line-clamp-1 group-hover:text-primary transition-colors">
            {cleanTitle ? cleanTitle(song.title) : song.title}
          </h3>
          <p className="text-xs text-gray-400 truncate">{song.artist}</p>
        </div>

        {/* Options Menu */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            // TODO: Add context menu
          }}
          className="p-2 text-gray-400 hover:text-white transition-colors flex-shrink-0"
          aria-label="More options"
        >
          <MdMoreVert size={20} />
        </button>
      </div>
    );
  }

  // Standard card for desktop/tablet
  return (
    <div className="relative w-full group bg-surface hover:bg-white/5 border border-white/5 hover:border-white/10 transition-all duration-300 rounded-2xl overflow-hidden p-3 cursor-pointer max-w-[170px] hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50">
      {/* Album Art */}
      <div className="relative w-full aspect-square rounded-xl overflow-hidden shadow-lg">
        <img
          src={song.image}
          alt={song.title}
          className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />

        {/* Play Overlay */}
        <div
          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300 backdrop-blur-[2px]"
          onClick={handlePlay}
        >
          <div className="bg-primary p-3.5 rounded-full text-white shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:scale-110 hover:bg-green-400">
            <FaPlay className="h-4 w-4 ml-0.5" />
          </div>
        </div>
      </div>

      {/* Title & Artist */}
      <div className="mt-3 text-left">
        <h3 className="font-display font-semibold text-white text-sm line-clamp-1 group-hover:text-primary transition-colors">{cleanTitle ? cleanTitle(song.title) : song.title}</h3>
        <p className="text-xs text-gray-400 truncate mt-1 group-hover:text-gray-300 transition-colors">{song.artist}</p>
      </div>
    </div>
  );
};

export default React.memo(Card);
