"use client"

import { motion } from "framer-motion"
import { Truck, Shield, Thermometer, FileCheck, Gauge, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const services = [
  {
    id: "dry-van",
    icon: Thermometer,
    title: "Specialized Dry Van Services",
    description: "Temperature-controlled and contamination-free transport solutions for pharmaceutical and plastic industries.",
    features: [
      {
        title: "Temperature Control & Monitoring",
        description: "Real-time temperature monitoring with GPS-enabled tracking systems",
        details: [
          "Temperature range: -20°C to +25°C (±0.5°C accuracy)",
          "24/7 temperature monitoring and alerts",
          "Validated cooling systems with backup power",
          "Temperature mapping and validation reports"
        ]
      },
      {
        title: "Pharmaceutical Compliance",
        description: "Full compliance with pharmaceutical transport regulations",
        details: [
          "GDP (Good Distribution Practice) certified",
          "FDA-approved transport protocols",
          "ISO 9001:2015 certified operations",
          "Licensed for controlled substances transport"
        ]
      },
      {
        title: "Clean Equipment Standards",
        description: "Specialized equipment for contamination-free transport",
        details: [
          "HACCP-compliant cleaning procedures",
          "Anti-contamination protocols",
          "Dedicated pharmaceutical-grade equipment",
          "Regular microbial testing"
        ]
      },
      {
        title: "Plastic Materials Handling",
        description: "Specialized handling for plastic resins and finished goods",
        details: [
          "Moisture-controlled environments",
          "Static-free handling procedures",
          "Specialized loading equipment",
          "Bulk resin transport capability"
        ]
      }
    ]
  },
  {
    id: "flatbed",
    icon: Truck,
    title: "Specialized Flatbed Services",
    description: "Expert handling of steel products and heavy machinery with industry-leading safety standards.",
    features: [
      {
        title: "Steel Transport Expertise",
        description: "Specialized equipment and expertise for steel industry logistics",
        details: [
          "Coil wells and specialized dunnage",
          "Certified steel hauling equipment",
          "Anti-scratch loading procedures",
          "Weather protection systems"
        ]
      },
      {
        title: "Safety Protocols",
        description: "Comprehensive safety measures for oversized and heavy loads",
        details: [
          "DOT-compliant securing methods",
          "Load-specific tie-down protocols",
          "Regular safety inspections",
          "Certified cargo securing specialists"
        ]
      },
      {
        title: "Equipment Specifications",
        description: "Modern fleet equipped for heavy and oversized loads",
        details: [
          "48' and 53' flatbeds",
          "Step decks and double drops",
          "Multi-axle trailers",
          "100,000+ lbs capacity options"
        ]
      },
      {
        title: "Specialized Loading/Unloading",
        description: "Expert handling of complex machinery and equipment",
        details: [
          "Crane service coordination",
          "Specialized ramps and loading equipment",
          "OSHA-compliant procedures",
          "Experienced loading specialists"
        ]
      }
    ]
  }
]

const certifications = [
  {
    icon: Shield,
    title: "Safety & Compliance",
    items: [
      "DOT Safety Rating: Satisfactory",
      "ISO 9001:2015 Certified",
      "GDP Certified",
      "CTPAT Certified"
    ]
  },
  {
    icon: FileCheck,
    title: "Insurance Coverage",
    items: [
      "$5M General Liability",
      "$1M Cargo Insurance",
      "Pharmaceutical Endorsement",
      "Environmental Liability"
    ]
  },
  {
    icon: Gauge,
    title: "Performance Metrics",
    items: [
      "99.8% On-Time Delivery",
      "0.1% Claims Ratio",
      "24/7 Tracking",
      "Real-Time POD"
    ]
  },
  {
    icon: Bell,
    title: "Monitoring Systems",
    items: [
      "GPS Fleet Tracking",
      "Temperature Monitoring",
      "Route Optimization",
      "ELD Compliance"
    ]
  }
]

export default function ServicesPage() {
  return (
    <div className="space-y-20">
      {/* Main Services */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {services.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="bg-background rounded-lg p-6 md:p-8 card-border"
          >
            <div className="flex items-center gap-4 mb-6">
              <service.icon className="w-8 h-8 text-primary" />
              <h2 className="text-2xl font-bold">{service.title}</h2>
            </div>
            <p className="text-muted-foreground mb-8">
              {service.description}
            </p>
            <div className="space-y-8">
              {service.features.map((feature, featureIndex) => (
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
                    {feature.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                        <span className="text-sm">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
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
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center"
            >
              <cert.icon className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold mb-4">{cert.title}</h3>
              <ul className="space-y-2">
                {cert.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="text-sm opacity-90">{item}</li>
                ))}
              </ul>
            </motion.div>
          ))}
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