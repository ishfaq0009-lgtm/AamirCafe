import { motion } from 'motion/react'

const LoadingScreen = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF8E7] gap-6">
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="relative flex items-center justify-center"
    >
      {/* Spinner ring */}
      <div className="w-24 h-24 border-2 border-[#F5A623]/25 rounded-full absolute" />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        className="w-24 h-24 border-2 border-transparent border-t-[#F5A623] rounded-full absolute"
      />

      {/* Logo */}
      <img
        src="/logo.webp"
        alt="Aamir"
        className="w-14 h-14 object-contain relative z-10"
      />
    </motion.div>

    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="text-[10px] uppercase tracking-[0.5em] text-[#C0392B] font-semibold"
    >
      AAMIR
    </motion.p>
  </div>
)

export default LoadingScreen