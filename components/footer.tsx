import Link from 'next/link'
import { Truck } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Truck className="h-6 w-6" />
              <span className="font-bold text-lg">FreightFlow Pro</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Specialized freight solutions for pharmaceutical, plastic, and steel industries with 
              industry-leading safety standards and monitoring systems.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-sm hover:text-primary">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm hover:text-primary">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm hover:text-primary">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services#dry-van" className="text-sm hover:text-primary">
                  Specialized Dry Van Services
                </Link>
              </li>
              <li>
                <Link href="/services#dry-van" className="text-sm hover:text-primary">
                  Pharmaceutical Transport
                </Link>
              </li>
              <li>
                <Link href="/services#dry-van" className="text-sm hover:text-primary">
                  Plastic Materials Transport
                </Link>
              </li>
              <li>
                <Link href="/services#flatbed" className="text-sm hover:text-primary">
                  Specialized Flatbed Services
                </Link>
              </li>
              <li>
                <Link href="/services#flatbed" className="text-sm hover:text-primary">
                  Steel Transport Solutions
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm hover:text-primary">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} FreightFlow Pro. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="https://linkedin.com" className="text-muted-foreground hover:text-primary">
                LinkedIn
              </Link>
              <Link href="https://twitter.com" className="text-muted-foreground hover:text-primary">
                Twitter
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}