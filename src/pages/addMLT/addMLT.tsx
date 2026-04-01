// pages/admin/AdminMLT.tsx
import { useEffect } from "react";
import { MLTProvider, useMLT } from "../../contexts/MLTContext";
import AddMLTForm from "../../components/form/addMLTForm";
import ViewMLTSection from "../../components/view/viewMLTSection";
import { Shield, Microscope, UserPlus, Activity } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { Navigate } from "react-router-dom";

const AdminMLTContent = () => {
  const { mlts, fetchMLTs } = useMLT();

  useEffect(() => {
    if (fetchMLTs) {
      fetchMLTs();
    }
  }, []);

  const stats = {
    total: mlts?.length || 0,
    active: mlts?.filter((m) => m.status === "active").length || 0,
    pending: mlts?.filter((m) => m.status === "pending").length || 0,
    inactive: mlts?.filter((m) => m.status === "inactive").length || 0,
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-neutral-100 to-purple-100 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              MLT Management Dashboard
            </h1>
          </div>
          <p className="mt-2 text-gray-600">
            Manage Medical Lab Technicians and their accounts
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total MLTs</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Microscope className="h-6 w-6 text-purple-600" />
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
                <Microscope className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          <AddMLTForm />
          <ViewMLTSection />
        </div>
      </div>
    </div>
  );
};

const AdminMLT = () => {
  const { user } = useAuth();

  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return (
    <MLTProvider>
      <AdminMLTContent />
    </MLTProvider>
  );
};

export default AdminMLT;
