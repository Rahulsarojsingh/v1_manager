'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

export interface Asset {
  id: string
  projectId: string
  filename: string
  type: 'diagram' | 'document'
  fileSize: number
  uploadedAt: string
  url?: string
}

interface AssetsContextType {
  assets: Asset[]
  addAsset: (asset: Omit<Asset, 'id' | 'uploadedAt'>) => void
  deleteAsset: (id: string) => void
  getProjectAssets: (projectId: string) => Asset[]
  getDiagrams: (projectId: string) => Asset[]
  getDocuments: (projectId: string) => Asset[]
}

const AssetsContext = createContext<AssetsContextType | undefined>(undefined)

export function AssetsProvider({ children }: { children: ReactNode }) {
  const [assets, setAssets] = useState<Asset[]>([
    {
      id: '1',
      projectId: '1',
      filename: 'Wireframes.pdf',
      type: 'diagram',
      fileSize: 2048000,
      uploadedAt: '2024-01-15',
      url: '/assets/wireframes.pdf',
    },
    {
      id: '2',
      projectId: '1',
      filename: 'requirements.docx',
      type: 'document',
      fileSize: 512000,
      uploadedAt: '2024-01-16',
      url: '/assets/requirements.docx',
    },
    {
      id: '3',
      projectId: '2',
      filename: 'App-Mockups.pdf',
      type: 'diagram',
      fileSize: 3500000,
      uploadedAt: '2024-02-01',
      url: '/assets/app-mockups.pdf',
    },
  ])

  const addAsset = useCallback((asset: Omit<Asset, 'id' | 'uploadedAt'>) => {
    const newAsset: Asset = {
      ...asset,
      id: Math.random().toString(36).substr(2, 9),
      uploadedAt: new Date().toISOString(),
    }
    setAssets((prev) => [newAsset, ...prev])
  }, [])

  const deleteAsset = useCallback((id: string) => {
    setAssets((prev) => prev.filter((a) => a.id !== id))
  }, [])

  const getProjectAssets = useCallback(
    (projectId: string) => assets.filter((a) => a.projectId === projectId),
    [assets]
  )

  const getDiagrams = useCallback(
    (projectId: string) =>
      assets.filter((a) => a.projectId === projectId && a.type === 'diagram'),
    [assets]
  )

  const getDocuments = useCallback(
    (projectId: string) =>
      assets.filter((a) => a.projectId === projectId && a.type === 'document'),
    [assets]
  )

  return (
    <AssetsContext.Provider
      value={{ assets, addAsset, deleteAsset, getProjectAssets, getDiagrams, getDocuments }}
    >
      {children}
    </AssetsContext.Provider>
  )
}

export function useAssets() {
  const context = useContext(AssetsContext)
  if (context === undefined) {
    throw new Error('useAssets must be used within an AssetsProvider')
  }
  return context
}
