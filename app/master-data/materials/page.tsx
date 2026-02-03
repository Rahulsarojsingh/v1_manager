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
import { Plus, Trash2, ArrowLeft, Package, BarChart3, DollarSign, Weight, Tags } from 'lucide-react'

export default function MaterialsPage() {
  const router = useRouter()
  const { token } = useAuth()
  const { materials, addMaterial, deleteMaterial } = useMasterData()
  const [isLoading, setIsLoading] = useState(true)
  
  const [form, setForm] = useState({ name: '', category: '', unit: '', quantity: '', unitPrice: '' })
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
    addMaterial({
      id: Date.now().toString(),
      name: form.name,
      category: form.category,
      unit: form.unit,
      quantity: parseInt(form.quantity),
      unitPrice: parseFloat(form.unitPrice)
    })
    setForm({ name: '', category: '', unit: '', quantity: '', unitPrice: '' })
    setDialogOpen(false)
  }

  const getTotalValue = (item: any) => {
    return (item.quantity * item.unitPrice).toFixed(2)
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
              <h1 className="text-2xl font-bold text-foreground">Materials Management</h1>
              <p className="text-sm text-muted-foreground mt-1">Manage materials and inventory</p>
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
                Add Material
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Material</DialogTitle>
                <DialogDescription>Add a new material to your inventory</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Material Name</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g., Cement, Steel Rod, Brick"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="e.g., Concrete, Steel, Masonry"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="unit">Unit of Measurement</Label>
                  <Input
                    id="unit"
                    value={form.unit}
                    onChange={(e) => setForm({ ...form, unit: e.target.value })}
                    placeholder="e.g., Bag, Ton, Piece"
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
                  <Label htmlFor="unitPrice">Unit Price</Label>
                  <Input
                    id="unitPrice"
                    type="number"
                    step="0.01"
                    value={form.unitPrice}
                    onChange={(e) => setForm({ ...form, unitPrice: e.target.value })}
                    placeholder="Enter unit price"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">Add Material</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {materials.length === 0 ? (
          <Card className="p-12 border-dashed">
            <div className="flex flex-col items-center justify-center text-center">
              <Package className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No materials yet</h3>
              <p className="text-sm text-muted-foreground">Add your first material to get started</p>
            </div>
          </Card>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid gap-4 mb-8 md:grid-cols-3">
              <Card className="p-6 border-border bg-card/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Materials</p>
                    <p className="text-3xl font-bold text-foreground mt-2">{materials.length}</p>
                  </div>
                  <Tags className="w-12 h-12 text-primary/20" />
                </div>
              </Card>
              <Card className="p-6 border-border bg-card/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Units</p>
                    <p className="text-3xl font-bold text-foreground mt-2">
                      {materials.reduce((sum, m) => sum + m.quantity, 0)}
                    </p>
                  </div>
                  <Weight className="w-12 h-12 text-primary/20" />
                </div>
              </Card>
              <Card className="p-6 border-border bg-card/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Value</p>
                    <p className="text-3xl font-bold text-foreground mt-2">
                      ${materials.reduce((sum, m) => sum + (m.quantity * m.unitPrice), 0).toFixed(2)}
                    </p>
                  </div>
                  <DollarSign className="w-12 h-12 text-primary/20" />
                </div>
              </Card>
            </div>

            {/* Materials Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {materials.map((material) => (
                <Card key={material.id} className="p-6 border-border hover:border-primary/50 transition-colors group">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-foreground text-lg group-hover:text-primary transition-colors">
                        {material.name}
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => deleteMaterial(material.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <BarChart3 className="w-4 h-4" />
                        <span>{material.category}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                        <div>
                          <p className="font-medium text-foreground text-xs mb-1">Quantity</p>
                          <p>{material.quantity} {material.unit}</p>
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-xs mb-1">Unit Price</p>
                          <p>${material.unitPrice.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Total Value */}
                    <div className="pt-2 border-t border-border">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Total Value</span>
                        <span className="font-semibold text-primary">${getTotalValue(material)}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
