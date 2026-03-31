// components/admin/ViewMLT.tsx
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import {
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  CalendarIcon,
  DocumentTextIcon,
  EyeIcon,
  KeyIcon,
} from "@heroicons/react/24/outline";
import { Microscope } from "lucide-react";
import mltService from "../../services/mltService";
import { type MLT } from "../../types";

interface ViewMLTProps {
  onEdit?: (mlt: MLT) => void;
  refreshTrigger?: number;
}

const ViewMLT: React.FC<ViewMLTProps> = ({ onEdit, refreshTrigger = 0 }) => {
  const [mlts, setMLTs] = useState<MLT[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMLT, setSelectedMLT] = useState<MLT | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [resettingPassword, setResettingPassword] = useState(false);

  useEffect(() => {
    fetchMLTs();
  }, [refreshTrigger]);

  const fetchMLTs = async () => {
    try {
      setLoading(true);
      const response = await mltService.getAllMLTs();
      if (response.success) {
        setMLTs(response.data);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to fetch MLTs");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (mlt: MLT) => {
    const newStatus = mlt.status === "active" ? "inactive" : "active";
    try {
      const response = await mltService.updateMLTStatus(mlt._id, newStatus);
      if (response.success) {
        toast.success(
          `MLT ${newStatus === "active" ? "activated" : "deactivated"} successfully`,
        );
        fetchMLTs();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to update status");
    }
  };

  const handleDelete = async (mlt: MLT) => {
    if (!confirm(`Are you sure you want to delete ${mlt.name}?`)) return;

    try {
      const response = await mltService.deleteMLT(mlt._id, false);
      if (response.success) {
        toast.success("MLT deleted successfully");
        fetchMLTs();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to delete MLT");
    }
  };

  const handleResetPassword = async () => {
    if (!selectedMLT) return;
    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setResettingPassword(true);
      const response = await mltService.resetMLTPassword(
        selectedMLT._id,
        newPassword,
      );
      if (response.success) {
        toast.success("Password reset successfully");
        setShowResetPasswordModal(false);
        setNewPassword("");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to reset password");
    } finally {
      setResettingPassword(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircleIcon className="h-3 w-3 mr-1" />
            Active
          </span>
        );
      case "inactive":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircleIcon className="h-3 w-3 mr-1" />
            Inactive
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <ClockIcon className="h-3 w-3 mr-1" />
            Pending
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Microscope className="h-6 w-6 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">MLT List</h2>
        </div>
        <div className="text-sm text-gray-500">Total: {mlts.length} MLTs</div>
      </div>

      {mlts.length === 0 ? (
        <div className="text-center py-12">
          <Microscope className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No MLTs found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Specialization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  License
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mlts.map((mlt) => (
                <tr
                  key={mlt._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <UserIcon className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {mlt.name}
                        </div>
                        <div className="text-sm text-gray-500">{mlt.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{mlt.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {mlt.specialization}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {mlt.department}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {mlt.licenseNumber}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(mlt.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedMLT(mlt);
                          setShowDetailsModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedMLT(mlt);
                          setShowResetPasswordModal(true);
                        }}
                        className="text-yellow-600 hover:text-yellow-900"
                        title="Reset Password"
                      >
                        <KeyIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleStatusToggle(mlt)}
                        className={`${
                          mlt.status === "active"
                            ? "text-red-600 hover:text-red-900"
                            : "text-green-600 hover:text-green-900"
                        }`}
                        title={
                          mlt.status === "active" ? "Deactivate" : "Activate"
                        }
                      >
                        {mlt.status === "active" ? (
                          <XCircleIcon className="h-5 w-5" />
                        ) : (
                          <CheckCircleIcon className="h-5 w-5" />
                        )}
                      </button>
                      {onEdit && (
                        <button
                          onClick={() => onEdit(mlt)}
                          className="text-purple-600 hover:text-purple-900"
                          title="Edit"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(mlt)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedMLT && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <Microscope className="h-6 w-6 text-purple-600" />
                <h3 className="text-xl font-bold text-gray-900">MLT Details</h3>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <XCircleIcon className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <UserIcon className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium text-gray-900">
                      {selectedMLT.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">
                      {selectedMLT.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <PhoneIcon className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">
                      {selectedMLT.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <AcademicCapIcon className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Specialization</p>
                    <p className="font-medium text-gray-900">
                      {selectedMLT.specialization}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <BriefcaseIcon className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Department</p>
                    <p className="font-medium text-gray-900">
                      {selectedMLT.department}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <DocumentTextIcon className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">License Number</p>
                    <p className="font-medium text-gray-900">
                      {selectedMLT.licenseNumber}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <AcademicCapIcon className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Qualifications</p>
                    <p className="font-medium text-gray-900">
                      {selectedMLT.qualifications}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <BriefcaseIcon className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Experience</p>
                    <p className="font-medium text-gray-900">
                      {selectedMLT.experience}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CalendarIcon className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Joined</p>
                    <p className="font-medium text-gray-900">
                      {format(new Date(selectedMLT.createdAt), "PPP")}
                    </p>
                  </div>
                </div>
              </div>

              {selectedMLT.bio && (
                <div className="border-t pt-4">
                  <div className="flex items-start space-x-3">
                    <DocumentTextIcon className="h-5 w-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Bio</p>
                      <p className="text-gray-700">{selectedMLT.bio}</p>
                    </div>
                  </div>
                </div>
              )}

              {selectedMLT.addedBy && (
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-500">Added By</p>
                  <p className="text-gray-700">
                    {selectedMLT.addedBy.name} ({selectedMLT.addedBy.email})
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetPasswordModal && selectedMLT && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Reset Password for {selectedMLT.name}
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="Enter new password (min. 6 characters)"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowResetPasswordModal(false);
                  setNewPassword("");
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleResetPassword}
                disabled={resettingPassword}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                {resettingPassword ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewMLT;
