// components/LoadingSpinner.js
import { motion } from 'framer-motion'

export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center">
      <motion.div
        className="rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  )
}