// App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home/Home";
import Signup from "./components/auth/signup";
import Login from "./components/auth/login";
import AdminDoctors from "./pages/adddoctors/adminDoctors";
import OurDoctors from "./pages/OurDoctors/ourDoctors";
import AdminMLTs from "./pages/addMLT/adminMLT";
import AddReports from "./pages/AddReports/addReports";
import ContactUsPage from "./pages/contactus/ContactUs";
import BookAppointment from "./pages/patients/BookAppointment";
import AppointmentStatus from "./pages/patients/AppointmentStatus";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";
import { useAuth } from "./hooks/useAuth";

function App() {
  const { isDoctor } = useAuth();
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <Routes>
            {/* Home Routes - both '/' and '/home' point to Home page */}
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/add-doctor" element={<AdminDoctors />} />
            <Route path="/doctors" element={<OurDoctors />} />
            <Route path="/add-mlt" element={<AdminMLTs />} />
            <Route path="/add-report" element={<AddReports />} />
            <Route path="/contact-us" element={<ContactUsPage />} />

            <Route
              path="/book-appointment/:doctorId?"
              element={<BookAppointment />}
            />
            <Route
              path="/appointments/status"
              element={<AppointmentStatus />}
            />
            <Route
              path="/patient/appointments"
              element={<AppointmentStatus />}
            />

            {/* Doctor Routes */}
            <Route
              path="/doctor/appointments"
              element={isDoctor ? <DoctorAppointments /> : <Navigate to="/" />}
            />
            <Route
              path="/doctor/dashboard"
              element={isDoctor ? <DoctorAppointments /> : <Navigate to="/" />}
            />
            {/* Catch all - redirect to home */}
            <Route path="*" element={<Home />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
