import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import EmployeeCard from "../components/EmployeeCard";
import Modal from "../components/Modal";
import Button from "../components/Button";
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
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    department: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // ================= FETCH =================
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await getEmployees();
      setEmployees(res.data);
      setFilteredEmployees(res.data);
      setError("");
    } catch {
      setError("Unable to connect to backend server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // ================= SEARCH =================
  useEffect(() => {
    const filtered = employees.filter((emp) =>
      emp.full_name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredEmployees(filtered);
  }, [search, employees]);

  // ================= VALIDATION =================
  const validateForm = () => {
    const errors = {};

    if (!form.full_name.trim()) {
      errors.full_name = "Full name is required.";
    }

    if (!form.email.trim()) {
      errors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errors.email = "Please enter a valid email address.";
    }

    return errors;
  };

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });

    if (formErrors[field]) {
      setFormErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  // ================= CREATE =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }

    try {
      setSubmitting(true);
      setFormErrors({});
      await createEmployee(form);

      setForm({
        full_name: "",
        email: "",
        department: "",
      });

      setShowModal(false);
      fetchEmployees();
    } catch (err) {
      if (err.response?.data?.detail) {
        setFormErrors({
          email: err.response.data.detail,
        });
      } else {
        setFormErrors({
          general: "Something went wrong. Please try again.",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this employee?")) return;

    try {
      await deleteEmployee(id);
      fetchEmployees();
    } catch {
      setError("Failed to delete employee.");
    }
  };

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
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Employee Dashboard
        </h1>

        <Button onClick={() => setShowModal(true)}>
          + Create Employee
        </Button>
      </div>

      {/* Search */}
      <div className="mb-8 max-w-md relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          🔍
        </span>
        <input
          type="text"
          placeholder="Search by employee name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-900 shadow-sm focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Employee Grid */}
      {!filteredEmployees.length ? (
        <EmptyState message="No employees found." />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((emp) => (
            <div
              key={emp.id}
              className="transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 rounded-2xl"
            >
              <EmployeeCard
                employee={emp}
                onDelete={handleDelete}
              />
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <h2 className="text-2xl font-semibold mb-6 text-white">
            Create New Employee
          </h2>

          {formErrors.general && (
            <p className="text-red-400 text-sm mb-4">
              {formErrors.general}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Full Name */}
            <div>
              <input
                type="text"
                placeholder="Full Name"
                value={form.full_name}
                onChange={(e) =>
                  handleChange("full_name", e.target.value)
                }
                className={`w-full px-4 py-2 rounded-xl border bg-white/80 text-gray-900 text-sm shadow-sm focus:ring-2 focus:ring-purple-400 transition ${
                  formErrors.full_name
                    ? "border-red-400"
                    : "border-white/30"
                }`}
              />
              {formErrors.full_name && (
                <p className="text-red-400 text-xs mt-1">
                  {formErrors.full_name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={(e) =>
                  handleChange("email", e.target.value)
                }
                className={`w-full px-4 py-2 rounded-xl border bg-white/80 text-gray-900 text-sm shadow-sm focus:ring-2 focus:ring-purple-400 transition ${
                  formErrors.email
                    ? "border-red-400"
                    : "border-white/30"
                }`}
              />
              {formErrors.email && (
                <p className="text-red-400 text-xs mt-1">
                  {formErrors.email}
                </p>
              )}
            </div>

            {/* Department Optional */}
            <div>
              <input
                type="text"
                placeholder="Department (Optional)"
                value={form.department}
                onChange={(e) =>
                  handleChange("department", e.target.value)
                }
                className="w-full px-4 py-2 rounded-xl border border-white/30 bg-white/80 text-gray-900 text-sm shadow-sm focus:ring-2 focus:ring-purple-400 transition"
              />
            </div>

            <Button type="submit" disabled={submitting}>
              {submitting ? "Creating..." : "Create Employee"}
            </Button>
          </form>
        </Modal>
      )}
    </Layout>
  );
}