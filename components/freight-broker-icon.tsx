import { motion } from 'framer-motion'

export function FreightBrokerIcon() {
  return (
    <motion.svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      animate={{
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {/* Head */}
      <motion.circle
        cx="12"
        cy="7"
        r="4"
        fill="currentColor"
      />
      
      {/* Body/Suit */}
      <motion.path
        d="M4 19v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      
      {/* Clipboard */}
      <motion.path
        d="M9 14h6m-6 3h4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        animate={{
          y: [-0.5, 0.5, -0.5]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.svg>
  )
}
