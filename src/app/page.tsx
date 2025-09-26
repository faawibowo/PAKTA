"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Shield, FileText, PenTool, CheckCircle, BarChart3, Loader2 } from "lucide-react"
import { useUserRole } from '@/context/user-role-context'
import { toast } from 'sonner'
import { initGoogleAuth, handleGoogleSignIn } from '@/lib/google-auth'

export default function HomePage() {
  const [selectedTab, setSelectedTab] = useState<"login" | "register">("login")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { setUserRole, setUser, isLoggedIn } = useUserRole()

  useEffect(() => {
    // Initialize Google Auth when component mounts
    initGoogleAuth().catch(console.error)
  }, [])

  // If already logged in, redirect to appropriate page
  if (isLoggedIn) {
    router.push('/draft')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      if (selectedTab === "register") {
        // Validation for register
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords do not match")
        }
        if (!formData.role) {
          throw new Error("Please select a role")
        }

        // Simulate registration
        const userData = {
          id: Math.random().toString(),
          username: formData.name,
          role: formData.role as 'Law' | 'Management' | 'Internal'
        }

        setUser(userData)
        setUserRole(formData.role as 'Law' | 'Management' | 'Internal')
        toast.success('Registration successful!')
        
        // Redirect based on role
        if (formData.role === 'Management') {
          router.push('/admin')
        } else {
          router.push('/draft')
        }
        
      } else {
        // Login logic
        if (!formData.role) {
          throw new Error("Please select a role")
        }

        // Simulate login
        const userData = {
          id: '1',
          username: formData.email.split('@')[0],
          role: formData.role as 'Law' | 'Management' | 'Internal'
        }

        setUser(userData)
        setUserRole(formData.role as 'Law' | 'Management' | 'Internal')
        toast.success('Login successful!')
        
        // Redirect based on role
        if (formData.role === 'Management') {
          router.push('/admin')
        } else {
          router.push('/draft')
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    setIsLoading(true)
    setError("")
    
    try {
      const authResponse = await handleGoogleSignIn()
      
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: authResponse.access_token
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Google authentication failed")
      }

      // Use the actual user data from database
      const userData = {
        id: result.user.id.toString(),
        username: result.user.username,
        role: result.user.role as 'Law' | 'Management' | 'Internal'
      }

      // Set user data using the login function which handles cookies
      setUser(userData)
      setUserRole(userData.role)
      
      // Save to cookies manually as well for middleware
      document.cookie = `userId=${userData.id}; path=/; SameSite=Lax`
      document.cookie = `userRole=${userData.role}; path=/; SameSite=Lax`
      document.cookie = `username=${userData.username}; path=/; SameSite=Lax`

      toast.success('Google authentication successful!')
      
      // Redirect based on actual user role from database
      if (userData.role === 'Management') {
        router.push('/admin')
      } else {
        router.push('/draft')
      }
      
    } catch (error) {
      console.error('Google auth error:', error)
      setError(error instanceof Error ? error.message : "Google authentication failed")
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: ""
    })
    setError("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Image src='/logo-pakta.png' height={32} width={32} alt='Pakta Logo'/>
            <span className="font-bold text-xl">PAKTA</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Info */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
                Smart Contract
                <span className="text-primary block">Management</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg">
                Manage, validate, and draft contracts with AI assistance. 
                Streamline your legal workflow with intelligent automation.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 pt-8">
              <div className="flex items-center space-x-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <span className="font-medium">Contract Vault</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <PenTool className="h-5 w-5 text-primary" />
                </div>
                <span className="font-medium">AI Drafting</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <span className="font-medium">Validation</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
                <span className="font-medium">Analytics</span>
              </div>
            </div>
          </div>

          {/* Right side - Auth */}
          <div className="flex justify-center">
            <Card className="w-full max-w-md">
              <CardHeader className="text-center space-y-2">
                <div className="flex border rounded-lg p-1 mb-4">
                  <button
                    onClick={() => { setSelectedTab("login"); resetForm(); }}
                    className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      selectedTab === "login"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { setSelectedTab("register"); resetForm(); }}
                    className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      selectedTab === "register"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Register
                  </button>
                </div>
                <CardTitle className="text-2xl">
                  {selectedTab === "login" ? "Welcome back" : "Get started"}
                </CardTitle>
                <CardDescription>
                  {selectedTab === "login" 
                    ? "Sign in to your PAKTA account" 
                    : "Create your PAKTA account"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {selectedTab === "register" && (
                    <div className="space-y-2">
                      <Label htmlFor="name">Username</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your Username"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder={selectedTab === "register" ? "Create a password" : "Enter your password"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                  </div>
                  
                  {selectedTab === "register" && (
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        required
                      />
                      {formData.password !== formData.confirmPassword && formData.confirmPassword && (
                        <p className="text-sm text-destructive">Passwords do not match</p>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Law">Law Department</SelectItem>
                        <SelectItem value="Management">Management</SelectItem>
                        <SelectItem value="Internal">Internal User</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {selectedTab === "register" ? "Create Account" : "Sign In"}
                  </Button>
                </form>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>
                
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogleAuth}
                  disabled={isLoading}
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  {selectedTab === "register" ? "Sign up with Google" : "Sign in with Google"}
                </Button>
                
                <div className="mt-4 text-center text-sm text-gray-600">
                  <p>Demo credentials:</p>
                  <p>Email: any@email.com | Password: any password</p>
                  <p>Role: Select from dropdown above</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )}
