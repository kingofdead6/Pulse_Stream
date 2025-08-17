import React from "react";

const Hero = () => {
  // Function to scroll smoothly to the "lives" section
  const handleScroll = () => {
    const section = document.getElementById("lives");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute w-full h-full object-cover"
      >
        <source src="https://res.cloudinary.com/dtwa3lxdk/video/upload/v1755447122/5278-182817488_medium_zjhgtt.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay for neon effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/70 via-indigo-900/50 to-black/70"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-wide drop-shadow-[0_0_15px_rgba(168,85,247,0.9)]">
          PulseStream
        </h1>
        <p className="mt-4 text-lg md:text-2xl text-purple-200">
          Watch live events and replays anytime, anywhere
        </p>

        <button
          onClick={handleScroll}
          className="cursor-pointer mt-8 px-8 py-3 rounded-full bg-gradient-to-r from-fuchsia-500/50 via-purple-600/50 to-indigo-600/50 hover:scale-105 duration-300 transition transform shadow-[0_0_20px_rgba(192,132,252,0.7)]"
        >
          View Live Now
        </button>
      </div>
    </div>
  );
};

export default Hero;
