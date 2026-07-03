// types/testReport.ts - Combined Unified Type Definition

// ============================================
// BASE TYPES
// ============================================

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

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

// ============================================
// MAIN TEST REPORT TYPE
// ============================================

export interface TestReport {
  _id: string;
  
  // Doctor info - Supports both string ID and populated object
  doctorId: string | {
    _id: string;
    name: string;
    email: string;
    specialization: string;
  };
  doctor_name: string;
  doctor_email: string;
  doctor_specialization: string;
  
  // MLT info - Supports both string ID and populated object
  mltId: string | null | {
    _id: string;
    name: string;
    email: string;
    specialization: string;
    department?: string;
  };
  mlt_name: string;
  mlt_email: string;
  mlt_specialization: string;
  
  // Patient info - Supports both string ID and populated object
  patientId: string | null | {
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
  };
  patient_name: string;
  patient_email: string;
  patient_phone: string;
  patient_age: string;
  patient_gender: string;
  patient_bloodGroup: string;
  
  // Appointment reference
  appointmentId?: string | {
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
    updatedAt: Date | string;
    updatedBy: string;
  }>;
  
  // Timestamps
  assigned_date: Date | string;
  completed_date: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// ============================================
// REQUEST DATA TYPES
// ============================================

export interface CreateTestRequestData {
  doctorId: string;
  doctor_name: string;
  doctor_email: string;
  doctor_specialization: string;
  mltId?: string;
  mlt_name: string;
  mlt_email: string;
  mlt_specialization: string;
  patientId?: string;
  patient_name: string;
  patient_email: string;
  patient_phone: string;
  patient_age: string;
  patient_gender: string;
  patient_bloodGroup: string;
  appointmentId?: string | null;
  test_name: string;
  test_category: 'Hematology' | 'Microbiology' | 'Biochemistry' | 'Pathology' | 'Radiology' | 'Immunology' | 'Other';
  test_description: string;
  test_priority: 'routine' | 'urgent' | 'emergency';
  test_instructions: string;
  suspected_disease: string;
  symptoms: string;
  clinical_notes: string;
  medical_history: string;
  medications: Medication[];
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
  test_report_file?: File | null;
}

// ============================================
// RESPONSE DATA TYPES
// ============================================

export interface MLTStatistics {
  period: string;
  dateRange: {
    start: Date | string;
    end: Date | string;
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
  lastUpdated: Date | string;
  history: Array<{
    test_results: string;
    results_summary: string;
    test_conclusion: string;
    recommendations: string;
    test_parameters: TestParameter[];
    updatedAt: Date | string;
    updatedBy: string;
  }>;
}

// ============================================
// DOCTOR VIEW TYPES
// ============================================

export interface DoctorTestRequestFilters {
  status?: 'pending' | 'assigned' | 'in-progress' | 'completed' | 'cancelled';
  category?: string;
  patientId?: string;
}

export interface DoctorTestStatistics {
  total: number;
  pending: number;
  assigned: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  byCategory: Array<{
    _id: string;
    count: number;
  }>;
  byMLT: Array<{
    _id: string;
    count: number;
    completed: number;
  }>;
}

// ============================================
// MLT VIEW TYPES
// ============================================

export interface MLTTestFilters {
  status?: 'pending' | 'assigned' | 'in-progress' | 'completed' | 'cancelled';
  category?: string;
  priority?: 'routine' | 'urgent' | 'emergency';
  search?: string;
  page?: number;
  limit?: number;
}

export interface MLTCompletedReportsFilters {
  startDate?: string;
  endDate?: string;
  category?: string;
  page?: number;
  limit?: number;
}

// ============================================
// UTILITY TYPE HELPERS
// ============================================

/**
 * Type guard to check if doctorId is populated
 */
export function isDoctorPopulated(doctorId: any): doctorId is { _id: string; name: string; email: string; specialization: string } {
  return doctorId && typeof doctorId === 'object' && 'name' in doctorId;
}

/**
 * Type guard to check if mltId is populated
 */
export function isMLTPopulated(mltId: any): mltId is { _id: string; name: string; email: string; specialization: string; department?: string } {
  return mltId && typeof mltId === 'object' && 'name' in mltId;
}

/**
 * Type guard to check if patientId is populated
 */
export function isPatientPopulated(patientId: any): patientId is { _id: string; name: string; email: string; phone: string; profile?: any } {
  return patientId && typeof patientId === 'object' && 'name' in patientId;
}

/**
 * Helper to get doctor name from TestReport
 */
export function getDoctorName(report: TestReport): string {
  if (typeof report.doctorId === 'object' && report.doctorId?.name) {
    return report.doctorId.name;
  }
  return report.doctor_name;
}

/**
 * Helper to get doctor email from TestReport
 */
export function getDoctorEmail(report: TestReport): string {
  if (typeof report.doctorId === 'object' && report.doctorId?.email) {
    return report.doctorId.email;
  }
  return report.doctor_email;
}

/**
 * Helper to get patient name from TestReport
 */
export function getPatientName(report: TestReport): string {
  if (typeof report.patientId === 'object' && report.patientId?.name) {
    return report.patientId.name;
  }
  return report.patient_name;
}

/**
 * Helper to get MLT name from TestReport
 */
export function getMLTName(report: TestReport): string {
  if (typeof report.mltId === 'object' && report.mltId?.name) {
    return report.mltId.name;
  }
  return report.mlt_name;
}