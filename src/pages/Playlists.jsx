import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlayerContext } from "../context/PlayerContext";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import CardSkeleton from "../components/CardSkeleton";
import PlaylistCard from "../components/PlaylistCard";
import { motion, AnimatePresence } from "framer-motion";

// Pure Component handling display
export const PlaylistsContent = React.memo(({
  className,
  compact = false,
  title,
  homePlaylists,
  loading,
  cleanTitle
}) => {
  const navigate = useNavigate();

  // Pagination state for compact mode
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);
  const cardsPerPage = 4;

  const handlePlaylistClick = (playlist) => {
    navigate(`/playlist/${playlist.id}`, { state: { playlist } });
  };

  const totalPages = Math.ceil((homePlaylists?.length || 0) / cardsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setDirection(1);
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setDirection(-1);
      setCurrentPage(prev => prev - 1);
    }
  };

  const currentCards = homePlaylists?.slice(
    currentPage * cardsPerPage,
    (currentPage + 1) * cardsPerPage
  ) || [];

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? -50 : 50,
      opacity: 0,
    }),
  };

  if (loading && (!homePlaylists || homePlaylists.length === 0)) {
    if (compact) {
      return (
        <div className={`w-full ${className}`}>
          {/* Header Skeleton */}
          {title && (
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">
                {title}
              </h2>
            </div>
          )}

          {/* Mobile Skeleton */}
          <div className="sm:hidden flex flex-col gap-1">
            {[...Array(4)].map((_, i) => (
              <CardSkeleton key={i} compact={true} />
            ))}
          </div>

          {/* Desktop Skeleton - Horizontal */}
          <div className="hidden sm:flex overflow-x-hidden gap-3 pb-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-32">
                <CardSkeleton compact={false} />
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className={`w-full ${className}`}>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4 mb-40">
          {[...Array(12)].map((_, i) => (
            <CardSkeleton key={i} compact={false} />
          ))}
        </div>
      </div>
    );
  }

  // Compact mode for Home page
  if (compact) {
    return (
      <div className={`w-full ${className}`}>
        {/* Header Section */}
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">
              {title}
            </h2>

            {/* Mobile Arrows (Inline with header) */}
            <div className="sm:hidden flex items-center gap-2">
              {homePlaylists?.length > cardsPerPage && (
                <>
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 0}
                    className={`p-1 rounded-full transition-colors border border-white/10 ${currentPage === 0
                      ? 'text-gray-600 cursor-not-allowed'
                      : 'text-white hover:bg-white/10'
                      }`}
                    aria-label="Previous playlist page"
                  >
                    <MdChevronLeft size={22} />
                  </button>
                  <button
                    onClick={nextPage}
                    disabled={currentPage >= totalPages - 1}
                    className={`p-1 rounded-full transition-colors border border-white/10 ${currentPage >= totalPages - 1
                      ? 'text-gray-600 cursor-not-allowed'
                      : 'text-white hover:bg-white/10'
                      }`}
                    aria-label="Next playlist page"
                  >
                    <MdChevronRight size={22} />
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Mobile: Compact List (4 items) */}
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={`mobile-playlist-${currentPage}`}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "tween", ease: "easeInOut", duration: 0.2 }}
            className="sm:hidden flex flex-col gap-1"
          >
            {currentCards.map((playlist) => (
              <PlaylistCard
                key={playlist.id}
                playlist={playlist}
                compact={true}
                onClick={handlePlaylistClick}
                cleanTitle={cleanTitle}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Desktop: Horizontal Scroll */}
        <div className="hidden sm:flex overflow-x-auto gap-3 no-scrollbar pb-2">
          {homePlaylists?.slice(0, 8).map((playlist) => (
            <div key={playlist.id} className="flex-shrink-0 w-32">
              <PlaylistCard
                playlist={playlist}
                compact={false}
                onClick={handlePlaylistClick}
                cleanTitle={cleanTitle}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Full mode for Playlists page
  return (
    <div className={`w-full ${className}`}>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4 mb-40">
        {homePlaylists?.map((playlist) => (
          <PlaylistCard
            key={playlist.id}
            playlist={playlist}
            compact={false}
            onClick={handlePlaylistClick}
            cleanTitle={cleanTitle}
          />
        ))}
      </div>

      {(!homePlaylists || homePlaylists.length === 0) && (
        <div className="text-gray-400 text-center py-10">
          No playlists found.
        </div>
      )}
    </div>
  );
});

// Container Component connecting to Context
const Playlists = (props) => {
  const { cleanTitle, homePlaylists, loading } = useContext(PlayerContext);

  return (
    <PlaylistsContent
      {...props}
      cleanTitle={cleanTitle}
      homePlaylists={homePlaylists}
      loading={loading}
    />
  );
};

export default Playlists;
