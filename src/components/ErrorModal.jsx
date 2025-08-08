import React from "react";

export default function ErrorModal({ open, onClose, title = "Error", message = "An error occurred.", buttonText = "OK" }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-slate-900 rounded-2xl shadow-2xl px-8 py-10 w-full max-w-md text-center animate-fadeInUp">
        {/* Animated X icon */}
        <div className="flex justify-center mb-4">
          <span className="inline-flex items-center justify-center rounded-full border-4 border-red-300 bg-slate-800 w-24 h-24 animate-pop">
            <svg className="w-14 h-14 text-red-400" fill="none" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="3" className="opacity-30" />
              <path d="M16 16l16 16M32 16L16 32" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </span>
        </div>
        <h2 className="text-2xl font-bold text-red-300 mb-2">{title.toLowerCase()}</h2>
        <p className="text-slate-200 mb-6">{message}</p>
        <button
          onClick={onClose}
          className="px-8 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold text-lg shadow transition"
        >
          {buttonText}
        </button>
      </div>
      {/* Animations */}
      <style>{`
        .animate-fadeInUp {
          animation: fadeInUp 0.3s cubic-bezier(.4,0,.2,1);
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .animate-pop {
          animation: pop 0.4s cubic-bezier(.4,0,.2,1);
        }
        @keyframes pop {
          0% { transform: scale(0.7);}
          70% { transform: scale(1.15);}
          100% { transform: scale(1);}
        }
      `}</style>
    </div>
  );
}