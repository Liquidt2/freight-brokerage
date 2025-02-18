"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { Truck, Sun, Moon, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NavigationContent } from "./navigation-types"

interface NavbarProps {
  navigation: NavigationContent | null
  className?: string
}

export function Navbar({ navigation, className }: NavbarProps) {
  const [mounted, setMounted] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)
  const { theme, setTheme } = useTheme()
  const { scrollY } = useScroll()
  const router = useRouter()
  const pathname = usePathname()
  
  // Framer Motion y-axis transform for navbar
  const yOffset = useTransform(
    scrollY,
    [0, 100],
    [0, -5]
  )

  useEffect(() => {
    setMounted(true)
  }, [])

  // Reset navigation state when pathname changes
  useEffect(() => {
    setIsNavigating(false)
  }, [pathname])

  if (!navigation) {
    return (
      <nav className="bg-background border-b w-full">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <p className="text-center text-muted-foreground">
            Please add navigation content in the Sanity Studio.
          </p>
        </div>
      </nav>
    )
  }

  const visibleMenuItems = navigation.menuItems.filter(item => item.show)

  return (
    <motion.div
      style={mounted ? { y: yOffset } : {}}
      className={`fixed top-0 left-0 right-0 flex justify-center w-full transition-all duration-300 bg-background/80 backdrop-blur-sm ${className || ""}`}
    >
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="floating-nav w-full max-w-5xl mx-auto px-8 relative z-25"
      >
        <div className="flex items-center justify-start h-14">
          
          {/* Logo */}
          <motion.div 
            className="flex-shrink-0"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link href="/" className="flex items-center space-x-4">
              {navigation.logo?.showImage && navigation.logo.image ? (
                <div className="h-10">
                  <Image
                    src={navigation.logo.image}
                    alt={navigation.logo.text}
                    width={104}
                    height={40}
                    className="object-contain"
                    priority
                  />
                </div>
              ) : navigation.logo?.showIcon ? (
                <Truck className="h-6 w-6" />
              ) : null}
              {navigation.logo?.showText && (
                <span className="font-bold text-base">{navigation.logo.text}</span>
              )}
            </Link>
          </motion.div>

          {/* Navigation Links */}
          <AnimatePresence>
            <div className="flex items-center space-x-6 ml-auto">
              {visibleMenuItems.map((item, index) => (
                <motion.div
                  key={`${item.href}-${index}`}
                  whileHover={{ scale: 1.05, y: -3 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 500, 
                    damping: 15,
                    mass: 0.6
                  }}
                >
                  {item.isButton ? (
                    <Button 
                      variant={item.buttonVariant || "default"} 
                      asChild 
                      className="rounded-full text-sm px-4 py-2 h-auto font-medium shadow-sm"
                      onClick={(e) => {
                        if (isNavigating || pathname === item.href) {
                          e.preventDefault()
                          return
                        }
                        setIsNavigating(true)
                        router.push(item.href)
                      }}
                      disabled={isNavigating}
                    >
                      <Link href={item.href}>{item.text}</Link>
                    </Button>
                  ) : (
                    <Link 
                      href={item.href} 
                      className="text-sm font-medium nav-link transition-colors hover:text-primary"
                      onClick={(e) => {
                        if (isNavigating || pathname === item.href) {
                          e.preventDefault()
                          return
                        }
                        setIsNavigating(true)
                        router.push(item.href)
                      }}
                    >
                      {item.text}
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>
          </AnimatePresence>

          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 180 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="relative rounded-full p-2 hover:bg-primary/20 flex-shrink-0 bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 transition-all duration-300 ml-4"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-5 w-5 transition-opacity duration-300 dark:opacity-0" />
            <Moon className="absolute h-5 w-5 opacity-0 transition-opacity duration-300 dark:opacity-100" />
          </motion.button>
        </div>
      </motion.nav>
    </motion.div>
  )
}
