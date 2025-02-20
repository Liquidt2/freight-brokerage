"use client"

import { Button } from "@/components/ui/button"
import { useEffect } from "react"
import { motion } from "framer-motion"
import { Truck, Shield, Clock, Globe, Box, Beaker, MapPin } from "lucide-react"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface HeroData {
  title: string
  subtitle: string
  primaryButton?: {
    text: string
    link: string
  }
  secondaryButton?: {
    text: string
    link: string
  }
}

interface IndustryFocusData {
  title: string
  subtitle: string
  industries: {
    title: string
    description: string
    icon: string
  }[]
}

interface FeaturesData {
  title: string
  subtitle: string
  featuresList: {
    title: string
    description: string
    icon: string
  }[]
}

interface HowItWorksData {
  title: string
  subtitle: string
  steps: {
    title: string
    description: string
    stepNumber: number
  }[]
}

interface TestimonialsData {
  title: string
  subtitle: string
  testimonialsList: {
    quote: string
    author: string
    company: string
  }[]
}

interface MapSectionData {
  title: string
  subtitle: string
  coverageAreas: string[]
}

interface FAQData {
  title: string
  subtitle: string
  questions: {
    question: string
    answer: string
  }[]
}

interface NewsData {
  title: string
  subtitle: string
  newsItems: {
    title: string
    content: string
    date: string
  }[]
}

interface CTAData {
  title: string
  subtitle: string
  buttonText: string
  buttonLink: string
}

export function HeroSection({ data }: { data: HeroData }) {
  useEffect(() => {
    console.log('HeroSection mounted with data:', {
      hasData: !!data,
      title: data?.title,
      subtitle: data?.subtitle,
      primaryButton: data?.primaryButton,
      secondaryButton: data?.secondaryButton
    })
  }, [data])
  return (
    <section className="relative py-12 lg:py-24 overflow-hidden bg-background mt-16">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background opacity-75 z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.05)_1px,transparent_0)] bg-[size:20px_20px] opacity-50 z-0" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="text-center">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {data.title}
          </motion.h1>
          <motion.p 
            className="mt-6 text-xl text-muted-foreground max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {data.subtitle}
          </motion.p>
          <motion.div 
            className="mt-10 flex justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {data.primaryButton && (
              <Button size="lg" asChild className="rounded-full shadow-lg hover:shadow-primary/50">
                <Link href={data.primaryButton.link}>{data.primaryButton.text}</Link>
              </Button>
            )}
            {data.secondaryButton && (
              <Button size="lg" variant="outline" asChild className="rounded-full">
                <Link href={data.secondaryButton.link}>{data.secondaryButton.text}</Link>
              </Button>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export function IndustryFocusSection({ data }: { data: IndustryFocusData }) {
  const getIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'truck':
        return Truck
      case 'box':
        return Box
      case 'flask':
        return Beaker
      default:
        return null
    }
  }

  return (
    <section className="py-12 relative">
      <div className="absolute inset-x-0 top-0 h-px bg-border/50 opacity-50" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-border/50 opacity-50" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold">{data.title}</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {data.subtitle}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.industries.map((industry, index) => (
            <motion.div
              key={industry.title}
              className="p-6 bg-background rounded-lg shadow-sm card-border relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              {(() => {
                const Icon = getIcon(industry.icon)
                return Icon ? <Icon className="h-12 w-12 text-primary mb-4" /> : null
              })()}
              <h3 className="text-xl font-semibold mb-2">{industry.title}</h3>
              <p className="text-muted-foreground">{industry.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function FeaturesSection({ data }: { data: FeaturesData }) {
  useEffect(() => {
    console.log('FeaturesSection mounted with data:', {
      hasData: !!data,
      title: data?.title,
      subtitle: data?.subtitle,
      featuresCount: data?.featuresList?.length
    })
  }, [data])
  const getIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'truck':
        return Truck
      case 'shield':
        return Shield
      case 'clock':
        return Clock
      case 'globe':
        return Globe
      default:
        return null
    }
  }

  return (
    <section className="py-12 bg-muted/50 relative">
      <div className="absolute inset-x-0 top-0 h-px bg-border/50 opacity-50" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-border/50 opacity-50" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold">{data.title}</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {data.subtitle}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {data.featuresList.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="glow-effect card-hover-effect p-6 bg-background rounded-lg shadow-sm card-border relative overflow-hidden hover:scale-105 hover:-translate-y-1 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              {(() => {
                const Icon = getIcon(feature.icon)
                return Icon ? <Icon className="h-12 w-12 text-primary mb-4" /> : null
              })()}
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function HowItWorksSection({ data }: { data: HowItWorksData }) {
  return (
    <section className="py-12 relative bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold">{data.title}</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {data.subtitle}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.steps.sort((a, b) => a.stepNumber - b.stepNumber).map((step, index) => (
            <motion.div
              key={step.title}
              className="p-6 bg-background rounded-lg shadow-sm relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center mb-4">
                {step.stepNumber}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function TestimonialsSection({ data }: { data: TestimonialsData }) {
  return (
    <section className="py-12 bg-muted/50 relative">
      <div className="absolute inset-x-0 top-0 h-px bg-border/50 opacity-50" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-border/50 opacity-50" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold">{data.title}</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {data.subtitle}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.testimonialsList.map((testimonial, index) => (
            <motion.div
              key={index}
              className="glow-effect card-hover-effect p-6 bg-background rounded-lg shadow-sm card-border relative overflow-hidden hover:scale-105 hover:-translate-y-1 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-lg mb-4 italic">&ldquo;{testimonial.quote}&rdquo;</p>
              <div>
                <p className="font-semibold">{testimonial.author}</p>
                <p className="text-sm text-muted-foreground">{testimonial.company}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function MapSection({ data }: { data: MapSectionData }) {
  return (
    <section className="py-12 relative">
      <div className="absolute inset-x-0 top-0 h-px bg-border/50 opacity-50" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-border/50 opacity-50" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold">{data.title}</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {data.subtitle}
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {data.coverageAreas.map((area, index) => (
            <motion.div
              key={area}
              className="glow-effect card-hover-effect p-6 bg-background rounded-lg shadow-sm card-border relative overflow-hidden hover:scale-105 hover:-translate-y-1 transition-all duration-300 text-center flex items-center justify-center gap-2"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              <MapPin className="h-5 w-5 text-primary" />
              {area}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function FAQSection({ data }: { data: FAQData }) {
  return (
    <section className="py-12 bg-muted/50 relative">
      <div className="absolute inset-x-0 top-0 h-px bg-border/50 opacity-50" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-border/50 opacity-50" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold">{data.title}</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {data.subtitle}
          </p>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {data.questions.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

export function NewsSection({ data }: { data: NewsData }) {
  return (
    <section className="py-12 relative">
      <div className="absolute inset-x-0 top-0 h-px bg-border/50 opacity-50" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-border/50 opacity-50" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold">{data.title}</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {data.subtitle}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.newsItems.map((item, index) => (
            <motion.article
              key={index}
              className="glow-effect card-hover-effect p-6 bg-background rounded-lg shadow-sm card-border relative overflow-hidden hover:scale-105 hover:-translate-y-1 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              <time className="text-sm text-muted-foreground">{new Date(item.date).toLocaleDateString()}</time>
              <h3 className="text-xl font-semibold mt-2 mb-4">{item.title}</h3>
              <p className="text-muted-foreground">{item.content}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function CTASection({ data }: { data: CTAData }) {
  useEffect(() => {
    console.log('CTASection mounted with data:', {
      hasData: !!data,
      title: data?.title,
      subtitle: data?.subtitle,
      buttonText: data?.buttonText,
      buttonLink: data?.buttonLink
    })
  }, [data])
  return (
    <section className="py-12 relative bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="glow-effect card-hover-effect bg-primary text-primary-foreground rounded-lg p-8 md:p-12 lg:p-16 relative overflow-hidden shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.01 }}
        >
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">{data.title}</h2>
            <p className="text-lg mb-8 opacity-90">
              {data.subtitle}
            </p>
            <Button size="lg" variant="secondary" asChild className="rounded-full shadow-lg hover:shadow-white/50">
              <Link href={data.buttonLink}>{data.buttonText}</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
