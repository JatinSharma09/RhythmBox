import React from 'react';

const Navbar = () => {
  return (
    <div className="top-nav flex gap-2 justify-around md:justify-between items-center py-4 px-4 md:px-8 lg:px-12">
      {/* Navigation Arrows */}
      <div className="flex gap-1">
        <div className="h-10 w-10 bg-[#1F1F22] rounded-full flex justify-center items-center hover:scale-125 transition">
          <img src="../Assets/Icon-Arrow-Left.svg" alt="left-arrow" className="h-4 w-4" />
        </div>

        <div
          className="h-10 w-10 bg-[#1F1F22] rounded-full flex justify-center items-center hover:scale-125 transition"
          id="playlistShow"
        >
          <img src="../Assets/Icon-Arrow-Right.svg" alt="right-arrow" className="h-4 w-4" />
        </div>
      </div>

      {/* Search and Button */}
      <div className="flex items-center gap-2">
        {/* Search Bar */}
        <div className="relative w-[200px] sm:w-[260px] md:w-[300px] lg:w-[365px]">
          <input
            type="text"
            placeholder="Search"
            id="search-box"
            className="h-9 w-full rounded-xl outline-none p-3 bg-[#1F1F22] border border-[#ebebff10] pl-8 text-sm text-white"
          />
          <div className="absolute inset-y-0 left-0 pl-2 flex items-center">
            <img src="../Assets/Search.svg" className="h-4 w-4" alt="search" />
          </div>

          {/* Suggestions Dropdown */}
          <ul
            id="suggestions"
            className="absolute bg-[#303031] w-full p-2 rounded-lg shadow-lg mt-1 max-h-40 overflow-y-auto z-10 hidden"
          ></ul>
        </div>

        {/* Icon Button */}
        {/* <div className="h-10 w-10 bg-[#1F1F22] rounded-full flex justify-center items-center">
          <img
            src="../Assets/Icon-Arrow-Left.svg"
            alt="left-arrow"
            className="h-4 w-4"
            id="search-btn"
          />
        </div> */}
      </div>
    </div>
  );
};

export default Navbar;
