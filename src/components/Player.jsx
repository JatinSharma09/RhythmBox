import React, { useContext } from "react";
import { PlayerContext } from "../context/PlayerContext";
import { AudioPlaybackStateContext } from "../context/AudioPlaybackStateContext";
import FullScreenPlayer from "./FullScreenPlayer";
import { MdShuffle, MdRepeat, MdRepeatOne, MdSkipNext, MdSkipPrevious, MdVolumeUp, MdOpenInFull, MdVolumeOff } from "react-icons/md";
import { FaPlay, FaPause } from "react-icons/fa6";

const Player = () => {
  const {
    isFullScreen,
    setIsFullScreen,
    isPlaying,
    togglePlayPause,
    volume,
    setVolume,
    audioRef,
    cleanTitle,
    currentSong,
    playNextSong,
    playPreviousSong,
    shuffle,
    toggleShuffle,
    repeat,
    toggleRepeat,
    toggleFavorite,
    favorites
  } = useContext(PlayerContext);

  const { currentTime, duration } = useContext(AudioPlaybackStateContext);

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.volume = vol;
      setVolume(vol);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time) || time < 0) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  // Handle miniplayer click on mobile
  const handleMiniplayerClick = (e) => {
    // Only trigger on mobile and if not clicking on a button
    if (window.innerWidth < 768 && e.target.closest('button') === null) {
      setIsFullScreen(true);
    }
  };

  return (
    <div className="fixed bottom-[68px] md:bottom-0 w-full z-50">
      <div className="bg-surface/95 backdrop-blur-xl border-t border-white/10 transition-all duration-300">

        {/* Mobile Miniplayer */}
        <div
          className="md:hidden flex items-center gap-3 p-3 cursor-pointer"
          onClick={handleMiniplayerClick}
        >
          {/* Album Art */}
          <img
            src={currentSong.image}
            alt="Album"
            className="h-12 w-12 rounded-lg object-cover shadow-lg flex-shrink-0"
          />

          {/* Song Info */}
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm truncate">
              {cleanTitle(currentSong.title)}
            </p>
            <p className="text-gray-400 text-xs truncate">
              {currentSong.artist}
            </p>
          </div>

          {/* Play/Pause Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePlayPause();
            }}
            className="bg-white rounded-full p-2.5 flex-shrink-0 active:scale-95 transition-transform"
          >
            {isPlaying ? (
              <FaPause className="text-black h-5 w-5 ml-0.5" />
            ) : (
              <FaPlay className="text-black h-5 w-5 ml-1" />
            )}
          </button>

          {/* Next Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              playNextSong();
            }}
            className="text-gray-300 p-2 flex-shrink-0"
          >
            <MdSkipNext size={24} />
          </button>
        </div>

        {/* Desktop Player */}
        <div className="hidden md:flex items-center justify-between px-4 py-3 gap-4 h-[88px]">
          {/* Song Info */}
          <div className="flex items-center flex-1 min-w-0">
            <div className="relative group">
              <img
                src={currentSong.image}
                alt="Album"
                className="h-14 w-14 rounded-lg object-cover shadow-lg group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="ml-3 min-w-0 overflow-hidden">
              <p className="text-white font-display font-semibold text-base truncate cursor-pointer hover:underline decoration-primary">
                {cleanTitle(currentSong.title)}
              </p>
              <p className="text-gray-400 font-medium text-sm truncate hover:text-white transition-colors cursor-pointer">
                {currentSong.artist}
              </p>
            </div>
          </div>

          {/* Song Actions (Heart) */}
          <div className="flex items-center gap-3 mr-4">
            <button
              onClick={() => toggleFavorite(currentSong)}
              className={`text-gray-400 hover:text-red-500 transition-colors ${favorites.some(f => f.id === currentSong.id) ? 'text-red-500' : ''
                }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill={favorites.some(f => f.id === currentSong.id) ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
            </button>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center flex-1 w-full max-w-xl">
            <div className="flex items-center justify-center gap-6">
              {/* Shuffle Button */}
              <button
                onClick={toggleShuffle}
                className={`p-2 rounded-full transition-all duration-200 ${shuffle ? 'text-primary bg-primary/10' : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                title="Shuffle"
                aria-label="Toggle shuffle"
              >
                <MdShuffle size={20} />
              </button>

              {/* Previous Button */}
              <button
                onClick={playPreviousSong}
                className="text-gray-300 hover:text-white hover:scale-110 transition-all duration-200"
                aria-label="Previous song"
              >
                <MdSkipPrevious size={32} />
              </button>

              {/* Play/Pause Button */}
              <button
                onClick={togglePlayPause}
                className="bg-white rounded-full p-2 hover:scale-105 transition-all duration-200 shadow-lg shadow-white/10"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <FaPause className="text-black h-4 w-4" />
                ) : (
                  <FaPlay className="text-black h-4 w-4 ml-1" />
                )}
              </button>

              {/* Next Button */}
              <button
                onClick={playNextSong}
                className="text-gray-300 hover:text-white hover:scale-110 transition-all duration-200"
                aria-label="Next song"
              >
                <MdSkipNext size={32} />
              </button>

              {/* Repeat Button */}
              <button
                onClick={toggleRepeat}
                className={`p-2 rounded-full transition-all duration-200 ${repeat > 0 ? 'text-primary bg-primary/10' : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                title="Repeat"
                aria-label="Toggle repeat"
              >
                {repeat === 2 ? <MdRepeatOne size={20} /> : <MdRepeat size={20} />}
              </button>
            </div>

            {/* Progress bar */}
            <div className="flex items-center gap-3 mt-2 w-full group">
              <span className="text-xs text-gray-400 font-medium tabular-nums w-10 text-right">{formatTime(currentTime)}</span>
              <div className="relative flex-1 h-1 bg-white/10 rounded-full overflow-hidden cursor-pointer group-hover:h-1.5 transition-all">
                <div
                  className="absolute top-0 left-0 h-full bg-primary rounded-full"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              <span className="text-xs text-gray-400 font-medium tabular-nums w-10">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Volume + Fullscreen */}
          <div className="flex items-center justify-end flex-1 gap-4">
            <div className="flex items-center gap-2 group">
              <button className="text-gray-400 hover:text-white transition-colors">
                {volume === 0 ? <MdVolumeOff size={24} /> : <MdVolumeUp size={24} />}
              </button>
              <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden relative">
                <div
                  className="absolute top-0 left-0 h-full bg-white rounded-full group-hover:bg-primary transition-colors"
                  style={{ width: `${volume * 100}%` }}
                />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>

            {/* Desktop Fullscreen */}
            <button
              onClick={() => setIsFullScreen(true)}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
            >
              <MdOpenInFull size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Full Screen Player Overlay */}
      <FullScreenPlayer
        isVisible={isFullScreen}
        onClose={() => setIsFullScreen(false)}
      />
    </div>
  );
};

export default Player;
