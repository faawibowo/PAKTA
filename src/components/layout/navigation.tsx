"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { FileText, PenTool, Shield, BarChart3, Settings, Menu, LogOut, Archive } from "lucide-react"
import { useState } from "react"
import { useUserRole } from "@/context/user-role-context"
import { formatUserRole, hasRoleAccess } from "@/lib/role-utils"

const navigation = [
  { name: "Draft Assistant", href: "/draft", icon: PenTool, roles: ["Law", "Management", "Internal"] },
  { name: "Validation", href: "/validation", icon: Shield, roles: ["Law", "Management", "Internal"] },
  { name: "Dashboard", href: "/dashboard", icon: BarChart3, roles: ["Management", "Internal"] },
  { name: "Vault", href: "/vault", icon: Archive, roles: ["Law", "Management", "Internal"] },
  { name: "Admin", href: "/admin", icon: Settings, roles: ["Management"] },
]

export function Navigation() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { userRole, user, isLoggedIn, logout } = useUserRole()

  const handleLogout = () => {
    logout()
    // Redirect to home page
    window.location.href = '/'
  }

  // Only show navigation buttons when user is logged in
  const showButtons = isLoggedIn
  const formattedRole = formatUserRole(userRole)
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
              // Check if user's role has access to this route
              const hasAccess = hasRoleAccess(userRole, item.roles)
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
            
            {/* User Info and Logout */}
            {showButtons && (
              <div className="flex items-center space-x-2 ml-4">
                <span className="text-sm text-muted-foreground">
                  {user?.username} ({formattedRole})
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            )}
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
              const hasAccess = hasRoleAccess(userRole, item.roles)
              
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
              
              {/* Mobile User Info and Logout */}
              {showButtons && (
                <div className="pt-2 border-t border-border">
                  <div className="text-sm text-muted-foreground mb-2 px-3">
                    {user?.username} ({formattedRole})
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="w-full justify-start flex items-center space-x-2"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}