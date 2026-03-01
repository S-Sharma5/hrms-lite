import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import EmployeeCard from "../components/EmployeeCard";
import Modal from "../components/Modal";
import Button from "../components/Button";
import Input from "../components/Input";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";

import {
  getEmployees,
  createEmployee,
  deleteEmployee,
} from "../api/api";

export default function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    employee_id: "",
    full_name: "",
    email: "",
    department: "",
  });

  // =========================
  // FETCH EMPLOYEES
  // =========================
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await getEmployees();
      setEmployees(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // =========================
  // HANDLE CREATE EMPLOYEE
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createEmployee(form);

      setForm({
        employee_id: "",
        full_name: "",
        email: "",
        department: "",
      });

      setShowModal(false);
      fetchEmployees();
    } catch (err) {
      alert(err.response?.data?.detail || "Error creating employee");
    }
  };

  // =========================
  // HANDLE DELETE
  // =========================
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this employee?")) return;

    try {
      await deleteEmployee(id);
      fetchEmployees();
    } catch (err) {
      alert("Error deleting employee");
    }
  };

  // =========================
  // UI STATES
  // =========================
  if (loading)
    return (
      <Layout>
        <Loading />
      </Layout>
    );

  if (error)
    return (
      <Layout>
        <ErrorState message={error} />
      </Layout>
    );

  return (
    <Layout>
      {/* Header Section */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight">
          Employee Dashboard
        </h1>

        <Button onClick={() => setShowModal(true)}>
          + Create Employee
        </Button>
      </div>

      {/* Empty State */}
      {!employees.length && (
        <EmptyState message="No employees found. Create your first employee." />
      )}

      {/* Employee Grid */}
      {employees.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {employees.map((emp) => (
            <EmployeeCard
              key={emp.id}
              employee={emp}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Create Employee Modal */}
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <h2 className="text-2xl font-bold mb-6 text-white">
            Create New Employee
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Employee ID"
              name="employee_id"
              value={form.employee_id}
              onChange={(e) =>
                setForm({ ...form, employee_id: e.target.value })
              }
            />

            <Input
              label="Full Name"
              name="full_name"
              value={form.full_name}
              onChange={(e) =>
                setForm({ ...form, full_name: e.target.value })
              }
            />

            <Input
              label="Email Address"
              name="email"
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <Input
              label="Department"
              name="department"
              value={form.department}
              onChange={(e) =>
                setForm({ ...form, department: e.target.value })
              }
            />

            <div className="pt-4">
              <Button type="submit">Create Employee</Button>
            </div>
          </form>
        </Modal>
      )}
    </Layout>
  );
}