'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    question: 'What is Project Manager?',
    answer: 'Project Manager is a comprehensive construction management application designed to help builders, contractors, engineers, and site supervisors track work, manage inventory, handle payments, and collaborate with teams efficiently.',
  },
  {
    question: 'Is it available on mobile?',
    answer: 'Yes! Project Manager is available on both iOS and Android platforms, as well as on web browsers. All platforms are synchronized in real-time for seamless access.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Absolutely. We use enterprise-grade encryption, role-based access controls, and secure cloud backup to protect your data. Your privacy and security are our top priorities.',
  },
  {
    question: 'Can I manage multiple projects?',
    answer: 'Yes! Project Manager is specifically designed for multi-project management. You can easily switch between projects and manage all of them from a single dashboard.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, bank transfers, and digital payment methods. Enterprise customers can also arrange custom billing terms.',
  },
  {
    question: 'Do you offer customer support?',
    answer: 'Yes! We provide support Monday to Saturday, 10:30 AM to 6:00 PM. You can reach us at info@manager.in or call +91 7903345915.',
  },
]

export function FAQ() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [openIndex, setOpenIndex] = useState<number | null>(0)

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
    <section id="faq" className="py-24 px-4">
      <div className="max-w-3xl mx-auto">
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
            Frequently Asked Questions
          </h2>
          <p className="text-zinc-400">
            Everything you need to know about Project Manager.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="space-y-4"
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-zinc-800/50 transition-colors text-left"
              >
                <h3 className="text-lg font-semibold text-white">{faq.question}</h3>
                <ChevronDown
                  className={`w-5 h-5 text-zinc-400 transition-transform duration-300 ${
                    openIndex === index ? 'transform rotate-180' : ''
                  }`}
                />
              </button>

              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-6 pb-4 border-t border-zinc-800"
                >
                  <p className="text-zinc-400 leading-relaxed">{faq.answer}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
