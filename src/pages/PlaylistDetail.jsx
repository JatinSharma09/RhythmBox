import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PlayerContext } from "../context/PlayerContext";
import { FaPlay, FaArrowLeft } from "react-icons/fa";
import { MdShuffle, MdPlayArrow } from "react-icons/md";

const PlaylistDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { playSong, cleanTitle, setQueue } = useContext(PlayerContext);

  const playlist = location.state?.playlist;

  if (!playlist) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white p-6">
        <p className="text-gray-400 mb-4">Playlist not found</p>
        <button
          onClick={() => navigate(-1)}
          className="text-primary hover:underline"
        >
          Go back
        </button>
      </div>
    );
  }

  const handlePlaySong = (song) => {
    playSong({
      id: song.id,
      title: song.name,
      artist: song.artists?.all?.[0]?.name || song.artists?.primary?.[0]?.name || "Unknown Artist",
      album: song.album?.name || "",
      image: song.image?.[2]?.url || song.image?.[0]?.url,
      url: song.downloadUrl?.[4]?.url || song.downloadUrl?.[0]?.url,
    });
  };

  const handlePlayAll = () => {
    if (playlist.songs?.length > 0) {
      const normalizedSongs = playlist.songs.map(song => ({
        id: song.id,
        title: song.name,
        artist: song.artists?.all?.[0]?.name || song.artists?.primary?.[0]?.name || "Unknown Artist",
        album: song.album?.name || "",
        image: song.image?.[2]?.url || song.image?.[0]?.url,
        url: song.downloadUrl?.[4]?.url || song.downloadUrl?.[0]?.url,
      }));
      setQueue(normalizedSongs);
      playSong(normalizedSongs[0]);
    }
  };

  const handleShufflePlay = () => {
    if (playlist.songs?.length > 0) {
      const normalizedSongs = playlist.songs.map(song => ({
        id: song.id,
        title: song.name,
        artist: song.artists?.all?.[0]?.name || song.artists?.primary?.[0]?.name || "Unknown Artist",
        album: song.album?.name || "",
        image: song.image?.[2]?.url || song.image?.[0]?.url,
        url: song.downloadUrl?.[4]?.url || song.downloadUrl?.[0]?.url,
      }));
      const shuffled = [...normalizedSongs].sort(() => Math.random() - 0.5);
      setQueue(shuffled);
      playSong(shuffled[0]);
    }
  };

  const songCount = playlist.songCount || playlist.songs?.length || 0;

  return (
    <div className="h-full w-full overflow-hidden bg-background relative">
      {/* Background with Blur Effect */}
      <div
        className="absolute inset-0 blur-3xl opacity-30 pointer-events-none"
        style={{
          backgroundImage: `url(${playlist.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-background/90 to-background pointer-events-none" />

      {/* Main Content - Full height scroll */}
      <div className="h-full w-full overflow-y-auto overflow-x-hidden relative z-10">
        {/* Hero Section */}
        <div className="px-4 py-4 flex flex-col items-center mt-10">

          <img
            src={playlist.image}
            alt={playlist.name}
            className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-lg shadow-xl object-cover"
          />

          <div className="mt-4 text-center w-full max-w-xs">
            <p className="text-[11px] text-gray-400 uppercase tracking-wider">Playlist</p>
            <h1
              className="text-xl font-bold text-white mt-1 leading-tight"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
            >
              {cleanTitle(playlist.name)}
            </h1>
            <p className="text-sm text-gray-400 mt-1">{songCount} songs</p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mt-5">
            <button
              onClick={handleShufflePlay}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-full text-sm font-medium"
            >
              <MdShuffle size={18} />
              Shuffle
            </button>
            <button
              onClick={handlePlayAll}
              className="flex items-center justify-center bg-primary hover:bg-primary/80 text-black w-12 h-12 rounded-full shadow-lg"
            >
              <MdPlayArrow size={28} />
            </button>
          </div>
        </div>

        {/* Songs List */}
        <div className="px-3 md:px-6 pb-32 mb-10 md:mb-0">
          {playlist.songs?.map((song, index) => (
            <div
              key={song.id || index}
              onClick={() => handlePlaySong(song)}
              className="grid grid-cols-[44px_1fr_auto] gap-3 items-center p-2 rounded-lg hover:bg-white/5 active:bg-white/10 cursor-pointer"
            >
              {/* Album Art */}
              <img
                src={song.image?.[1]?.url || song.image?.[0]?.url}
                alt={song.name}
                className="w-11 h-11 rounded object-cover"
                loading="lazy"
              />

              {/* Song Info - Using explicit overflow styles */}
              <div className="min-w-0">
                <p
                  className="text-white text-sm font-medium"
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {cleanTitle(song.name)}
                </p>
                <p
                  className="text-gray-400 text-xs"
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {song.artists?.all?.[0]?.name || song.artists?.primary?.[0]?.name || "Unknown"}
                </p>
              </div>

              {/* Duration */}
              <span className="text-gray-500 text-xs tabular-nums">
                {song.duration ? `${Math.floor(song.duration / 60)}:${(song.duration % 60).toString().padStart(2, '0')}` : ''}
              </span>
            </div>
          ))}

          {(!playlist.songs || playlist.songs.length === 0) && (
            <div className="text-center py-12 text-gray-500">
              No songs in this playlist
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaylistDetail;
