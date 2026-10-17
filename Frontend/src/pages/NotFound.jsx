import { Link } from 'react-router-dom'

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF8E7] px-4">
    <p className="text-7xl font-serif text-[#F5A623]">404</p>
    <h1 className="mt-4 font-serif text-3xl text-[#1A1A1A] font-semibold">
      Page Not Found
    </h1>
    <p className="mt-2 text-sm text-[#6B4C2A]">
      The page you're looking for doesn't exist.
    </p>
    <Link
      to="/"
      className="mt-8 rounded-full bg-gradient-to-r from-[#F5A623] to-[#E8941A] px-8 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A] transition-all hover:shadow-[0_8px_25px_rgba(245,166,35,0.4)]"
    >
      Back to Home
    </Link>
  </div>
)

export default NotFound