import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className="hidden md:flex flex-col gap-7 w-[17%] h-auto bg-[#212124] p-3"
        id="navbar"
      >
        {/* Profile Section */}
        <div className="profile flex justify-between items-center h-12 p-3 mt-1 rounded-lg hover:bg-[#4C4E54]">
          <img src="../Assets/User-Picture.svg" alt="User" className="h-6 w-6" />
          <img src="../Assets/Icon-Ellipsis.svg" alt="Menu" className="h-6 w-6" />
        </div>

        {/* Main Navigation */}
        <div className="nav-section-1 flex flex-col gap-1">
          <Link to="/">
            <div className="p-3 rounded-lg leading-6 hover:bg-[#4c4e54]">Home</div>
          </Link>
          <Link to="/explore">
            <div className="p-3 rounded-lg leading-6 hover:bg-[#4c4e54]">Explore</div>
          </Link>
        </div>

        {/* Collections Section */}
        <div className="nav-section-2">
          <div className="text-xs text-[#9898A6] font-medium mb-1">MY COLLECTIONS</div>
          <Link to="/playlists">
            <div className="flex items-center gap-2 px-3 py-2 mt-2 rounded-lg hover:bg-[#4c4e54]">
              <img src="../Assets/Icon-Playlists.svg" alt="Playlists Icon" />
              <label className="cursor-pointer">Playlists</label>
            </div>
          </Link>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 z-50 w-full bg-[#212124] flex justify-around items-center p-2 md:hidden">
        <Link to="/" className="flex flex-col items-center justify-center">
          <img src="../Assets/house.svg" alt="Home" className="h-6 w-6" />
          <div className="text-xs leading-6 mt-1">Home</div>
        </Link>
        <Link to="/explore" className="flex flex-col items-center justify-center">
          <img src="../Assets/Search.svg" alt="Queue" className="h-6 w-6" />
          <div className="text-xs leading-6 mt-1">Explore</div>
        </Link>
        <Link to="/playlists" className="flex flex-col items-center justify-center">
          <img src="../Assets/list-music.svg" alt="Playlist" className="h-6 w-6" />
          <div className="text-xs leading-6 mt-1">Playlists</div>
        </Link>
      </div>
    </>
  );
};

export default Sidebar;
