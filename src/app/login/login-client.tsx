"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AuthShell } from "@/components/auth/auth-shell"
import { AuthForm } from "@/components/auth/auth-form"

export function LoginClient() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (data: { email: string; password: string }) => {
    setIsLoading(true)
    setError("")

    try {
      // TODO: Implement actual login logic
      console.log("Login attempt:", data)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Redirect to contracts page on success
      router.push("/contracts")
    } catch (err) {
      setError("Invalid email or password")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthShell
      title="Welcome Back"
      description="Sign in to your PAKTA account to continue"
    >
      <AuthForm
        type="signin"
        onSubmit={handleLogin}
        isLoading={isLoading}
        error={error}
      />
    </AuthShell>
  )
}