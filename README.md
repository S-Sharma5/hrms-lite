# 📌 HRMS Lite – Employee Management System

## 🚀 Live Application

- **Frontend (Vercel):**  
  https://hrms-lite-beta-ten.vercel.app

- **Backend API (Render):**  
  https://hrms-lite-mgk7.onrender.com  

- **API Documentation (Swagger):**  
  https://hrms-lite-mgk7.onrender.com/docs 

- **GitHub Repository:**  
  https://github.com/S-Sharma5/hrms-lite  

---

# 📖 Project Overview

HRMS Lite is a lightweight Human Resource Management System that allows organizations to:

- Manage employees
- View employee details
- Delete employees
- Mark attendance (Present / Absent)
- Track attendance per employee

This project demonstrates a full-stack implementation using React (frontend) and FastAPI (backend), deployed on Vercel and Render.

---

# 🛠 Tech Stack

## 🔹 Frontend
- React (Vite)
- Axios
- Tailwind CSS
- Vercel (Deployment)

## 🔹 Backend
- FastAPI
- Uvicorn
- SQLAlchemy
- Pydantic
- SQLite Database
- Render (Deployment)

---

# 🏗 Project Structure

hrms-lite/
│
├── backend/
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   ├── database.py
│   ├── requirements.txt
│   └── hrms.db
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
└── README.md

---

# ⚙️ Features

- Create Employee
- View All Employees
- View Employee Details
- Delete Employee
- Mark Attendance (Present / Absent)
- Attendance Calendar View
- RESTful API with Swagger Docs

---

# 💻 How to Run Locally

## 1️⃣ Clone Repository

```bash
git clone https://github.com/S-Sharma5/hrms-lite.git
cd hrms-lite
```

---

## 2️⃣ Run Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Mac/Linux
# venv\Scripts\activate    # Windows

pip install -r requirements.txt
uvicorn main:app --reload
```

Backend runs on:
http://localhost:8000

Swagger Docs:
http://localhost:8000/docs

---

## 3️⃣ Run Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:
http://localhost:5173

---

# 🌍 Deployment Details

## 🔹 Backend Deployment
- Platform: Render
- Environment: Python 3
- Start Command:
```
uvicorn main:app --host 0.0.0.0 --port $PORT
```

## 🔹 Frontend Deployment
- Platform: Vercel
- Framework: Vite
- Root Directory: frontend
- Build Command:
```
npm run build
```
- Output Directory:
```
dist
```

---

# ⚠️ Assumptions & Limitations

- SQLite is used for simplicity (not suitable for large-scale production)
- Render free plan may sleep after inactivity (first request may take ~30–60 seconds)
- No authentication implemented
- Basic validation implemented using Pydantic

---

# 📌 Future Improvements

- Add authentication (JWT)
- Role-based access (Admin / HR)
- Use PostgreSQL instead of SQLite
- Add pagination
- Improve UI/UX
- Add analytics dashboard

---

# 👨‍💻 Author

Shubham Sharma  
Full Stack Developer