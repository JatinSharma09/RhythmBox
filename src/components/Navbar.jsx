import React from 'react';
import { MdSearch } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="h-16 flex items-center justify-between px-4 md:px-8 bg-transparent z-30 sticky top-0">
      {/* Greeting */}
      <div className="hidden md:flex items-center gap-4">
        <h1 className="text-2xl font-display font-bold text-white tracking-tight">
          {getGreeting()}
        </h1>
      </div>

      {/* Search Bar */}
      <div className="flex items-center flex-1 max-w-md mx-4 md:mx-8">
        <div 
          onClick={() => navigate('/explore')}
          className="flex items-center gap-2 md:gap-3 bg-surface/50 hover:bg-surface/80 border border-white/5 rounded-full px-3 py-2 md:px-4 md:py-2.5 w-full transition-all cursor-text group"
        >
          <MdSearch className="text-gray-400 group-hover:text-white transition-colors flex-shrink-0" size={20} />
          <span className="text-xs md:text-sm text-gray-400 font-medium group-hover:text-white transition-colors truncate">
            Search songs...
          </span>
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-4">
        <button className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-surface hover:bg-white/10 transition-colors border border-white/5">
          <span className="font-bold text-xs text-primary">JS</span>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
