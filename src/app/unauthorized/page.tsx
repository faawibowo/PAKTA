"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Lock, ArrowLeft, Home } from "lucide-react"
import { useUserRole } from "@/context/user-role-context"

export default function UnauthorizedPage() {
  const router = useRouter()
  const { userRole } = useUserRole()

  const handleGoBack = () => {
    router.back()
  }

  const handleGoHome = () => {
    router.push("/")
  }

  const handleGoToDashboard = () => {
    // Redirect to appropriate dashboard based on role
    if (userRole === "Management" || userRole === "Internal") {
      router.push("/dashboard")
    } else {
      router.push("/draft") // Default to draft assistant for other roles
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <Lock className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold">Access Denied</CardTitle>
          <CardDescription>
            You don't have permission to access this page
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Your current role: <span className="font-medium text-foreground">{userRole}</span>
            </p>
            <p className="text-xs text-muted-foreground">
              This page requires different permissions than your current role allows.
            </p>
          </div>

          <div className="flex flex-col space-y-2">
            <Button onClick={handleGoToDashboard} className="w-full">
              <Home className="h-4 w-4 mr-2" />
              Go to Dashboard
            </Button>
            
            <Button variant="outline" onClick={handleGoBack} className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
            
            <Button variant="ghost" onClick={handleGoHome} className="w-full">
              <Shield className="h-4 w-4 mr-2" />
              Return Home
            </Button>
          </div>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium text-sm mb-2">Need access?</h4>
            <p className="text-xs text-muted-foreground">
              Contact your administrator to request additional permissions for your account.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}