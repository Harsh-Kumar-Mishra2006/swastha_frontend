// pages/doctor/DoctorTestReports.tsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  Stethoscope,
  Microscope,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronDown,
  Download,
  Eye,
  FileCheck,
  FileX,
  Loader,
  Activity,
  TrendingUp,
  BarChart3,
  ClipboardList,
  Bell,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";

interface TestReport {
  _id: string;
  test_name: string;
  test_category: string;
  test_priority: "routine" | "urgent" | "emergency";
  status: "pending" | "assigned" | "in-progress" | "completed" | "cancelled";
  patientId: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    profile?: {
      age?: string;
      gender?: string;
      bloodGroup?: string;
    };
  };
  mltId: {
    _id: string;
    name: string;
    email: string;
    specialization: string;
  };
  symptoms: string;
  suspected_disease: string;
  test_results?: string;
  test_report_url?: string;
  completed_date?: string;
  createdAt: string;
}

const DoctorTestReports = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [testReports, setTestReports] = useState<TestReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<TestReport | null>(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState<any>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [patients, setPatients] = useState<any[]>([]);
  const [mlts, setMlts] = useState<any[]>([]);

  // Form state for creating test
  const [formData, setFormData] = useState({
    patientId: "",
    mltId: "",
    test_name: "",
    test_category: "Hematology",
    test_priority: "routine",
    test_description: "",
    test_instructions: "",
    suspected_disease: "",
    symptoms: "",
    clinical_notes: "",
    medical_history: "",
    medications: [{ name: "", dosage: "", frequency: "", duration: "" }],
  });

  useEffect(() => {
    if (user) {
      fetchTestReports();
      fetchPatients();
      fetchMLTs();
    }
  }, [user, filter]);

  const fetchTestReports = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/test-reports/doctor/${user?._id}`, {
        params: { status: filter !== "all" ? filter : undefined },
      });
      if (response.data.success) {
        setTestReports(response.data.data);
        setStats(response.data.statistics);
        if (response.data.data.length > 0) {
          setSelectedReport(response.data.data[0]);
        }
      }
    } catch (error) {
      toast.error("Failed to load test reports");
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await api.get(
        `/test-reports/doctor/${user?._id}/patients`,
      );
      if (response.data.success) {
        setPatients(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch patients:", error);
    }
  };

  const fetchMLTs = async () => {
    try {
      const response = await api.get("/admin/mlt");
      if (response.data.success) {
        setMlts(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch MLTs:", error);
    }
  };

  const handleCreateTest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedPatient = patients.find(
        (p) => p._id === formData.patientId,
      );
      const selectedMLT = mlts.find((m) => m._id === formData.mltId);

      const payload = {
        doctorId: user?._id,
        doctor_name: user?.name,
        doctor_email: user?.email,
        doctor_specialization: user?.profile?.specialization || "",
        mltId: formData.mltId,
        mlt_name: selectedMLT?.name,
        mlt_email: selectedMLT?.email,
        mlt_specialization: selectedMLT?.specialization,
        patientId: formData.patientId,
        patient_name: selectedPatient?.name,
        patient_email: selectedPatient?.email,
        patient_phone: selectedPatient?.phone,
        patient_age: selectedPatient?.profile?.age || "",
        patient_gender: selectedPatient?.profile?.gender || "",
        patient_bloodGroup: selectedPatient?.profile?.bloodGroup || "",
        test_name: formData.test_name,
        test_category: formData.test_category,
        test_description: formData.test_description,
        test_priority: formData.test_priority,
        test_instructions: formData.test_instructions,
        suspected_disease: formData.suspected_disease,
        symptoms: formData.symptoms,
        clinical_notes: formData.clinical_notes,
        medical_history: formData.medical_history,
        medications: formData.medications.filter((m) => m.name),
      };

      const response = await api.post("/test-reports/create", payload);
      if (response.data.success) {
        toast.success("Test request created successfully!");
        setShowCreateModal(false);
        fetchTestReports();
        resetForm();
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.error || "Failed to create test request",
      );
    }
  };

  const resetForm = () => {
    setFormData({
      patientId: "",
      mltId: "",
      test_name: "",
      test_category: "Hematology",
      test_priority: "routine",
      test_description: "",
      test_instructions: "",
      suspected_disease: "",
      symptoms: "",
      clinical_notes: "",
      medical_history: "",
      medications: [{ name: "", dosage: "", frequency: "", duration: "" }],
    });
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      assigned: { color: "bg-blue-100 text-blue-800", icon: User },
      "in-progress": { color: "bg-purple-100 text-purple-800", icon: Loader },
      completed: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      cancelled: { color: "bg-red-100 text-red-800", icon: XCircle },
    };
    const config = configs[status as keyof typeof configs] || configs.pending;
    const Icon = config.icon;
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}
      >
        <Icon className="h-4 w-4 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const configs = {
      routine: { color: "bg-gray-100 text-gray-800" },
      urgent: { color: "bg-orange-100 text-orange-800" },
      emergency: { color: "bg-red-100 text-red-800" },
    };
    const config = configs[priority as keyof typeof configs] || configs.routine;
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  const filteredReports = testReports.filter(
    (report) =>
      report.patientId?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      report.test_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.mltId?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Test Reports</h1>
            <p className="text-gray-600 mt-1">
              Manage and track all test requests
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-teal-700 hover:to-emerald-700 transition-all flex items-center space-x-2 shadow-lg hover:shadow-xl"
          >
            <Plus className="h-5 w-5" />
            <span>New Test Request</span>
          </button>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              {
                label: "Total",
                value: stats.total,
                color: "bg-blue-50 text-blue-600",
                icon: ClipboardList,
              },
              {
                label: "Pending",
                value: stats.pending,
                color: "bg-yellow-50 text-yellow-600",
                icon: Clock,
              },
              {
                label: "In Progress",
                value: stats["in-progress"],
                color: "bg-purple-50 text-purple-600",
                icon: Loader,
              },
              {
                label: "Completed",
                value: stats.completed,
                color: "bg-green-50 text-green-600",
                icon: CheckCircle,
              },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className={`${stat.color} rounded-xl p-4 text-center transition-transform hover:scale-105`}
                >
                  <Icon className="h-6 w-6 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm">{stat.label}</div>
                </div>
              );
            })}
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {[
                "all",
                "pending",
                "assigned",
                "in-progress",
                "completed",
                "cancelled",
              ].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === status
                      ? "bg-teal-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by patient, test, MLT..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 w-64"
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Test List */}
          <div className="lg:col-span-1 space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {filteredReports.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No test reports found</p>
              </div>
            ) : (
              filteredReports.map((report) => (
                <button
                  key={report._id}
                  onClick={() => setSelectedReport(report)}
                  className={`w-full text-left bg-white rounded-xl p-4 shadow-sm transition-all hover:shadow-md ${
                    selectedReport?._id === report._id
                      ? "ring-2 ring-teal-500 border-transparent"
                      : "border border-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="font-semibold text-gray-900 truncate">
                          {report.test_name}
                        </p>
                        {getPriorityBadge(report.test_priority)}
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        Patient: {report.patientId?.name}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        MLT: {report.mltId?.name}
                      </p>
                      <div className="flex items-center mt-1 text-xs text-gray-400">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(report.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="ml-2">{getStatusBadge(report.status)}</div>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Test Details */}
          <div className="lg:col-span-2">
            {selectedReport ? (
              <div className="bg-white rounded-xl shadow-lg p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-6 pb-4 border-b">
                  <div>
                    <div className="flex items-center space-x-3">
                      <h2 className="text-xl font-bold text-gray-900">
                        {selectedReport.test_name}
                      </h2>
                      {getPriorityBadge(selectedReport.test_priority)}
                      {getStatusBadge(selectedReport.status)}
                    </div>
                    <p className="text-gray-600 mt-1">
                      {selectedReport.test_category}
                    </p>
                  </div>
                  {selectedReport.status === "completed" &&
                    selectedReport.test_report_url && (
                      <a
                        href={selectedReport.test_report_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center space-x-2"
                      >
                        <Download className="h-4 w-4" />
                        <span>Download Report</span>
                      </a>
                    )}
                </div>

                {/* Patient Info */}
                <div className="bg-teal-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-gray-700 mb-2 flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Patient Information
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Name</p>
                      <p className="font-medium">
                        {selectedReport.patientId?.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Email</p>
                      <p className="font-medium">
                        {selectedReport.patientId?.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Phone</p>
                      <p className="font-medium">
                        {selectedReport.patientId?.phone}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Age/Gender</p>
                      <p className="font-medium">
                        {selectedReport.patientId?.profile?.age || "N/A"} /
                        {selectedReport.patientId?.profile?.gender || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* MLT Info */}
                <div className="bg-purple-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-gray-700 mb-2 flex items-center">
                    <Microscope className="h-4 w-4 mr-2" />
                    Assigned MLT
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Name</p>
                      <p className="font-medium">
                        {selectedReport.mltId?.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Specialization</p>
                      <p className="font-medium">
                        {selectedReport.mltId?.specialization}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Status</p>
                      <p className="font-medium capitalize">
                        {selectedReport.status}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Clinical Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">
                      Suspected Disease
                    </h3>
                    <p className="text-gray-600">
                      {selectedReport.suspected_disease || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">
                      Symptoms
                    </h3>
                    <p className="text-gray-600">
                      {selectedReport.symptoms || "Not specified"}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <h3 className="font-semibold text-gray-700 mb-2">
                      Clinical Notes
                    </h3>
                    <p className="text-gray-600">
                      {selectedReport.clinical_notes || "Not specified"}
                    </p>
                  </div>
                </div>

                {/* Test Results (if completed) */}
                {selectedReport.status === "completed" && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-green-800 mb-3 flex items-center">
                      <FileCheck className="h-5 w-5 mr-2" />
                      Test Results
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-green-700 font-medium">
                          Results
                        </p>
                        <p className="text-gray-700">
                          {selectedReport.test_results || "No results provided"}
                        </p>
                      </div>
                      {selectedReport.results_summary && (
                        <div>
                          <p className="text-sm text-green-700 font-medium">
                            Summary
                          </p>
                          <p className="text-gray-700">
                            {selectedReport.results_summary}
                          </p>
                        </div>
                      )}
                      {selectedReport.test_conclusion && (
                        <div>
                          <p className="text-sm text-green-700 font-medium">
                            Conclusion
                          </p>
                          <p className="text-gray-700">
                            {selectedReport.test_conclusion}
                          </p>
                        </div>
                      )}
                      {selectedReport.recommendations && (
                        <div>
                          <p className="text-sm text-green-700 font-medium">
                            Recommendations
                          </p>
                          <p className="text-gray-700">
                            {selectedReport.recommendations}
                          </p>
                        </div>
                      )}
                      {selectedReport.completed_date && (
                        <p className="text-xs text-gray-500">
                          Completed on:{" "}
                          {new Date(
                            selectedReport.completed_date,
                          ).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* MLT Notes */}
                {selectedReport.mlt_notes && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-700 mb-2">
                      MLT Notes
                    </h3>
                    <p className="text-gray-600">{selectedReport.mlt_notes}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-12 text-center">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  Select a test report to view details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Test Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  New Test Request
                </h2>
                <p className="text-gray-600">
                  Assign a test to an MLT for a patient
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <XCircle className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleCreateTest} className="space-y-6">
              {/* Patient Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Patient *
                </label>
                <select
                  required
                  value={formData.patientId}
                  onChange={(e) =>
                    setFormData({ ...formData, patientId: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                >
                  <option value="">Select patient</option>
                  {patients.map((patient) => (
                    <option key={patient._id} value={patient._id}>
                      {patient.name} - {patient.email}
                    </option>
                  ))}
                </select>
              </div>

              {/* MLT Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assign to MLT *
                </label>
                <select
                  required
                  value={formData.mltId}
                  onChange={(e) =>
                    setFormData({ ...formData, mltId: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                >
                  <option value="">Select MLT</option>
                  {mlts.map((mlt) => (
                    <option key={mlt._id} value={mlt._id}>
                      {mlt.name} - {mlt.specialization}
                    </option>
                  ))}
                </select>
              </div>

              {/* Test Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Test Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.test_name}
                    onChange={(e) =>
                      setFormData({ ...formData, test_name: e.target.value })
                    }
                    placeholder="e.g., Complete Blood Count"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Test Category *
                  </label>
                  <select
                    required
                    value={formData.test_category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        test_category: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="Hematology">Hematology</option>
                    <option value="Microbiology">Microbiology</option>
                    <option value="Biochemistry">Biochemistry</option>
                    <option value="Pathology">Pathology</option>
                    <option value="Radiology">Radiology</option>
                    <option value="Immunology">Immunology</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={formData.test_priority}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        test_priority: e.target.value as any,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="routine">Routine</option>
                    <option value="urgent">Urgent</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Suspected Disease
                  </label>
                  <input
                    type="text"
                    value={formData.suspected_disease}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        suspected_disease: e.target.value,
                      })
                    }
                    placeholder="e.g., Anemia"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Symptoms & Clinical Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Symptoms
                </label>
                <textarea
                  rows={2}
                  value={formData.symptoms}
                  onChange={(e) =>
                    setFormData({ ...formData, symptoms: e.target.value })
                  }
                  placeholder="Describe the patient's symptoms"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Clinical Notes
                </label>
                <textarea
                  rows={2}
                  value={formData.clinical_notes}
                  onChange={(e) =>
                    setFormData({ ...formData, clinical_notes: e.target.value })
                  }
                  placeholder="Additional clinical notes"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Test Instructions
                </label>
                <textarea
                  rows={2}
                  value={formData.test_instructions}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      test_instructions: e.target.value,
                    })
                  }
                  placeholder="Instructions for the MLT"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              {/* Medications */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medications
                </label>
                {formData.medications.map((med, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2"
                  >
                    <input
                      type="text"
                      placeholder="Medication name"
                      value={med.name}
                      onChange={(e) => {
                        const newMeds = [...formData.medications];
                        newMeds[index].name = e.target.value;
                        setFormData({ ...formData, medications: newMeds });
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                    />
                    <input
                      type="text"
                      placeholder="Dosage"
                      value={med.dosage}
                      onChange={(e) => {
                        const newMeds = [...formData.medications];
                        newMeds[index].dosage = e.target.value;
                        setFormData({ ...formData, medications: newMeds });
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                    />
                    <input
                      type="text"
                      placeholder="Frequency"
                      value={med.frequency}
                      onChange={(e) => {
                        const newMeds = [...formData.medications];
                        newMeds[index].frequency = e.target.value;
                        setFormData({ ...formData, medications: newMeds });
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                    />
                    <input
                      type="text"
                      placeholder="Duration"
                      value={med.duration}
                      onChange={(e) => {
                        const newMeds = [...formData.medications];
                        newMeds[index].duration = e.target.value;
                        setFormData({ ...formData, medications: newMeds });
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      medications: [
                        ...formData.medications,
                        { name: "", dosage: "", frequency: "", duration: "" },
                      ],
                    })
                  }
                  className="text-sm text-teal-600 hover:text-teal-700"
                >
                  + Add Medication
                </button>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                >
                  Create Test Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorTestReports;
