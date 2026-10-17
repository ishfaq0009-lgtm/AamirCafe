import { useRef, useState } from 'react'

const MagneticButton = ({
  children,
  className = '',
  strength = 0.35,
  as: Tag = 'button',
  ...props
}) => {
  const ref = useRef(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  const handleMove = (e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) * strength
    const y = (e.clientY - rect.top - rect.height / 2) * strength
    setPos({ x, y })
  }

  const handleLeave = () => setPos({ x: 0, y: 0 })

  return (
    <Tag
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
      className={className}
      {...props}
    >
      {children}
    </Tag>
  )
}

export default MagneticButton