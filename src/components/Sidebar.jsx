import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MdHomeFilled, 
  MdExplore, 
  MdLibraryMusic, 
  MdMenu, 
  MdChevronLeft,
  MdHistory,
  MdFavorite,
  MdRecommend
} from 'react-icons/md';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', icon: MdHomeFilled, label: 'Home' },
    { path: '/explore', icon: MdExplore, label: 'Explore' },
    { path: '/foryou', icon: MdRecommend, label: 'For You' },
    { path: '/playlists', icon: MdLibraryMusic, label: 'Playlists' },
    { path: '/favorites', icon: MdFavorite, label: 'Favorites' },
    { path: '/history', icon: MdHistory, label: 'History' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.div
        animate={{ width: isCollapsed ? '80px' : '240px' }}
        className="hidden md:flex flex-col h-full bg-surface/50 backdrop-blur-xl border-r border-white/5 relative z-40 transition-all duration-300"
      >
        {/* Header / Toggle */}
        <div className="p-4 flex items-center justify-between h-16">
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-display font-bold text-xl text-primary tracking-wide"
              >
                RhythmBox
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            {isCollapsed ? <MdMenu size={24} /> : <MdChevronLeft size={24} />}
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-3 py-4 space-y-2">
          {navItems.map((item) => (
            <Link to={item.path} key={item.path}>
              <div
                className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                  isActive(item.path)
                    ? 'bg-primary/20 text-primary'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {isActive(item.path) && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-primary/10 rounded-xl"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon size={24} className={isActive(item.path) ? 'text-primary' : ''} />
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="font-medium whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </Link>
          ))}
        </div>

        {/* User Profile (Collapsed/Expanded) */}
        <div className="p-4 border-t border-white/5">
          <div className={`flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer transition-colors ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-xs font-bold">
              JS
            </div>
            {!isCollapsed && (
              <div className="flex-1 overflow-hidden">
                <div className="text-sm font-medium truncate">Jatin Sharma</div>
                <div className="text-xs text-gray-400 truncate">Premium</div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 z-50 w-full bg-surface/90 backdrop-blur-xl border-t border-white/10 flex justify-around items-center p-2 md:hidden pb-safe">
        {navItems.map((item) => (
          <Link to={item.path} key={item.path} className="flex flex-col items-center justify-center p-2 w-full">
            <div className={`p-1 rounded-full transition-colors ${isActive(item.path) ? 'text-primary' : 'text-gray-400'}`}>
              <item.icon size={24} />
            </div>
            <span className={`text-[10px] mt-1 font-medium ${isActive(item.path) ? 'text-primary' : 'text-gray-500'}`}>
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </>
  );
};

export default Sidebar;
