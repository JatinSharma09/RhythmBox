import React, { useContext } from "react";
import { PlayerContext } from "../context/PlayerContext";
import { AudioPlaybackStateContext } from "../context/AudioPlaybackStateContext";
import FullScreenPlayer from "./FullScreenPlayer";

const Player = () => {
  // console.log("Player Render");
  // Consume stable values from PlayerContext
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
    playNextSong,     // NEW: Get playNextSong
    playPreviousSong, // NEW: Get playPreviousSong
  } = useContext(PlayerContext);

  // Consume frequently changing values from AudioPlaybackStateContext
  const { currentTime, duration } = useContext(AudioPlaybackStateContext);

  // Handle seeking (dragging the progress bar)
  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  // Handle volume change
  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.volume = vol;
      setVolume(vol);
    }
  };

  // Helper function to format time (e.g., 3:45)
  const formatTime = (time) => {
    if (isNaN(time) || time < 0) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="fixed bottom-[68px] md:bottom-0 w-full bg-[#1F1F22] z-50 md:h-[88px]">
      <div className="flex flex-wrap md:flex-nowrap items-center justify-between px-4 py-3 gap-4">
        {/* Song Info */}
        <div className="flex items-center flex-1">
          <img
            src={currentSong.image}
            alt="Album"
            className="h-11 w-11 md:h-[60px] md:w-[60px] rounded object-cover"
          />
          <div className="ml-3 w-full overflow-hidden">
            <p className="text-white font-semibold text-sm md:text-sm truncate">
              {/* //if current song title is longer than 20 characters, truncate */}
              {cleanTitle(currentSong.title).length > 20 ? `${cleanTitle(currentSong.title).slice(0, 20)}...` : cleanTitle(currentSong.title)}
            </p>
            <p className="text-[#fcfcfca9] font-semibold text-xs md:text-sm  truncate">
              {currentSong.artist}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center flex-1 w-full">
          <div className="flex items-center justify-center gap-5 md:gap-6">
            {/* Previous Button */}
            <img
              src="/Assets/Icon-Rewind-Filled.svg"
              alt="Prev"
              className="h-5 w-5 md:h-5 md:w-5 hover:opacity-80 cursor-pointer"
              onClick={playPreviousSong} // Call playPreviousSong
            />
            {/* Play/Pause Button */}
            {isPlaying ? (
              <img
                src="/Assets/pause.svg"
                alt="Pause"
                className="h-7 w-7 md:h-8 md:w-8 hover:scale-110 cursor-pointer"
                onClick={togglePlayPause}
              />
            ) : (
              <img
                src="/Assets/Icon-Play-Filled (1).svg"
                alt="Play"
                className="h-7 w-7 md:h-8 md:w-8 hover:scale-110 cursor-pointer"
                onClick={togglePlayPause}
              />
            )}
            {/* Next Button */}
            <img
              src="/Assets/Icon-Forward-Filled.svg"
              alt="Next"
              className="h-5 w-5 md:h-5 md:w-5 hover:opacity-80 cursor-pointer"
              onClick={playNextSong} // Call playNextSong
            />
          </div>

          {/* Progress bar */}
          <div className="hidden md:flex items-center gap-3 mt-2 w-full">
            <span className="text-xs text-white">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 accent-sky-400 cursor-pointer"
            />
            <span className="text-xs text-white">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume + Fullscreen */}
        <div className="block md:flex items-center md:justify-end md:flex-1 gap-4">
          <div className="hidden md:flex items-center gap-2">
            <img
              src="/Assets/Icon-Volume.svg"
              alt="Volume"
              className="p-2 hover:bg-slate-500 rounded-xl cursor-pointer"
            />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-20 accent-sky-400 cursor-pointer"
            />
          </div>
          <img
            src="/Assets/picture-in-picture-2.svg"
            alt="FullScreen"
            className=" p-2 hover:bg-slate-500 rounded-xl transition-transform cursor-pointer"
            onClick={() => setIsFullScreen(true)}
          />
        </div>
      </div>

      <FullScreenPlayer
        isVisible={isFullScreen}
        onClose={() => setIsFullScreen(false)}
      />
    </div>
  );
};

export default Player;
