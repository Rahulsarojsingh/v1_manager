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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Trash2, ArrowLeft, Users, Briefcase, Building2 } from 'lucide-react'

export default function TeamManagementPage() {
  const router = useRouter()
  const { token } = useAuth()
  const { teamMembers, designations, departments, addTeamMember, deleteTeamMember, addDesignation, addDepartment } = useMasterData()
  const [isLoading, setIsLoading] = useState(true)
  
  // Form states
  const [teamMemberForm, setTeamMemberForm] = useState({ name: '', email: '', phone: '', designation: '', department: '' })
  const [designationForm, setDesignationForm] = useState({ name: '', description: '' })
  const [departmentForm, setDepartmentForm] = useState({ name: '', description: '' })

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

  const handleAddTeamMember = (e: React.FormEvent) => {
    e.preventDefault()
    addTeamMember({
      id: Date.now().toString(),
      ...teamMemberForm
    })
    setTeamMemberForm({ name: '', email: '', phone: '', designation: '', department: '' })
  }

  const handleAddDesignation = (e: React.FormEvent) => {
    e.preventDefault()
    addDesignation({
      id: Date.now().toString(),
      ...designationForm
    })
    setDesignationForm({ name: '', description: '' })
  }

  const handleAddDepartment = (e: React.FormEvent) => {
    e.preventDefault()
    addDepartment({
      id: Date.now().toString(),
      ...departmentForm
    })
    setDepartmentForm({ name: '', description: '' })
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
              <h1 className="text-2xl font-bold text-foreground">Team Management</h1>
              <p className="text-sm text-muted-foreground mt-1">Add team members, designations and departments</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="members" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="members">Team Members</TabsTrigger>
            <TabsTrigger value="designations">Designations</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
          </TabsList>

          {/* Team Members Tab */}
          <TabsContent value="members" className="space-y-6">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Team Member
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Team Member</DialogTitle>
                  <DialogDescription>Add a new team member to your organization</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddTeamMember} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={teamMemberForm.name}
                      onChange={(e) => setTeamMemberForm({ ...teamMemberForm, name: e.target.value })}
                      placeholder="Enter name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={teamMemberForm.email}
                      onChange={(e) => setTeamMemberForm({ ...teamMemberForm, email: e.target.value })}
                      placeholder="Enter email"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={teamMemberForm.phone}
                      onChange={(e) => setTeamMemberForm({ ...teamMemberForm, phone: e.target.value })}
                      placeholder="Enter phone"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="designation">Designation</Label>
                    <Input
                      id="designation"
                      value={teamMemberForm.designation}
                      onChange={(e) => setTeamMemberForm({ ...teamMemberForm, designation: e.target.value })}
                      placeholder="Enter designation"
                    />
                  </div>
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={teamMemberForm.department}
                      onChange={(e) => setTeamMemberForm({ ...teamMemberForm, department: e.target.value })}
                      placeholder="Enter department"
                    />
                  </div>
                  <Button type="submit" className="w-full">Add Member</Button>
                </form>
              </DialogContent>
            </Dialog>

            {teamMembers.length === 0 ? (
              <Card className="p-12 border-dashed">
                <div className="flex flex-col items-center justify-center text-center">
                  <Users className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No team members yet</h3>
                  <p className="text-sm text-muted-foreground">Add your first team member to get started</p>
                </div>
              </Card>
            ) : (
              <div className="grid gap-4">
                {teamMembers.map((member) => (
                  <Card key={member.id} className="p-4 border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">{member.name}</h3>
                        <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-muted-foreground">
                          <p>Email: {member.email}</p>
                          <p>Phone: {member.phone}</p>
                          <p>Designation: {member.designation}</p>
                          <p>Department: {member.department}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => deleteTeamMember(member.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Designations Tab */}
          <TabsContent value="designations" className="space-y-6">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Designation
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Designation</DialogTitle>
                  <DialogDescription>Add a new job designation for your team</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddDesignation} className="space-y-4">
                  <div>
                    <Label htmlFor="des-name">Name</Label>
                    <Input
                      id="des-name"
                      value={designationForm.name}
                      onChange={(e) => setDesignationForm({ ...designationForm, name: e.target.value })}
                      placeholder="e.g., Project Manager"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="des-desc">Description</Label>
                    <Input
                      id="des-desc"
                      value={designationForm.description}
                      onChange={(e) => setDesignationForm({ ...designationForm, description: e.target.value })}
                      placeholder="Enter description"
                    />
                  </div>
                  <Button type="submit" className="w-full">Add Designation</Button>
                </form>
              </DialogContent>
            </Dialog>

            {designations.length === 0 ? (
              <Card className="p-12 border-dashed">
                <div className="flex flex-col items-center justify-center text-center">
                  <Briefcase className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No designations yet</h3>
                  <p className="text-sm text-muted-foreground">Add your first designation to get started</p>
                </div>
              </Card>
            ) : (
              <div className="grid gap-4">
                {designations.map((designation) => (
                  <Card key={designation.id} className="p-4 border-border">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">{designation.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{designation.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Departments Tab */}
          <TabsContent value="departments" className="space-y-6">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Department
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Department</DialogTitle>
                  <DialogDescription>Add a new department to your organization</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddDepartment} className="space-y-4">
                  <div>
                    <Label htmlFor="dept-name">Name</Label>
                    <Input
                      id="dept-name"
                      value={departmentForm.name}
                      onChange={(e) => setDepartmentForm({ ...departmentForm, name: e.target.value })}
                      placeholder="e.g., Construction"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="dept-desc">Description</Label>
                    <Input
                      id="dept-desc"
                      value={departmentForm.description}
                      onChange={(e) => setDepartmentForm({ ...departmentForm, description: e.target.value })}
                      placeholder="Enter description"
                    />
                  </div>
                  <Button type="submit" className="w-full">Add Department</Button>
                </form>
              </DialogContent>
            </Dialog>

            {departments.length === 0 ? (
              <Card className="p-12 border-dashed">
                <div className="flex flex-col items-center justify-center text-center">
                  <Building2 className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No departments yet</h3>
                  <p className="text-sm text-muted-foreground">Add your first department to get started</p>
                </div>
              </Card>
            ) : (
              <div className="grid gap-4">
                {departments.map((department) => (
                  <Card key={department.id} className="p-4 border-border">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">{department.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{department.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
