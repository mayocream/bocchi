'use client'

import { motion } from 'framer-motion'

export const Button = ({ children }) => (
  <motion.button
    className='p-2 px-4 text-white font-bold bg-sky-500 rounded-full'
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
  >
    {children}
  </motion.button>
)
