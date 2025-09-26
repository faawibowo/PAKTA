"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { FileText, PenTool, Shield, BarChart3, Settings, Menu, LogOut, Archive } from "lucide-react"
import { useState } from "react"
import { useUserRole } from "@/context/user-role-context"

const navigation = [
  { name: "Draft Assistant", href: "/draft", icon: PenTool, roles: ["Law", "Management", "Internal"] },
  { name: "Validation", href: "/validation", icon: Shield, roles: ["Law", "Management", "Internal"] },
  { name: "Dashboard", href: "/dashboard", icon: BarChart3, roles: ["Management", "Internal"] },
  { name: "Vault", href: "/vault", icon: Archive, roles: ["Law", "Management", "Internal"] },
  { name: "Admin", href: "/admin", icon: Settings, roles: ["Internal"] },
]

export function Navigation() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { userRole, user, isLoggedIn, logout, setUserRole } = useUserRole()

  // Debug: Log current state
  console.log("Navigation Debug:", { userRole, isLoggedIn, pathname })

  const handleLogout = () => {
    logout()
    // Redirect to home page
    window.location.href = '/'
  }

  // Always show navigation buttons (remove isLoggedIn check for testing)
  const showButtons = true // Change this back to isLoggedIn after testing

  return (
    <nav className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Image src='/logo-pakta.png' height={32} width={32} alt='Pakta Logo'/>
              <span className="font-bold text-xl text-foreground">PAKTA</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {showButtons && navigation.map((item) => {
              const Icon = item.icon
              // Show all buttons for testing (remove role check temporarily)
              const hasAccess = item.roles.includes(userRole) || userRole === "Management"
              
              if (hasAccess) {
                return (
                  <Button
                    key={item.name}
                    variant={pathname === item.href ? "default" : "ghost"}
                    size="sm"
                    className="flex items-center space-x-2"
                    asChild
                  >
                    <Link href={item.href}>
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  </Button>
                )
              }
              return null
            })}
            
            {/* Logout Button */}
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleLogout}
              className="ml-4 flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {showButtons && navigation.map((item) => {
              const Icon = item.icon
              const hasAccess = item.roles.includes(userRole) || userRole === "Management"
              
              if (hasAccess) {
                return (
                  <Button
                    key={item.name}
                    variant={pathname === item.href ? "default" : "ghost"}
                    size="sm"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link 
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      <span>{item.name}</span>
                    </Link>
                  </Button>
                )
              }
              return null
            })}
              
              {/* Mobile Logout Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="w-full justify-start mt-2 flex items-center space-x-2"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}