from pydantic import BaseModel, EmailStr
from datetime import date


# =========================
# EMPLOYEE SCHEMAS
# =========================

class EmployeeCreate(BaseModel):
    full_name: str
    email: EmailStr
    department: str


class EmployeeResponse(BaseModel):
    id: int
    employee_id: str
    full_name: str
    email: EmailStr
    department: str

    class Config:
        from_attributes = True


# =========================
# ATTENDANCE SCHEMAS
# =========================

class AttendanceCreate(BaseModel):
    employee_id: int
    date: date
    status: str


class AttendanceResponse(BaseModel):
    id: int
    date: date
    status: str
    employee_id: int

    class Config:
        from_attributes = True