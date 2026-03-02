import { useEffect } from "react";

export default function Modal({ children, onClose }) {
  // Close on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
    >
      {/* Background Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div
        className="
          relative
          w-full max-w-md
          p-8
          rounded-2xl
          bg-gradient-to-br
          from-purple-500/20
          via-indigo-500/20
          to-purple-700/20
          backdrop-blur-xl
          border border-purple-300/30
          shadow-2xl
          transform transition-all duration-300
          scale-100
        "
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white text-xl transition"
        >
          ✕
        </button>

        {children}
      </div>
    </div>
  );
}