'use client'

import React from "react"

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { useProjects } from '@/lib/projects-context'
import { useAssets } from '@/lib/assets-context'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, Upload, ImageIcon, AlertCircle, Loader2, CheckCircle } from 'lucide-react'

export default function UploadDiagramPage() {
  const router = useRouter()
  const params = useParams()
  const { token } = useAuth()
  const { getProject } = useProjects()
  const { addAsset } = useAssets()

  const projectId = params.id as string
  const project = getProject(projectId)

  const [isLoading, setIsLoading] = useState(true)
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)

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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="w-12 h-12 text-destructive mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Project Not Found</h1>
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Accept images and PDFs
      const validTypes = ['image/png', 'image/jpeg', 'image/gif', 'application/pdf']
      if (validTypes.includes(selectedFile.type)) {
        setFile(selectedFile)
      } else {
        alert('Please select an image (PNG, JPG, GIF) or PDF file')
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      alert('Please select a file')
      return
    }

    setIsUploading(true)
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      addAsset({
        projectId,
        filename: file.name,
        type: 'diagram',
        fileSize: file.size,
        url: URL.createObjectURL(file),
      })

      setUploadSuccess(true)
      setFile(null)

      // Redirect after success
      setTimeout(() => {
        router.push(`/project/${projectId}`)
      }, 2000)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="noise-overlay" aria-hidden="true" />

      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Link href={`/project/${projectId}`}>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold font-display text-foreground">Upload Diagram</h1>
            <p className="text-sm text-muted-foreground">Upload diagrams or images for {project.name}</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="p-8 border-border">
          {uploadSuccess ? (
            // Success State
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">Upload Successful!</h2>
              <p className="text-muted-foreground mb-6">
                Your diagram "{file?.name || 'file'}" has been uploaded successfully.
              </p>
              <p className="text-sm text-muted-foreground">Redirecting to project...</p>
            </div>
          ) : (
            // Upload Form
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* File Input Area */}
              <div className="flex items-center justify-center">
                <label
                  htmlFor="file-input"
                  className="w-full px-6 py-12 border-2 border-dashed border-border rounded-lg hover:border-primary/50 transition-colors cursor-pointer bg-secondary/50"
                >
                  <div className="flex flex-col items-center justify-center text-center">
                    <ImageIcon className="w-12 h-12 text-muted-foreground mb-3" />
                    <p className="text-lg font-semibold text-foreground mb-1">
                      {file ? file.name : 'Drop your diagram here'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      or click to select a file
                    </p>
                    <p className="text-xs text-muted-foreground mt-3">
                      PNG, JPG, GIF, or PDF (up to 10MB)
                    </p>
                  </div>
                  <input
                    id="file-input"
                    type="file"
                    accept=".png,.jpg,.jpeg,.gif,.pdf"
                    onChange={handleFileChange}
                    disabled={isUploading}
                    className="hidden"
                  />
                </label>
              </div>

              {/* File Details */}
              {file && (
                <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
                  <p className="text-sm font-medium text-foreground">
                    File: <span className="font-semibold">{file.name}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Size: {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-6 border-t border-border">
                <Link href={`/project/${projectId}`} className="flex-1">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-border text-foreground hover:bg-secondary bg-transparent"
                    disabled={isUploading}
                  >
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  disabled={!file || isUploading}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Diagram
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </Card>
      </main>
    </div>
  )
}
