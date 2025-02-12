"use client"

import { motion } from "framer-motion"
import { Shield, Users, Globe, Award } from "lucide-react"

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const values = [
  {
    icon: Shield,
    title: "Reliability",
    description: "We deliver on our promises with consistent, dependable service that our clients can count on."
  },
  {
    icon: Users,
    title: "Customer Focus",
    description: "Our clients&apos; success is our success. We work tirelessly to exceed expectations and build lasting partnerships."
  },
  {
    icon: Globe,
    title: "Innovation",
    description: "We leverage cutting-edge technology to optimize routes, reduce costs, and improve efficiency."
  },
  {
    icon: Award,
    title: "Excellence",
    description: "We maintain the highest standards in every aspect of our operations, from customer service to delivery."
  }
]

export default function AboutPage() {
  return (
    <div className="space-y-20">
      {/* Mission Section */}
      <motion.section
        initial="initial"
        animate="animate"
        variants={fadeIn}
        className="bg-background rounded-lg shadow-sm border p-8 md:p-12"
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            To revolutionize the freight industry through innovative technology and exceptional service, 
            providing reliable, efficient, and sustainable logistics solutions that empower businesses 
            to thrive in today&apos;s dynamic market.
          </p>
        </div>
      </motion.section>

      {/* History Section */}
      <motion.section
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={fadeIn}
        className="bg-background rounded-lg shadow-sm border p-8 md:p-12"
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">Our Journey</h2>
          <div className="space-y-8">
            <div className="relative pl-8 border-l-2 border-primary/20">
              <div className="absolute w-4 h-4 bg-primary rounded-full -left-[9px] top-0" />
              <h3 className="text-xl font-semibold mb-2">Founded with a Vision</h3>
              <p className="text-muted-foreground">
                Established in 2020, we set out to transform the freight brokerage industry 
                by combining traditional logistics expertise with modern technology.
              </p>
            </div>
            <div className="relative pl-8 border-l-2 border-primary/20">
              <div className="absolute w-4 h-4 bg-primary rounded-full -left-[9px] top-0" />
              <h3 className="text-xl font-semibold mb-2">Rapid Growth</h3>
              <p className="text-muted-foreground">
                By 2022, we had expanded our network to cover all 50 states, serving 
                hundreds of satisfied clients with our innovative logistics solutions.
              </p>
            </div>
            <div className="relative pl-8">
              <div className="absolute w-4 h-4 bg-primary rounded-full -left-[9px] top-0" />
              <h3 className="text-xl font-semibold mb-2">Today</h3>
              <p className="text-muted-foreground">
                We continue to lead the industry in technology adoption and service quality, 
                processing thousands of shipments monthly with our state-of-the-art platform.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Values Section */}
      <motion.section
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={fadeIn}
        className="bg-background rounded-lg shadow-sm border p-8 md:p-12"
      >
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex gap-4"
              >
                <div className="flex-shrink-0">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  )
}