import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import LandingNavbar from "./components/LandingNavbar";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import EventDetails from "./pages/EventDetails";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailed from "./pages/PaymentFailed";
import MyBookings from "./pages/MyBookings";
import Profile from "./pages/Profile";

import AdminDashboard from "./pages/AdminDashboard";
import AdminEvents from "./pages/AdminEvents";
import AdminBookings from "./pages/AdminBookings";

import ProtectedRoute from "./routes/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/UserLayout";
import EventChatbot from "./components/EventChatbot";

function App() {

  return (

    <BrowserRouter>

      <LandingNavbar />

      <Routes>

        {/* LANDING */}

        <Route
path="/"
element={
<>
<LandingNavbar />
<LandingPage />
</>
}
/>

        {/* AUTH */}

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* USER */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserLayout>
                <Dashboard />
              </UserLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/event/:id"
          element={
            <ProtectedRoute>
              <UserLayout>
                <EventDetails />
              </UserLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <UserLayout>
                <MyBookings />
              </UserLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/success"
          element={<PaymentSuccess />}
        />

        <Route
          path="/failed"
          element={<PaymentFailed />}
        />


        {/* ADMIN */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="ROLE_ADMIN">
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/events"
          element={
            <ProtectedRoute role="ROLE_ADMIN">
              <AdminLayout>
                <AdminEvents />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/bookings"
          element={
            <ProtectedRoute role="ROLE_ADMIN">
              <AdminLayout>
                <AdminBookings />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
          <ProtectedRoute>
          <UserLayout>
          <Profile/>
          </UserLayout>
          </ProtectedRoute>
          }
          />
      </Routes>
      <EventChatbot />
    </BrowserRouter>
  );
}

export default App;