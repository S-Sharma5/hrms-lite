export default function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl border border-white/20 w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-white text-xl"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}