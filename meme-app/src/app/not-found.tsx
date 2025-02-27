"use client";
import React from "react";

const NotFound: React.FC = () => {
  const handleBackToMeme = () => {
    window.history.back();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white">
      <h1 className="text-6xl font-bold text-white">404</h1>
      <p className="mt-4 text-xl text-gray-700">
        Oops! The page you are looking for does not exist.
      </p>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 flex items-center"
        onClick={handleBackToMeme}
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 19l-7-7 7-7"
          ></path>
        </svg>
        Back to Meme
      </button>
    </div>
  );
};

export default NotFound;
