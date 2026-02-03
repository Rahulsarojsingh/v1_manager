'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Users, Building2, Truck, Wrench, Package, Settings, ArrowRight } from 'lucide-react'

const masterDataSections = [
  {
    id: 'team',
    title: 'Team Management',
    description: 'Add team members, manage designations and departments',
    icon: Users,
    href: '/master-data/team',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'contractors',
    title: 'Contractors',
    description: 'Manage contractors and their specializations',
    icon: Building2,
    href: '/master-data/contractors',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'suppliers',
    title: 'Suppliers',
    description: 'Track suppliers and their product categories',
    icon: Truck,
    href: '/master-data/suppliers',
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'vendors',
    title: 'Vendors',
    description: 'Manage vendor services and details',
    icon: Wrench,
    href: '/master-data/vendors',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'equipment',
    title: 'Equipment',
    description: 'Track owned and rented equipment',
    icon: Package,
    href: '/master-data/equipment',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    id: 'materials',
    title: 'Materials',
    description: 'Manage materials and inventory',
    icon: Settings,
    href: '/master-data/materials',
    color: 'from-indigo-500 to-blue-500'
  },
]

export default function MasterDataPage() {
  const router = useRouter()
  const { user, token } = useAuth()
  const [isLoading, setIsLoading] = useState(true)

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

  return (
    <div className="min-h-screen bg-background">
      <div className="noise-overlay" aria-hidden="true" />
      
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Master Data Configuration</h1>
            <p className="text-sm text-muted-foreground mt-1">Setup and manage all master records for smooth operations</p>
          </div>
          <Link href="/home">
            <Button variant="outline" size="sm">
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {masterDataSections.map((section) => {
            const Icon = section.icon
            return (
              <Link key={section.id} href={section.href}>
                <Card className="p-6 border-border hover:border-primary/50 transition-all duration-300 group cursor-pointer h-full">
                  <div className="space-y-4">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${section.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    {/* Content */}
                    <div>
                      <h3 className="font-semibold text-foreground text-lg group-hover:text-primary transition-colors">
                        {section.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-2">
                        {section.description}
                      </p>
                    </div>

                    {/* Action */}
                    <div className="flex items-center gap-2 text-primary text-sm font-medium pt-4 border-t border-border group-hover:translate-x-1 transition-transform">
                      <span>Configure</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Info Section */}
        <div className="mt-12 p-6 border border-border rounded-lg bg-card/50 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-foreground mb-2">Getting Started</h3>
          <p className="text-sm text-muted-foreground">
            Configure master data records for your organization. Start by setting up team members and departments, then proceed with contractors, suppliers, vendors, equipment, and materials. These records will be available across all your projects.
          </p>
        </div>
      </main>
    </div>
  )
}
