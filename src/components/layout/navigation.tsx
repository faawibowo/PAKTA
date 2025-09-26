"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { FileText, PenTool, Shield, BarChart3, Settings, Menu, Archive } from "lucide-react"
import { useState } from "react"
import { useUserRole } from "@/context/user-role-context"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const navigation = [
  { name: "Contract Vault", href: "/", icon: FileText, roles: ["Law", "Management", "Internal"] },
  { name: "Draft Assistant", href: "/draft", icon: PenTool, roles: ["Law", "Management"] },
  { name: "Saved Drafts", href: "/vault", icon: Archive, roles: ["Law", "Management"] },
  { name: "Validation", href: "/validation", icon: Shield, roles: ["Law", "Management", "Internal"] },
  { name: "Dashboard", href: "/dashboard", icon: BarChart3, roles: ["Management", "Internal"] },
  { name: "Admin", href: "/admin", icon: Settings, roles: ["Management"] },
]

export function Navigation() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { userRole, setUserRole } = useUserRole()

  return (
    <nav className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl text-foreground">Smart Contract Vault</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navigation.map((item) => {
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-4 bg-transparent">
                  Role: {userRole}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setUserRole("Law")}>Law</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setUserRole("Management")}>Management</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setUserRole("Internal")}>Internal</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setUserRole("Guest")}>Guest</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
              {navigation.map((item) => {
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-start mt-2 bg-transparent">
                    Role: {userRole}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-full">
                  <DropdownMenuItem onClick={() => setUserRole("Law")}>Law</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setUserRole("Management")}>Management</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setUserRole("Internal")}>Internal</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setUserRole("Guest")}>Guest</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
