"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AuthShell } from "@/components/auth/auth-shell"
import { AuthForm } from "@/components/auth/auth-form"

export function RegisterClient() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleRegister = async (data: { 
    name: string; 
    email: string; 
    password: string; 
    confirmPassword: string 
  }) => {
    setIsLoading(true)
    setError("")

    try {
      if (data.password !== data.confirmPassword) {
        throw new Error("Passwords do not match")
      }

      // TODO: Implement actual register logic
      console.log("Register attempt:", data)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Redirect to contracts page on success
      router.push("/contracts")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthShell
      title="Join PAKTA"
      description="Create your account to start managing contracts"
    >
      <AuthForm
        type="signup"
        onSubmit={handleRegister}
        isLoading={isLoading}
        error={error}
      />
    </AuthShell>
  )
}