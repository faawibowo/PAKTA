"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, Lock } from "lucide-react"
import { useUserRole } from "@/context/user-role-context"
import { UserManagementTable } from "@/components/admin/user-management-table"
import { AdminStatsCards } from "@/components/admin/admin-stats-cards"
import { Toaster } from "sonner"

export default function AdminPage() {
  const { userRole } = useUserRole()

  if (userRole !== "Management") {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
          <Lock className="h-16 w-16 text-muted-foreground" />
          <h1 className="text-3xl font-bold text-foreground">Access Denied</h1>
          <p className="text-muted-foreground">You do not have the necessary permissions to view this page.</p>
          <p className="text-sm text-muted-foreground">Current Role: {userRole}</p>
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

        {/* System Settings Card */}
        {/* <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              System Settings
            </CardTitle>
            <CardDescription>Configure system-wide settings and preferences.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">System configuration coming soon</p>
              <p className="text-sm">Advanced settings will be available here.</p>
            </div>
          </CardContent>
        </Card> */}
      </div>
      
      <Toaster richColors position="top-right" />
    </MainLayout>
  )
}
