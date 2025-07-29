import React, { useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlayerContext } from "../context/PlayerContext";
import { AudioPlaybackStateContext } from "../context/AudioPlaybackStateContext";

const FullScreenPlayer = ({
  isVisible,
  onClose,
}) => {
  // Consume stable values from PlayerContext
  const {
    queue,
    isPlaying,
    togglePlayPause,
    playSong,
    audioRef,
    cleanTitle,
    currentSong,
    playNextSong,     // NEW: Get playNextSong
    playPreviousSong, // NEW: Get playPreviousSong
    currentSongIndex // Also get currentSongIndex for highlighting in queue
  } = useContext(PlayerContext);

  // console.log("Fullscreen Player Renderd");

  // Consume frequently changing values from AudioPlaybackStateContext
  const { currentTime, duration } = useContext(AudioPlaybackStateContext);
  // console.log(1);
  
  // Handle seeking (dragging the progress bar)
  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
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
  // console.log("Queue:",queue);
  

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "100%" }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 bg-[#1F1F22] overflow-y-auto"
        >
          {/* Background Blur Behind Album */}
          <div
            className="absolute inset-0 blur-md opacity-30"
            style={{
              backgroundImage: `url(${currentSong?.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          {/* Overlay Content */}
          <div className="relative z-10">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white text-2xl hover:text-red-400 cursor-pointer"
            >
              ✕
            </button>

            {/* Main Layout */}
            <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-2 p-6 md:p-10">
              {/* Song Image + Info */}
              <div className="flex flex-col w-full md:mt-12 gap-3 items-center md:justify-center md:items-center text-white md:w-1/2">
                <img
                  src={currentSong?.image}
                  alt="Album Art"
                  className="rounded-2xl w-60 h-60 md:w-80 md:h-80 object-cover shadow-2xl"
                  loading="lazy"
                />
                <div className="flex flex-col justify-center items-center mt-4 text-center md:text-left">
                  <h1 className="text-2xl md:text-3xl font-bold">
                    {cleanTitle(currentSong?.title)}
                  </h1>
                  <h2 className="text-md md:text-lg text-gray-400 mt-1">
                    {currentSong?.artist}
                  </h2>
                </div>

                {/* Play/Pause Buttons */}
                <div className="flex items-center justify-center gap-5 md:gap-6">
                  {/* Previous Button */}
                  <img
                    src="/assets/Icon-Rewind-Filled.svg"
                    alt="Prev"
                    className="h-6 w-6 md:h-5 md:w-5 hover:opacity-80 cursor-pointer"
                    onClick={playPreviousSong} // Call playPreviousSong
                    loading="lazy"
                  />
                  {/* Play/Pause Button */}
                  {isPlaying ? (
                    <img
                      src="/assets/pause.svg"
                      alt="Pause"
                      className="h-10 w-10 md:h-8 md:w-8 hover:scale-110 cursor-pointer"
                      onClick={togglePlayPause}
                      loading="lazy"
                    />
                  ) : (
                    <img
                      src="/assets/Icon-Play-Filled (1).svg"
                      alt="Play"
                      className="h-10 w-10 md:h-8 md:w-8 hover:scale-110 cursor-pointer"
                      onClick={togglePlayPause}
                      loading="lazy"
                    />
                  )}
                  {/* Next Button */}
                  <img
                    src="/assets/Icon-Forward-Filled.svg"
                    alt="Next"
                    className="h-6 w-6 md:h-5 md:w-5 hover:opacity-80 cursor-pointer"
                    onClick={playNextSong} // Call playNextSong
                    loading="lazy"
                  />
                </div>

                {/* Progress Bar */}
                <div className="flex flex-row items-center gap-3 mt-2 w-full md:w-[60%]">
                  <span className="text-xs text-white">
                    {formatTime(currentTime)}
                  </span>
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1 accent-sky-400 cursor-pointer"
                  />
                  <span className="text-xs text-white">
                    {formatTime(duration)}
                  </span>
                </div>
              </div>

              {/* Queue Section */}
              <div className="w-full md:w-1/2 ">
                <h2 className="text-white text-xl font-semibold mb-4 text-center md:text-left">
                  Up Next
                </h2>
                <div className="bg-white bg-opacity-5 backdrop-blur-md rounded-2xl p-4 h-[400px] md:h-[500px] overflow-y-auto space-y-4 custom-scrollbar">
                  {queue?.length > 0 ? (
                    queue.map((song, index) => {
                      // Highlight the current playing song in the queue
                      const isCurrent = currentSong?.id === song.id && currentSongIndex === index;
                      // console.log(song);
                      
                      return (
                        <motion.div
                          key={song.id || index}
                          whileHover={{ scale: 1.03 }}
                          className={`flex items-center gap-3 rounded-xl p-2 cursor-pointer transition ${
                            isCurrent
                              ? "bg-[#5C5C5E] border-l-4 border-green-500 shadow-md"
                              : "bg-[#3A3A3C] hover:bg-[#4C4C4E]"
                          }`}
                          onClick={() => {
                            // When clicking a song in the queue, use playSong
                            // The playSong function will handle setting currentSong and currentSongIndex
                            playSong({
                              id: song.id,
                              title: song.name || song?.title,
                              artist: song.artists?.primary?.[0]?.name || song?.artist,
                              album: song.album?.name || song?.album,
                              image: song.image?.[2]?.url || song?.image,
                              url: song.downloadUrl?.[4]?.url || song?.url,
                            });
                          }}
                        >
                          <img
                            src={song.image?.[1]?.url || song?.image}
                            // alt={song.name}
                            className="h-12 w-12 rounded-md object-cover"
                            loading="lazy"
                          />
                          <div className="text-white overflow-hidden">
                            <p className="truncate font-medium">{cleanTitle(song?.name || song?.title)}</p>
                            <p className="text-sm text-gray-400 truncate">
                              {song.artists?.primary?.[0]?.name || song?.artist}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })
                  ) : (
                    <p className="text-gray-400 text-center">
                      No songs in queue.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FullScreenPlayer;
