from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from datetime import date

from database import engine, SessionLocal, Base
from models import Employee, Attendance
from schemas import (
    EmployeeCreate,
    EmployeeResponse,
    AttendanceCreate,
    AttendanceResponse,
)

Base.metadata.create_all(bind=engine)

app = FastAPI(title="HRMS API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change to frontend URL after deployment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# DB dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def root():
    return {"message": "HRMS Backend Running"}


# ============================
# EMPLOYEE APIs
# ============================

@app.post("/employees", response_model=EmployeeResponse, status_code=status.HTTP_201_CREATED)
def create_employee(employee: EmployeeCreate, db: Session = Depends(get_db)):

    if db.query(Employee).filter(Employee.employee_id == employee.employee_id).first():
        raise HTTPException(status_code=400, detail="Employee ID already exists")

    if db.query(Employee).filter(Employee.email == employee.email).first():
        raise HTTPException(status_code=400, detail="Email already exists")

    new_employee = Employee(**employee.model_dump())
    db.add(new_employee)
    db.commit()
    db.refresh(new_employee)

    return new_employee


@app.get("/employees", response_model=list[EmployeeResponse])
def get_employees(db: Session = Depends(get_db)):
    return db.query(Employee).all()


@app.get("/employees/{employee_id}", response_model=EmployeeResponse)
def get_employee(employee_id: int, db: Session = Depends(get_db)):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()

    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    return employee


@app.delete("/employees/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_employee(employee_id: int, db: Session = Depends(get_db)):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()

    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    db.delete(employee)
    db.commit()

    return


# ============================
# ATTENDANCE APIs
# ============================

@app.post("/attendance", response_model=AttendanceResponse, status_code=201)
def mark_attendance(attendance: AttendanceCreate, db: Session = Depends(get_db)):

    employee = db.query(Employee).filter(Employee.id == attendance.employee_id).first()

    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    new_attendance = Attendance(
        employee_id=attendance.employee_id,
        date=attendance.date,
        status=attendance.status
    )

    db.add(new_attendance)
    db.commit()
    db.refresh(new_attendance)

    return new_attendance


@app.get("/attendance/{employee_id}", response_model=list[AttendanceResponse])
def get_attendance(employee_id: int, db: Session = Depends(get_db)):

    if not db.query(Employee).filter(Employee.id == employee_id).first():
        raise HTTPException(status_code=404, detail="Employee not found")

    return db.query(Attendance).filter(Attendance.employee_id == employee_id).all()