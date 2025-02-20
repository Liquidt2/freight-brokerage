'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, Linkedin, Twitter, Truck, MapPin, Phone, Mail } from 'lucide-react'
import { FooterContent } from './types'
import { urlFor } from '@/lib/sanity/client'

const socialIcons = {
  linkedin: Linkedin,
  twitter: Twitter,
  facebook: Facebook,
  instagram: Instagram,
}

interface FooterProps {
  footer: FooterContent | null
  className?: string
}

export function Footer({ footer, className }: FooterProps) {
  if (!footer) {
    return (
    <footer className={`bg-background border-t ${className || ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-muted-foreground">
            Please add footer content in the Sanity Studio.
          </p>
        </div>
      </footer>
    )
  }

  return (
    <footer className={`bg-background border-t ${className || ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Company Info */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center space-x-2">
            {footer.companyInfo?.showLogo && footer.companyInfo?.logo ? (
                <Image
                  src={footer.companyInfo.logo}
                  alt={footer.companyInfo?.name || 'Company Logo'}
                  width={footer.companyInfo?.logoWidth || 150}
                  height={(footer.companyInfo?.logoWidth || 150) * 0.5}
                  className="object-contain"
                  unoptimized
                />
              ) : (
                <Truck className="h-6 w-6" />
              )}
              {footer.companyInfo?.showName && (
                <span className="font-bold text-lg">{footer.companyInfo?.name}</span>
              )}
            </Link>
          </div>

          {/* Social Links */}
          {footer.socialLinks && footer.socialLinks.some(social => social.show) && (
            <div>
              <h3 className="font-semibold mb-3">Connect With Us</h3>
              <div className="flex space-x-4">
                {footer.socialLinks
                  .filter(social => social.show)
                  .map((social) => {
                    const Icon = socialIcons[social.platform as keyof typeof socialIcons]
                    if (!Icon) return null
                    return (
                      <a
                        key={social.platform}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary"
                      >
                        <Icon className="h-5 w-5" />
                        <span className="sr-only">{social.platform}</span>
                      </a>
                    )
                  })}
              </div>
            </div>
          )}

          {/* Contact Info */}
          <div className="text-sm text-muted-foreground space-y-2">
            {footer.companyInfo?.showAddress && (
              <p className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                {footer.companyInfo?.address}
              </p>
            )}
            {footer.companyInfo?.showPhone && (
              <p className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                Phone: {footer.companyInfo?.phone}
              </p>
            )}
            {footer.companyInfo?.showEmail && (
              <p className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                Email: {footer.companyInfo?.email}
              </p>
            )}
          </div>
        </div>

        {/* Copyright */}
        {footer.copyright && footer.showCopyright && (
          <div className="mt-6 pt-6 border-t">
<p className="text-sm text-center text-muted-foreground">
  {footer.copyright}
  <span className="mx-2">|</span>
  <Link href="/privacy" className="hover:underline">
    Privacy Policy
  </Link>
  <span className="mx-2">|</span>
  <Link href="/terms" className="hover:underline">
    Terms of Service
  </Link>
</p>
          </div>
        )}
      </div>
    </footer>
  )
}
