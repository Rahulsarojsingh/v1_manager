'use client'

import React from "react"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { useMasterData } from '@/lib/master-data-context'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Trash2, ArrowLeft, Package, Wrench, Tag, CheckCircle2, AlertCircle, Clock } from 'lucide-react'

export default function EquipmentPage() {
  const router = useRouter()
  const { token } = useAuth()
  const { equipment, addEquipment, deleteEquipment } = useMasterData()
  const [isLoading, setIsLoading] = useState(true)
  
  const [form, setForm] = useState({ name: '', type: '', quantity: '', status: 'Available', ownershipType: 'Owned' })
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    if (!token) {
      router.push('/login')
    } else {
      setIsLoading(false)
    }
  }, [token, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addEquipment({
      id: Date.now().toString(),
      name: form.name,
      type: form.type,
      quantity: parseInt(form.quantity),
      status: form.status as 'Available' | 'In Use' | 'Maintenance',
      ownershipType: form.ownershipType as 'Owned' | 'Rented'
    })
    setForm({ name: '', type: '', quantity: '', status: 'Available', ownershipType: 'Owned' })
    setDialogOpen(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Available':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />
      case 'In Use':
        return <AlertCircle className="w-4 h-4 text-blue-500" />
      case 'Maintenance':
        return <Clock className="w-4 h-4 text-yellow-500" />
      default:
        return null
    }
  }

  const getOwnershipBadgeColor = (type: string) => {
    return type === 'Owned' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-cyan-500/20 text-cyan-400'
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="noise-overlay" aria-hidden="true" />
      
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/master-data">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Equipment Management</h1>
              <p className="text-sm text-muted-foreground mt-1">Track owned and rented equipment</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Equipment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Equipment</DialogTitle>
                <DialogDescription>Add a new equipment to your inventory</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Equipment Name</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g., Excavator, Bulldozer"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="type">Equipment Type</Label>
                  <Input
                    id="type"
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    placeholder="e.g., Heavy Machinery, Tools"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                    placeholder="Enter quantity"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="ownership">Ownership Type</Label>
                  <Select value={form.ownershipType} onValueChange={(value) => setForm({ ...form, ownershipType: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Owned">Owned</SelectItem>
                      <SelectItem value="Rented">Rented</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={form.status} onValueChange={(value) => setForm({ ...form, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="In Use">In Use</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full">Add Equipment</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {equipment.length === 0 ? (
          <Card className="p-12 border-dashed">
            <div className="flex flex-col items-center justify-center text-center">
              <Package className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No equipment yet</h3>
              <p className="text-sm text-muted-foreground">Add your first equipment to get started</p>
            </div>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {equipment.map((item) => (
              <Card key={item.id} className="p-6 border-border hover:border-primary/50 transition-colors group">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-foreground text-lg group-hover:text-primary transition-colors">
                      {item.name}
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => deleteEquipment(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Wrench className="w-4 h-4" />
                      <span>{item.type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Qty: {item.quantity}</span>
                    </div>
                  </div>

                  {/* Status and Ownership Badges */}
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(item.status)}
                      <span className="text-xs text-muted-foreground">{item.status}</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${getOwnershipBadgeColor(item.ownershipType)}`}>
                      {item.ownershipType}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
