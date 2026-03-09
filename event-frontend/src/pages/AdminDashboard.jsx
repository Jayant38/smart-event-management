import { useEffect, useState } from "react";
import api from "../api/axiosConfig";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

const AdminDashboard = () => {

  const [stats, setStats] = useState(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);

  useEffect(() => {

    // Dashboard Stats
    api.get("/admin/dashboard")
      .then(res => setStats(res.data.data))
      .catch(err => console.log("Dashboard load error:", err));

    // Monthly Revenue
    api.get("/bookings/admin/revenue/monthly")
      .then(res => setMonthlyRevenue(res.data))
      .catch(err => console.log("Revenue load error:", err));

  }, []);

  if (!stats) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary"></div>
        <p className="mt-3">Loading Admin Data...</p>
      </div>
    );
  }

  // Month number → name
  const monthNames = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  const chartData = monthlyRevenue.map(item => ({
    name: monthNames[item.month - 1],
    revenue: item.revenue
  }));

  return (
    <div className="container mt-5">

      <h2 className="mb-4 fw-bold">Admin Dashboard</h2>

      {/* ⭐ Stats Cards */}
      <div className="row g-4">

        <div className="col-md-3">
          <div className="card shadow border-0 text-center p-4 dashboard-card">
            <h6 className="text-muted">Total Users</h6>
            <h2 className="fw-bold text-primary">{stats.totalUsers}</h2>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow border-0 text-center p-4 dashboard-card">
            <h6 className="text-muted">Total Bookings</h6>
            <h2 className="fw-bold text-info">{stats.totalBookings}</h2>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow border-0 text-center p-4 dashboard-card">
            <h6 className="text-muted">Confirmed</h6>
            <h2 className="fw-bold text-success">{stats.confirmedBookings}</h2>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow border-0 text-center p-4 dashboard-card">
            <h6 className="text-muted">Total Revenue</h6>
            <h2 className="fw-bold text-warning">₹ {stats.totalRevenue}</h2>
          </div>
        </div>

      </div>

      {/* ⭐ Monthly Revenue Chart */}
      <div className="card shadow border-0 p-4 mt-4">

        <h5 className="fw-bold mb-3">Monthly Revenue Analytics</h5>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="name" />

            {/* ₹ on axis */}
            <YAxis tickFormatter={(value) => `₹${value}`} />

            {/* Better Tooltip */}
            <Tooltip
              formatter={(value) => `₹${value}`}
              cursor={{ fill: "rgba(37,99,235,0.1)" }}
            />

            {/* Animated Bars */}
            <Bar
              dataKey="revenue"
              fill="#2563eb"
              radius={[8,8,0,0]}
              animationDuration={1500}
            />

          </BarChart>
        </ResponsiveContainer>

      </div>

    </div>
  );
};

export default AdminDashboard;