"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useUserRole } from '@/context/user-role-context'
import { toast } from 'sonner'

export function LoginClient() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('')
  const [loading, setLoading] = useState(false)
  const { setUserRole, setUser } = useUserRole()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password || !role) {
      toast.error('Please fill in all fields')
      return
    }

    setLoading(true)

    try {
      // In a real app, you'd authenticate with your backend
      // For demo purposes, we'll simulate a successful login
      const userData = {
        id: '1',
        username: email.split('@')[0],
        role: role as 'Law' | 'Management' | 'Internal'
      }

      // Set user data in context (this will also set cookies)
      setUser(userData)
      setUserRole(role as 'Law' | 'Management' | 'Internal')

      toast.success('Login successful!')
      
      // Redirect based on role
      if (role === 'Management') {
        router.push('/admin')
      } else {
        router.push('/draft')
      }
    } catch (error) {
      toast.error('Login failed. Please try again.')
      console.error('Login error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">Welcome to PAKTA</CardTitle>
          <CardDescription>Sign in to your contract management system</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={setRole} required>
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
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          
          <div className="mt-4 text-center text-sm text-gray-600">
            <p>Demo credentials:</p>
            <p>Email: any@email.com</p>
            <p>Password: any password</p>
            <p>Role: Select from dropdown</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}