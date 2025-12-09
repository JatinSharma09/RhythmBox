import React, { useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlayerContext } from "../context/PlayerContext";
import { AudioPlaybackStateContext } from "../context/AudioPlaybackStateContext";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableFullScreenQueueItem from "./SortableFullScreenQueueItem";
import { MdShuffle, MdRepeat, MdRepeatOne, MdKeyboardArrowDown, MdQueueMusic, MdSkipNext, MdSkipPrevious } from "react-icons/md";
import { FaPlay, FaPause } from "react-icons/fa6";

const FullScreenPlayer = ({
  isVisible,
  onClose,
}) => {
  const {
    queue,
    isPlaying,
    togglePlayPause,
    playSong,
    audioRef,
    cleanTitle,
    currentSong,
    playNextSong,
    playPreviousSong,
    currentSongIndex,
    shuffle,
    toggleShuffle,
    repeat,
    toggleRepeat,
    reorderQueue,
    toggleFavorite,
    favorites
  } = useContext(PlayerContext);

  const { currentTime, duration } = useContext(AudioPlaybackStateContext);
  const [showQueue, setShowQueue] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = queue.findIndex((item) => item.id === active.id);
      const newIndex = queue.findIndex((item) => item.id === over.id);

      const newQueue = arrayMove(queue, oldIndex, newIndex);
      reorderQueue(newQueue);
    }
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
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

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "100%" }}
          transition={{ duration: 0.4, ease: "circOut" }}
          className="fixed inset-0 z-50 bg-[#0F0F0F]"
        >
          {/* Background Blur */}
          <div
            className="absolute inset-0 blur-3xl opacity-30 scale-110"
            style={{
              backgroundImage: `url(${currentSong?.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-[#0F0F0F]/90 to-[#0F0F0F]" />

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-4">
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors"
              >
                <MdKeyboardArrowDown size={28} />
              </button>
              <span className="text-xs font-medium tracking-widest uppercase text-white/60">Now Playing</span>
              <button
                onClick={() => setShowQueue(!showQueue)}
                className={`p-2 rounded-full transition-colors md:hidden ${showQueue ? 'bg-primary/20 text-primary' : 'bg-white/5 hover:bg-white/10 text-white'}`}
              >
                <MdQueueMusic size={24} />
              </button>
              <div className="w-10 hidden md:block" />
            </div>

            {/* Mobile Layout */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">

              {/* Main Player Section (Mobile: Full width, Desktop: Left 55%) */}
              <div className={`flex flex-col items-center justify-center px-6 md:px-12 md:w-[55%] ${showQueue ? 'hidden md:flex' : 'flex'}`}>
                {/* Album Art */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-full max-w-[280px] md:max-w-[320px] aspect-square mb-8"
                >
                  <img
                    src={currentSong?.image}
                    alt="Album Art"
                    className="w-full h-full rounded-2xl object-cover shadow-2xl"
                  />
                </motion.div>

                {/* Song Info */}
                <div className="w-full max-w-[320px] md:max-w-[400px] text-center mb-6">
                  <div className="flex items-center justify-center gap-3">
                    <div className="flex-1 min-w-0 ml-10">
                      <h1 className="text-xl md:text-2xl font-bold text-white truncate">
                        {cleanTitle(currentSong?.title)}
                      </h1>
                      <h2 className="text-base md:text-lg text-gray-400 truncate mt-1">
                        {currentSong?.artist}
                      </h2>
                    </div>
                    <button
                      onClick={() => toggleFavorite(currentSong)}
                      className={`p-2 rounded-full flex-shrink-0 transition-colors ${favorites.some(f => f.id === currentSong?.id)
                          ? 'text-red-500'
                          : 'text-gray-400 hover:text-white'
                        }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill={favorites.some(f => f.id === currentSong?.id) ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full max-w-[320px] md:max-w-[400px] mb-8">
                  <div className="relative h-1 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full bg-white rounded-full"
                      style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
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
                  <div className="flex justify-between mt-2 text-xs text-gray-400">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-8 md:gap-10 mb-8">
                  <button
                    onClick={toggleShuffle}
                    className={`p-2 transition-colors ${shuffle ? 'text-primary' : 'text-gray-400 hover:text-white'}`}
                  >
                    <MdShuffle size={24} />
                  </button>

                  <button
                    onClick={playPreviousSong}
                    className="text-white hover:scale-110 transition-transform"
                  >
                    <MdSkipPrevious size={32} />
                  </button>

                  <button
                    onClick={togglePlayPause}
                    className="bg-white text-black rounded-full p-4 hover:scale-105 transition-transform shadow-xl"
                  >
                    {isPlaying ? (
                      <FaPause className="w-7 h-7 md:w-8 md:h-8 text-black" />
                    ) : (
                      <FaPlay className="w-7 h-7 md:w-8 md:h-8 text-black pl-0.5" />
                    )}
                  </button>

                  <button
                    onClick={playNextSong}
                    className="text-white hover:scale-110 transition-transform"
                  >
                    <MdSkipNext size={32} />
                  </button>

                  <button
                    onClick={toggleRepeat}
                    className={`p-2 transition-colors ${repeat > 0 ? 'text-primary' : 'text-gray-400 hover:text-white'}`}
                  >
                    {repeat === 2 ? <MdRepeatOne size={24} /> : <MdRepeat size={24} />}
                  </button>
                </div>
              </div>

              {/* Queue Section (Mobile: Conditional, Desktop: Right 45%) */}
              <div className={`flex-1 flex flex-col md:w-[45%] bg-black/20 md:bg-transparent ${showQueue ? 'flex min-h-0' : 'hidden md:flex'}`}>
                <div className="p-4 md:p-6 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">Up Next</h3>
                  <span className="text-sm text-gray-400">{queue.length} songs</span>
                </div>
                <div className="flex-1 overflow-y-auto px-4 pb-24 md:pb-6 custom-scrollbar">
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={queue.map(item => item.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-2">
                        {queue?.length > 0 ? (
                          queue.map((song, index) => {
                            const isCurrent = currentSong?.id === song.id && currentSongIndex === index;
                            return (
                              <SortableFullScreenQueueItem
                                key={song.id}
                                song={song}
                                index={index}
                                isCurrent={isCurrent}
                                playSong={playSong}
                                cleanTitle={cleanTitle}
                              />
                            );
                          })
                        ) : (
                          <div className="text-center py-12 text-gray-500">
                            <p>Queue is empty</p>
                          </div>
                        )}
                      </div>
                    </SortableContext>
                  </DndContext>
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
