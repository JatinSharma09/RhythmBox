import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div
      className="flex items-center justify-center min-h-screen bg-black text-white p-4 font-inter"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      <div className="text-center bg-gray-800 bg-opacity-70 p-8 md:p-12 rounded-xl shadow-2xl max-w-md mx-auto transform hover:scale-105 transition-transform duration-300 ease-in-out border border-gray-700">
        <h1 className="text-8xl md:text-9xl font-extrabold text-green-500 mb-4 drop-shadow-lg">
          404
        </h1>
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-100">
          Page Not Found
        </h2>
        <p className="text-lg text-gray-300 mb-8 leading-relaxed">
          Oops! The page you're looking for doesn't exist or has been moved.
          Don't worry, we'll help you get back on track.
        </p>
        <Link
          to="/" // Link back to your home page
          className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75"
        >
          Go to Homepage
          <svg
            className="ml-2 -mr-1 w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
