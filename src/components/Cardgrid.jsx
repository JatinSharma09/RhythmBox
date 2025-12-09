import React, { useState, useEffect } from "react";
import Card from "./Card";
import CardSkeleton from "./CardSkeleton";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

const CardGrid = ({ Data, title, loading = false, playSong, cleanTitle }) => {
  const dataToRender = Data || [];

  // Responsive Pagination State
  const [cardsPerPage, setCardsPerPage] = useState(4); // Default to mobile
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);

  // Update cards per page based on screen width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) { // sm breakpoint
        setCardsPerPage(7);
      } else {
        setCardsPerPage(4);
      }
      setCurrentPage(0); // Reset page on resize
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalPages = Math.ceil(dataToRender.length / cardsPerPage);

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

  const currentCards = dataToRender.slice(
    currentPage * cardsPerPage,
    (currentPage + 1) * cardsPerPage
  );

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

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">
          {title}
        </h2>

        {/* Navigation Arrows (Unified for Mobile & Desktop) */}
        {!loading && (
          <div className="flex items-center gap-2">
            {dataToRender.length > cardsPerPage && (
              <>
                <button
                  onClick={prevPage}
                  disabled={currentPage === 0}
                  className={`p-1 rounded-full transition-colors border border-white/10 ${currentPage === 0
                    ? 'text-gray-600 cursor-not-allowed'
                    : 'text-white hover:bg-white/10'
                    }`}
                  aria-label="Previous page"
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
                  aria-label="Next page"
                >
                  <MdChevronRight size={22} />
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {loading ? (
        <>
          {/* Mobile Skeleton */}
          <div className="sm:hidden flex flex-col gap-1">
            {[...Array(4)].map((_, index) => (
              <CardSkeleton key={`skeleton-mobile-${index}`} compact={true} />
            ))}
          </div>

          {/* Desktop Skeleton */}
          <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            {[...Array(7)].map((_, index) => (
              <div key={`skeleton-desktop-${index}`} className="w-full">
                <CardSkeleton compact={false} />
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Mobile: Compact List (4 items) */}
          <div className="sm:hidden w-full">
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              <motion.div
                key={`mobile-${currentPage}`}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "tween", ease: "easeInOut", duration: 0.2 }}
                className="flex flex-col gap-1"
              >
                {currentCards.map((item, index) => (
                  <Card
                    key={`${currentPage}-${index}`}
                    songData={item}
                    compact={true}
                    playSong={playSong}
                    cleanTitle={cleanTitle}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Desktop: Grid Layout (7 items) */}
          <div className="hidden sm:block w-full">
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              <motion.div
                key={`desktop-${currentPage}`}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "tween", ease: "easeInOut", duration: 0.2 }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4"
              >
                {currentCards.map((item, index) => (
                  <div key={`${currentPage}-${index}`} className="w-full">
                    <Card
                      songData={item}
                      compact={false}
                      playSong={playSong}
                      cleanTitle={cleanTitle}
                    />
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </>
      )}
    </div >
  );
};

export default CardGrid;