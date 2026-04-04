// types/testReport.ts

export interface Test {
  testName: string;
  testDescription?: string;
  referenceRange?: string;
  unit?: string;
  result?: string;
  status: 'pending' | 'completed' | 'reviewed';
  _id?: string;
}

export interface PatientInfo {
  name: string;
  email: string;
  phone?: string;
  age?: number;
  gender?: 'male' | 'female' | 'other' | 'not_specified';
  patientId?: string;
}

export interface DoctorInfo {
  doctorId: string;
  name: string;
  email?: string;
  specialization?: string;
}

export interface MLTInfo {
  mltId?: string;
  name?: string;
  email?: string;
  assignedAt?: Date;
  acceptedAt?: Date;
  completedAt?: Date;
}

export interface TestReport {
  _id: string;
  reportId: string;
  patient: PatientInfo;
  doctor: DoctorInfo;
  mlt: MLTInfo;
  condition: string;
  disease: string;
  reportDescription: string;
  doctorNotes?: string;
  additionalNotes?: string;
  tests: Test[];
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'normal' | 'urgent' | 'emergency';
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface CreateReportData {
  patientName: string;
  patientEmail: string;
  patientPhone?: string;
  patientAge?: number;
  patientGender?: 'male' | 'female' | 'other' | 'not_specified';
  condition: string;
  disease: string;
  reportDescription: string;
  doctorNotes?: string;
  additionalNotes?: string;
  tests?: Omit<Test, '_id' | 'status' | 'result'>[];
  priority?: 'normal' | 'urgent' | 'emergency';
}

export interface UpdateReportData {
  condition?: string;
  disease?: string;
  reportDescription?: string;
  doctorNotes?: string;
  tests?: Test[];
  priority?: 'normal' | 'urgent' | 'emergency';
  additionalNotes?: string;
}

export interface AssignMLTData {
  mltId: string;
}

export interface UpdateTestResultData {
  result: string;
  status?: 'pending' | 'completed' | 'reviewed';
}

export interface AvailableMLT {
  _id: string;
  name: string;
  email: string;
  specialization: string;
  department: string;
}

export interface ReportListResponse {
  success: boolean;
  data: TestReport[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ReportResponse {
  success: boolean;
  data: TestReport;
  message?: string;
}