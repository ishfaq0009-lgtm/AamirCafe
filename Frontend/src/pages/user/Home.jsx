import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'motion/react'
import {
  ArrowRight,
  ArrowUpRight,
  Utensils,
  Coffee,
  Cake,
  Sparkles,
  Award,
  Star,
  Calendar,
  Flame,
  Tag,
} from 'lucide-react'

import {
  Reveal,
  RevealText,
  StaggerContainer,
  StaggerItem,
} from '../../components/Reveal.jsx'
import MagneticButton from '../../components/MagneticButton.jsx'
import { getHotDeals } from '../../api/deals.js'

import image2 from '../../assets/image2.jpg'
import imageFood1 from '../../assets/imageFood1.jpg'
import Sweetsimage from '../../assets/Sweetsimgae.jpg'
import cafeimage from '../../assets/cafeimage.jpg'

const Home = () => {
  const heroRef = useRef(null)
  const [hotDeals, setHotDeals] = useState([])

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '35%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0])

  useEffect(() => {
    ;(async () => {
      try {
        const res = await getHotDeals()
        if (res.success) setHotDeals(res.AllDeals || [])
      } catch (e) {
        /* silent */
      }
    })()
  }, [])

  const experiences = [
    {
      img: imageFood1,
      title: 'Signature Kitchen',
      label: 'Fast Food',
      link: '/fast-food',
      num: '01',
    },
    {
      img: Sweetsimage,
      title: 'Sweet Traditions',
      label: 'Sweets & Bakery',
      link: '/sweets',
      num: '02',
    },
    {
      img: cafeimage,
      title: 'The Café',
      label: 'Coffee & Tea',
      link: '/cafe',
      num: '03',
    },
    {
      img: image2,
      title: 'The Grand Hall',
      label: 'Marriage Hall',
      link: '/booking',
      num: '04',
    },
  ]

  return (
    <div className="relative bg-[#FFF8E7] text-[#1A1A1A] overflow-hidden">
      {/* ================= HERO ================= */}
      <section ref={heroRef} className="relative min-h-screen overflow-hidden">
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0"
        >
          <img
            src={image2}
            alt="Aamir Cafe & Marriage Hall"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/40 to-[#1A1A1A]/60" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/20" />
        </motion.div>

        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-[#F5A623]/60"
              style={{
                left: `${12 + i * 15}%`,
                top: `${25 + (i % 3) * 18}%`,
              }}
              animate={{ y: [0, -30, 0], opacity: [0.15, 0.7, 0.15] }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        <div className="relative z-10 min-h-screen mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-20 flex flex-col justify-center pt-32 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center gap-4 mb-10"
          >
            <span className="h-px w-14 bg-[#F5A623]" />
            <span className="text-[10px] font-medium uppercase tracking-[0.5em] text-[#F5A623]">
              Since 1985 · Bannu
            </span>
          </motion.div>

          <h1 className="font-serif max-w-[1000px] text-white">
            <span className="block text-[clamp(44px,6vw,84px)] leading-[1.02] font-light tracking-tight-display">
              <RevealText delay={0.3}>Bakers. Café.</RevealText>
            </span>
            <span className="mt-2 block text-[clamp(38px,5vw,72px)] leading-[1.08] font-light tracking-tight-display text-white/95">
              <RevealText delay={0.45}>Celebrations,</RevealText>
            </span>
            <span className="mt-1 block text-[clamp(38px,5vw,72px)] leading-[1.08] font-light tracking-tight-display text-[#F5A623]">
              <RevealText delay={0.6}>under one roof.</RevealText>
            </span>
          </h1>

          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            style={{ transformOrigin: 'left' }}
            className="mt-12 mb-8 h-px w-24 bg-gradient-to-r from-[#F5A623]/80 to-transparent"
          />

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="max-w-xl text-[15px] leading-[1.9] text-white/65 font-light"
          >
            Bannu's most loved bakery, café and marriage hall. Crafting the
            finest sweets, baked goods and unforgettable celebrations since
            1985.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.3 }}
            className="mt-12 flex flex-wrap gap-4"
          >
            <Link to="/booking">
              <MagneticButton className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-[#F5A623] to-[#E8941A] px-8 py-4 text-[11px] font-bold uppercase tracking-[0.25em] text-[#1A1A1A]">
                <span className="relative z-10">Book the Hall</span>
                <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </MagneticButton>
            </Link>

            <Link to="/deals">
              <MagneticButton
                as="a"
                className="group inline-flex items-center gap-3 rounded-full border border-white/25 bg-white/[0.05] px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-white backdrop-blur-xl transition-all hover:border-[#F5A623] hover:bg-[#F5A623]/10"
              >
                <span>View Deals</span>
                <Flame className="h-4 w-4 text-[#F5A623]" />
              </MagneticButton>
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="absolute bottom-8 right-6 sm:right-10 lg:right-20 hidden md:flex items-center gap-3"
        >
          <span className="h-px w-8 bg-white/20" />
          <p className="text-[9px] uppercase tracking-[0.5em] text-white/40">
            Bakery · Cafe · Hall
          </p>
        </motion.div>
      </section>

      {/* ================= MARQUEE ================= */}
      <section className="relative border-y border-[#F5A623]/25 bg-[#1A1A1A] py-8">
        <div className="overflow-hidden">
          <div
            className="flex whitespace-nowrap"
            style={{
              animation: 'marquee 40s linear infinite',
              width: 'max-content',
            }}
          >
            {[...Array(2)].map((_, k) => (
              <div key={k} className="flex">
                {[
                  'Bakers & Sweets',
                  'Grand Celebrations',
                  'Signature Kitchen',
                  'Artisan Bakery',
                  'Marriage Hall',
                  'Since 1985',
                ].map((t, i) => (
                  <span
                    key={`${k}-${i}`}
                    className="flex items-center gap-10 px-10 font-serif text-2xl sm:text-3xl lg:text-4xl text-white/20 italic font-light"
                  >
                    {t}
                    <Sparkles className="h-4 w-4 text-[#F5A623]" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= ⭐ HOT DEALS ================= */}
      {hotDeals.length > 0 && (
        <section className="relative py-24 sm:py-32 px-6 sm:px-10 lg:px-20 bg-[#FFF8E7]">
          <div className="mx-auto max-w-[1400px]">
            <div className="flex flex-col justify-between gap-6 mb-14 md:flex-row md:items-end">
              <div>
                <Reveal>
                  <div className="flex items-center gap-4 mb-6">
                    <span className="h-px w-12 bg-[#C0392B]" />
                    <span className="text-[11px] font-semibold uppercase tracking-[0.4em] text-[#C0392B]">
                      Hot Deals
                    </span>
                  </div>
                </Reveal>
                <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-tight font-light text-[#1A1A1A]">
                  <RevealText>Today's Best </RevealText>
                  <RevealText delay={0.1}>
                    <span className="italic text-[#C0392B]">Offers.</span>
                  </RevealText>
                </h2>
              </div>

              <Reveal delay={0.2}>
                <Link
                  to="/deals"
                  className="group inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#C0392B] hover:text-[#F5A623] transition"
                >
                  View All Deals
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </Reveal>
            </div>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotDeals.slice(0, 3).map((deal) => (
                <StaggerItem key={deal._id}>
                  <Link
                    to={`/deal/${deal._id}`}
                    className="group block rounded-2xl overflow-hidden border border-[#F5A623]/25 bg-[#FFFDF7] shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(107,76,42,0.12)] hover:border-[#F5A623]/60 relative"
                  >
                    <div className="absolute top-3 left-3 z-10 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#C0392B] to-[#8B2620] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
                      <Flame className="h-3 w-3" />
                      Hot Deal
                    </div>

                    <div className="relative overflow-hidden">
                      <img
                        src={deal.image || deal.items?.[0]?.image}
                        alt={deal.title}
                        className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>

                    <div className="p-6">
                      <h3 className="font-serif text-2xl font-semibold text-[#1A1A1A]">
                        {deal.title}
                      </h3>
                      <p className="text-sm text-[#6B4C2A] mt-2 line-clamp-2">
                        {deal.description}
                      </p>

                      <div className="mt-5 pt-4 border-t border-[#F5A623]/20 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-[#6B4C2A]/60 font-semibold">
                            Only
                          </p>
                          <p className="font-serif text-3xl font-bold text-[#C0392B]">
                            Rs. {Number(deal.dealPrice).toLocaleString()}
                          </p>
                        </div>
                        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#F5A623] to-[#E8941A] group-hover:scale-110 transition">
                          <Tag className="h-4 w-4 text-[#1A1A1A]" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      )}

      {/* ================= PHILOSOPHY ================= */}
      <section className="relative py-28 sm:py-40 px-6 sm:px-10 lg:px-20 bg-[#FDF6E3]">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1">
              <Reveal>
                <div className="flex items-center gap-4 mb-6">
                  <span className="h-px w-12 bg-[#F5A623]" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.4em] text-[#C0392B]">
                    Our Story
                  </span>
                </div>
              </Reveal>

              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.08] font-light text-[#1A1A1A]">
                <RevealText>Four decades of </RevealText>
                <br />
                <RevealText delay={0.1}>
                  taste &amp;{' '}
                  <span className="italic text-[#C0392B]">tradition.</span>
                </RevealText>
              </h2>

              <Reveal delay={0.3}>
                <p className="mt-8 text-base leading-8 text-[#6B4C2A] max-w-lg font-light">
                  Since 1985, Aamir has been a part of Bannu's most beloved
                  moments. From wedding cakes and daily bakery to grand
                  celebrations in our marriage hall — every detail is crafted
                  with devotion.
                </p>
              </Reveal>

              <Reveal delay={0.4}>
                <div className="mt-10 grid grid-cols-3 gap-6 pt-10 border-t border-[#F5A623]/25">
                  {[
                    { icon: Award, label: 'Trusted' },
                    { icon: Star, label: 'Top Rated' },
                    { icon: Calendar, label: 'Since 1985' },
                  ].map(({ icon: Icon, label }, i) => (
                    <div key={i} className="flex flex-col gap-3">
                      <Icon className="h-5 w-5 text-[#F5A623]" />
                      <span className="text-[10px] uppercase tracking-[0.2em] text-[#6B4C2A] font-semibold">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-7 order-1 lg:order-2 relative">
              <Reveal>
                <div className="relative">
                  <div className="aspect-[4/5] overflow-hidden rounded-2xl">
                    <img
                      src={cafeimage}
                      alt="Aamir Cafe interior"
                      className="h-full w-full object-cover transition-transform duration-[1.5s] hover:scale-105"
                    />
                  </div>

                  <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="absolute -bottom-8 -left-8 max-w-xs rounded-2xl bg-[#FFFDF7] p-6 border border-[#F5A623]/25 shadow-[0_12px_40px_rgba(107,76,42,0.12)]"
                  >
                    <p className="font-serif text-xl text-[#1A1A1A] italic font-normal">
                      "Aamir has been a part of our family's celebrations for
                      three generations."
                    </p>
                    <p className="mt-3 text-[10px] uppercase tracking-[0.3em] text-[#C0392B] font-semibold">
                      — Featured Review
                    </p>
                  </motion.div>

                  <div className="absolute -top-4 -right-4 w-24 h-24 border-t-2 border-r-2 border-[#F5A623]" />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ================= EXPERIENCES ================= */}
      <section className="relative py-24 sm:py-32 px-6 sm:px-10 lg:px-20 bg-[#FFF8E7]">
        <div className="mx-auto max-w-[1400px]">
          <div className="text-center mb-20">
            <Reveal>
              <div className="flex items-center justify-center gap-4 mb-6">
                <span className="h-px w-12 bg-[#F5A623]" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.4em] text-[#C0392B]">
                  Curated Experiences
                </span>
                <span className="h-px w-12 bg-[#F5A623]" />
              </div>
            </Reveal>

            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-tight font-light text-[#1A1A1A]">
              <RevealText>Discover our </RevealText>
              <RevealText delay={0.1}>
                <span className="italic text-[#C0392B]">worlds.</span>
              </RevealText>
            </h2>
          </div>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {experiences.map((exp, i) => (
              <StaggerItem key={i}>
                <Link to={exp.link} className="group block">
                  <div className="relative aspect-[4/3] md:aspect-auto md:h-[420px] overflow-hidden rounded-2xl">
                    <img
                      src={exp.img}
                      alt={exp.title}
                      className="h-full w-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />

                    <div className="absolute top-6 left-6 font-serif text-5xl text-[#F5A623]/40 font-light">
                      {exp.num}
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-8">
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.4em] text-[#F5A623] mb-2 font-semibold">
                            {exp.label}
                          </p>
                          <h3 className="font-serif text-3xl sm:text-4xl text-white leading-tight font-light">
                            {exp.title}
                          </h3>
                        </div>

                        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#F5A623]/50 backdrop-blur-sm transition-all duration-500 group-hover:bg-[#F5A623] group-hover:border-[#F5A623]">
                          <ArrowUpRight className="h-5 w-5 text-[#F5A623] transition group-hover:text-[#1A1A1A]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ================= CTA — MARRIAGE HALL ================= */}
      <section className="relative py-32 px-6 sm:px-10 lg:px-20 overflow-hidden bg-[#1A1A1A]">
        <div className="absolute inset-0">
          <img
            src={image2}
            alt="Marriage Hall"
            className="h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1A] via-[#1A1A1A]/70 to-[#1A1A1A]" />
        </div>

        <div className="relative mx-auto max-w-[1000px] text-center">
          <Reveal>
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className="h-px w-12 bg-[#F5A623]" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.4em] text-[#F5A623]">
                The Grand Hall
              </span>
              <span className="h-px w-12 bg-[#F5A623]" />
            </div>
          </Reveal>

          <h2 className="font-serif text-5xl sm:text-6xl lg:text-7xl leading-[1.05] font-light text-white">
            <RevealText>Your story deserves </RevealText>
            <br />
            <RevealText delay={0.1}>
              <span className="italic text-[#F5A623]">a grand stage.</span>
            </RevealText>
          </h2>

          <Reveal delay={0.3}>
            <p className="mt-8 text-lg leading-8 text-white/60 max-w-2xl mx-auto font-light">
              Host weddings, Walima, engagements and every celebration — in a
              venue designed to be unforgettable.
            </p>
          </Reveal>

          <Reveal delay={0.5}>
            <div className="mt-12">
              <Link to="/booking">
                <MagneticButton className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#F5A623] to-[#E8941A] px-10 py-5 text-[11px] font-bold uppercase tracking-[0.3em] text-[#1A1A1A] shadow-[0_0_40px_rgba(245,166,35,0.35)] transition-all hover:shadow-[0_0_60px_rgba(245,166,35,0.55)]">
                  Reserve the Hall
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </MagneticButton>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <section className="py-24 px-6 sm:px-10 lg:px-20 bg-[#FFF8E7] border-t border-[#F5A623]/20">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Utensils,
                title: 'Bakers & Sweets',
                text: 'Traditional sweets and freshly baked goods made daily since 1985.',
              },
              {
                icon: Coffee,
                title: 'The Café',
                text: 'Slow mornings and quiet evenings with signature brews and light bites.',
              },
              {
                icon: Cake,
                title: 'Celebration Cakes',
                text: 'Handcrafted cakes designed for your milestone moments.',
              },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="group relative rounded-2xl border border-[#F5A623]/20 bg-[#FFFDF7] p-8 transition-all duration-500 hover:border-[#F5A623]/50 hover:shadow-[0_15px_40px_rgba(107,76,42,0.1)]">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F5A623]/15 mb-6 transition-all duration-500 group-hover:bg-[#F5A623]/25 group-hover:scale-110">
                    <s.icon className="h-6 w-6 text-[#C0392B]" />
                  </div>
                  <h3 className="font-serif text-2xl text-[#1A1A1A] mb-3 font-normal">
                    {s.title}
                  </h3>
                  <p className="text-sm leading-7 text-[#6B4C2A] font-light">
                    {s.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home