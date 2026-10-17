const AboutUs = () => {
  return (
    <div className="min-h-screen bg-[#FFF8E7] text-[#1A1A1A]">
      {/* Hero */}
      <section className="px-6 py-20 sm:px-10 lg:px-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.35em] text-[#C0392B] font-semibold">
              Aamir Cafe & Bakers
            </p>

            <h1 className="font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl font-semibold text-[#1A1A1A]">
              Since 1985 —
              <span className="block text-[#F5A623]">
                Baking Bannu's Memories
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-sm leading-7 text-[#6B4C2A]">
              For nearly four decades, Aamir Cafe & Bakers has been a part of
              Bannu's most precious moments. From wedding cakes and daily
              bakery to grand celebrations in our marriage hall — every
              detail is crafted with love.
            </p>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-2xl border border-[#F5A623]/25">
              <img
                src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1000&q=80"
                alt="Aamir Cafe"
                className="h-[430px] w-full object-cover"
              />
            </div>

            <div className="absolute -bottom-6 -left-6 hidden bg-[#1A1A1A] px-8 py-6 text-white sm:block rounded-2xl">
              <p className="text-3xl font-serif text-[#F5A623]">40+</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-white/60">
                Years of Taste
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="bg-[#FFFDF7] px-6 py-20 sm:px-10 lg:px-20 border-y border-[#F5A623]/20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-[#C0392B] font-semibold">
              About Us
            </p>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl text-[#1A1A1A] font-semibold">
              What Makes Us Different
            </h2>
          </div>

          <div className="grid gap-10 md:grid-cols-3">
            {[
              {
                title: 'Traditional Taste',
                text: 'Recipes passed down through generations — unchanged, uncompromised, unforgettable.',
              },
              {
                title: 'Every Event Matters',
                text: 'From intimate family occasions to grand wedding celebrations, every event receives careful attention.',
              },
              {
                title: 'Personal Attention',
                text: 'Our team works with you to understand your requirements and help create an event that feels truly special.',
              },
            ].map((item, i) => (
              <div key={i} className="border-t-2 border-[#F5A623] pt-6">
                <h3 className="text-lg font-semibold text-[#1A1A1A]">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#6B4C2A]">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-[#1A1A1A] px-6 py-20 text-white sm:px-10 lg:px-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#F5A623] font-semibold">
              Our Promise
            </p>
            <h2 className="mt-4 font-serif text-3xl leading-tight sm:text-4xl text-white font-semibold">
              Your Celebration,
              <span className="block text-[#F5A623]">Our Devotion.</span>
            </h2>
            <p className="mt-6 max-w-lg text-sm leading-7 text-white/60">
              We believe every celebration deserves great taste, thoughtful
              service and attention to detail. Aamir Cafe & Bakers is built
              to give you and your guests an experience worth remembering.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              'Fresh Daily',
              'Family Recipes',
              'Grand Hall',
              'Trusted Since 1985',
            ].map((label, i) => (
              <div
                key={i}
                className="border border-[#F5A623]/25 p-6 rounded-xl bg-[#0D0D0D]"
              >
                <p className="font-serif text-3xl text-[#F5A623]">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <p className="mt-3 text-sm text-white/70">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 text-center sm:px-10 bg-[#FFF8E7]">
        <p className="text-xs uppercase tracking-[0.3em] text-[#C0392B] font-semibold">
          Plan Your Event
        </p>
        <h2 className="mx-auto mt-3 max-w-2xl font-serif text-3xl sm:text-4xl text-[#1A1A1A] font-semibold">
          Let Us Be Part Of Your Special Day
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#6B4C2A]">
          Make your next celebration memorable with Aamir Cafe & Marriage Hall.
        </p>
        <a
          href="/booking"
          className="mt-8 inline-block bg-gradient-to-r from-[#F5A623] to-[#E8941A] px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A] rounded-full transition-all hover:shadow-[0_8px_25px_rgba(245,166,35,0.4)]"
        >
          Book Your Event
        </a>
      </section>
    </div>
  )
}

export default AboutUs