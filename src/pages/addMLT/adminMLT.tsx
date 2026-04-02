// pages/AdminMLTs.tsx
import { useEffect } from "react";
import { AdminMLTProvider, useAdminMLT } from "../../contexts/AdminMLTContext";
import AddMLTForm from "../../components/form/addMLTForm";
import ViewMLTsSection from "../../components/view/viewMLTSection";
import { Shield, Users, UserPlus, Activity, Building2 } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { Navigate } from "react-router-dom";

// This component uses the MLT context and MUST be inside AdminMLTProvider
const AdminMLTsContent = () => {
  const { mlts, stats, fetchMLTs, fetchStats } = useAdminMLT();

  useEffect(() => {
    fetchMLTs();
    fetchStats();
  }, []);

  const displayStats = {
    total: stats?.total || mlts.length,
    active: stats?.active || mlts.filter((m) => m.status === "active").length,
    pending:
      stats?.pending || mlts.filter((m) => m.status === "pending").length,
    inactive:
      stats?.inactive || mlts.filter((m) => m.status === "inactive").length,
    departments: stats?.byDepartment?.length || 0,
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-neutral-100 to-purple-100 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">MLT Management</h1>
          </div>
          <p className="mt-2 text-gray-600">
            Manage Medical Laboratory Technicians and their accounts
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total MLTs</p>
                <p className="text-3xl font-bold text-gray-900">
                  {displayStats.total}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-3xl font-bold text-green-600">
                  {displayStats.active}
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
                  {displayStats.pending}
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
                  {displayStats.inactive}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Departments</p>
                <p className="text-3xl font-bold text-indigo-600">
                  {displayStats.departments}
                </p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-lg">
                <Building2 className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          <AddMLTForm />
          <ViewMLTsSection />
        </div>
      </div>
    </div>
  );
};

// This is the main exported component that wraps everything with the provider
const AdminMLTs = () => {
  const { user } = useAuth();

  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return (
    <AdminMLTProvider>
      <AdminMLTsContent />
    </AdminMLTProvider>
  );
};

export default AdminMLTs;
