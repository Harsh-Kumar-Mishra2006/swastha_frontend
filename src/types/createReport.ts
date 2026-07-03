// types/testReport.ts

export interface TestParameter {
  name: string;
  value: string;
  unit: string;
  normal_range: string;
  is_abnormal?: boolean;
}

export interface NormalRange {
  parameter: string;
  range: string;
  description: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface TestReport {
  _id: string;
  // Doctor info
  doctorId: {
    _id: string;
    name: string;
    email: string;
    specialization: string;
  };
  doctor_name: string;
  doctor_email: string;
  doctor_specialization: string;
  
  // MLT info
  mltId: {
    _id: string;
    name: string;
    email: string;
    specialization: string;
    department?: string;
  } | null;
  mlt_name: string;
  mlt_email: string;
  mlt_specialization: string;
  
  // Patient info
  patientId: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    profile?: {
      age?: string;
      gender?: string;
      bloodGroup?: string;
      address?: string;
    };
  } | null;
  patient_name: string;
  patient_email: string;
  patient_phone: string;
  patient_age: string;
  patient_gender: string;
  patient_bloodGroup: string;
  
  // Appointment reference
  appointmentId?: {
    _id: string;
    appointment_date: string;
    appointment_time: string;
    symptoms: string;
  };
  
  // Test details
  test_name: string;
  test_category: 'Hematology' | 'Microbiology' | 'Biochemistry' | 'Pathology' | 'Radiology' | 'Immunology' | 'Other';
  test_description: string;
  test_priority: 'routine' | 'urgent' | 'emergency';
  test_instructions: string;
  
  // Clinical details
  suspected_disease: string;
  symptoms: string;
  clinical_notes: string;
  medical_history: string;
  medications: Medication[];
  
  // Status
  status: 'pending' | 'assigned' | 'in-progress' | 'completed' | 'cancelled';
  
  // MLT work
  test_results: string;
  test_report_url: string;
  test_report_public_id: string;
  mlt_notes: string;
  
  // Results summary
  results_summary: string;
  test_conclusion: string;
  recommendations: string;
  
  // Detailed report fields
  test_parameters: TestParameter[];
  normal_ranges: NormalRange[];
  interpretation: string;
  clinical_impression: string;
  follow_up_instructions: string;
  report_visibility: 'doctor' | 'patient' | 'both';
  report_version: number;
  previous_versions: Array<{
    test_results: string;
    results_summary: string;
    test_conclusion: string;
    recommendations: string;
    test_parameters: TestParameter[];
    updatedAt: Date;
    updatedBy: string;
  }>;
  
  // Timestamps
  assigned_date: Date;
  completed_date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateReportData {
  test_results: string;
  results_summary: string;
  test_conclusion: string;
  recommendations: string;
  mlt_notes: string;
  report_status: 'completed' | 'in-progress';
  test_parameters: TestParameter[];
  normal_ranges: NormalRange[];
  interpretation: string;
  clinical_impression: string;
  follow_up_instructions: string;
  report_visibility: 'doctor' | 'patient' | 'both';
  test_report_file?: File;
}

export interface MLTStatistics {
  period: string;
  dateRange: {
    start: Date;
    end: Date;
  };
  overall: {
    totalTests: number;
    completedTests: number;
    cancelledTests: number;
    avgCompletionTime: number;
  };
  daily: Array<{
    _id: string;
    count: number;
    completed: number;
  }>;
  byCategory: Array<{
    _id: string;
    count: number;
    completed: number;
  }>;
}

export interface MLTDashboardData {
  mlt: {
    id: string;
    name: string;
    email: string;
    specialization: string;
  };
  statistics: {
    total: number;
    pending: number;
    assigned: number;
    'in-progress': number;
    completed: number;
    cancelled: number;
  };
  recentTests: TestReport[];
  byCategory: Array<{
    _id: string;
    count: number;
    completed: number;
  }>;
  byPriority: Array<{
    _id: string;
    count: number;
  }>;
}

export interface AssignedTestsResponse {
  tests: TestReport[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface ReportHistory {
  currentVersion: number;
  lastUpdated: Date;
  history: Array<{
    test_results: string;
    results_summary: string;
    test_conclusion: string;
    recommendations: string;
    test_parameters: TestParameter[];
    updatedAt: Date;
    updatedBy: string;
  }>;
}