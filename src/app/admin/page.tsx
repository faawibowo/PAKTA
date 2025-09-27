"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, Lock } from "lucide-react"
import { useUserRole } from "@/context/user-role-context"
import { UserManagementTable } from "@/components/admin/user-management-table"
import { AdminStatsCards } from "@/components/admin/admin-stats-cards"
import { Toaster } from "sonner"
import { formatUserRole } from "@/lib/role-utils"

export default function AdminPage() {
  const { userRole } = useUserRole()
  const formattedRole = formatUserRole(userRole)

  if (formattedRole !== "Internal") {
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
          <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
          <p className="text-muted-foreground mt-2">Role-based access control and administrative functions</p>
        </div>

        {/* Statistics Cards */}
        <AdminStatsCards />

        {/* User Management Table */}
        <UserManagementTable />
      </div>
      
      <Toaster richColors position="top-right" />
    </MainLayout>
  )
}
