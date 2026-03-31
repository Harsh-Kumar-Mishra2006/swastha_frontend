// pages/admin/AdminMLT.tsx
import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import AddMLT from "../../components/form/addMLTForm";
import ViewMLT from "../../components/view/viewMLTSection";
import { PlusIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { Microscope } from "lucide-react";

const AdminMLT: React.FC = () => {
  const { user } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAddSuccess = () => {
    setShowAddForm(false);
    // Increment refresh trigger to cause ViewMLT to re-fetch
    setRefreshTrigger((prev) => prev + 1);
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
            <p className="text-gray-600 mt-2">
              You don't have permission to view this page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Microscope className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Medical Lab Technicians Management
                </h1>
                <p className="text-gray-600 mt-1">
                  Add, view, and manage MLT staff members
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              {showAddForm ? (
                <>
                  <UserGroupIcon className="h-5 w-5 mr-2" />
                  View MLTs
                </>
              ) : (
                <>
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Add New MLT
                </>
              )}
            </button>
          </div>
        </div>

        {/* Main Content - Only render one component at a time */}
        {showAddForm ? (
          <AddMLT
            onSuccess={handleAddSuccess}
            onCancel={() => setShowAddForm(false)}
          />
        ) : (
          <ViewMLT
            refreshTrigger={refreshTrigger}
            onEdit={(mlt) => {
              // Handle edit if needed
              console.log("Edit MLT:", mlt);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AdminMLT;
