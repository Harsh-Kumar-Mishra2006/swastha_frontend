// pages/AdminDoctors.tsx
import { useEffect } from "react";
import { AdminProvider, useAdmin } from "../../contexts/AdminContext";
import AddDoctorForm from "../../components/form/addDoctorForm";
import ViewDoctorsSection from "../../components/view/viewDoctorsSection";
import { Shield, Users, UserPlus, Activity } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { Navigate } from "react-router-dom";

const AdminDoctorsContent = () => {
  const { doctors, fetchDoctors } = useAdmin();
  const { user } = useAuth();

  useEffect(() => {
    fetchDoctors();
  }, []);

  const stats = {
    total: doctors.length,
    active: doctors.filter((d) => d.status === "active").length,
    pending: doctors.filter((d) => d.status === "pending").length,
    inactive: doctors.filter((d) => d.status === "inactive").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-neutral-100 to-teal-100 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-teal-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
          </div>
          <p className="mt-2 text-gray-600">
            Manage doctors and their accounts
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Doctors</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <div className="bg-teal-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-teal-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.active}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {stats.pending}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <UserPlus className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Inactive</p>
                <p className="text-3xl font-bold text-red-600">
                  {stats.inactive}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          <AddDoctorForm />
          <ViewDoctorsSection />
        </div>
      </div>
    </div>
  );
};

const AdminDoctors = () => {
  const { user } = useAuth();

  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return (
    <AdminProvider>
      <AdminDoctorsContent />
    </AdminProvider>
  );
};

export default AdminDoctors;
