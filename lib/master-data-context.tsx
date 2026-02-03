'use client'

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react'

export interface TeamMember {
  id: string
  name: string
  email: string
  phone: string
  designation: string
  department: string
}

export interface Designation {
  id: string
  name: string
  description: string
}

export interface Department {
  id: string
  name: string
  description: string
}

export interface Contractor {
  id: string
  name: string
  email: string
  phone: string
  address: string
  specialization: string
}

export interface Supplier {
  id: string
  name: string
  email: string
  phone: string
  address: string
  productCategory: string
}

export interface Vendor {
  id: string
  name: string
  email: string
  phone: string
  address: string
  serviceType: string
}

export interface Equipment {
  id: string
  name: string
  type: string
  quantity: number
  status: 'Available' | 'In Use' | 'Maintenance'
  ownershipType: 'Owned' | 'Rented'
}

export interface Material {
  id: string
  name: string
  category: string
  unit: string
  quantity: number
  unitPrice: number
}

interface MasterDataContextType {
  teamMembers: TeamMember[]
  designations: Designation[]
  departments: Department[]
  contractors: Contractor[]
  suppliers: Supplier[]
  vendors: Vendor[]
  equipment: Equipment[]
  materials: Material[]
  
  addTeamMember: (member: TeamMember) => Promise<void>
  deleteTeamMember: (id: string) => Promise<void>
  addDesignation: (designation: Designation) => Promise<void>
  addDepartment: (department: Department) => Promise<void>
  addContractor: (contractor: Contractor) => Promise<void>
  deleteContractor: (id: string) => Promise<void>
  addSupplier: (supplier: Supplier) => Promise<void>
  deleteSupplier: (id: string) => Promise<void>
  addVendor: (vendor: Vendor) => Promise<void>
  deleteVendor: (id: string) => Promise<void>
  addEquipment: (equipment: Equipment) => Promise<void>
  deleteEquipment: (id: string) => Promise<void>
  addMaterial: (material: Material) => Promise<void>
  deleteMaterial: (id: string) => Promise<void>
}

const MasterDataContext = createContext<MasterDataContextType | undefined>(undefined)

export function MasterDataProvider({ children }: { children: ReactNode }) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [designations, setDesignations] = useState<Designation[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [contractors, setContractors] = useState<Contractor[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [materials, setMaterials] = useState<Material[]>([])

  const fetchMasterData = useCallback(async () => {
    try {
      const [teamRes, desigRes, deptRes, contRes, suppRes, vendRes, equipRes, matRes] = await Promise.all([
        fetch('/api/team-members'),
        fetch('/api/designations'),
        fetch('/api/departments'),
        fetch('/api/contractors'),
        fetch('/api/suppliers'),
        fetch('/api/vendors'),
        fetch('/api/equipment'),
        fetch('/api/materials')
      ])

      if (teamRes.ok) setTeamMembers(await teamRes.json())
      if (desigRes.ok) setDesignations(await desigRes.json())
      if (deptRes.ok) setDepartments(await deptRes.json())
      if (contRes.ok) setContractors(await contRes.json())
      
      if (suppRes.ok) {
        const data = await suppRes.json()
        setSuppliers(data.map((d: any) => ({ ...d, productCategory: d.product_category })))
      }

      if (vendRes.ok) {
        const data = await vendRes.json()
        setVendors(data.map((d: any) => ({ ...d, serviceType: d.service_type })))
      }

      if (equipRes.ok) {
        const data = await equipRes.json()
        setEquipment(data.map((d: any) => ({ ...d, ownershipType: d.ownership_type })))
      }

      if (matRes.ok) {
        const data = await matRes.json()
        setMaterials(data.map((d: any) => ({ ...d, unitPrice: d.unit_price })))
      }

    } catch (error) {
      console.error("Error fetching master data:", error)
    }
  }, [])

  useEffect(() => {
    fetchMasterData()
  }, [fetchMasterData])

  const addTeamMember = async (member: TeamMember) => {
    try {
      const res = await fetch('/api/team-members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(member)
      })
      if (res.ok) {
        const newItem = await res.json()
        setTeamMembers((prev) => [...prev, newItem])
      }
    } catch (error) {
      console.error("Error adding team member:", error)
    }
  }

  const deleteTeamMember = async (id: string) => {
    try {
      const res = await fetch(`/api/team-members/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setTeamMembers((prev) => prev.filter(m => m.id !== id))
      }
    } catch (error) {
      console.error("Error deleting team member:", error)
    }
  }

  const addDesignation = async (designation: Designation) => {
    try {
      const res = await fetch('/api/designations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(designation)
      })
      if (res.ok) {
        const newItem = await res.json()
        setDesignations((prev) => [...prev, newItem])
      }
    } catch (error) {
      console.error("Error adding designation:", error)
    }
  }

  const addDepartment = async (department: Department) => {
    try {
      const res = await fetch('/api/departments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(department)
      })
      if (res.ok) {
        const newItem = await res.json()
        setDepartments((prev) => [...prev, newItem])
      }
    } catch (error) {
      console.error("Error adding department:", error)
    }
  }

  const addContractor = async (contractor: Contractor) => {
    try {
      const res = await fetch('/api/contractors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contractor)
      })
      if (res.ok) {
        const newItem = await res.json()
        setContractors((prev) => [...prev, newItem])
      }
    } catch (error) {
      console.error("Error adding contractor:", error)
    }
  }

  const deleteContractor = async (id: string) => {
    try {
      const res = await fetch(`/api/contractors/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setContractors((prev) => prev.filter(c => c.id !== id))
      }
    } catch (error) {
      console.error("Error deleting contractor:", error)
    }
  }

  const addSupplier = async (supplier: Supplier) => {
    try {
      const payload = { ...supplier, product_category: supplier.productCategory }
      const res = await fetch('/api/suppliers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        const data = await res.json()
        const newItem = { ...data, productCategory: data.product_category }
        setSuppliers((prev) => [...prev, newItem])
      }
    } catch (error) {
      console.error("Error adding supplier:", error)
    }
  }

  const deleteSupplier = async (id: string) => {
    try {
      const res = await fetch(`/api/suppliers/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setSuppliers((prev) => prev.filter(s => s.id !== id))
      }
    } catch (error) {
      console.error("Error deleting supplier:", error)
    }
  }

  const addVendor = async (vendor: Vendor) => {
    try {
      const payload = { ...vendor, service_type: vendor.serviceType }
      const res = await fetch('/api/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        const data = await res.json()
        const newItem = { ...data, serviceType: data.service_type }
        setVendors((prev) => [...prev, newItem])
      }
    } catch (error) {
      console.error("Error adding vendor:", error)
    }
  }

  const deleteVendor = async (id: string) => {
    try {
      const res = await fetch(`/api/vendors/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setVendors((prev) => prev.filter(v => v.id !== id))
      }
    } catch (error) {
      console.error("Error deleting vendor:", error)
    }
  }

  const addEquipment = async (equip: Equipment) => {
    try {
      const payload = { ...equip, ownership_type: equip.ownershipType }
      const res = await fetch('/api/equipment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        const data = await res.json()
        const newItem = { ...data, ownershipType: data.ownership_type }
        setEquipment((prev) => [...prev, newItem])
      }
    } catch (error) {
      console.error("Error adding equipment:", error)
    }
  }

  const deleteEquipment = async (id: string) => {
    try {
      const res = await fetch(`/api/equipment/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setEquipment((prev) => prev.filter(e => e.id !== id))
      }
    } catch (error) {
      console.error("Error deleting equipment:", error)
    }
  }

  const addMaterial = async (material: Material) => {
    try {
      const payload = { ...material, unit_price: material.unitPrice }
      const res = await fetch('/api/materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        const data = await res.json()
        const newItem = { ...data, unitPrice: data.unit_price }
        setMaterials((prev) => [...prev, newItem])
      }
    } catch (error) {
      console.error("Error adding material:", error)
    }
  }

  const deleteMaterial = async (id: string) => {
    try {
      const res = await fetch(`/api/materials/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setMaterials((prev) => prev.filter(m => m.id !== id))
      }
    } catch (error) {
      console.error("Error deleting material:", error)
    }
  }

  return (
    <MasterDataContext.Provider
      value={{
        teamMembers,
        designations,
        departments,
        contractors,
        suppliers,
        vendors,
        equipment,
        materials,
        addTeamMember,
        deleteTeamMember,
        addDesignation,
        addDepartment,
        addContractor,
        deleteContractor,
        addSupplier,
        deleteSupplier,
        addVendor,
        deleteVendor,
        addEquipment,
        deleteEquipment,
        addMaterial,
        deleteMaterial,
      }}
    >
      {children}
    </MasterDataContext.Provider>
  )
}

export function useMasterData() {
  const context = useContext(MasterDataContext)
  if (context === undefined) {
    throw new Error('useMasterData must be used within MasterDataProvider')
  }
  return context
}
