import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-purple-900 via-indigo-900 to-black text-white text-center px-6">
      <h1 className="text-9xl font-extrabold tracking-widest drop-shadow-[0_0_25px_rgba(168,85,247,0.9)]">
        404
      </h1>
      <p className="mt-6 text-2xl md:text-3xl text-purple-300">
        Oops! The page you’re looking for doesn’t exist.
      </p>

      <Link
        to="/"
        className="mt-10 px-8 py-3 rounded-full bg-gradient-to-r from-fuchsia-500 via-purple-600 to-indigo-600 hover:scale-105 duration-300 transition transform shadow-[0_0_20px_rgba(192,132,252,0.7)]"
      >
        Back to Home
      </Link>

      {/* Subtle glow animation */}
      <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse -z-10"></div>
    </div>
  );
};

export default NotFound;
