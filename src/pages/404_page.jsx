import React, { useState } from 'react';

const NotFoundPage = () => {
  const [showPopup, setShowPopup] = useState(false);

  const handleBeamMeHome = (e) => {
    e.preventDefault();
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f111f]">
      <div className="w-full max-w-lg mx-auto text-center p-8 rounded-2xl shadow-2xl bg-[#23263a] border border-[#101828]">
        <img
          src="/Security_Research.gif"
          alt="404 Not Found"
          className="h-48 w-auto mx-auto mb-6 rounded-xl shadow-lg border border-[#101828] bg-[#101828] object-contain"
          style={{ background: "#101828" }}
        />
        <h1 className="text-5xl font-extrabold text-[#8200db] mb-3 tracking-tight">404</h1>
        <h2 className="text-2xl font-bold text-white mb-2">Lost in Space?</h2>
        <p className="text-lg text-gray-300 mb-6">
          Oops! Looks like you've wandered into an unknown part of the DuesPay universe.<br />
          <span className="text-[#8200db] font-semibold">This page doesn't exist</span>... or maybe it's just hiding from you.<br />
          <span className="italic text-gray-400">Don't worry, even astronauts get lost sometimes.</span>
        </p>
        <button
          onClick={handleBeamMeHome}
          className="inline-block px-8 py-3 bg-[#8200db] text-white rounded-xl font-semibold shadow hover:bg-purple-700 transition-colors"
        >
          🚀 Beam Me Home
        </button>
        {showPopup && (
          <div className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 bg-[#23263a] border border-[#8200db] text-white px-6 py-4 rounded-2xl shadow-2xl mt-6 animate-bounce">
            Hehe, this doesn't do anything. Find your way around yourself!
          </div>
        )}
      </div>
    </div>
  );
};

export default NotFoundPage;