"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, ArrowLeft, Home, FileQuestion } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  const router = useRouter()

  const handleGoBack = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-muted flex items-center justify-center">
            <FileQuestion className="h-10 w-10 text-muted-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold">404 - Page Not Found</CardTitle>
          <CardDescription>
            The page you're looking for doesn't exist or has been moved
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              This could happen if:
            </p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• The URL was typed incorrectly</li>
              <li>• The page has been moved or deleted</li>
              <li>• You don't have permission to view this page</li>
              <li>• The link you followed is outdated</li>
            </ul>
          </div>

          <div className="flex flex-col space-y-3">
            <Button asChild className="w-full">
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Go to Home
              </Link>
            </Button>
            
            <Button variant="outline" onClick={handleGoBack} className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
            
            <Button variant="ghost" asChild className="w-full">
              <Link href="/draft">
                <Search className="h-4 w-4 mr-2" />
                Browse Draft Assistant
              </Link>
            </Button>
          </div>

          <div className="mt-8 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium text-sm mb-2">Still need help?</h4>
            <p className="text-xs text-muted-foreground mb-3">
              If you believe this is an error, please contact support or try these common pages:
            </p>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/draft">Draft Assistant</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/vault">Vault</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/validation">Validation</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}