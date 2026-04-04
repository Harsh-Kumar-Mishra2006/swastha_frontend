// components/reports/ReportDetailsModal.tsx
import React, { useEffect, useState } from "react";
import { useTestReportData } from "../../hooks/useTestReport";
import {
  X,
  User,
  Mail,
  Phone,
  Calendar,
  ClipboardList,
  Flag,
  Loader2,
  Microscope,
  Stethoscope,
} from "lucide-react";
import { format } from "date-fns";

interface ReportDetailsModalProps {
  reportId: string;
  onClose: () => void;
}

const ReportDetailsModal: React.FC<ReportDetailsModalProps> = ({
  reportId,
  onClose,
}) => {
  const { getDoctorReportById, getStatusColor, getPriorityColor, loading } =
    useTestReportData();
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    const fetchReport = async () => {
      const data = await getDoctorReportById(reportId);
      setReport(data);
    };
    fetchReport();
  }, [reportId]);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd MMM yyyy, hh:mm a");
  };

  if (loading || !report) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">Report Details</h2>
            <p className="text-purple-100 text-sm">{report.reportId}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-purple-500 rounded-lg p-1 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Status Badges */}
          <div className="flex space-x-2 mb-6">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(report.status)}`}
            >
              {report.status.toUpperCase()}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(report.priority)}`}
            >
              <Flag className="h-3 w-3 inline mr-1" />
              {report.priority.toUpperCase()}
            </span>
          </div>

          {/* Patient Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <User className="h-5 w-5 mr-2 text-purple-600" />
              Patient Information
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <User className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-gray-600">Name:</span>
                <span className="ml-2 font-medium">{report.patient.name}</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-gray-600">Email:</span>
                <span className="ml-2">{report.patient.email}</span>
              </div>
              {report.patient.phone && (
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-600">Phone:</span>
                  <span className="ml-2">{report.patient.phone}</span>
                </div>
              )}
              {report.patient.age && (
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-600">Age:</span>
                  <span className="ml-2">{report.patient.age} years</span>
                </div>
              )}
            </div>
          </div>

          {/* Medical Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Stethoscope className="h-5 w-5 mr-2 text-purple-600" />
              Medical Information
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div>
                <span className="text-sm text-gray-500">Condition:</span>
                <p className="font-medium">{report.condition}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Disease:</span>
                <p className="font-medium">{report.disease}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">
                  Report Description:
                </span>
                <p className="text-gray-700">{report.reportDescription}</p>
              </div>
              {report.doctorNotes && (
                <div>
                  <span className="text-sm text-gray-500">Doctor's Notes:</span>
                  <p className="text-gray-700">{report.doctorNotes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Tests */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Microscope className="h-5 w-5 mr-2 text-purple-600" />
              Tests Requested
            </h3>
            <div className="space-y-3">
              {report.tests.map((test: any, index: number) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-800">
                      {test.testName}
                    </h4>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        test.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {test.status.toUpperCase()}
                    </span>
                  </div>
                  {test.testDescription && (
                    <p className="text-sm text-gray-600 mb-2">
                      {test.testDescription}
                    </p>
                  )}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {test.referenceRange && (
                      <div>
                        <span className="text-gray-500">Reference Range:</span>
                        <span className="ml-2">{test.referenceRange}</span>
                      </div>
                    )}
                    {test.unit && (
                      <div>
                        <span className="text-gray-500">Unit:</span>
                        <span className="ml-2">{test.unit}</span>
                      </div>
                    )}
                    {test.result && (
                      <div>
                        <span className="text-gray-500">Result:</span>
                        <span className="ml-2 font-medium">{test.result}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Info */}
          {report.additionalNotes && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <ClipboardList className="h-5 w-5 mr-2 text-purple-600" />
                Additional Notes
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">{report.additionalNotes}</p>
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="text-xs text-gray-400 border-t pt-4">
            <p>Created: {formatDate(report.createdAt)}</p>
            <p>Last Updated: {formatDate(report.updatedAt)}</p>
            {report.completedAt && (
              <p>Completed: {formatDate(report.completedAt)}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailsModal;
