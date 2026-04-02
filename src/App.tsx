// App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home/Home";
import Signup from "./components/auth/signup";
import Login from "./components/auth/login";
import AdminDoctors from "./pages/adddoctors/adminDoctors";
import OurDoctors from "./pages/OurDoctors/ourDoctors";
import Payment from "./pages/payment/payment";
import BookAppointment from "./pages/bookAppointments/bookAppointements";
import MyAppointments from "./pages/myappointments/MyAppointments";
import AdminMLTs from "./pages/addMLT/adminMLT";

function App() {
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
            <Route path="/payment/:appointmentId" element={<Payment />} />
            <Route
              path="/book-appointment/:doctorId"
              element={<BookAppointment />}
            />
            <Route path="/my-appointments" element={<MyAppointments />} />
            <Route path="/add-mlt" element={<AdminMLTs />} />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Home />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
