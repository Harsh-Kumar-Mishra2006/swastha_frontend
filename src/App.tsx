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
import ContactUsPage from "./pages/contactus/ContactUs";
import BookAppointment from "./pages/patients/BookAppointment";
import AppointmentStatus from "./pages/patients/AppointmentStatus";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";
import { useAuth } from "./hooks/useAuth";
import ViewPatients from "./pages/doctor/viewPatients";
import DoctorCreateTestRequest from "./pages/doctor/DoctorTestReports";
import CreatePrescription from "./pages/doctor/AddPrescription";
import MyPrescriptions from "./pages/patients/PatientPrescriptions";
import PrescriptionList from "./pages/doctor/PrescritptionList";
import TestReportsList from "./pages/mlt/TestReportList";
import ViewReport from "./pages/report/ViewReport";
import ViewReportList from "./pages/report/viewReportList";
import CreateReport from "./pages/mlt/MLTCreateReport";

function AppRoutes() {
  const { isDoctor } = useAuth();

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/add-doctor" element={<AdminDoctors />} />
        <Route path="/doctors" element={<OurDoctors />} />
        <Route path="/add-mlt" element={<AdminMLTs />} />
        <Route path="/add-report" element={<DoctorCreateTestRequest />} />
        <Route path="/contact-us" element={<ContactUsPage />} />
        <Route path="/view-patients" element={<ViewPatients />} />
        <Route path="/book-appointment" element={<BookAppointment />} />
        <Route
          path="/book-appointment/:doctorId"
          element={<BookAppointment />}
        />
        <Route path="/appointments/status" element={<AppointmentStatus />} />
        <Route path="/patient/appointments" element={<AppointmentStatus />} />
        <Route
          path="/doctor/appointments"
          element={isDoctor ? <DoctorAppointments /> : <Navigate to="/" />}
        />
        <Route
          path="/view-patient-appointments"
          element={<DoctorAppointments />}
        />
        <Route path="/add-prescription" element={<CreatePrescription />} />
        <Route path="/your-prescriptions" element={<MyPrescriptions />} />
        <Route path="/doctor/prescriptions" element={<PrescriptionList />} />
        <Route
          path="/doctor/active-appointments"
          element={isDoctor ? <DoctorAppointments /> : <Navigate to="/" />}
        />
        <Route path="/mlt-test-requests" element={<TestReportsList />} />

        <Route path="/mlt-createreport/:testId" element={<CreateReport />} />

        <Route path="/view-report" element={<ViewReport />} />
        <Route path="/report-list" element={<ViewReportList />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
