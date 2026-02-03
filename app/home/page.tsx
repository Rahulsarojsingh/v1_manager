'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { useProjects } from '@/lib/projects-context'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Plus, Folder, ExternalLink, Trash2 } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()
  const { user, token, logout } = useAuth()
  const { projects, deleteProject } = useProjects()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Redirect to login if not authenticated
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'Completed':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'On Hold':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="noise-overlay" aria-hidden="true" />
      
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-display text-foreground">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your projects and assets</p>
          </div>
          <button
            onClick={() => {
              logout()
              router.push('/')
            }}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Action Bar */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Your Projects</h2>
            <p className="text-sm text-muted-foreground">
              {projects.length} {projects.length === 1 ? 'project' : 'projects'} in total
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/master-data">
              <Button variant="outline" className="gap-2 bg-transparent">
                <Folder className="w-4 h-4" />
                Master Data
              </Button>
            </Link>
            <Link href="/add-project">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                <Plus className="w-4 h-4" />
                New Project
              </Button>
            </Link>
          </div>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-border rounded-lg">
            <Folder className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No projects yet</h3>
            <p className="text-sm text-muted-foreground text-center mb-6">
              Create your first project to get started managing your work
            </p>
            <Link href="/add-project">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Create First Project
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="p-6 border-border hover:border-primary/50 transition-colors group"
              >
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground text-lg group-hover:text-primary transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">{project.clientName}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {project.description}
                  </p>

                  {/* Meta Info */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div>
                      <p className="font-medium text-foreground text-xs">Type</p>
                      <p>{project.type}</p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-xs">Category</p>
                      <p>{project.category}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t border-border">
                    <Link href={`/project/${project.id}`} className="flex-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-primary hover:bg-primary/10 gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => deleteProject(project.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
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
