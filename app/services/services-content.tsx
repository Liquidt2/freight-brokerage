'use client'

import { motion } from "framer-motion"
import { Truck, Shield, Thermometer, FileCheck, Gauge, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Service } from '@/hooks/use-services'
import { useServices } from '@/hooks/use-services'
import { useEffect } from 'react'

interface Certification {
  icon: string
  title: string
  items: string[]
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  truck: Truck,
  shield: Shield,
  thermometer: Thermometer,
  fileCheck: FileCheck,
  gauge: Gauge,
  bell: Bell,
  box: Truck, // Using Truck as fallback for box
  flask: Thermometer, // Using Thermometer as fallback for flask
  globe: Bell, // Using Bell as fallback for globe
  chart: Gauge, // Using Gauge as fallback for chart
  clock: Gauge, // Using Gauge as fallback for clock
  check: FileCheck, // Using FileCheck as fallback for check
  star: Shield, // Using Shield as fallback for star
}

const certifications: Certification[] = [
  {
    icon: 'shield',
    title: "Safety & Compliance",
    items: [
      "DOT Safety Rating: Satisfactory",
      "ISO 9001:2015 Certified",
      "GDP Certified",
      "CTPAT Certified"
    ]
  },
  {
    icon: 'fileCheck',
    title: "Insurance Coverage",
    items: [
      "$5M General Liability",
      "$1M Cargo Insurance",
      "Pharmaceutical Endorsement",
      "Environmental Liability"
    ]
  },
  {
    icon: 'gauge',
    title: "Performance Metrics",
    items: [
      "99.8% On-Time Delivery",
      "0.1% Claims Ratio",
      "24/7 Tracking",
      "Real-Time POD"
    ]
  },
  {
    icon: 'bell',
    title: "Monitoring Systems",
    items: [
      "GPS Fleet Tracking",
      "Temperature Monitoring",
      "Route Optimization",
      "ELD Compliance"
    ]
  }
]

export default function ServicesContent({ initialServices }: { initialServices: Service[] }) {
  const { services, isLoading, error, fetchServices } = useServices()

  useEffect(() => {
    fetchServices()
  }, [fetchServices])

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center py-12 bg-destructive/10 rounded-lg shadow border border-destructive/20">
          <h2 className="text-2xl font-bold mb-2 text-destructive">Error Loading Services</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-muted rounded-lg h-48 mb-4"></div>
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  if (!services?.length) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center py-12 bg-background rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-2">No Services Found</h2>
          <p className="text-muted-foreground">Please add services in the Sanity Studio.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-20">
      {/* Main Services */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {services.map((service, index) => {
          const Icon = iconMap[service.icon as keyof typeof iconMap]
          return (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-background rounded-lg p-6 md:p-8 card-border"
            >
              <div className="flex items-center gap-4 mb-6">
                {Icon && <Icon className="w-8 h-8 text-primary" />}
                <h2 className="text-2xl font-bold">{service.title}</h2>
              </div>
              <p className="text-muted-foreground mb-8">
                {service.description}
              </p>
              <div className="space-y-12">
                {/* Features */}
                <div className="space-y-8">
                  {service.features?.map((feature, featureIndex) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: featureIndex * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground mb-4">{feature.description}</p>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {feature.details?.map((detail: string, detailIndex: number) => (
                          <li key={detailIndex} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                            <span className="text-sm">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>

                {/* Benefits */}
                {service.benefits && service.benefits.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Key Benefits</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {service.benefits.map((benefit, index) => {
                        const BenefitIcon = iconMap[benefit.icon] || Shield
                        return (
                          <motion.div
                            key={benefit.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="flex gap-3 p-4 bg-muted/50 rounded-lg"
                          >
                            <BenefitIcon className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                            <div>
                              <h4 className="font-medium mb-1">{benefit.title}</h4>
                              <p className="text-sm text-muted-foreground">{benefit.description}</p>
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Requirements */}
                {service.requirements && service.requirements.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Requirements & Compliance</h3>
                    <div className="space-y-4">
                      {service.requirements.map((req: NonNullable<Service['requirements']>[number], index: number) => (
                        <motion.div
                          key={req.title}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          viewport={{ once: true }}
                          className="p-4 bg-muted/50 rounded-lg"
                        >
                          <h4 className="font-medium mb-2">{req.title}</h4>
                          <p className="text-sm text-muted-foreground mb-3">{req.description}</p>
                          <ul className="space-y-1">
                            {req.items.map((item: string, itemIndex: number) => (
                              <li key={itemIndex} className="text-sm flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Coverage */}
                {service.coverage && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Service Coverage</h3>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                        {service.coverage.areas.map((area: string, index: number) => (
                          <li key={index} className="text-sm flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                            {area}
                          </li>
                        ))}
                      </ul>
                      {service.coverage.restrictions && (
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Note:</span> {service.coverage.restrictions}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Certifications & Standards */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="bg-primary text-primary-foreground rounded-lg p-8 md:p-12 card-border"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Standards & Certifications</h2>
          <p className="text-lg opacity-90">
            Industry-leading certifications and monitoring systems ensuring the highest quality service
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {certifications.map((cert, index) => {
            const Icon = iconMap[cert.icon as keyof typeof iconMap]
            return (
              <motion.div
                key={cert.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center"
              >
                <Icon className="w-12 h-12 mb-4" />
                <h3 className="text-xl font-semibold mb-4">{cert.title}</h3>
                <ul className="space-y-2">
                  {cert.items.map((item: string, itemIndex: number) => (
                    <li key={itemIndex} className="text-sm opacity-90">{item}</li>
                  ))}
                </ul>
              </motion.div>
            )
          })}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
        <p className="text-lg text-muted-foreground mb-8">
          Contact our team to discuss your specific shipping needs
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/quote">Request a Quote</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/contact">Contact Sales</Link>
          </Button>
        </div>
      </motion.section>
    </div>
  )
}
