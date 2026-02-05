from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "User"

    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    hashed_password = Column("password", String)
    created_at = Column("createdAt", DateTime, default=datetime.utcnow)
    updated_at = Column("updatedAt", DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Project(Base):
    __tablename__ = "Project"

    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)
    type = Column(String)
    client_name = Column("clientName", String)
    status = Column(String) # 'Active' | 'Completed' | 'On Hold'
    start_date = Column("startDate", String)
    category = Column(String)
    created_at = Column("createdAt", DateTime, default=datetime.utcnow)
    updated_at = Column("updatedAt", DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    assets = relationship("Asset", back_populates="project")

class Asset(Base):
    __tablename__ = "Asset"

    id = Column(String, primary_key=True, index=True)
    project_id = Column("projectId", String, ForeignKey("Project.id"))
    filename = Column(String)
    type = Column(String)   # 'diagram' | 'document'
    file_size = Column("fileSize", Integer)
    url = Column(String, nullable=True)
    uploaded_at = Column("uploadedAt", DateTime, default=datetime.utcnow)
    
    project = relationship("Project", back_populates="assets")

# Master Data Models

class TeamMember(Base):
    __tablename__ = "TeamMember"
    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    email = Column(String)
    phone = Column(String)
    designation = Column(String)
    department = Column(String)

class Designation(Base):
    __tablename__ = "Designation"
    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)

class Department(Base):
    __tablename__ = "Department"
    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)

class Contractor(Base):
    __tablename__ = "Contractor"
    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    email = Column(String)
    phone = Column(String)
    address = Column(String)
    specialization = Column(String)

class Supplier(Base):
    __tablename__ = "Supplier"
    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    email = Column(String)
    phone = Column(String)
    address = Column(String)
    product_category = Column("productCategory", String)

class Vendor(Base):
    __tablename__ = "Vendor"
    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    email = Column(String)
    phone = Column(String)
    address = Column(String)
    service_type = Column("serviceType", String)

class Equipment(Base):
    __tablename__ = "Equipment"
    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    type = Column(String)
    quantity = Column(Integer)
    status = Column(String) # 'Available' | 'In Use' | 'Maintenance'
    ownership_type = Column("ownershipType", String) # 'Owned' | 'Rented'

class Material(Base):
    __tablename__ = "Material"
    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    category = Column(String)
    unit = Column(String)
    quantity = Column(Float)
    unit_price = Column("unitPrice", Float)
