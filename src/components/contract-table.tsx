"use client"

import { useState } from "react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Search, Filter, Edit, Trash } from "lucide-react"
import { cn } from "@/lib/utils"

interface Contract {
  id: string
  title: string
  parties: string
  category: string
  status: "valid" | "warning" | "error" | "draft"
  previewLink: string
}

const initialContracts: Contract[] = [
  {
    id: "1",
    title: "Software Development Agreement",
    parties: "Acme Corp, Beta Solutions",
    category: "Software",
    status: "valid",
    previewLink: "#",
  },
  {
    id: "2",
    title: "Non-Disclosure Agreement",
    parties: "Gamma Inc, Delta LLC",
    category: "Legal",
    status: "warning",
    previewLink: "#",
  },
  {
    id: "3",
    title: "Service Level Agreement",
    parties: "Epsilon Ltd, Zeta Co",
    category: "Services",
    status: "error",
    previewLink: "#",
  },
  {
    id: "4",
    title: "Partnership Agreement",
    parties: "Theta Corp, Iota Inc",
    category: "Business",
    status: "draft",
    previewLink: "#",
  },
  {
    id: "5",
    title: "Consulting Agreement",
    parties: "Kappa LLC, Lambda Ltd",
    category: "Services",
    status: "valid",
    previewLink: "#",
  },
]

export function ContractTable() {
  const [contracts, setContracts] = useState<Contract[]>(initialContracts)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch =
      contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.parties.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.category.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = filterCategory === "all" || contract.category.toLowerCase() === filterCategory.toLowerCase()

    const matchesStatus = filterStatus === "all" || contract.status === filterStatus

    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleDelete = (id: string) => {
    setContracts(contracts.filter((contract) => contract.id !== id))
  }

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

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search contracts by title, parties, or category..."
            className="w-full pl-10 pr-4 py-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <div className="p-2">
              <h4 className="font-medium mb-2">Category</h4>
              <div className="space-y-1">
                {["All", "Software", "Legal", "Services", "Business"].map((category) => (
                  <Button
                    key={category}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start",
                      filterCategory.toLowerCase() === category.toLowerCase() && "bg-accent text-accent-foreground",
                    )}
                    onClick={() => setFilterCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
              <h4 className="font-medium mt-4 mb-2">Status</h4>
              <div className="space-y-1">
                {["All", "Valid", "Warning", "Error", "Draft"].map((status) => (
                  <Button
                    key={status}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start",
                      filterStatus.toLowerCase() === status.toLowerCase() && "bg-accent text-accent-foreground",
                    )}
                    onClick={() => setFilterStatus(status)}
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contract Title</TableHead>
              <TableHead>Parties Involved</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Preview</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContracts.length > 0 ? (
              filteredContracts.map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell className="font-medium">{contract.title}</TableCell>
                  <TableCell>{contract.parties}</TableCell>
                  <TableCell>{contract.category}</TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeClass(contract.status)}>{contract.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Link href={contract.previewLink} className="text-primary hover:underline" prefetch={false}>
                      View
                    </Link>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/draft?id=${contract.id}`} className="flex items-center gap-2">
                            <Edit className="h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2" onClick={() => handleDelete(contract.id)}>
                          <Trash className="h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No contracts found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
