import { MainLayout } from "@/components/layout/main-layout"
import { SmartDashboard } from "@/components/smart-dashboard"

export default function DashboardPage() {
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