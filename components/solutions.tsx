'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Users, Wrench, Clipboard, Users2, HardHat, Package } from 'lucide-react'

const solutions = [
  {
    icon: HardHat,
    title: 'Builders',
    description: 'Complete project oversight with real-time updates and comprehensive reporting.',
    color: 'emerald',
  },
  {
    icon: Wrench,
    title: 'Contractors',
    description: 'Streamline daily operations and manage multiple sites efficiently.',
    color: 'blue',
  },
  {
    icon: Clipboard,
    title: 'Engineers',
    description: 'Technical documentation and inspection management in one place.',
    color: 'amber',
  },
  {
    icon: Users2,
    title: 'Sub-Contractors',
    description: 'Easy task assignments and progress tracking for specialized work.',
    color: 'violet',
  },
  {
    icon: Users,
    title: 'Site Supervisors',
    description: 'Daily work logs, attendance, and real-time issue reporting.',
    color: 'rose',
  },
  {
    icon: Package,
    title: 'Material Suppliers',
    description: 'Inventory tracking and automated purchase order management.',
    color: 'cyan',
  },
]

const colorMap = {
  emerald: 'emerald-500',
  blue: 'blue-500',
  amber: 'amber-500',
  violet: 'violet-500',
  rose: 'rose-500',
  cyan: 'cyan-500',
}

export function Solutions() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
  }

  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2
            className="text-3xl sm:text-4xl font-bold text-white mb-4"
            style={{ fontFamily: 'var(--font-instrument-sans)' }}
          >
            Built for Everyone
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Tailored solutions for every role in construction management.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {solutions.map((solution) => {
            const Icon = solution.icon
            const colorClass = colorMap[solution.color as keyof typeof colorMap]

            return (
              <motion.div
                key={solution.title}
                variants={itemVariants}
                className="group relative p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 hover:scale-[1.02] transition-all duration-300 overflow-hidden"
              >
                <div className="p-3 rounded-lg bg-zinc-800 w-fit mb-4">
                  <Icon className={`w-5 h-5 text-${colorClass}`} strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{solution.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{solution.description}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
