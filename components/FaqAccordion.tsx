'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface FaqItem {
  question: string
  answer: string
}

export default function FaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div key={index}>
          <div
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="cursor-pointer transition-all duration-300"
            style={{
              background: 'rgba(0,0,0,0.45)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: `1px solid ${openIndex === index ? 'rgba(252,211,77,0.35)' : 'rgba(252,211,77,0.12)'}`,
              boxShadow:
                openIndex === index
                  ? '0 0 24px rgba(252,211,77,0.1)'
                  : '0 0 12px rgba(252,211,77,0.04)',
            }}
            role="button"
            aria-expanded={openIndex === index}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setOpenIndex(openIndex === index ? null : index)
              }
            }}
          >
            {/* Question row */}
            <div className="flex items-start justify-between gap-4 px-7 py-6">
              <h3
                className="font-serif text-lg leading-snug flex-1"
                style={{ color: openIndex === index ? '#FCD34D' : 'rgba(229,229,229,0.9)' }}
              >
                {faq.question}
              </h3>
              <motion.span
                animate={{ rotate: openIndex === index ? 45 : 0 }}
                transition={{ duration: 0.25 }}
                className="flex-shrink-0 text-2xl font-light leading-none mt-0.5"
                style={{ color: '#3B82F6' }}
                aria-hidden="true"
              >
                +
              </motion.span>
            </div>

            {/* Answer */}
            <AnimatePresence initial={false}>
              {openIndex === index && (
                <motion.div
                  key="answer"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  style={{ overflow: 'hidden' }}
                >
                  <p
                    className="px-7 pb-7 text-sm leading-relaxed"
                    style={{ color: 'rgba(229,229,229,0.72)' }}
                  >
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      ))}
    </div>
  )
}
