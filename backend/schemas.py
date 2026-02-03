from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# User Schemas
class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    password: str
    name: Optional[str] = None

class User(UserBase):
    id: str
    name: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: User

class TokenData(BaseModel):
    email: Optional[str] = None

# Project Schemas
class ProjectBase(BaseModel):
    name: str
    description: str
    type: str
    client_name: str
    status: str
    start_date: str
    category: str

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    type: Optional[str] = None
    client_name: Optional[str] = None
    status: Optional[str] = None
    start_date: Optional[str] = None
    category: Optional[str] = None

class Project(ProjectBase):
    id: str
    created_at: datetime
    updated_at: datetime
    # assets: List[Asset] = [] # Uncomment when Asset schema is defined

    class Config:
        from_attributes = True

# Master Data Schemas

# TeamMember
class TeamMemberBase(BaseModel):
    name: str
    email: str
    phone: str
    designation: str
    department: str

class TeamMemberCreate(TeamMemberBase):
    pass

class TeamMember(TeamMemberBase):
    id: str
    class Config:
        from_attributes = True

# Designation
class DesignationBase(BaseModel):
    name: str
    description: str

class DesignationCreate(DesignationBase):
    pass

class Designation(DesignationBase):
    id: str
    class Config:
        from_attributes = True

# Department
class DepartmentBase(BaseModel):
    name: str
    description: str

class DepartmentCreate(DepartmentBase):
    pass

class Department(DepartmentBase):
    id: str
    class Config:
        from_attributes = True

# Contractor
class ContractorBase(BaseModel):
    name: str
    email: str
    phone: str
    address: str
    specialization: str

class ContractorCreate(ContractorBase):
    pass

class Contractor(ContractorBase):
    id: str
    class Config:
        from_attributes = True

# Supplier
class SupplierBase(BaseModel):
    name: str
    email: str
    phone: str
    address: str
    product_category: str

class SupplierCreate(SupplierBase):
    pass

class Supplier(SupplierBase):
    id: str
    class Config:
        from_attributes = True

# Vendor
class VendorBase(BaseModel):
    name: str
    email: str
    phone: str
    address: str
    service_type: str

class VendorCreate(VendorBase):
    pass

class Vendor(VendorBase):
    id: str
    class Config:
        from_attributes = True

# Equipment
class EquipmentBase(BaseModel):
    name: str
    type: str
    quantity: int
    status: str
    ownership_type: str

class EquipmentCreate(EquipmentBase):
    pass

class Equipment(EquipmentBase):
    id: str
    class Config:
        from_attributes = True

# Material
class MaterialBase(BaseModel):
    name: str
    category: str
    unit: str
    quantity: float
    unit_price: float

class MaterialCreate(MaterialBase):
    pass

class Material(MaterialBase):
    id: str
    class Config:
        from_attributes = True
