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
}

export default new AdminService();