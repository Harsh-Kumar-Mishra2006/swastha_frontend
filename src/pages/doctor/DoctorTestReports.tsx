// pages/doctor/DoctorTestReports.tsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import {
  FileText,
  Plus,
  Search,
  User,
  Clock,
  CheckCircle,
  XCircle,
  Download,
  Loader,
  ClipboardList,
  ChevronDown,
  ChevronUp,
  Send,
  FileCheck,
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
  clinical_notes: string;
  test_results?: string;
  test_report_url?: string;
  results_summary?: string;
  test_conclusion?: string;
  recommendations?: string;
  completed_date?: string;
  createdAt: string;
  assigned_date: string;
  mlt_notes?: string;
}

const DoctorTestReports = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [testReports, setTestReports] = useState<TestReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<TestReport | null>(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState<any>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [patients, setPatients] = useState<any[]>([]);
  const [mlts, setMlts] = useState<any[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState({
    request: true,
    reports: true,
  });

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
        if (response.data.data.length > 0 && !selectedReport) {
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
      pending: {
        color: "bg-yellow-100 text-yellow-800",
        icon: Clock,
        label: "Pending",
      },
      assigned: {
        color: "bg-blue-100 text-blue-800",
        icon: User,
        label: "Assigned",
      },
      "in-progress": {
        color: "bg-purple-100 text-purple-800",
        icon: Loader,
        label: "In Progress",
      },
      completed: {
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
        label: "Completed",
      },
      cancelled: {
        color: "bg-red-100 text-red-800",
        icon: XCircle,
        label: "Cancelled",
      },
    };
    const config = configs[status as keyof typeof configs] || configs.pending;
    const Icon = config.icon;
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}
      >
        <Icon className="h-4 w-4 mr-1" />
        {config.label}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const configs = {
      routine: { color: "bg-gray-100 text-gray-800", label: "Routine" },
      urgent: { color: "bg-orange-100 text-orange-800", label: "Urgent" },
      emergency: { color: "bg-red-100 text-red-800", label: "Emergency" },
    };
    const config = configs[priority as keyof typeof configs] || configs.routine;
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.label}
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Test Reports</h1>
            <p className="text-gray-600 mt-1">
              Request tests and view results from MLT
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-teal-700 hover:to-emerald-700 transition-all flex items-center space-x-2 shadow-lg hover:shadow-xl"
          >
            <Plus className="h-5 w-5" />
            <span>New Test Request</span>
          </button>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
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
              {
                label: "Cancelled",
                value: stats.cancelled || 0,
                color: "bg-red-50 text-red-600",
                icon: XCircle,
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

        {/* SECTION 1: Request Test from MLT */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          <button
            onClick={() =>
              setIsDropdownOpen({
                ...isDropdownOpen,
                request: !isDropdownOpen.request,
              })
            }
            className="w-full px-6 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white flex items-center justify-between hover:from-teal-600 hover:to-emerald-600 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Send className="h-6 w-6" />
              <span className="text-lg font-semibold">
                Request Test from MLT
              </span>
              <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                {stats?.pending || 0} Pending
              </span>
            </div>
            {isDropdownOpen.request ? (
              <ChevronUp className="h-6 w-6" />
            ) : (
              <ChevronDown className="h-6 w-6" />
            )}
          </button>

          {isDropdownOpen.request && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Request Form - Simplified */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-700">
                    Quick Test Request
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Patient *
                    </label>
                    <select
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select MLT *
                    </label>
                    <select
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Test Name *
                    </label>
                    <input
                      type="text"
                      value={formData.test_name}
                      onChange={(e) =>
                        setFormData({ ...formData, test_name: e.target.value })
                      }
                      placeholder="e.g., Complete Blood Count"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <select
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
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Symptoms / Suspected Disease
                    </label>
                    <input
                      type="text"
                      value={formData.symptoms}
                      onChange={(e) =>
                        setFormData({ ...formData, symptoms: e.target.value })
                      }
                      placeholder="e.g., Fatigue, dizziness, pale skin"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>

                  <button
                    onClick={handleCreateTest}
                    className="w-full px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Send className="h-5 w-5" />
                    <span>Send Request to MLT</span>
                  </button>
                </div>

                {/* Recent Requests */}
                <div>
                  <h3 className="font-semibold text-gray-700 mb-3">
                    Recent Requests
                  </h3>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {testReports
                      .filter(
                        (r) =>
                          r.status === "pending" || r.status === "assigned",
                      )
                      .slice(0, 5)
                      .map((report) => (
                        <div
                          key={report._id}
                          className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">
                                {report.test_name}
                              </p>
                              <p className="text-sm text-gray-600">
                                Patient: {report.patientId?.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                MLT: {report.mltId?.name}
                              </p>
                            </div>
                            {getStatusBadge(report.status)}
                          </div>
                        </div>
                      ))}
                    {testReports.filter(
                      (r) => r.status === "pending" || r.status === "assigned",
                    ).length === 0 && (
                      <p className="text-gray-500 text-center py-4">
                        No pending requests
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 2: View Test Reports */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <button
            onClick={() =>
              setIsDropdownOpen({
                ...isDropdownOpen,
                reports: !isDropdownOpen.reports,
              })
            }
            className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white flex items-center justify-between hover:from-blue-600 hover:to-cyan-600 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <FileCheck className="h-6 w-6" />
              <span className="text-lg font-semibold">View Test Reports</span>
              <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                {stats?.completed || 0} Completed
              </span>
            </div>
            {isDropdownOpen.reports ? (
              <ChevronUp className="h-6 w-6" />
            ) : (
              <ChevronDown className="h-6 w-6" />
            )}
          </button>

          {isDropdownOpen.reports && (
            <div className="p-6">
              {/* Filters */}
              <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
                <div className="flex flex-wrap gap-2">
                  {[
                    "all",
                    "pending",
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
                    placeholder="Search reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 w-64"
                  />
                </div>
              </div>

              {/* Reports List */}
              <div className="grid grid-cols-1 gap-4">
                {filteredReports.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No test reports found</p>
                  </div>
                ) : (
                  filteredReports.map((report) => (
                    <div
                      key={report._id}
                      className={`border rounded-lg p-4 transition-all hover:shadow-md cursor-pointer ${
                        selectedReport?._id === report._id
                          ? "border-teal-500 bg-teal-50"
                          : "border-gray-200 hover:border-teal-300"
                      }`}
                      onClick={() => setSelectedReport(report)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h3 className="font-semibold text-gray-900">
                              {report.test_name}
                            </h3>
                            {getPriorityBadge(report.test_priority)}
                            {getStatusBadge(report.status)}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-sm">
                            <div>
                              <span className="text-gray-500">Patient:</span>
                              <span className="ml-1 font-medium">
                                {report.patientId?.name}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">MLT:</span>
                              <span className="ml-1 font-medium">
                                {report.mltId?.name}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Category:</span>
                              <span className="ml-1">
                                {report.test_category}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Date:</span>
                              <span className="ml-1">
                                {new Date(
                                  report.createdAt,
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          {report.status === "completed" &&
                            report.test_results && (
                              <div className="mt-2 p-2 bg-green-50 rounded border border-green-200">
                                <p className="text-sm text-green-800">
                                  <CheckCircle className="h-4 w-4 inline mr-1" />
                                  Report ready - Click to view details
                                </p>
                              </div>
                            )}
                        </div>
                        {report.status === "completed" &&
                          report.test_report_url && (
                            <a
                              href={report.test_report_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-4 px-3 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center space-x-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Download className="h-4 w-4" />
                              <span>Download</span>
                            </a>
                          )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Test Modal - Full version */}
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

              {/* Symptoms */}
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

              {/* Clinical Notes */}
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
