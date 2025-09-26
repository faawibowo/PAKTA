"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Bell, Lightbulb } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Pie, PieChart, Cell, Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts"

interface Contract {
  id: string
  title: string
  category: string
  status: "valid" | "warning" | "error" | "draft"
  value: number
  expiration: string 
}

const dashboardContracts: Contract[] = [
  {
    id: "1",
    title: "Software Development Agreement",
    category: "Software",
    status: "valid",
    value: 150000,
    expiration: "2026-03-15",
  },
  {
    id: "2",
    title: "Non-Disclosure Agreement",
    category: "Legal",
    status: "warning",
    value: 0,
    expiration: "2025-11-01",
  },
  {
    id: "3",
    title: "Service Level Agreement",
    category: "Services",
    status: "error",
    value: 75000,
    expiration: "2025-10-20",
  },
  {
    id: "4",
    title: "Partnership Agreement",
    category: "Business",
    status: "draft",
    value: 200000,
    expiration: "2026-06-30",
  },
  {
    id: "5",
    title: "Consulting Agreement",
    category: "Services",
    status: "valid",
    value: 50000,
    expiration: "2026-01-10",
  },
  {
    id: "6",
    title: "Vendor Contract",
    category: "Procurement",
    status: "valid",
    value: 30000,
    expiration: "2025-12-01",
  },
  {
    id: "7",
    title: "Employment Contract",
    category: "HR",
    status: "warning",
    value: 0,
    expiration: "2025-09-30",
  },
]

const getStatusBadgeClass = (status: Contract["status"]) => {
  switch (status) {
    case "valid":
      return "bg-success text-success-foreground"
    case "warning":
      return "bg-warning text-warning-foreground"
    case "error":
      return "bg-error text-error-foreground"
    case "draft":
      return "bg-muted text-muted-foreground"
    default:
      return ""
  }
}

export function SmartDashboard() {
  const [notifications, setNotifications] = useState<string[]>([])

  useEffect(() => {
    const today = new Date()
    const expiringContracts = dashboardContracts.filter((contract) => {
      const expirationDate = new Date(contract.expiration)
      const diffTime = expirationDate.getTime() - today.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays <= 30 && diffDays > 0 // Contracts expiring within 30 days
    })

    if (expiringContracts.length > 0) {
      setNotifications(
        expiringContracts.map((contract) => `Contract "${contract.title}" is expiring on ${contract.expiration}.`),
      )
    }
  }, [])

  // Chart data
  const contractsByCategory = dashboardContracts.reduce(
    (acc, contract) => {
      acc[contract.category] = (acc[contract.category] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const categoryChartData = Object.entries(contractsByCategory).map(([name, value], index) => ({
    name,
    value,
    fill: `var(--chart-${(index % 5) + 1})`, // Use chart colors from globals.css
  }))

  const contractsByStatus = dashboardContracts.reduce(
    (acc, contract) => {
      acc[contract.status] = (acc[contract.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const statusChartData = Object.entries(contractsByStatus).map(([name, value], index) => ({
    name,
    value,
    fill: `var(--${name})`, // Use status colors from globals.css
  }))

  // AI Summary Insights
  const totalContracts = dashboardContracts.length
  const problematicContracts = dashboardContracts.filter((c) => c.status === "error" || c.status === "warning").length
  const topContractValue = dashboardContracts.reduce((max, contract) => Math.max(max, contract.value), 0)
  const topContractTitle = dashboardContracts.find((c) => c.value === topContractValue)?.title || "N/A"

  return (
    <div className="space-y-8">
      {notifications.length > 0 && (
        <Alert className="border-warning text-warning">
          <Bell className="h-4 w-4" />
          <AlertTitle>Notifications</AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-5">
              {notifications.map((notification, index) => (
                <li key={index}>{notification}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Contract Summary Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Contracts by Category</CardTitle>
            <CardDescription>Distribution of contracts across different categories.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="aspect-square h-[250px]">
              <PieChart>
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={categoryChartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={80}
                  strokeWidth={2}
                >
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contracts by Status</CardTitle>
            <CardDescription>Overview of contract statuses.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="aspect-square h-[250px]">
              <BarChart data={statusChartData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                <YAxis tickLine={false} tickMargin={10} axisLine={false} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="var(--color-primary)" radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* AI Summary Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            AI Summary Insights
          </CardTitle>
          <CardDescription>Key insights generated by AI from your contract data.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-md p-4">
            <h4 className="font-semibold text-muted-foreground">Total Contracts</h4>
            <p className="text-2xl font-bold">{totalContracts}</p>
          </div>
          <div className="border rounded-md p-4">
            <h4 className="font-semibold text-muted-foreground">Problematic Contracts</h4>
            <p className="text-2xl font-bold text-error">{problematicContracts}</p>
          </div>
          <div className="border rounded-md p-4">
            <h4 className="font-semibold text-muted-foreground">Top Contract Value</h4>
            <p className="text-2xl font-bold">${topContractValue.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground truncate">{topContractTitle}</p>
          </div>
        </CardContent>
      </Card>

      {/* Table of Contracts */}
      <Card>
        <CardHeader>
          <CardTitle>Contracts Overview</CardTitle>
          <CardDescription>All contracts sorted by status and value.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead>Expiration</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dashboardContracts
                  .sort((a, b) => {
                    // Sort by status (error, warning, draft, valid) then by value
                    const statusOrder = { error: 0, warning: 1, draft: 2, valid: 3 }
                    if (statusOrder[a.status] !== statusOrder[b.status]) {
                      return statusOrder[a.status] - statusOrder[b.status]
                    }
                    return b.value - a.value
                  })
                  .map((contract) => (
                    <TableRow key={contract.id}>
                      <TableCell className="font-medium">{contract.title}</TableCell>
                      <TableCell>{contract.category}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeClass(contract.status)}>{contract.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">${contract.value.toLocaleString()}</TableCell>
                      <TableCell>{contract.expiration}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
