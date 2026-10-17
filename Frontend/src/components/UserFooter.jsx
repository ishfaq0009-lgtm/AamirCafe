import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import Logo from './Logo.jsx'
import Marquee from './Marquee.jsx'

const UserFooter = () => {
  return (
    <footer className="relative bg-[#1A1A1A] text-[#FFF8E7] overflow-hidden">
      {/* Top Marquee */}
      <div className="border-y border-[#F5A623]/20 py-5 bg-[#0D0D0D]">
        <Marquee
          items={[
            'RESERVE YOUR TABLE',
            'CELEBRATE WITH US',
            'BOOK THE HALL',
            'TASTE THE FINEST',
            'AAMIR CAFE & BAKERS',
            'SINCE 1985',
          ]}
          className="text-[11px] font-semibold uppercase tracking-[0.4em] text-[#F5A623]/80"
        />
      </div>

      <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-16 pt-20 pb-12">
        <div className="grid gap-14 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-5">
            <Logo variant="light" />
            <p className="mt-6 max-w-md text-sm leading-7 text-[#FFF8E7]/60">
              Since 1985, Aamir Cafe & Bakers has been serving Bannu's finest
              bakery, café and celebration venue — where every dish is crafted
              with love and every event becomes a memory.
            </p>

            <div className="mt-8 flex gap-3">
              {['Facebook', 'Instagram', 'LinkedIn'].map((s) => (
                <a
                  key={s}
                  href="#"
                  aria-label={s}
                  className="group flex h-11 w-11 items-center justify-center rounded-full border border-[#F5A623]/20 transition-all duration-300 hover:border-[#F5A623] hover:bg-[#F5A623]/10"
                >
                  <ArrowUpRight className="h-4 w-4 text-[#FFF8E7]/60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#F5A623]" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="lg:col-span-2">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#F5A623]">
              Explore
            </h3>
            <div className="mt-6 space-y-3 text-sm">
              {[
                { to: '/', label: 'Home' },
                { to: '/about', label: 'About' },
                { to: '/fast-food', label: 'Menu' },
                { to: '/packages', label: 'Packages' },
                { to: '/booking', label: 'Reserve Hall' },
              ].map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="group flex items-center gap-2 text-[#FFF8E7]/50 transition hover:text-[#F5A623]"
                >
                  <span className="w-0 h-px bg-[#F5A623] transition-all duration-300 group-hover:w-3" />
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#F5A623]">
              Services
            </h3>
            <div className="mt-6 space-y-3 text-sm">
              {['Weddings', 'Walima', 'Engagements', 'Birthday Parties'].map(
                (l) => (
                  <p key={l} className="text-[#FFF8E7]/50">
                    {l}
                  </p>
                )
              )}
            </div>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#F5A623]">
              Visit Us
            </h3>
            <div className="mt-6 space-y-5 text-sm">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#FFF8E7]/30">
                  Location
                </p>
                <p className="mt-1.5 text-[#FFF8E7]/70 leading-6">
                  Aamir Cafe & Marriage Hall
                  <br />
                  Bannu, Pakistan
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#FFF8E7]/30">
                  Reservations
                </p>
                <a
                  href="tel:+9200000000"
                  className="mt-1.5 block text-[#FFF8E7]/70 hover:text-[#F5A623] transition"
                >
                  +92 XXX XXXXXXX
                </a>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#FFF8E7]/30">
                  Email
                </p>
                <a
                  href="mailto:info@aamircafe.com"
                  className="mt-1.5 block text-[#FFF8E7]/70 hover:text-[#F5A623] transition"
                >
                  info@aamircafe.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-20 flex flex-col items-center justify-between gap-4 border-t border-[#F5A623]/10 pt-8 sm:flex-row">
          <p className="text-xs text-[#FFF8E7]/30">
            © {new Date().getFullYear()} Aamir Cafe & Bakers — Since 1985. All Rights Reserved.
          </p>
          <p className="text-xs text-[#FFF8E7]/30">
            Bakers & Sweets · Marriage Hall · Cafe
          </p>
        </div>
      </div>
    </footer>
  )
}

export default UserFooter