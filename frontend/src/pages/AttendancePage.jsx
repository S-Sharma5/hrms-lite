import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import Button from "../components/Button";
import { getAttendance, markAttendance, getEmployee } from "../api/api";

export default function AttendancePage() {
  const { id } = useParams();

  const [employee, setEmployee] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    const emp = await getEmployee(id);
    const att = await getAttendance(id);
    setEmployee(emp.data);
    setAttendance(att.data);
  };

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayIndex = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const handleMark = async (status) => {
    if (!selectedDate) return;

    await markAttendance({
      employee_id: Number(id),
      date: formatDate(selectedDate),
      status,
    });

    fetchData();
  };

  const getStatus = (day) => {
    const dateObj = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );

    const record = attendance.find(
      (a) => a.date === formatDate(dateObj)
    );

    return record?.status;
  };

  const renderDays = () => {
    const days = [];

    for (let i = 0; i < firstDayIndex; i++) {
      days.push(<div key={`empty-${i}`} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const status = getStatus(day);

      let colorClass =
        "bg-gray-100 hover:bg-gray-200 text-gray-800";

      if (status === "Present") {
        colorClass =
          "bg-green-500 text-white hover:bg-green-600";
      }

      if (status === "Absent") {
        colorClass =
          "bg-red-500 text-white hover:bg-red-600";
      }

      days.push(
        <div
          key={day}
          onClick={() =>
            setSelectedDate(
              new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                day
              )
            )
          }
          className={`h-12 flex items-center justify-center rounded-lg cursor-pointer transition ${colorClass}`}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  return (
    <Layout>
      <h1 className="text-3xl font-semibold mb-8">
        Attendance — {employee?.full_name}
      </h1>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        {/* Month Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() =>
              setCurrentDate(
                new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth() - 1
                )
              )
            }
          >
            ◀
          </button>

          <h2 className="text-xl font-medium">
            {currentDate.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </h2>

          <button
            onClick={() =>
              setCurrentDate(
                new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth() + 1
                )
              )
            }
          >
            ▶
          </button>
        </div>

        {/* Weekday Labels */}
        <div className="grid grid-cols-7 text-center text-sm text-gray-400 mb-3">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
            (day) => (
              <div key={day}>{day}</div>
            )
          )}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-3">
          {renderDays()}
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-8">
          <Button onClick={() => handleMark("Present")}>
            Mark Present
          </Button>
          <Button variant="danger" onClick={() => handleMark("Absent")}>
            Mark Absent
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-6 mt-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>Green = Present</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span>Red = Absent</span>
        </div>
      </div>
    </Layout>
  );
}