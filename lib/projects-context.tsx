'use client'

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react'

export interface Project {
  id: string
  name: string
  description: string
  type: string
  clientName: string
  status: 'Active' | 'Completed' | 'On Hold'
  startDate: string
  category: string
  createdAt: string
}

interface ProjectsContextType {
  projects: Project[]
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => Promise<void>
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>
  deleteProject: (id: string) => Promise<void>
  getProject: (id: string) => Project | undefined
  fetchProjects: () => Promise<void>
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined)

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([])

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch('/api/projects')
      if (res.ok) {
        const data = await res.json()
        setProjects(data)
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error)
    }
  }, [])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const addProject = useCallback(async (projectData: Omit<Project, 'id' | 'createdAt'>) => {
    try {
      const res = await fetch('http://localhost:8000/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      })
      if (res.ok) {
        const newProject = await res.json()
        setProjects((prev) => [newProject, ...prev])
      }
    } catch (error) {
      console.error('Failed to add project:', error)
      throw error
    }
  }, [])

  const updateProject = useCallback(async (id: string, updates: Partial<Project>) => {
    try {
      const res = await fetch(`http://localhost:8000/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (res.ok) {
        const updatedProject = await res.json()
        setProjects((prev) =>
          prev.map((p) => (p.id === id ? updatedProject : p))
        )
      }
    } catch (error) {
      console.error('Failed to update project:', error)
      throw error
    }
  }, [])

  const deleteProject = useCallback(async (id: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/projects/${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete project:', error)
      throw error
    }
  }, [])

  const getProject = useCallback(
    (id: string) => projects.find((p) => p.id === id),
    [projects]
  )

  return (
    <ProjectsContext.Provider
      value={{ projects, addProject, updateProject, deleteProject, getProject, fetchProjects }}
    >
      {children}
    </ProjectsContext.Provider>
  )
}

export function useProjects() {
  const context = useContext(ProjectsContext)
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectsProvider')
  }
  return context
}
