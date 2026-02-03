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
import { ArrowLeft, Upload, File, AlertCircle, Loader2, CheckCircle, X } from 'lucide-react'

export default function UploadDocumentsPage() {
  const router = useRouter()
  const params = useParams()
  const { token } = useAuth()
  const { getProject } = useProjects()
  const { addAsset } = useAssets()

  const projectId = params.id as string
  const project = getProject(projectId)

  const [isLoading, setIsLoading] = useState(true)
  const [files, setFiles] = useState<File[]>([])
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
    const selectedFiles = Array.from(e.target.files || [])
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
    ]

    const validFiles = selectedFiles.filter((file) => validTypes.includes(file.type))

    if (validFiles.length !== selectedFiles.length) {
      alert('Some files were not added. Please select valid document types (PDF, DOC, DOCX, XLS, XLSX, TXT)')
    }

    setFiles((prev) => [...prev, ...validFiles])
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (files.length === 0) {
      alert('Please select at least one file')
      return
    }

    setIsUploading(true)
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Add each file as an asset
      files.forEach((file) => {
        addAsset({
          projectId,
          filename: file.name,
          type: 'document',
          fileSize: file.size,
          url: URL.createObjectURL(file),
        })
      })

      setUploadSuccess(true)
      setFiles([])

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
            <h1 className="text-2xl font-bold font-display text-foreground">Upload Documents</h1>
            <p className="text-sm text-muted-foreground">Upload documents for {project.name}</p>
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
                {files.length} document{files.length !== 1 ? 's' : ''} have been uploaded successfully.
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
                    <File className="w-12 h-12 text-muted-foreground mb-3" />
                    <p className="text-lg font-semibold text-foreground mb-1">
                      Drop documents here
                    </p>
                    <p className="text-sm text-muted-foreground">
                      or click to select files
                    </p>
                    <p className="text-xs text-muted-foreground mt-3">
                      PDF, DOC, DOCX, XLS, XLSX, or TXT (up to 10MB each)
                    </p>
                  </div>
                  <input
                    id="file-input"
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                    onChange={handleFileChange}
                    disabled={isUploading}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Selected Files */}
              {files.length > 0 && (
                <div className="space-y-2 p-4 bg-primary/10 border border-primary/30 rounded-lg">
                  <p className="text-sm font-medium text-foreground mb-3">
                    Selected Files ({files.length})
                  </p>
                  <div className="space-y-2">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-secondary/50 rounded">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <File className="w-4 h-4 text-primary flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(file.size / 1024).toFixed(2)} KB
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-muted-foreground hover:text-destructive flex-shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
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
                  disabled={files.length === 0 || isUploading}
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
                      Upload {files.length} Document{files.length !== 1 ? 's' : ''}
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
