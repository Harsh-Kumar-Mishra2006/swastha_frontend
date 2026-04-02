// components/view/ViewMLTsSection.tsx
import { useState } from "react";
import { useAdminMLT } from "../../contexts/AdminMLTContext";
import {
  Search,
  Trash2,
  RefreshCw,
  Key,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Phone,
  FlaskConical,
  Building2,
  IdCard,
} from "lucide-react";
import toast from "react-hot-toast";

const ViewMLTsSection = () => {
  const { mlts, loading, updateMLTStatus, deleteMLT, resetMLTPassword } =
    useAdminMLT();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [selectedMLT, setSelectedMLT] = useState<any>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePermanent, setDeletePermanent] = useState(false);

  // Get unique departments for filter
  const departments = ["all", ...new Set(mlts.map((mlt) => mlt.department))];

  const filteredMLTs = mlts.filter((mlt) => {
    const matchesSearch =
      mlt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mlt.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mlt.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mlt.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || mlt.status === statusFilter;

    const matchesDepartment =
      departmentFilter === "all" || mlt.department === departmentFilter;

    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center w-fit">
            <CheckCircle className="h-3 w-3 mr-1" /> Active
          </span>
        );
      case "inactive":
        return (
          <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium flex items-center w-fit">
            <XCircle className="h-3 w-3 mr-1" /> Inactive
          </span>
        );
      case "pending":
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium flex items-center w-fit">
            <Clock className="h-3 w-3 mr-1" /> Pending
          </span>
        );
      default:
        return null;
    }
  };

  const handleStatusChange = async (mltId: string, newStatus: string) => {
    await updateMLTStatus(mltId, newStatus);
  };

  const handlePasswordReset = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    await resetMLTPassword(selectedMLT._id, newPassword);
    setShowPasswordModal(false);
    setNewPassword("");
    setSelectedMLT(null);
  };

  const handleDelete = async () => {
    await deleteMLT(selectedMLT._id, deletePermanent);
    setShowDeleteModal(false);
    setSelectedMLT(null);
    setDeletePermanent(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Manage MLTs</h2>
            <p className="text-sm text-gray-600">
              View and manage all Medical Laboratory Technician accounts
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search MLTs by name, email, specialization, or license number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
          </select>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept === "all" ? "All Departments" : dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* MLTs Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                MLT
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Professional Info
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                License
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Added By
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  </div>
                </td>
              </tr>
            ) : filteredMLTs.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  No MLTs found
                </td>
              </tr>
            ) : (
              filteredMLTs.map((mlt) => (
                <tr
                  key={mlt._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {mlt.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {mlt.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          @{mlt.email.split("@")[0]}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 flex items-center">
                      <Mail className="h-3 w-3 mr-1 text-gray-400" />
                      {mlt.email}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center mt-1">
                      <Phone className="h-3 w-3 mr-1 text-gray-400" />
                      {mlt.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 flex items-center">
                      <FlaskConical className="h-3 w-3 mr-1 text-gray-400" />
                      {mlt.specialization}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center mt-1">
                      <Building2 className="h-3 w-3 mr-1 text-gray-400" />
                      {mlt.department}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {mlt.experience} exp • {mlt.qualifications}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 flex items-center">
                      <IdCard className="h-3 w-3 mr-1 text-gray-400" />
                      {mlt.licenseNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(mlt.status)}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {mlt.addedBy?.name || "Admin"}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="relative inline-block text-left">
                      <select
                        onChange={(e) =>
                          handleStatusChange(mlt._id, e.target.value)
                        }
                        value={mlt.status}
                        className="mr-2 text-sm border border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="active">Set Active</option>
                        <option value="inactive">Set Inactive</option>
                        <option value="pending">Set Pending</option>
                      </select>
                      <button
                        onClick={() => {
                          setSelectedMLT(mlt);
                          setShowPasswordModal(true);
                        }}
                        className="p-1 text-gray-400 hover:text-purple-600 transition-colors mr-1"
                        title="Reset Password"
                      >
                        <Key className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedMLT(mlt);
                          setShowDeleteModal(true);
                        }}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Password Reset Modal */}
      {showPasswordModal && selectedMLT && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Reset Password
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Set new password for {selectedMLT.name}
            </p>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password (min. 6 characters)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 mb-4"
              minLength={6}
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setSelectedMLT(null);
                  setNewPassword("");
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordReset}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Reset Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedMLT && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete MLT
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete {selectedMLT.name}?
            </p>
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={deletePermanent}
                  onChange={(e) => setDeletePermanent(e.target.checked)}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-600">
                  Permanently delete (cannot be undone)
                </span>
              </label>
              {!deletePermanent && (
                <p className="mt-2 text-xs text-gray-500">
                  MLT will be deactivated instead of permanently deleted.
                </p>
              )}
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedMLT(null);
                  setDeletePermanent(false);
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                {deletePermanent ? "Permanently Delete" : "Deactivate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewMLTsSection;
