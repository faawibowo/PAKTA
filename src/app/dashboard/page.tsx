"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { SmartDashboard } from "@/components/smart-dashboard"
import { useUserRole } from "@/context/user-role-context"
import { formatUserRole, hasRoleAccess } from "@/lib/role-utils"
import { Lock } from "lucide-react"

export default function DashboardPage() {
  const { userRole, isLoggedIn, user } = useUserRole()
  const formattedRole = formatUserRole(userRole)
  const hasAccess = hasRoleAccess(userRole, ["Management", "Internal"])
  
  // If not logged in yet, show loading
  if (!isLoggedIn) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </MainLayout>
    )
  }
  
  if (!hasAccess) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
          <Lock className="h-16 w-16 text-muted-foreground" />
          <h1 className="text-3xl font-bold text-foreground">Access Denied</h1>
          <p className="text-muted-foreground">You do not have the necessary permissions to view this page.</p>
          <p className="text-sm text-muted-foreground">Current Role: {formattedRole}</p>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Monitor contract insights, analytics, and performance metrics</p>
        </div>
        <SmartDashboard />
      </div>
    </MainLayout>
  )
}