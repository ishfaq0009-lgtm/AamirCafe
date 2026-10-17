import { motion } from 'motion/react'

export const Reveal = ({
  children,
  delay = 0,
  y = 40,
  once = true,
  className = '',
}) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once, margin: '-80px' }}
    transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
)

export const RevealText = ({
  children,
  delay = 0,
  className = '',
  as: Tag = 'div',
}) => (
  <Tag className={className}>
    <span className="mask-reveal">
      <motion.span
        initial={{ y: '110%' }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{
          duration: 1,
          delay,
          ease: [0.77, 0, 0.175, 1],
        }}
        style={{ display: 'inline-block' }}
      >
        {children}
      </motion.span>
    </span>
  </Tag>
)

export const StaggerContainer = ({ children, className = '' }) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: '-80px' }}
    variants={{
      hidden: {},
      visible: { transition: { staggerChildren: 0.1 } },
    }}
    className={className}
  >
    {children}
  </motion.div>
)

export const StaggerItem = ({ children, className = '' }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
    }}
    className={className}
  >
    {children}
  </motion.div>
)