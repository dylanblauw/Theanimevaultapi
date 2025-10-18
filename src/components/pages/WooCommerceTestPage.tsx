import { useState } from 'react'
import { motion } from 'framer-motion'

export function WooCommerceTestPage() {
  return (
    <div className="min-h-screen py-12 bg-black/20 backdrop-blur-sm">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl mx-auto mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            <span className="gradient-text-animated">WooCommerce</span> Test
          </h1>
          
          <p className="text-xl text-white leading-relaxed mb-8">
            Test je WooCommerce API verbinding en bekijk je producten
          </p>
          
          <div className="bg-white/10 p-8 rounded-lg">
            <p className="text-white">Test pagina geladen!</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}