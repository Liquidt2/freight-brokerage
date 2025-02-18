"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useTheme } from "next-themes"
import { motion, useScroll, useTransform } from "framer-motion"
import { Truck, Sun, Moon, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NavigationContent } from "./navigation-types"

interface NavbarProps {
  navigation: NavigationContent | null
  className?: string
}

export function Navbar({ navigation, className }: NavbarProps) {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const { scrollY } = useScroll()
  
  // Framer Motion background color transition
  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.9)"]
  )
  const darkBackgroundColor = useTransform(
    scrollY,
    [0, 100],
    ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.9)"]
  )

  useEffect(() => {
    setMounted(true)
  }, [])

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
      style={mounted ? { backgroundColor: theme === "dark" ? darkBackgroundColor : backgroundColor } : {}}
      className={`fixed top-0 left-0 right-0 flex justify-center w-full transition-all duration-300 ${className || ""}`}
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
          <div className="flex items-center space-x-6 ml-auto">
            {visibleMenuItems.map((item, index) => (
              <motion.div
                key={`${item.href}-${index}`}
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 400, 
                  damping: 10,
                  mass: 0.8
                }}
              >
                {item.isButton ? (
                  <Button variant={item.buttonVariant || "default"} asChild className="rounded-full text-sm px-4 py-2 h-auto font-medium shadow-sm">
                    <Link href={item.href}>{item.text}</Link>
                  </Button>
                ) : (
                  <Link href={item.href} className="text-sm font-medium nav-link transition-colors hover:text-primary">
                    {item.text}
                  </Link>
                )}
              </motion.div>
            ))}
          </div>

          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.05, rotate: 180 }}
            transition={{ duration: 0.3 }}
            className="relative rounded-full p-2 hover:bg-primary/10 flex-shrink-0"
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
