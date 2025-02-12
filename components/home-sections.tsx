"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Truck, Shield, Clock, Globe } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Modern Freight Solutions for a Connected World
          </motion.h1>
          <motion.p 
            className="mt-6 text-xl text-muted-foreground max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Streamline your logistics with our cutting-edge freight brokerage platform. 
            Get instant quotes, real-time tracking, and dedicated support.
          </motion.p>
          <motion.div 
            className="mt-10 flex justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button size="lg" asChild className="rounded-full shadow-lg hover:shadow-primary/50">
              <Link href="/quote">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="rounded-full">
              <Link href="/contact">Contact Sales</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export function FeaturesSection() {
  const features = [
    {
      icon: Truck,
      title: "Nationwide Coverage",
      description: "Access to thousands of verified carriers across the country"
    },
    {
      icon: Shield,
      title: "Secure Shipping",
      description: "Full insurance coverage and cargo protection"
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock customer service and shipment tracking"
    },
    {
      icon: Globe,
      title: "Global Network",
      description: "International shipping solutions and customs expertise"
    }
  ]

  return (
    <section className="py-20 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold">Why Choose FreightFlow Pro?</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Experience the difference with our innovative freight solutions
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="glow-effect card-hover-effect p-6 bg-background rounded-lg shadow-sm border relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              <feature.icon className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function CTASection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="glow-effect card-hover-effect bg-primary text-primary-foreground rounded-lg p-8 md:p-12 lg:p-16 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.01 }}
        >
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Optimize Your Freight Operations?</h2>
            <p className="text-lg mb-8 opacity-90">
              Join thousands of businesses that trust FreightFlow Pro for their logistics needs.
              Get started today with a free quote.
            </p>
            <Button size="lg" variant="secondary" asChild className="rounded-full shadow-lg hover:shadow-white/50">
              <Link href="/quote">Request a Quote</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}