const Contact = () => {
  return (
    <div className="min-h-screen bg-[#FFF8E7] text-[#1A1A1A]">
      <section className="px-5 py-16 sm:px-8 sm:py-20 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-7xl">
          {/* Heading */}
          <div className="mb-14">
            <p className="text-xs uppercase tracking-[0.35em] text-[#C0392B] font-semibold">
              Get In Touch
            </p>

            <div className="mt-4 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <h1 className="max-w-3xl font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl font-semibold">
                Let's Talk About
                <span className="block text-[#F5A623]">
                  Your Special Event
                </span>
              </h1>
              <p className="max-w-md text-sm leading-7 text-[#6B4C2A]">
                Planning a wedding, Walima, Mehndi or any special celebration?
                We are here to help you.
              </p>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid overflow-hidden border border-[#F5A623]/25 bg-[#FFFDF7] lg:grid-cols-[0.85fr_1.15fr] rounded-2xl">
            {/* Left Side */}
            <div className="relative min-h-[600px] overflow-hidden bg-[#1A1A1A] p-8 text-white sm:p-10 lg:p-12">
              <img
                src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=900&q=80"
                alt="Aamir Marriage Hall"
                className="absolute inset-0 h-full w-full object-cover opacity-35"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-black/30" />

              <div className="relative z-10 flex h-full flex-col justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[#F5A623] font-semibold">
                    Aamir Cafe & Bakers
                  </p>
                  <h2 className="mt-5 max-w-md font-serif text-4xl leading-tight sm:text-5xl font-semibold">
                    Your Event
                    <span className="block text-[#F5A623]">
                      Starts Here.
                    </span>
                  </h2>
                </div>

                <div className="mt-12 space-y-5">
                  {[
                    {
                      icon: '📍',
                      label: 'Address',
                      value: 'Aamir Cafe & Marriage Hall, Bannu',
                    },
                    { icon: '☎', label: 'Phone', value: '+92 XXX XXXXXXX' },
                    {
                      icon: '✉',
                      label: 'Email',
                      value: 'info@aamircafe.com',
                    },
                  ].map((c, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 border border-[#F5A623]/20 bg-black/25 p-4 backdrop-blur-sm rounded-xl"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#F5A623]/40 text-[#F5A623] rounded-lg">
                        {c.icon}
                      </div>
                      <div>
                        <p className="text-[9px] uppercase tracking-[2px] text-white/40">
                          {c.label}
                        </p>
                        <p className="mt-1 text-sm text-white/85">{c.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side */}
            <div className="p-7 sm:p-10 lg:p-14">
              <div className="mb-10">
                <p className="text-xs uppercase tracking-[0.25em] text-[#C0392B] font-semibold">
                  Contact Us
                </p>
                <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-semibold text-[#1A1A1A]">
                  Send Us a Message
                </h2>
              </div>

              <form className="space-y-7">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-[10px] uppercase tracking-[2px] text-[#6B4C2A] font-semibold">
                      Your Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      className="w-full border border-[#F5A623]/25 bg-[#FFF8E7] px-4 py-3.5 text-sm text-[#1A1A1A] rounded-lg outline-none transition focus:border-[#F5A623] focus:bg-[#FFFDF7] placeholder:text-[#6B4C2A]/40"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-[10px] uppercase tracking-[2px] text-[#6B4C2A] font-semibold">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      placeholder="Enter phone number"
                      className="w-full border border-[#F5A623]/25 bg-[#FFF8E7] px-4 py-3.5 text-sm text-[#1A1A1A] rounded-lg outline-none transition focus:border-[#F5A623] focus:bg-[#FFFDF7] placeholder:text-[#6B4C2A]/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[10px] uppercase tracking-[2px] text-[#6B4C2A] font-semibold">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full border border-[#F5A623]/25 bg-[#FFF8E7] px-4 py-3.5 text-sm text-[#1A1A1A] rounded-lg outline-none transition focus:border-[#F5A623] focus:bg-[#FFFDF7] placeholder:text-[#6B4C2A]/40"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[10px] uppercase tracking-[2px] text-[#6B4C2A] font-semibold">
                    Message
                  </label>
                  <textarea
                    rows="5"
                    placeholder="Tell us about your event..."
                    className="w-full resize-none border border-[#F5A623]/25 bg-[#FFF8E7] px-4 py-3.5 text-sm text-[#1A1A1A] rounded-lg outline-none transition focus:border-[#F5A623] focus:bg-[#FFFDF7] placeholder:text-[#6B4C2A]/40"
                  />
                </div>

                <div className="flex items-center justify-between border-t border-[#F5A623]/20 pt-7">
                  <p className="hidden max-w-xs text-xs leading-5 text-[#6B4C2A]/70 sm:block">
                    We will review your message and contact you as soon as
                    possible.
                  </p>
                  <button
                    type="submit"
                    className="group flex items-center gap-5 bg-gradient-to-r from-[#F5A623] to-[#E8941A] px-7 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A] rounded-full transition-all duration-300 hover:shadow-[0_8px_25px_rgba(245,166,35,0.4)]"
                  >
                    <span>Send Message</span>
                    <span className="text-lg transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact