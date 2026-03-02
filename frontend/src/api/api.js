import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// EMPLOYEE
export const getEmployees = () => API.get("/employees");
export const createEmployee = (data) => API.post("/employees", data);
export const deleteEmployee = (id) => API.delete(`/employees/${id}`);
export const getEmployee = (id) => API.get(`/employees/${id}`);

// ATTENDANCE
export const markAttendance = (data) => API.post("/attendance", data);
export const getAttendance = (id) => API.get(`/attendance/${id}`);
export const filterAttendance = (params) =>
  API.get("/attendance", { params });
export const getAttendanceSummary = (id) =>
  API.get(`/attendance/summary/${id}`);

// DASHBOARD
export const getDashboardSummary = () =>
  API.get("/dashboard-summary");

export default API;