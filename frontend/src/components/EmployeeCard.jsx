import Button from "./Button";
import { useNavigate } from "react-router-dom";

export default function EmployeeCard({ employee, onDelete }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-lg hover:scale-[1.02] transition">
      <h2 className="text-xl font-semibold mb-2">
        {employee.full_name}
      </h2>

      <p className="text-gray-300 text-sm">
        ID: {employee.employee_id}
      </p>

      <p className="text-gray-400 text-sm">
        {employee.email}
      </p>

      <p className="text-gray-400 text-sm mb-4">
        {employee.department}
      </p>

      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          onClick={() => navigate(`/employee/${employee.id}`)}
        >
          Details
        </Button>

        <Button
          variant="primary"
          onClick={() => navigate(`/attendance/${employee.id}`)}
        >
          Attendance
        </Button>

        <Button
          variant="danger"
          onClick={() => onDelete(employee.id)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}