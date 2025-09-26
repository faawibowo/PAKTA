"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { FileText, PenTool, Shield, BarChart3, Settings, Menu, LogOut, User } from "lucide-react"
import { useState } from "react"
import { useUserRole } from "@/context/user-role-context"

const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart3, roles: ["Management", "Internal"] },
  { name: "Contract Vault", href: "/vault", icon: FileText, roles: ["Law", "Management", "Internal"] },
  { name: "Draft Assistant", href: "/draft", icon: PenTool, roles: ["Law", "Management"] },
  { name: "Validation", href: "/validation", icon: Shield, roles: ["Law", "Management", "Internal"] },
  { name: "Admin", href: "/admin", icon: Settings, roles: ["Management"] },
]

export function Navigation() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { userRole, user, isLoggedIn, logout } = useUserRole()

  const handleLogout = () => {
    logout()
    // Redirect to login or home page
    window.location.href = '/login'
  }

  return (
    <nav className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl text-foreground">PAKTA Dashboard</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn && navigation.map((item) => {
              const Icon = item.icon
              if (item.roles.includes(userRole)) {
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              }
              return null
            })}
            
            {/* User Info & Logout */}
            {isLoggedIn ? (
              <div className="flex items-center space-x-4 ml-4">
                <div className="flex items-center space-x-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{user?.username}</span>
                  <span className="text-muted-foreground">|</span>
                  <span className="font-semibold text-primary">{userRole}</span>
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="ml-4">
                <Link href="/login">
                  <Button variant="default">
                    Login
                  </Button>
                </Link>
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
              {isLoggedIn && navigation.map((item) => {
                const Icon = item.icon
                if (item.roles.includes(userRole)) {
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors",
                        pathname === item.href
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent",
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  )
                }
                return null
              })}
              
              {/* Mobile User Info & Logout */}
              {isLoggedIn ? (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between px-3 py-2">
                    <div className="text-sm">
                      <p className="font-medium">{user?.username}</p>
                      <p className="text-muted-foreground">Role: {userRole}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleLogout}>
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mt-4 pt-4 border-t border-border px-3">
                  <Link href="/login">
                    <Button variant="default" className="w-full">
                      Login
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
