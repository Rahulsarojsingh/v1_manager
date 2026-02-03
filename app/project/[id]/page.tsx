'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { useProjects } from '@/lib/projects-context'
import { useAssets } from '@/lib/assets-context'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ArrowLeft,
  Upload,
  File as ImageIcon,
  Image as ImageIcon2,
  Download,
  Trash2,
  Calendar,
  Building2,
  Tag,
  AlertCircle,
} from 'lucide-react'

export default function ProjectDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { token } = useAuth()
  const { getProject } = useProjects()
  const { getDiagrams, getDocuments, deleteAsset } = useAssets()
  const [isLoading, setIsLoading] = useState(true)

  const projectId = params.id as string
  const project = getProject(projectId)
  const diagrams = getDiagrams(projectId)
  const documents = getDocuments(projectId)

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

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="w-12 h-12 text-destructive mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Project Not Found</h1>
            <p className="text-sm text-muted-foreground mb-6">The project you're looking for doesn't exist.</p>
            <Link href="/home">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Back to Projects
              </Button>
            </Link>
          </div>
        </div>
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="noise-overlay" aria-hidden="true" />

      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Link href="/home">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold font-display text-foreground">{project.name}</h1>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                {project.status}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{project.clientName}</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Project Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <Card className="p-4 border-border">
            <div className="flex items-center gap-3">
              <Building2 className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground font-medium">Client</p>
                <p className="text-sm font-semibold text-foreground">{project.clientName}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-border">
            <div className="flex items-center gap-3">
              <Tag className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground font-medium">Type</p>
                <p className="text-sm font-semibold text-foreground">{project.type}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-border">
            <div className="flex items-center gap-3">
              <Tag className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground font-medium">Category</p>
                <p className="text-sm font-semibold text-foreground">{project.category}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-border">
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground font-medium">Start Date</p>
                <p className="text-sm font-semibold text-foreground">
                  {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Description */}
        {project.description && (
          <Card className="p-6 border-border mb-12">
            <h2 className="text-lg font-semibold text-foreground mb-2">Description</h2>
            <p className="text-muted-foreground">{project.description}</p>
          </Card>
        )}

        {/* Assets Section */}
        <Card className="border-border">
          <Tabs defaultValue="diagrams" className="w-full">
            <div className="border-b border-border px-6">
              <TabsList className="bg-transparent border-b-0">
                <TabsTrigger value="diagrams" className="text-foreground data-[state=active]:border-b-2">
                  <ImageIcon2 className="w-4 h-4 mr-2" />
                  Diagrams ({diagrams.length})
                </TabsTrigger>
                <TabsTrigger value="documents" className="text-foreground data-[state=active]:border-b-2">
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Documents ({documents.length})
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Diagrams Tab */}
            <TabsContent value="diagrams" className="p-6 space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-foreground">Upload Diagrams</h3>
                <Link href={`/project/${projectId}/upload-diagram`}>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                    <Upload className="w-4 h-4" />
                    Upload Diagram
                  </Button>
                </Link>
              </div>

              {diagrams.length === 0 ? (
                <div className="text-center py-8">
                  <ImageIcon2 className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">No diagrams uploaded yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {diagrams.map((asset) => (
                    <div
                      key={asset.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <ImageIcon2 className="w-5 h-5 text-primary flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-foreground truncate">{asset.filename}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(asset.fileSize)} • Uploaded{' '}
                            {new Date(asset.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {asset.url && (
                          <a href={asset.url} download>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-primary hover:bg-primary/10"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </a>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => deleteAsset(asset.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="p-6 space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-foreground">Upload Documents</h3>
                <Link href={`/project/${projectId}/upload-documents`}>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                    <Upload className="w-4 h-4" />
                    Upload Documents
                  </Button>
                </Link>
              </div>

              {documents.length === 0 ? (
                <div className="text-center py-8">
                  <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">No documents uploaded yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {documents.map((asset) => (
                    <div
                      key={asset.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <ImageIcon className="w-5 h-5 text-primary flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-foreground truncate">{asset.filename}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(asset.fileSize)} • Uploaded{' '}
                            {new Date(asset.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {asset.url && (
                          <a href={asset.url} download>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-primary hover:bg-primary/10"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </a>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => deleteAsset(asset.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </Card>
      </main>
    </div>
  )
}
