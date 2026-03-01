import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-black/30 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center">
        <Link
          to="/"
          className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
        >
          HRMS
        </Link>
      </div>
    </header>
  );
}