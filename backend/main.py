from fastapi import FastAPI, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi.middleware.cors import CORSMiddleware
from datetime import date
import random
import string

from database import engine, SessionLocal, Base
from models import Employee, Attendance
from schemas import (
    EmployeeCreate,
    EmployeeResponse,
    AttendanceCreate,
    AttendanceResponse,
)

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="HRMS API")

# ============================
# CORS
# ============================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================
# DB Dependency
# ============================
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

    # Ensure email is unique
    if db.query(Employee).filter(Employee.email == employee.email).first():
        raise HTTPException(status_code=400, detail="Email already exists")

    # Generate unique 5-character alphanumeric ID
    while True:
        generated_id = ''.join(random.choices(string.ascii_uppercase + string.digits, k=5))
        existing = db.query(Employee).filter(Employee.employee_id == generated_id).first()
        if not existing:
            break

    new_employee = Employee(
        employee_id=generated_id,
        full_name=employee.full_name,
        email=employee.email,
        department=employee.department
    )

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

    # Prevent duplicate marking for same date
    existing = db.query(Attendance).filter(
        Attendance.employee_id == attendance.employee_id,
        Attendance.date == attendance.date
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Attendance already marked for this date"
        )

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

    return db.query(Attendance).filter(
        Attendance.employee_id == employee_id
    ).all()


# ============================
# FILTER ATTENDANCE
# ============================

@app.get("/attendance")
def filter_attendance(
    employee_id: int | None = None,
    from_date: date | None = Query(None),
    to_date: date | None = Query(None),
    db: Session = Depends(get_db),
):

    query = db.query(Attendance)

    if employee_id:
        query = query.filter(Attendance.employee_id == employee_id)

    if from_date:
        query = query.filter(Attendance.date >= from_date)

    if to_date:
        query = query.filter(Attendance.date <= to_date)

    return query.all()


# ============================
# TOTAL PRESENT DAYS PER EMPLOYEE
# ============================

@app.get("/attendance/summary/{employee_id}")
def attendance_summary(employee_id: int, db: Session = Depends(get_db)):

    if not db.query(Employee).filter(Employee.id == employee_id).first():
        raise HTTPException(status_code=404, detail="Employee not found")

    total_present = (
        db.query(func.count(Attendance.id))
        .filter(
            Attendance.employee_id == employee_id,
            Attendance.status == "Present"
        )
        .scalar()
    )

    return {
        "employee_id": employee_id,
        "total_present_days": total_present
    }


# ============================
# DASHBOARD SUMMARY
# ============================

@app.get("/dashboard-summary")
def dashboard_summary(db: Session = Depends(get_db)):

    total_employees = db.query(func.count(Employee.id)).scalar()

    total_present = (
        db.query(func.count(Attendance.id))
        .filter(Attendance.status == "Present")
        .scalar()
    )

    total_absent = (
        db.query(func.count(Attendance.id))
        .filter(Attendance.status == "Absent")
        .scalar()
    )

    return {
        "total_employees": total_employees,
        "total_present": total_present,
        "total_absent": total_absent,
    }