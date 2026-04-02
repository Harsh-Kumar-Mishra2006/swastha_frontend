// services/adminService.ts
import api from "./api";

export interface AddDoctorData {
  name: string;
  email: string;
  username: string;
  phone: string;
  password: string;
  specialization: string;
  qualifications: string;
  experience: string;
  bio?: string;
  consultationFee?: number;
  availableDays?: string[];
  availableTime?: {
    start: string;
    end: string;
  };
}

// Add this interface for MLT
export interface AddMLTData {
  name: string;
  email: string;
  username: string;
  phone: string;
  password: string;
  specialization: string;
  qualifications: string;
  experience: string;
  licenseNumber: string;
  department: string;
  bio?: string;
}

class AdminService {
  async getAllDoctors() {
    const response = await api.get("/admin/doctors");
    return response.data;
  }

  async getDoctorById(doctorId: string) {
    const response = await api.get(`/admin/doctors/${doctorId}`);
    return response.data;
  }

  async getPendingDoctors() {
    const response = await api.get("/admin/doctors/pending");
    return response.data;
  }

  async addDoctor(doctorData: AddDoctorData) {
    try {
      console.log("📤 Sending to backend:", {
        ...doctorData,
        password: "[REDACTED]"
      });
      
      const response = await api.post("/admin/doctors", doctorData);
      console.log("📥 Response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ API Error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  }

  async updateDoctorStatus(doctorId: string, status: string) {
    const response = await api.put(`/admin/doctors/${doctorId}/status`, {
      status,
    });
    return response.data;
  }

  async deleteDoctor(doctorId: string, permanent: boolean = false) {
    const response = await api.delete(
      `/admin/doctors/${doctorId}?permanent=${permanent}`,
    );
    return response.data;
  }

  async resetDoctorPassword(doctorId: string, newPassword: string) {
    const response = await api.post(
      `/admin/doctors/${doctorId}/reset-password`,
      { newPassword },
    );
    return response.data;
  }

  async getDoctorStats() {
    const response = await api.get("/admin/stats");
    return response.data;
  }

  async bulkAddDoctors(doctors: AddDoctorData[]) {
    const response = await api.post("/admin/doctors/bulk", { doctors });
    return response.data;
  }

   // ==================== MLT Methods ====================
  
  async getAllMLTs() {
    const response = await api.get("/admin/mlt");
    return response.data;
  }

  async getMLTById(mltId: string) {
    const response = await api.get(`/admin/mlt/${mltId}`);
    return response.data;
  }

  async addMLT(mltData: AddMLTData) {
    try {
      console.log("📤 Sending MLT to backend:", {
        ...mltData,
        password: "[REDACTED]"
      });
      
      const response = await api.post("/admin/mlt", mltData);
      console.log("📥 MLT Response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ MLT API Error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  }

  async updateMLTStatus(mltId: string, status: string) {
    const response = await api.put(`/admin/mlt/${mltId}/status`, { status });
    return response.data;
  }

  async updateMLTProfile(mltId: string, profileData: Partial<AddMLTData>) {
    const response = await api.put(`/admin/mlt/${mltId}`, profileData);
    return response.data;
  }

  async deleteMLT(mltId: string, permanent: boolean = false) {
    const response = await api.delete(`/admin/mlt/${mltId}?permanent=${permanent}`);
    return response.data;
  }

  async resetMLTPassword(mltId: string, newPassword: string) {
    const response = await api.post(`/admin/mlt/${mltId}/reset-password`, { newPassword });
    return response.data;
  }

  async getMLTStats() {
    const response = await api.get("/admin/mlt/stats");
    return response.data;
  }
}

export default new AdminService();