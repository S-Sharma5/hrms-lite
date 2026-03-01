import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
});

export const getEmployees = () => API.get("/employees");
export const createEmployee = (data) => API.post("/employees", data);
export const deleteEmployee = (id) => API.delete(`/employees/${id}`);
export const getEmployee = (id) => API.get(`/employees/${id}`);


export const markAttendance = (data) => API.post("/attendance", data);
export const getAttendance = (id) => API.get(`/attendance/${id}`);

export default API;