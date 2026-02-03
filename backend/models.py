from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    hashed_password = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Project(Base):
    __tablename__ = "projects"

    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)
    type = Column(String)
    client_name = Column(String)
    status = Column(String) # 'Active' | 'Completed' | 'On Hold'
    start_date = Column(String)
    category = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    assets = relationship("Asset", back_populates="project")

class Asset(Base):
    __tablename__ = "assets"

    id = Column(String, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("projects.id"))
    filename = Column(String)
    type = Column(String)   # 'diagram' | 'document'
    file_size = Column(Integer)
    url = Column(String, nullable=True)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    
    project = relationship("Project", back_populates="assets")

# Master Data Models

class TeamMember(Base):
    __tablename__ = "team_members"
    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    email = Column(String)
    phone = Column(String)
    designation = Column(String)
    department = Column(String)

class Designation(Base):
    __tablename__ = "designations"
    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)

class Department(Base):
    __tablename__ = "departments"
    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)

class Contractor(Base):
    __tablename__ = "contractors"
    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    email = Column(String)
    phone = Column(String)
    address = Column(String)
    specialization = Column(String)

class Supplier(Base):
    __tablename__ = "suppliers"
    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    email = Column(String)
    phone = Column(String)
    address = Column(String)
    product_category = Column(String)

class Vendor(Base):
    __tablename__ = "vendors"
    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    email = Column(String)
    phone = Column(String)
    address = Column(String)
    service_type = Column(String)

class Equipment(Base):
    __tablename__ = "equipment"
    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    type = Column(String)
    quantity = Column(Integer)
    status = Column(String)
    ownership_type = Column(String)

class Material(Base):
    __tablename__ = "materials"
    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    category = Column(String)
    unit = Column(String)
    quantity = Column(Float)
    unit_price = Column(Float)
