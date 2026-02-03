"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"

const footerLinks = {
  Product: ["Features", "Pricing", "Mobile App", "Web Platform", "API"],
  Resources: ["Documentation", "Guides", "Support", "Blog", "Templates"],
  Company: ["About", "Careers", "Partners", "Contact", "Locations"],
  Legal: ["Privacy", "Terms", "Security", "Compliance", "Licenses"],
}

export function Footer() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <footer ref={ref} className="border-t border-zinc-800 bg-zinc-950">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-8"
        >
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <a href="#" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                <span className="text-zinc-950 font-bold text-sm">PM</span>
              </div>
              <span className="font-semibold text-white">Project Manager</span>
            </a>
            <p className="text-sm text-zinc-500 mb-4">The modern construction management platform.</p>
            {/* Contact Info */}
            <div className="text-xs text-zinc-500 space-y-1">
              <p>Email: <a href="mailto:info@manager.in" className="text-zinc-400 hover:text-white">info@manager.in</a></p>
              <p>Phone: <a href="tel:+917903345915" className="text-zinc-400 hover:text-white">+91 7903345915</a></p>
              <p>Hours: Mon-Sat, 10:30 AM - 6:00 PM</p>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-white mb-4">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-zinc-500 hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>

        {/* Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 pt-8 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <p className="text-sm text-zinc-500">&copy; {new Date().getFullYear()} Project Manager. All rights reserved.</p>
          <div className="text-sm text-zinc-500">
            <span>Based in Sonpur, Saran, Bihar, India</span>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
