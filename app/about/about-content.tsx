"use client"

import { motion } from "framer-motion"
import { Shield, Users, Globe, Award } from "lucide-react"
import { AboutContent } from './types'

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  shield: Shield,
  users: Users,
  globe: Globe,
  award: Award,
  star: Award, // Using Award as a fallback for star
  heart: Shield, // Using Shield as a fallback for heart
}

export default function AboutContentUI({ about }: { about: AboutContent }) {
  return (
    <div className="space-y-20">
      {/* Mission Section */}
      <motion.section
        initial="initial"
        animate="animate"
        variants={fadeIn}
        className="bg-background rounded-lg p-8 md:p-12 card-border"
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">{about.title}</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {about.mission}
          </p>
        </div>
      </motion.section>

      {/* History Section */}
      <motion.section
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={fadeIn}
        className="bg-background rounded-lg p-8 md:p-12 card-border"
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">Our Journey</h2>
          <div className="space-y-8">
            {about.history.map((item, index) => (
              <div 
                key={item.year}
                className={`relative pl-8 ${
                  index !== about.history.length - 1 ? 'border-l-2 border-primary/20' : ''
                }`}
              >
                <div className="absolute w-4 h-4 bg-primary rounded-full -left-[9px] top-0" />
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Values Section */}
      <motion.section
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={fadeIn}
        className="bg-background rounded-lg p-8 md:p-12 card-border"
      >
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {about.values.map((value, index) => {
              const Icon = iconMap[value.icon] || Shield // Fallback to Shield if icon not found
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </motion.section>
    </div>
  )
}
