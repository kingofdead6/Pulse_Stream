import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-t from-gray-950 via-indigo-950 to-purple-950 text-white px-6 pt-14 pb-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        
        {/* Brand / About */}
        <div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500 bg-clip-text text-transparent">
            Pulse Stream
          </h2>
          <p className="mt-4 text-gray-400 text-sm leading-relaxed">
            Your gateway to live events, entertainment, and experiences around
            the world. Watch live or catch up on replays anytime.
          </p>

          {/* Download App Section */}
          {/* Download App Section */}
<div className="mt-6">
  <h3 className="text-lg font-semibold text-purple-300 mb-2">Get the App</h3>
  <a
    href="https://pulse-stream-file.vercel.app/PulseStream.apk"
    download="PulseStream.apk" // forces download instead of opening
  >
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
      alt="Download Pulse Stream"
      className="h-12"
    />
  </a>
</div>

        </div>

        {/* Empty spacer to balance layout */}
        <div></div>

        {/* Social Links */}
        <div className="flex flex-col items-start md:items-end space-y-4">
          <h3 className="text-lg font-semibold text-purple-300">
            Follow Us
          </h3>
          <div className="flex gap-4 mt-2">
            <a href="#" className="hover:text-pink-400 transition"><FaFacebookF size={20} /></a>
            <a href="#" className="hover:text-pink-400 transition"><FaTwitter size={20} /></a>
            <a href="#" className="hover:text-pink-400 transition"><FaInstagram size={20} /></a>
            <a href="#" className="hover:text-pink-400 transition"><FaLinkedin size={20} /></a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-12 pt-6 border-t border-gray-800 text-center text-sm text-gray-400">
        © {new Date().getFullYear()}{" "}
        <a
          href="https://www.softwebelevation.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-purple-400 transition"
        >
          SoftWebElevation
        </a>
        . All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
