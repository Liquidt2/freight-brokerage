"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NavigationContent } from "./navigation-types"
import { urlFor } from "@/lib/sanity/image"

interface NavbarProps {
  navigation: NavigationContent | null
  className?: string
}

export default function Navbar({ navigation, className }: NavbarProps) {
  const [mounted, setMounted] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    setIsNavigating(false)
  }, [pathname])

  if (!navigation) {
    return null
  }

  const visibleMenuItems = navigation.menuItems.filter(item => item.show)

  return (
    <header className="fixed top-0 left-0 right-0 z-layer-nav flex justify-center">
      <div className="floating-nav w-[90%] max-w-5xl">
        <div className="px-8">
        <div className="flex items-center h-14">
          <Link href="/" className="flex items-center space-x-4 mr-16">
            {navigation.logo?.showImage && navigation.logo?.image && (
              <div style={{ 
                width: navigation.logo.imageWidth, 
                height: navigation.logo.logoHeight,
                position: 'relative'
              }}>
                <Image
                  src={urlFor(navigation.logo.image).url()}
                  alt={navigation.logo.text || "Logo"}
                  fill
                  className="object-contain"
                  sizes={`${navigation.logo.imageWidth}px`}
                  priority
                />
              </div>
            )}
            {navigation.logo?.showText && (
              <span className="font-bold text-base">
                {navigation.logo.text}
              </span>
            )}
          </Link>

          <nav className="flex-1 flex items-center justify-end space-x-6">
            {visibleMenuItems.map((item, index) => (
              <div key={`${item.href}-${index}`}>
                {item.isButton ? (
                  <Button 
                    variant={item.buttonVariant || "default"} 
                    asChild 
                    className="rounded-full text-sm px-4 py-2 h-auto font-medium shadow-sm"
                  >
                    <Link href={item.href}>{item.text}</Link>
                  </Button>
                ) : (
                  <Link 
                    href={item.href} 
                    className="text-sm font-medium nav-link transition-colors hover:text-primary"
                  >
                    {item.text}
                  </Link>
                )}
              </div>
            ))}

            <button
              className="relative rounded-full p-2 hover:bg-primary/20 bg-gradient-to-r from-primary/10 to-primary/5"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-5 w-5 transition-opacity duration-300 dark:opacity-0" />
              <Moon className="absolute h-5 w-5 opacity-0 transition-opacity duration-300 dark:opacity-100" />
            </button>
          </nav>
        </div>
        </div>
      </div>
    </header>
  )
}
