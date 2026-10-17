const Marquee = ({ items, speed = 40, className = '' }) => {
  return (
    <div className={`overflow-hidden ${className}`}>
      <div
        className="flex whitespace-nowrap"
        style={{
          animation: `marquee ${speed}s linear infinite`,
          width: 'max-content',
        }}
      >
        {[...items, ...items].map((item, i) => (
          <span key={i} className="flex items-center">
            <span className="px-8">{item}</span>
            <span className="text-[#d4af37] text-xs">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}

export default Marquee