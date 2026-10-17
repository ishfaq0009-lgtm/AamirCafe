import { Link } from 'react-router-dom'

/**
 * Logo — uses the brand logo.webp placed in /public.
 * The variant switches text colours for dark vs light backgrounds.
 * The size prop changes overall dimensions.
 */
const Logo = ({ variant = 'dark', size = 'md' }) => {
  const textColor = variant === 'light' ? 'text-white' : 'text-[#1A1A1A]'
  const subColor = variant === 'light' ? 'text-[#F5A623]' : 'text-[#C0392B]'

  const sizes = {
    sm: { img: 'h-9', title: 'text-xl', sub: 'text-[8px]' },
    md: { img: 'h-11', title: 'text-[24px]', sub: 'text-[9px]' },
    lg: { img: 'h-16', title: 'text-3xl', sub: 'text-[10px]' },
  }
  const s = sizes[size] || sizes.md

  return (
    <Link
      to="/"
      className="group inline-flex items-center gap-3 leading-none select-none"
    >
      <img
        src="/logo.webp"
        alt="Aamir Cafe & Bakers Logo"
        className={`${s.img} w-auto object-contain transition-transform duration-500 group-hover:scale-105`}
        loading="eager"
        draggable={false}
      />

      <div className="flex flex-col justify-center">
        <h1
          className={`font-serif ${s.title} tracking-[0.18em] font-semibold ${textColor} transition-all duration-500 group-hover:tracking-[0.24em]`}
        >
          AAMIR
        </h1>
        <p className={`mt-0.5 ${s.sub} uppercase tracking-[0.42em] ${subColor}`}>
          Cafe · Bakers · Hall
        </p>
      </div>
    </Link>
  )
}

export default Logo