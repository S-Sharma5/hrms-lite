import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Loading from "../components/Loading";
import ErrorState from "../components/ErrorState";
import { getEmployee } from "../api/api";

export default function EmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  const fetchEmployee = async () => {
    try {
      setLoading(true);
      const res = await getEmployee(id);
      setEmployee(res.data);
      setError("");
    } catch (err) {
      setError("Failed to load employee details.");
    } finally {
      setLoading(false);
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
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-8 text-sm text-gray-400 hover:text-gray-700 transition"
      >
        ← Back
      </button>

      <div className="max-w-2xl mx-auto">

        {/* Glass Card */}
        <div className="
          bg-white/10
          backdrop-blur-xl
          border border-white/20
          rounded-2xl
          shadow-xl
          p-8
          text-white
        ">

          {/* Avatar */}
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-sm font-medium mb-6">
            {employee?.full_name?.charAt(0)}
          </div>

          <h2 className="text-lg font-medium mb-8 tracking-wide">
            Employee Details
          </h2>

          <div className="space-y-6 text-sm">

            <div className="flex justify-between border-b border-white/10 pb-3">
              <span className="text-gray-300">Full Name</span>
              <span className="font-medium">
                {employee?.full_name}
              </span>
            </div>

            <div className="flex justify-between border-b border-white/10 pb-3">
              <span className="text-gray-300">Employee ID</span>
              <span className="font-medium">
                {employee?.employee_id}
              </span>
            </div>

            <div className="flex justify-between border-b border-white/10 pb-3">
              <span className="text-gray-300">Email</span>
              <span className="font-medium">
                {employee?.email}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-300">Department</span>
              <span className="font-medium">
                {employee?.department}
              </span>
            </div>

          </div>
        </div>

      </div>
    </Layout>
  );
}