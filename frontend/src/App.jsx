import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AttendancePage from "./pages/AttendancePage";
import EmployeeDetail from "./pages/EmployeeDetail";

function App() {
  return (
    <Routes>
      {/* Dashboard */}
      <Route path="/" element={<Dashboard />} />

      {/* Employee Detail */}
      <Route path="/employee/:id" element={<EmployeeDetail />} />

      {/* Attendance Page */}
      <Route path="/attendance/:id" element={<AttendancePage />} />
    </Routes>
  );
}

export default App;