// pages/AddReports/AddReports.tsx
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Navigate } from "react-router-dom";
import { TestReportProvider } from "../../contexts/TestReportContext";
import AddReportForm from "../../components/form/addReportForm";
import PreviousReportsDropdown from "../../components/reports/PreviousReportsShowdown";
import ReportDetailsModal from "../../components/reports/reportDetailsModal";
import { useTestReportData } from "../../hooks/useTestReport";
import {
  FileText,
  PlusCircle,
  ClipboardList,
  Stethoscope,
  FlaskConical,
} from "lucide-react";

const AddReportsContent = () => {
  const { user } = useAuth();
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [showNewReport, setShowNewReport] = useState(false);
  const { reports } = useTestReportData();

  const stats = {
    total: reports.length,
    pending: reports.filter((r) => r.status === "pending").length,
    assigned: reports.filter((r) => r.status === "assigned").length,
    completed: reports.filter((r) => r.status === "completed").length,
  };

  const handleViewReport = async (reportId: string) => {
    setSelectedReportId(reportId);
  };

  const handleCloseModal = () => {
    setSelectedReportId(null);
  };

  if (!user || user.role !== "doctor") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-neutral-100 to-purple-100 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3">
            <FlaskConical className="h-8 w-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">Test Reports</h1>
          </div>
          <p className="mt-2 text-gray-600">
            Create and manage laboratory test reports for patients
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Reports</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-purple-600" />
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
                <ClockIcon className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Assigned to MLT</p>
                <p className="text-3xl font-bold text-blue-600">
                  {stats.assigned}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <ClipboardList className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.completed}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Stethoscope className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Previous Reports */}
          <div>
            <PreviousReportsDropdown onSelectReport={handleViewReport} />
          </div>

          {/* Right Column - Create New Report Toggle */}
          <div>
            {!showNewReport ? (
              <div
                className="bg-white rounded-xl shadow-sm border-2 border-dashed border-purple-300 hover:border-purple-500 transition-all cursor-pointer overflow-hidden"
                onClick={() => setShowNewReport(true)}
              >
                <div className="p-12 text-center">
                  <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <PlusCircle className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Create New Report
                  </h3>
                  <p className="text-gray-600">
                    Click here to create a new test report for a patient
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <AddReportForm
                  onSuccess={() => {
                    setShowNewReport(false);
                  }}
                  onCancel={() => setShowNewReport(false)}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Report Details Modal */}
      {selectedReportId && (
        <ReportDetailsModal
          reportId={selectedReportId}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

// ClockIcon component (if not imported)
const ClockIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const AddReports = () => {
  return (
    <TestReportProvider>
      <AddReportsContent />
    </TestReportProvider>
  );
};

export default AddReports;
