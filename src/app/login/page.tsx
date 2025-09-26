"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Eye, EyeOff } from "lucide-react"
import { useUserRole } from "@/context/user-role-context"

// Mock database users with roles
const mockUsers = [
  { id: "1", username: "admin", password: "admin123", role: "Management" as const },
  { id: "2", username: "lawyer", password: "law123", role: "Law" as const },
  { id: "3", username: "internal", password: "int123", role: "Internal" as const },
  { id: "4", username: "guest", password: "guest123", role: "Guest" as const },
]

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  const { setUser, setUserRole } = useUserRole()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Find user in mock database
      const user = mockUsers.find(
        u => u.username === username && u.password === password
      )

      if (user) {
        // Set user state in context
        setUser({
          id: user.id,
          username: user.username,
          role: user.role
        })
        setUserRole(user.role)
        
        // Redirect to appropriate page based on role
        if (user.role === "Management" || user.role === "Internal") {
          router.push("/") // Dashboard
        } else {
          router.push("/vault") // Contract Vault
        }
      } else {
        setError("Username atau password salah")
      }
    } catch (err) {
      setError("Terjadi kesalahan saat login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Login to PAKTA</CardTitle>
          <CardDescription>
            Platform Analisis Kontrak Terintegrasi AI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
          
          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold text-sm mb-2">Demo Credentials:</h4>
            <div className="text-xs space-y-1">
              <div><strong>Admin:</strong> admin / admin123 (Management)</div>
              <div><strong>Lawyer:</strong> lawyer / law123 (Law)</div>
              <div><strong>Internal:</strong> internal / int123 (Internal)</div>
              <div><strong>Guest:</strong> guest / guest123 (Guest)</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}