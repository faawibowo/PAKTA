"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Bell, Lightbulb, Shield, Loader2, AlertCircle, BarChart3, Maximize2 } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Pie, PieChart, Cell, Bar, BarChart, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { useUserRole } from "@/context/user-role-context"
import { useContracts, Contract } from "@/hooks/useContracts"

const getStatusBadgeClass = (status: Contract["status"]) => {
  switch (status) {
    case "Aktif":
      return "bg-green-500 text-white hover:bg-green-600"
    case "Akan Jatuh Tempo":
      return "bg-yellow-500 text-white hover:bg-yellow-600"
    case "Kedaluwarsa":
      return "bg-red-500 text-white hover:bg-red-600"
    case "Pending":
      return "bg-blue-500 text-white hover:bg-blue-600"
    default:
      return "bg-gray-500 text-white"
  }
}

export function SmartDashboard() {
  const [notifications, setNotifications] = useState<string[]>([])
  const [maximizedChart, setMaximizedChart] = useState<string | null>(null)
  const { userRole } = useUserRole()
  const { contracts, loading, error, refetch } = useContracts()

  // RBAC: Check if user has permission to access dashboard
  const hasAccess = ["Management", "Internal"].includes(userRole)

  useEffect(() => {
    if (!hasAccess || loading || error) return

    const today = new Date()
    const expiringContracts = contracts.filter((contract) => {
      const endDate = new Date(contract.endDate)
      const timeUntilExpiry = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      // Kontrak yang akan berakhir dalam 30 hari ke depan
      return timeUntilExpiry <= 30 && timeUntilExpiry > 0
    })

    if (expiringContracts.length > 0) {
      setNotifications(
        expiringContracts.map((contract) => 
          `Kontrak "${contract.title}" akan berakhir pada ${new Date(contract.endDate).toLocaleDateString('id-ID')}.`
        )
      )
    }
  }, [hasAccess, contracts, loading, error])

  // RBAC: Display access denied message
  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-red-600">Akses Ditolak</CardTitle>
            <CardDescription>
              Anda tidak memiliki izin untuk mengakses Smart Dashboard. 
              Fitur ini hanya tersedia untuk role Management dan Internal.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground">
              Role Anda saat ini: <span className="font-semibold">{userRole}</span>
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-lg font-medium">Memuat Data Dashboard...</p>
            <p className="text-sm text-muted-foreground mt-2">
              Mengambil data kontrak dari database cloud
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-red-600">Gagal Memuat Data</CardTitle>
            <CardDescription>
              Terjadi kesalahan saat mengambil data dari database.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Error: {error}
            </p>
            <button 
              onClick={refetch}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Coba Lagi
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Chart data - using real contracts from database
  const contractsByCategory = contracts.reduce(
    (acc, contract) => {
      acc[contract.category] = (acc[contract.category] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const categoryChartData = Object.entries(contractsByCategory).map(([name, value], index) => ({
    name,
    value,
    fill: `hsl(${(index * 45) % 360}, 70%, 50%)`, // Generate different colors
  }))

  const contractsByStatus = contracts.reduce(
    (acc, contract) => {
      acc[contract.status] = (acc[contract.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const statusChartData = Object.entries(contractsByStatus).map(([name, value]) => ({
    name,
    value,
    fill: 
      name === "Aktif" ? "#10b981" : // Green
      name === "Akan Jatuh Tempo" ? "#f59e0b" : // Yellow  
      name === "Kedaluwarsa" ? "#ef4444" : // Red
      name === "Pending" ? "#3b82f6" : // Blue
      "#6b7280" // Gray for unknown
  }))

  // Analytics based on real database data
  const totalContracts = contracts.length
  const activeContracts = contracts.filter((c) => c.status === "Aktif").length
  const today = new Date()
  const expiringContracts = contracts.filter((contract) => {
    const endDate = new Date(contract.endDate)
    const timeUntilExpiry = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    // Kontrak yang akan berakhir dalam 30 hari ke depan
    return timeUntilExpiry <= 30 && timeUntilExpiry > 0
  }).length
  const expiredContracts = contracts.filter((c) => c.status === "Kedaluwarsa").length
  const pendingContracts = contracts.filter((c) => c.status === "Pending").length
  const topContractValue = contracts.length > 0 ? contracts.reduce((max, contract) => Math.max(max, contract.value), 0) : 0
  const topContractTitle = contracts.find((c) => c.value === topContractValue)?.title || "Tidak ada data"
  const totalValue = contracts.reduce((sum, contract) => sum + contract.value, 0)

  // Get most common category
  const mostCommonCategory = Object.entries(contractsByCategory).sort(([,a], [,b]) => b - a)[0]
  const mostCommonCategoryName = mostCommonCategory ? mostCommonCategory[0] : "N/A"
  const mostCommonCategoryCount = mostCommonCategory ? mostCommonCategory[1] : 0

  return (
    <div className="space-y-8">
      {/* Bell Notification Icon with Badge */}
      {notifications.length > 0 && (
        <div className="absolute top-4 right-25 z-10">
          <div className="relative group">
            {/* Bell Icon with animated ring effect */}
            <div className="relative p-2 bg-yellow-50 rounded-full border-2 border-yellow-200 hover:bg-yellow-100 transition-colors cursor-pointer">
              <Bell 
                className="h-4 w-4 text-yellow-600 animate-pulse" 
              />
              
              {/* Notification Badge */}
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[15px] h-4 flex items-center justify-center px-1 shadow-lg">
                {notifications.length > 99 ? '99+' : notifications.length}
              </div>
            </div>
            
            {/* Hover Tooltip with Notification Details */}
            <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Bell className="h-4 w-4 text-yellow-600" />
                  <span className="font-semibold text-gray-900">
                    {notifications.length} Kontrak Akan Berakhir
                  </span>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {notifications.slice(0, 5).map((notification, index) => (
                    <div key={index} className="text-sm text-gray-700 p-2 bg-yellow-50 rounded border-l-4 border-yellow-400">
                      {notification}
                    </div>
                  ))}
                  {notifications.length > 5 && (
                    <div className="text-xs text-gray-500 text-center pt-2 border-t">
                      +{notifications.length - 5} kontrak lainnya
                    </div>
                  )}
                </div>
              </div>
              {/* Arrow pointer */}
              <div className="absolute top-0 right-6 transform -translate-y-2">
                <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-b-[8px] border-l-transparent border-r-transparent border-b-gray-200"></div>
                <div className="w-0 h-0 border-l-[7px] border-r-[7px] border-b-[7px] border-l-transparent border-r-transparent border-b-white absolute top-px left-px"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Summary Cards - Based on Database Data */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="md:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Lightbulb className="h-8 w-8 text-primary" />
              Total Kontrak
            </CardTitle>
            <CardDescription>Seluruh kontrak dalam database</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-6xl font-bold text-primary bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                {totalContracts}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Ringkasan Analitik
            </CardTitle>
            <CardDescription>Insights dan analisis data kontrak dari database cloud.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="border rounded-lg p-4 bg-gradient-to-br from-blue-50 to-blue-100">
                <h4 className="font-semibold text-blue-700">Kontrak Aktif</h4>
                <p className="text-2xl font-bold text-blue-900">{activeContracts}</p>
                <p className="text-xs text-blue-600">Kontrak yang masih berlaku</p>
              </div>
              <div className="border rounded-lg p-4 bg-gradient-to-br from-red-50 to-red-100">
                <h4 className="font-semibold text-red-700">Kedaluwarsa</h4>
                <p className="text-2xl font-bold text-red-900">{expiredContracts}</p>
                <p className="text-xs text-red-600">Memerlukan tindakan</p>
              </div>
              <div className="border rounded-lg p-4 bg-gradient-to-br from-yellow-50 to-yellow-100">
                <h4 className="font-semibold text-yellow-700">Akan Berakhir</h4>
                <p className="text-2xl font-bold text-yellow-900">{expiringContracts}</p>
                <p className="text-xs text-yellow-600">Dalam 30 hari</p>
              </div>
                <div className="border rounded-lg p-4 bg-gradient-to-br from-purple-50 to-purple-100">
                  <h4 className="font-semibold text-purple-700">Pending</h4>
                  <p className="text-2xl font-bold text-purple-900">{pendingContracts}</p>
                  <p className="text-xs text-purple-600">Menunggu persetujuan</p>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contract Summary Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="relative">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Kontrak berdasarkan Kategori</CardTitle>
                <CardDescription>Distribusi kontrak berdasarkan kategori bisnis.</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMaximizedChart(maximizedChart === 'category' ? null : 'category')}
                className="h-8 w-8 p-0"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[280px]">
              <BarChart 
                data={categoryChartData} 
                margin={{ top: 20, right: 5, left: 5, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  tickLine={false} 
                  tickMargin={8} 
                  axisLine={false}
                  angle={-45}
                  textAnchor="end"
                  height={50}
                  interval={0}
                  fontSize={10}
                />
                <YAxis tickLine={false} tickMargin={8} axisLine={false} fontSize={10} />
                <ChartTooltip 
                  cursor={false} 
                  content={<ChartTooltipContent />} 
                  formatter={(value, name) => [`${value} kontrak`, name]}
                />
                <Bar dataKey="value" radius={[3, 3, 0, 0]} maxBarSize={40}>
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="relative">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Status Kontrak</CardTitle>
                <CardDescription>Overview status semua kontrak dalam sistem.</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMaximizedChart(maximizedChart === 'status' ? null : 'status')}
                className="h-8 w-8 p-0"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[280px]">
              <BarChart 
                data={statusChartData} 
                margin={{ top: 20, right: 5, left: 5, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  tickLine={false} 
                  tickMargin={8} 
                  axisLine={false}
                  angle={-45}
                  textAnchor="end"
                  height={50}
                  interval={0}
                  fontSize={10}
                />
                <YAxis tickLine={false} tickMargin={8} axisLine={false} fontSize={10} />
                <ChartTooltip 
                  cursor={false} 
                  content={<ChartTooltipContent />}
                  formatter={(value, name) => [`${value} kontrak`, name]}
                />
                <Bar dataKey="value" radius={[3, 3, 0, 0]} maxBarSize={40}>
                  {statusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Maximized Chart Modal with Blur Background */}
      {maximizedChart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Blur Background */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMaximizedChart(null)}
          />
          
          {/* Maximized Chart Content */}
          <div className="relative bg-white rounded-lg shadow-2xl max-w-6xl max-h-[90vh] overflow-auto m-4">
            <Card className="border-0 shadow-none">
              <CardHeader className="relative">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl">
                      {maximizedChart === 'category' ? 'Kontrak berdasarkan Kategori' : 'Status Kontrak'}
                    </CardTitle>
                    <CardDescription>
                      {maximizedChart === 'category' 
                        ? 'Distribusi kontrak berdasarkan kategori bisnis.' 
                        : 'Overview status semua kontrak dalam sistem.'
                      }
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setMaximizedChart(null)}
                    className="h-8 w-8 p-0"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{}} className="h-[600px] w-full">
                  <BarChart 
                    data={maximizedChart === 'category' ? categoryChartData : statusChartData}
                    margin={{ top: 20, right: 20, left: 20, bottom: 120 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      tickLine={false} 
                      tickMargin={15} 
                      axisLine={false}
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      interval={0}
                      fontSize={12}
                    />
                    <YAxis tickLine={false} tickMargin={15} axisLine={false} fontSize={12} />
                    <ChartTooltip 
                      cursor={false} 
                      content={<ChartTooltipContent />} 
                      formatter={(value, name) => [`${value} kontrak`, name]}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={80}>
                      {(maximizedChart === 'category' ? categoryChartData : statusChartData).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Additional Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Nilai Kontrak Tertinggi</CardTitle>
            <CardDescription>Kontrak dengan nilai ekonomi terbesar dari database.</CardDescription>
          </CardHeader>
          <CardContent>
            {totalContracts > 0 ? (
              <div className="space-y-2">
                <p className="text-3xl font-bold text-primary">
                  {topContractValue > 0 ? `Rp ${topContractValue.toLocaleString('id-ID')}` : 'Rp 0'}
                </p>
                <p className="text-sm text-muted-foreground">{topContractTitle}</p>
                <p className="text-xs text-muted-foreground">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md font-medium">
                    Total nilai seluruh kontrak: Rp {totalValue.toLocaleString('id-ID')}
                  </span>
                </p>
                {totalValue > 0 && (
                  <p className="text-xs text-green-600">
                    Rata-rata nilai per kontrak: Rp {Math.round(totalValue / totalContracts).toLocaleString('id-ID')}
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-3xl font-bold text-gray-400">Rp 0</p>
                <p className="text-sm text-muted-foreground">Belum ada data kontrak</p>
                <p className="text-xs text-muted-foreground">
                  Tambahkan kontrak untuk melihat statistik nilai
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rekomendasi Analitik</CardTitle>
            <CardDescription>Saran otomatis berdasarkan analisis data database.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expiringContracts > 0 && (
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">Perhatian Kontrak Expiring</p>
                    <p className="text-xs text-muted-foreground">
                      {expiringContracts} kontrak akan berakhir dalam 30 hari
                    </p>
                  </div>
                </div>
              )}
              {mostCommonCategoryCount > 0 && (
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">Kategori Dominan</p>
                    <p className="text-xs text-muted-foreground">
                      Kategori {mostCommonCategoryName} memiliki {mostCommonCategoryCount} kontrak
                    </p>
                  </div>
                </div>
              )}
              {totalContracts > 0 && (
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">Status Aktif</p>
                    <p className="text-xs text-muted-foreground">
                      {Math.round((activeContracts / totalContracts) * 100)}% kontrak dalam status aktif
                    </p>
                  </div>
                </div>
              )}
              {pendingContracts > 0 && (
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">Kontrak Pending</p>
                    <p className="text-xs text-muted-foreground">
                      {pendingContracts} kontrak menunggu persetujuan
                    </p>
                  </div>
                </div>
              )}
              {totalContracts === 0 && (
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-gray-500 mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">Belum Ada Data</p>
                    <p className="text-xs text-muted-foreground">
                      Belum ada kontrak dalam database
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table of Contracts - Database Data */}
      <Card>
        <CardHeader>
          <CardTitle>Tabel Kontrak</CardTitle>
          <CardDescription>
            {totalContracts > 0 
              ? `Menampilkan ${totalContracts} kontrak dari database cloud, diurutkan berdasarkan status dan nilai.`
              : "Belum ada kontrak dalam database."
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {totalContracts > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Judul Kontrak</TableHead>
                    <TableHead>Pihak</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Nilai</TableHead>
                    <TableHead>Tanggal Berakhir</TableHead>
                    <TableHead>Upload</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contracts
                    .sort((a, b) => {
                      // Sort by status priority (Kedaluwarsa, Akan Jatuh Tempo, Pending, Aktif) then by value
                      const statusOrder = { 
                        "Kedaluwarsa": 0, 
                        "Akan Jatuh Tempo": 1, 
                        "Pending": 2, 
                        "Aktif": 3 
                      }
                      if (statusOrder[a.status] !== statusOrder[b.status]) {
                        return statusOrder[a.status] - statusOrder[b.status]
                      }
                      return b.value - a.value
                    })
                    .map((contract) => (
                      <TableRow key={contract.id}>
                        <TableCell className="font-medium">{contract.title}</TableCell>
                        <TableCell className="max-w-[200px] truncate" title={contract.parties}>
                          {contract.parties}
                        </TableCell>
                        <TableCell>{contract.category}</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadgeClass(contract.status)}>{contract.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {contract.value > 0 ? `Rp ${contract.value.toLocaleString('id-ID')}` : '-'}
                        </TableCell>
                        <TableCell>{new Date(contract.endDate).toLocaleDateString('id-ID')}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {new Date(contract.uploadedAt).toLocaleDateString('id-ID')}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-gray-100 p-3 mb-4">
                <AlertCircle className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Kontrak</h3>
              <p className="text-sm text-gray-500 max-w-sm">
                Database belum memiliki data kontrak. Tambahkan kontrak pertama untuk melihat analytics di dashboard.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
