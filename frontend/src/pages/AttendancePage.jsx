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

  const today = new Date();
  const todayString = today.toISOString().split("T")[0];

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

  // ✅ MONTHLY COUNT LOGIC
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const monthlyAttendance = attendance.filter((a) => {
    const d = new Date(a.date);
    return (
      d.getMonth() === currentMonth &&
      d.getFullYear() === currentYear
    );
  });

  const presentCount = monthlyAttendance.filter(
    (a) => a.status === "Present"
  ).length;

  const absentCount = monthlyAttendance.filter(
    (a) => a.status === "Absent"
  ).length;

  const handleDateClick = (day) => {
    const clickedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );

    const clickedString = formatDate(clickedDate);

    if (clickedString > todayString) return;

    setSelectedDate(clickedDate);
  };

  const handleMark = async (status) => {
    if (!selectedDate) return;

    const selectedString = formatDate(selectedDate);

    const alreadyMarked = attendance.find(
      (a) => a.date === selectedString
    );

    if (alreadyMarked) {
      alert("Attendance already marked for this date.");
      return;
    }

    await markAttendance({
      employee_id: Number(id),
      date: selectedString,
      status,
    });

    setSelectedDate(null);
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

      const dateObj = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );

      const dateString = formatDate(dateObj);

      const isFuture = dateString > todayString;
      const isSelected =
        selectedDate &&
        formatDate(selectedDate) === dateString;
      const isToday = dateString === todayString;

      let baseStyle =
        "h-12 flex items-center justify-center rounded-xl text-sm transition-all duration-300 ease-in-out transform";

      let colorStyle =
        "bg-gray-100 hover:bg-gray-200 text-gray-800";

      if (status === "Present") {
        colorStyle =
          "bg-green-500 text-white hover:bg-green-600";
      } else if (status === "Absent") {
        colorStyle =
          "bg-red-500 text-white hover:bg-red-600";
      } else if (isSelected) {
        colorStyle =
          "bg-blue-500 text-white scale-110 shadow-xl";
      }

      if (isFuture) {
        colorStyle =
          "bg-gray-200 text-gray-400 opacity-50 cursor-not-allowed";
      }

      days.push(
        <div
          key={day}
          onClick={() => !isFuture && handleDateClick(day)}
          className={`${baseStyle} ${colorStyle} ${
            !isFuture ? "cursor-pointer" : ""
          } ${isToday ? "border-2 border-blue-400" : ""}`}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  const selectedString =
    selectedDate && formatDate(selectedDate);

  const isAlreadyMarked = attendance.find(
    (a) => a.date === selectedString
  );

  return (
    <Layout>
      <h1 className="text-3xl font-semibold mb-8">
        Attendance — {employee?.full_name}
      </h1>

      {/* ✅ MONTH SUMMARY CARDS */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-green-100 p-6 rounded-2xl shadow-sm">
          <p className="text-sm text-green-700">
            Present This Month
          </p>
          <p className="text-3xl font-bold text-green-800 mt-2">
            {presentCount}
          </p>
        </div>

        <div className="bg-red-100 p-6 rounded-2xl shadow-sm">
          <p className="text-sm text-red-700">
            Absent This Month
          </p>
          <p className="text-3xl font-bold text-red-800 mt-2">
            {absentCount}
          </p>
        </div>
      </div>

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

        <div className="grid grid-cols-7 gap-3">
          {renderDays()}
        </div>

        <div className="flex gap-4 mt-8">
          <Button
            disabled={!selectedDate || isAlreadyMarked}
            onClick={() => handleMark("Present")}
          >
            Mark Present
          </Button>

          <Button
            variant="danger"
            disabled={!selectedDate || isAlreadyMarked}
            onClick={() => handleMark("Absent")}
          >
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