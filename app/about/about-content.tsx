"use client"

import { motion } from "framer-motion"
import { Shield, Users, Globe, Award, Star, Heart } from "lucide-react"
import { AboutContent } from './types'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'

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
  star: Star,
  heart: Heart,
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
            <div className="prose prose-lg mx-auto">
              <PortableText
                value={about.history}
                components={{
                  block: {
                    normal: ({children}) => <p className="text-muted-foreground mb-4">{children}</p>,
                    h3: ({children}) => <h3 className="text-2xl font-semibold mt-8 mb-4">{children}</h3>,
                    h4: ({children}) => <h4 className="text-xl font-semibold mt-6 mb-3">{children}</h4>,
                  },
                  list: {
                    bullet: ({children}) => <ul className="list-disc pl-6 mb-4">{children}</ul>,
                    number: ({children}) => <ol className="list-decimal pl-6 mb-4">{children}</ol>,
                  },
                  listItem: {
                    bullet: ({children}) => <li className="mb-2">{children}</li>,
                    number: ({children}) => <li className="mb-2">{children}</li>,
                  },
                  marks: {
                    strong: ({children}) => <strong className="font-semibold">{children}</strong>,
                    em: ({children}) => <em className="italic">{children}</em>,
                    link: ({value, children}) => {
                      const target = (value?.href || '').startsWith('http') ? '_blank' : undefined
                      return (
                        <a 
                          href={value?.href}
                          target={target}
                          rel={target === '_blank' ? 'noopener noreferrer' : undefined}
                          className="text-primary hover:underline"
                        >
                          {children}
                        </a>
                      )
                    },
                  },
                }}
              />
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
              const Icon = iconMap[value.icon] || Shield
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

      {/* Team Section */}
      {about.team && about.team.length > 0 && (
        <motion.section
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeIn}
          className="bg-background rounded-lg p-8 md:p-12 card-border"
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {about.team.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  {member.image && (
                    <div className="relative w-32 h-32 mx-auto mb-4">
                      <Image
                        src={member.image.asset.url}
                        alt={member.image.alt || member.name}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                  )}
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-primary mb-2">{member.role}</p>
                  {member.bio && (
                    <p className="text-muted-foreground text-sm">{member.bio}</p>
                  )}
                  {member.socialLinks && (
                    <div className="flex justify-center gap-4 mt-3">
                      {member.socialLinks.linkedin && (
                        <a href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80">
                          LinkedIn
                        </a>
                      )}
                      {member.socialLinks.twitter && (
                        <a href={member.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80">
                          Twitter
                        </a>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Stats Section */}
      {about.stats && about.stats.length > 0 && (
        <motion.section
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeIn}
          className="bg-background rounded-lg p-8 md:p-12 card-border"
        >
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {about.stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-lg font-semibold mb-1">{stat.label}</div>
                  {stat.description && (
                    <p className="text-sm text-muted-foreground">{stat.description}</p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Certifications Section */}
      {about.certifications && about.certifications.length > 0 && (
        <motion.section
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeIn}
          className="bg-background rounded-lg p-8 md:p-12 card-border"
        >
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Our Certifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {about.certifications.map((cert, index) => (
                <motion.div
                  key={cert.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  {cert.image && (
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      <Image
                        src={cert.image.asset.url}
                        alt={cert.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                  <h3 className="text-xl font-semibold mb-2">{cert.name}</h3>
                  {cert.issuer && (
                    <p className="text-primary mb-2">{cert.issuer}</p>
                  )}
                  {cert.description && (
                    <p className="text-sm text-muted-foreground">{cert.description}</p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Call to Action Section */}
      {about.callToAction && (
        <motion.section
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeIn}
          className="bg-background rounded-lg p-8 md:p-12 card-border"
        >
          <div className="max-w-4xl mx-auto text-center">
            {about.callToAction.title && (
              <h2 className="text-3xl font-bold mb-4">{about.callToAction.title}</h2>
            )}
            {about.callToAction.description && (
              <p className="text-lg text-muted-foreground mb-8">{about.callToAction.description}</p>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {about.callToAction.primaryButton && (
                <a
                  href={about.callToAction.primaryButton.link}
                  className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                >
                  {about.callToAction.primaryButton.text}
                </a>
              )}
              {about.callToAction.secondaryButton && (
                <a
                  href={about.callToAction.secondaryButton.link}
                  className="inline-flex items-center justify-center rounded-md border border-input bg-background px-8 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {about.callToAction.secondaryButton.text}
                </a>
              )}
            </div>
          </div>
        </motion.section>
      )}
    </div>
  )
}