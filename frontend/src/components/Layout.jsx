import Header from "./Header";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-10">
        {children}
      </main>
    </div>
  );
}