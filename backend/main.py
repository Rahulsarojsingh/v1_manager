from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
import crud, models, schemas
from database import SessionLocal, engine
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
from typing import List
import uvicorn
import os
from jose import JWTError, jwt

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS Setup
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
]

# Add FRONTEND_URL from environment variable (for deployment)
frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Auth Configuration
SECRET_KEY = "your-secret-key" # Change this in production!
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Routes
@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, email=form_data.username)
    if not user or not crud.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer", "user": user}

@app.post("/api/auth/signup", response_model=schemas.Token)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    new_user = crud.create_user(db=db, user=user)
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": new_user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer", "user": new_user}

@app.post("/api/auth/login", response_model=schemas.Token)
def login(login_req: schemas.UserCreate, db: Session = Depends(get_db)):
    # Note: Using UserCreate here just to reuse the schema, but in reality we might want a separate Login schema
    # Also, standard OAuth2 uses form data, but our frontend sends JSON.
    user = crud.get_user_by_email(db, email=login_req.email)
    if not user or not crud.verify_password(login_req.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer", "user": user}

@app.get("/api/projects", response_model=List[schemas.Project])
def read_projects(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    projects = crud.get_projects(db, skip=skip, limit=limit)
    return projects

@app.post("/api/projects", response_model=schemas.Project)
def create_project(project: schemas.ProjectCreate, db: Session = Depends(get_db)):
    return crud.create_project(db=db, project=project)

@app.put("/api/projects/{project_id}", response_model=schemas.Project)
def update_project(project_id: str, project: schemas.ProjectUpdate, db: Session = Depends(get_db)):
    db_project = crud.update_project(db, project_id, project)
    if db_project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return db_project

@app.delete("/api/projects/{project_id}")
def delete_project(project_id: str, db: Session = Depends(get_db)):
    success = crud.delete_project(db, project_id)
    if not success:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"ok": True}

# Master Data Endpoints

# TeamMember
@app.get("/api/team-members", response_model=List[schemas.TeamMember])
def read_team_members(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_team_members(db, skip=skip, limit=limit)

@app.post("/api/team-members", response_model=schemas.TeamMember)
def create_team_member(member: schemas.TeamMemberCreate, db: Session = Depends(get_db)):
    return crud.create_team_member(db=db, member=member)

@app.delete("/api/team-members/{member_id}")
def delete_team_member(member_id: str, db: Session = Depends(get_db)):
    success = crud.delete_team_member(db, member_id)
    if not success:
        raise HTTPException(status_code=404, detail="Team member not found")
    return {"ok": True}

# Designation
@app.get("/api/designations", response_model=List[schemas.Designation])
def read_designations(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_designations(db, skip=skip, limit=limit)

@app.post("/api/designations", response_model=schemas.Designation)
def create_designation(designation: schemas.DesignationCreate, db: Session = Depends(get_db)):
    return crud.create_designation(db=db, designation=designation)

@app.delete("/api/designations/{designation_id}")
def delete_designation(designation_id: str, db: Session = Depends(get_db)):
    success = crud.delete_designation(db, designation_id)
    if not success:
        raise HTTPException(status_code=404, detail="Designation not found")
    return {"ok": True}

# Department
@app.get("/api/departments", response_model=List[schemas.Department])
def read_departments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_departments(db, skip=skip, limit=limit)

@app.post("/api/departments", response_model=schemas.Department)
def create_department(department: schemas.DepartmentCreate, db: Session = Depends(get_db)):
    return crud.create_department(db=db, department=department)

@app.delete("/api/departments/{department_id}")
def delete_department(department_id: str, db: Session = Depends(get_db)):
    success = crud.delete_department(db, department_id)
    if not success:
        raise HTTPException(status_code=404, detail="Department not found")
    return {"ok": True}

# Contractor
@app.get("/api/contractors", response_model=List[schemas.Contractor])
def read_contractors(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_contractors(db, skip=skip, limit=limit)

@app.post("/api/contractors", response_model=schemas.Contractor)
def create_contractor(contractor: schemas.ContractorCreate, db: Session = Depends(get_db)):
    return crud.create_contractor(db=db, contractor=contractor)

@app.delete("/api/contractors/{contractor_id}")
def delete_contractor(contractor_id: str, db: Session = Depends(get_db)):
    success = crud.delete_contractor(db, contractor_id)
    if not success:
        raise HTTPException(status_code=404, detail="Contractor not found")
    return {"ok": True}

# Supplier
@app.get("/api/suppliers", response_model=List[schemas.Supplier])
def read_suppliers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_suppliers(db, skip=skip, limit=limit)

@app.post("/api/suppliers", response_model=schemas.Supplier)
def create_supplier(supplier: schemas.SupplierCreate, db: Session = Depends(get_db)):
    return crud.create_supplier(db=db, supplier=supplier)

@app.delete("/api/suppliers/{supplier_id}")
def delete_supplier(supplier_id: str, db: Session = Depends(get_db)):
    success = crud.delete_supplier(db, supplier_id)
    if not success:
        raise HTTPException(status_code=404, detail="Supplier not found")
    return {"ok": True}

# Vendor
@app.get("/api/vendors", response_model=List[schemas.Vendor])
def read_vendors(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_vendors(db, skip=skip, limit=limit)

@app.post("/api/vendors", response_model=schemas.Vendor)
def create_vendor(vendor: schemas.VendorCreate, db: Session = Depends(get_db)):
    return crud.create_vendor(db=db, vendor=vendor)

@app.delete("/api/vendors/{vendor_id}")
def delete_vendor(vendor_id: str, db: Session = Depends(get_db)):
    success = crud.delete_vendor(db, vendor_id)
    if not success:
        raise HTTPException(status_code=404, detail="Vendor not found")
    return {"ok": True}

# Equipment
@app.get("/api/equipment", response_model=List[schemas.Equipment])
def read_equipment(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_equipment(db, skip=skip, limit=limit)

@app.post("/api/equipment", response_model=schemas.Equipment)
def create_equipment(equipment: schemas.EquipmentCreate, db: Session = Depends(get_db)):
    return crud.create_equipment(db=db, equipment=equipment)

@app.delete("/api/equipment/{equipment_id}")
def delete_equipment(equipment_id: str, db: Session = Depends(get_db)):
    success = crud.delete_equipment(db, equipment_id)
    if not success:
        raise HTTPException(status_code=404, detail="Equipment not found")
    return {"ok": True}

# Material
@app.get("/api/materials", response_model=List[schemas.Material])
def read_materials(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_materials(db, skip=skip, limit=limit)

@app.post("/api/materials", response_model=schemas.Material)
def create_material(material: schemas.MaterialCreate, db: Session = Depends(get_db)):
    return crud.create_material(db=db, material=material)

@app.delete("/api/materials/{material_id}")
def delete_material(material_id: str, db: Session = Depends(get_db)):
    success = crud.delete_material(db, material_id)
    if not success:
        raise HTTPException(status_code=404, detail="Material not found")
    return {"ok": True}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
