// types/testReport.ts
export interface TestReport {
  _id: string;
  doctorId: string;
  doctor_name: string;
  doctor_email: string;
  doctor_specialization: string;
  mltId: string;
  mlt_name: string;
  mlt_email: string;
  mlt_specialization: string;
  patientId: string;
  patient_name: string;
  patient_email: string;
  patient_phone: string;
  patient_age: string;
  patient_gender: string;
  patient_bloodGroup: string;
  appointmentId?: string;
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
  status: 'pending' | 'assigned' | 'in-progress' | 'completed' | 'cancelled';
  test_results: string;
  test_report_url: string;
  test_report_public_id: string;
  mlt_notes: string;
  results_summary: string;
  test_conclusion: string;
  recommendations: string;
  assigned_date: string;
  completed_date?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}
// types/testReport.ts
export interface CreateTestRequestData {
  doctorId: string;
  doctor_name: string;
  doctor_email: string;
  doctor_specialization: string;
  mltId?: string; // Made optional
  mlt_name: string;
  mlt_email: string;
  mlt_specialization: string;
  patientId?: string; // Made optional
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

// types/testReport.ts - Add new types

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

export interface DetailedTestReport extends TestReport {
  test_parameters: TestParameter[];
  normal_ranges: NormalRange[];
  interpretation: string;
  clinical_impression: string;
  follow_up_instructions: string;
  report_visibility: 'doctor' | 'patient' | 'both';
  report_version: number;
  previous_versions: any[];
}

export interface CreateDetailedReportData {
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