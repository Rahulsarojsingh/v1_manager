from sqlalchemy.orm import Session
import models, schemas
import uuid
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        id=str(uuid.uuid4()),
        email=user.email,
        name=user.name,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_projects(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Project).offset(skip).limit(limit).all()

def get_project(db: Session, project_id: str):
    return db.query(models.Project).filter(models.Project.id == project_id).first()

def create_project(db: Session, project: schemas.ProjectCreate):
    db_project = models.Project(
        id=str(uuid.uuid4()),
        name=project.name,
        description=project.description,
        type=project.type,
        client_name=project.client_name,
        status=project.status,
        start_date=project.start_date,
        category=project.category
    )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

def update_project(db: Session, project_id: str, project: schemas.ProjectUpdate):
    db_project = get_project(db, project_id)
    if not db_project:
        return None
    
    update_data = project.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_project, key, value)
    
    db.commit()
    db.refresh(db_project)
    return db_project

def delete_project(db: Session, project_id: str):
    db_project = get_project(db, project_id)
    if db_project:
        db.delete(db_project)
        db.commit()
        return True
    return False

# Master Data CRUD

# TeamMember
def get_team_members(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.TeamMember).offset(skip).limit(limit).all()

def create_team_member(db: Session, member: schemas.TeamMemberCreate):
    db_member = models.TeamMember(
        id=str(uuid.uuid4()),
        **member.dict()
    )
    db.add(db_member)
    db.commit()
    db.refresh(db_member)
    return db_member

def delete_team_member(db: Session, member_id: str):
    db_member = db.query(models.TeamMember).filter(models.TeamMember.id == member_id).first()
    if db_member:
        db.delete(db_member)
        db.commit()
        return True
    return False

# Designation
def get_designations(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Designation).offset(skip).limit(limit).all()

def create_designation(db: Session, designation: schemas.DesignationCreate):
    db_designation = models.Designation(
        id=str(uuid.uuid4()),
        **designation.dict()
    )
    db.add(db_designation)
    db.commit()
    db.refresh(db_designation)
    return db_designation

def delete_designation(db: Session, designation_id: str):
    db_designation = db.query(models.Designation).filter(models.Designation.id == designation_id).first()
    if db_designation:
        db.delete(db_designation)
        db.commit()
        return True
    return False

# Department
def get_departments(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Department).offset(skip).limit(limit).all()

def create_department(db: Session, department: schemas.DepartmentCreate):
    db_department = models.Department(
        id=str(uuid.uuid4()),
        **department.dict()
    )
    db.add(db_department)
    db.commit()
    db.refresh(db_department)
    return db_department

def delete_department(db: Session, department_id: str):
    db_department = db.query(models.Department).filter(models.Department.id == department_id).first()
    if db_department:
        db.delete(db_department)
        db.commit()
        return True
    return False

# Contractor
def get_contractors(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Contractor).offset(skip).limit(limit).all()

def create_contractor(db: Session, contractor: schemas.ContractorCreate):
    db_contractor = models.Contractor(
        id=str(uuid.uuid4()),
        **contractor.dict()
    )
    db.add(db_contractor)
    db.commit()
    db.refresh(db_contractor)
    return db_contractor

def delete_contractor(db: Session, contractor_id: str):
    db_contractor = db.query(models.Contractor).filter(models.Contractor.id == contractor_id).first()
    if db_contractor:
        db.delete(db_contractor)
        db.commit()
        return True
    return False

# Supplier
def get_suppliers(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Supplier).offset(skip).limit(limit).all()

def create_supplier(db: Session, supplier: schemas.SupplierCreate):
    db_supplier = models.Supplier(
        id=str(uuid.uuid4()),
        **supplier.dict()
    )
    db.add(db_supplier)
    db.commit()
    db.refresh(db_supplier)
    return db_supplier

def delete_supplier(db: Session, supplier_id: str):
    db_supplier = db.query(models.Supplier).filter(models.Supplier.id == supplier_id).first()
    if db_supplier:
        db.delete(db_supplier)
        db.commit()
        return True
    return False

# Vendor
def get_vendors(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Vendor).offset(skip).limit(limit).all()

def create_vendor(db: Session, vendor: schemas.VendorCreate):
    db_vendor = models.Vendor(
        id=str(uuid.uuid4()),
        **vendor.dict()
    )
    db.add(db_vendor)
    db.commit()
    db.refresh(db_vendor)
    return db_vendor

def delete_vendor(db: Session, vendor_id: str):
    db_vendor = db.query(models.Vendor).filter(models.Vendor.id == vendor_id).first()
    if db_vendor:
        db.delete(db_vendor)
        db.commit()
        return True
    return False

# Equipment
def get_equipment(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Equipment).offset(skip).limit(limit).all()

def create_equipment(db: Session, equipment: schemas.EquipmentCreate):
    db_equipment = models.Equipment(
        id=str(uuid.uuid4()),
        **equipment.dict()
    )
    db.add(db_equipment)
    db.commit()
    db.refresh(db_equipment)
    return db_equipment

def delete_equipment(db: Session, equipment_id: str):
    db_equipment = db.query(models.Equipment).filter(models.Equipment.id == equipment_id).first()
    if db_equipment:
        db.delete(db_equipment)
        db.commit()
        return True
    return False

# Material
def get_materials(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Material).offset(skip).limit(limit).all()

def create_material(db: Session, material: schemas.MaterialCreate):
    db_material = models.Material(
        id=str(uuid.uuid4()),
        **material.dict()
    )
    db.add(db_material)
    db.commit()
    db.refresh(db_material)
    return db_material

def delete_material(db: Session, material_id: str):
    db_material = db.query(models.Material).filter(models.Material.id == material_id).first()
    if db_material:
        db.delete(db_material)
        db.commit()
        return True
    return False
