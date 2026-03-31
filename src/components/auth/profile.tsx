// Profile.tsx
import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import authService from "../../services/authService";
import { useNavigate } from "react-router-dom";
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  IdentificationIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  HeartIcon,
  DocumentTextIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  ShieldCheckIcon,
  BeakerIcon,
  ClipboardIcon,
} from "@heroicons/react/24/outline";

import { Microscope } from "lucide-react";
// Schema for patient profile
const patientProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  profile: z.object({
    age: z.string().optional(),
    gender: z.enum(["male", "female", "other", ""]).optional(),
    dob: z.string().optional(),
    address: z.string().optional(),
    bloodGroup: z
      .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", ""])
      .optional(),
    emergencyContact: z
      .object({
        name: z.string().optional(),
        relationship: z.string().optional(),
        phone: z.string().optional(),
      })
      .optional(),
  }),
});

// Schema for doctor profile
const doctorProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  profile: z.object({
    bio: z.string().optional(),
    specialization: z.string().min(2, "Specialization is required"),
    qualifications: z.string().min(2, "Qualifications are required"),
    experience: z.string().min(1, "Experience is required"),
    age: z.string().optional(),
    gender: z.enum(["male", "female", "other", ""]).optional(),
    address: z.string().optional(),
  }),
});

// Schema for MLT profile
const mltProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  profile: z.object({
    bio: z.string().optional(),
    specialization: z.string().min(2, "Specialization is required"),
    qualifications: z.string().min(2, "Qualifications are required"),
    experience: z.string().min(1, "Experience is required"),
    licenseNumber: z.string().min(3, "License number is required"),
    department: z.string().min(2, "Department is required"),
    age: z.string().optional(),
    gender: z.enum(["male", "female", "other", ""]).optional(),
    address: z.string().optional(),
  }),
});

type PatientFormData = z.infer<typeof patientProfileSchema>;
type DoctorFormData = z.infer<typeof doctorProfileSchema>;
type MLTFormData = z.infer<typeof mltProfileSchema>;

const Profile: React.FC = () => {
  const { user, updateUser, logout, loading: authLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();

  // Form for patient
  const patientForm = useForm<PatientFormData>({
    resolver: zodResolver(patientProfileSchema),
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
      profile: {
        age: user?.profile?.age || "",
        gender: (user?.profile?.gender as any) || "",
        dob: user?.profile?.dob || "",
        address: user?.profile?.address || "",
        bloodGroup: (user?.profile?.bloodGroup as any) || "",
        emergencyContact: {
          name: user?.profile?.emergencyContact?.name || "",
          relationship: user?.profile?.emergencyContact?.relationship || "",
          phone: user?.profile?.emergencyContact?.phone || "",
        },
      },
    },
  });

  // Form for doctor
  const doctorForm = useForm<DoctorFormData>({
    resolver: zodResolver(doctorProfileSchema),
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
      profile: {
        bio: user?.profile?.bio || "",
        specialization: user?.profile?.specialization || "",
        qualifications: user?.profile?.qualifications || "",
        experience: user?.profile?.experience || "",
        age: user?.profile?.age || "",
        gender: (user?.profile?.gender as any) || "",
        address: user?.profile?.address || "",
      },
    },
  });

  // Form for MLT
  const mltForm = useForm<MLTFormData>({
    resolver: zodResolver(mltProfileSchema),
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
      profile: {
        bio: user?.profile?.bio || "",
        specialization: user?.profile?.specialization || "",
        qualifications: user?.profile?.qualifications || "",
        experience: user?.profile?.experience || "",
        licenseNumber: user?.profile?.licenseNumber || "",
        department: user?.profile?.department || "",
        age: user?.profile?.age || "",
        gender: (user?.profile?.gender as any) || "",
        address: user?.profile?.address || "",
      },
    },
  });

  const onSubmitPatient = async (data: PatientFormData) => {
    try {
      setLoading(true);

      const cleanedData = {
        name: data.name,
        phone: data.phone,
        profile: {
          ...data.profile,
          emergencyContact: data.profile.emergencyContact
            ? {
                name: data.profile.emergencyContact.name || "",
                relationship: data.profile.emergencyContact.relationship || "",
                phone: data.profile.emergencyContact.phone || "",
              }
            : undefined,
        },
      };

      const response = await authService.updateProfile(cleanedData);
      if (response.success) {
        updateUser(response.user);
        toast.success("Profile updated successfully");
        setIsEditing(false);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const onSubmitDoctor = async (data: DoctorFormData) => {
    try {
      setLoading(true);
      const response = await authService.updateProfile(data);
      if (response.success) {
        updateUser(response.user);
        toast.success("Profile updated successfully");
        setIsEditing(false);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const onSubmitMLT = async (data: MLTFormData) => {
    try {
      setLoading(true);
      const response = await authService.updateProfile(data);
      if (response.success) {
        updateUser(response.user);
        toast.success("Profile updated successfully");
        setIsEditing(false);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please login to view your profile</p>
        <button
          onClick={() => navigate("/login")}
          className="mt-4 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
        >
          Go to Login
        </button>
      </div>
    );
  }

  const getRoleIcon = () => {
    switch (user.role) {
      case "MLT":
        return <Microscope className="h-6 w-6 text-purple-600" />;
      case "doctor":
        return <BriefcaseIcon className="h-6 w-6 text-blue-600" />;
      case "admin":
        return <ShieldCheckIcon className="h-6 w-6 text-red-600" />;
      default:
        return <UserIcon className="h-6 w-6 text-teal-600" />;
    }
  };

  const ProfileHeader = () => (
    <div className="flex justify-between items-center mb-6">
      <div>
        <div className="flex items-center space-x-2">
          {getRoleIcon()}
          <h1 className="text-3xl font-bold text-gray-900">
            {user.role === "doctor"
              ? "Doctor Profile"
              : user.role === "MLT"
                ? "Lab Technician Profile"
                : user.role === "admin"
                  ? "Admin Profile"
                  : "My Profile"}
          </h1>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {user.role === "MLT" ? (
            <>
              <Microscope className="h-4 w-4 inline mr-1 text-purple-600" />{" "}
              Medical Laboratory Technician Account
            </>
          ) : user.role === "doctor" ? (
            <>
              <BriefcaseIcon className="h-4 w-4 inline mr-1 text-blue-600" />{" "}
              Medical Professional Account
            </>
          ) : (
            <>
              <ShieldCheckIcon className="h-4 w-4 inline mr-1 text-teal-600" />{" "}
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Account
            </>
          )}
          {user.isVerified && (
            <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
              Verified
            </span>
          )}
        </p>
      </div>
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
        >
          {isEditing ? (
            <>
              <XMarkIcon className="h-5 w-5 mr-2" />
              Cancel
            </>
          ) : (
            <>
              <PencilIcon className="h-5 w-5 mr-2" />
              Edit Profile
            </>
          )}
        </button>

        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
          Logout
        </button>
      </div>
    </div>
  );

  const LogoutModal = () => {
    if (!showLogoutConfirm) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Confirm Logout
          </h3>
          <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowLogoutConfirm(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Patient Profile View
  if (user.role === "patient") {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProfileHeader />
        <LogoutModal />

        {isEditing ? (
          <form
            onSubmit={patientForm.handleSubmit(onSubmitPatient)}
            className="space-y-6"
          >
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    {...patientForm.register("name")}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  {patientForm.formState.errors.name && (
                    <p className="mt-1 text-sm text-red-600">
                      {patientForm.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    {...patientForm.register("phone")}
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  {patientForm.formState.errors.phone && (
                    <p className="mt-1 text-sm text-red-600">
                      {patientForm.formState.errors.phone.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={user.username}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age
                  </label>
                  <input
                    {...patientForm.register("profile.age")}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Enter your age"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    {...patientForm.register("profile.gender")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    {...patientForm.register("profile.dob")}
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Blood Group
                  </label>
                  <select
                    {...patientForm.register("profile.bloodGroup")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Select blood group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    {...patientForm.register("profile.address")}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Enter your address"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Emergency Contact
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Name
                  </label>
                  <input
                    {...patientForm.register("profile.emergencyContact.name")}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Relationship
                  </label>
                  <input
                    {...patientForm.register(
                      "profile.emergencyContact.relationship",
                    )}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Relationship"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    {...patientForm.register("profile.emergencyContact.phone")}
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Phone number"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckIcon className="h-5 w-5 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="bg-teal-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white">
                  Personal Information
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start space-x-3">
                    <UserIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="text-lg font-medium text-gray-900">
                        {user.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-lg font-medium text-gray-900">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <PhoneIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="text-lg font-medium text-gray-900">
                        {user.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <IdentificationIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Username</p>
                      <p className="text-lg font-medium text-gray-900">
                        {user.username}
                      </p>
                    </div>
                  </div>

                  {user.profile?.age && (
                    <div className="flex items-start space-x-3">
                      <CalendarIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Age</p>
                        <p className="text-lg font-medium text-gray-900">
                          {user.profile.age}
                        </p>
                      </div>
                    </div>
                  )}

                  {user.profile?.gender && (
                    <div className="flex items-start space-x-3">
                      <UserIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Gender</p>
                        <p className="text-lg font-medium text-gray-900 capitalize">
                          {user.profile.gender}
                        </p>
                      </div>
                    </div>
                  )}

                  {user.profile?.dob && (
                    <div className="flex items-start space-x-3">
                      <CalendarIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Date of Birth</p>
                        <p className="text-lg font-medium text-gray-900">
                          {new Date(user.profile.dob).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {user.profile?.bloodGroup && (
                    <div className="flex items-start space-x-3">
                      <HeartIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Blood Group</p>
                        <p className="text-lg font-medium text-gray-900">
                          {user.profile.bloodGroup}
                        </p>
                      </div>
                    </div>
                  )}

                  {user.profile?.address && (
                    <div className="flex items-start space-x-3 md:col-span-2">
                      <UserIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="text-lg font-medium text-gray-900">
                          {user.profile.address}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {user.profile?.emergencyContact && (
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="bg-teal-600 px-6 py-4">
                  <h2 className="text-xl font-semibold text-white">
                    Emergency Contact
                  </h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {user.profile.emergencyContact.name && (
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="text-lg font-medium text-gray-900">
                          {user.profile.emergencyContact.name}
                        </p>
                      </div>
                    )}
                    {user.profile.emergencyContact.relationship && (
                      <div>
                        <p className="text-sm text-gray-500">Relationship</p>
                        <p className="text-lg font-medium text-gray-900">
                          {user.profile.emergencyContact.relationship}
                        </p>
                      </div>
                    )}
                    {user.profile.emergencyContact.phone && (
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="text-lg font-medium text-gray-900">
                          {user.profile.emergencyContact.phone}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Doctor Profile View
  if (user.role === "doctor") {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProfileHeader />
        <LogoutModal />

        {isEditing ? (
          <form
            onSubmit={doctorForm.handleSubmit(onSubmitDoctor)}
            className="space-y-6"
          >
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    {...doctorForm.register("name")}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  {doctorForm.formState.errors.name && (
                    <p className="mt-1 text-sm text-red-600">
                      {doctorForm.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    {...doctorForm.register("phone")}
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  {doctorForm.formState.errors.phone && (
                    <p className="mt-1 text-sm text-red-600">
                      {doctorForm.formState.errors.phone.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={user.username}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age
                  </label>
                  <input
                    {...doctorForm.register("profile.age")}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Enter your age"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    {...doctorForm.register("profile.gender")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    {...doctorForm.register("profile.address")}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Enter your address"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Professional Information
              </h2>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specialization *
                  </label>
                  <input
                    {...doctorForm.register("profile.specialization")}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="e.g., Cardiologist, Neurologist"
                  />
                  {doctorForm.formState.errors.profile?.specialization && (
                    <p className="mt-1 text-sm text-red-600">
                      {
                        doctorForm.formState.errors.profile.specialization
                          .message
                      }
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Qualifications *
                  </label>
                  <input
                    {...doctorForm.register("profile.qualifications")}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="e.g., MBBS, MD, MS"
                  />
                  {doctorForm.formState.errors.profile?.qualifications && (
                    <p className="mt-1 text-sm text-red-600">
                      {
                        doctorForm.formState.errors.profile.qualifications
                          .message
                      }
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Experience *
                  </label>
                  <input
                    {...doctorForm.register("profile.experience")}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="e.g., 10 years"
                  />
                  {doctorForm.formState.errors.profile?.experience && (
                    <p className="mt-1 text-sm text-red-600">
                      {doctorForm.formState.errors.profile.experience.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    {...doctorForm.register("profile.bio")}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Tell us about yourself, your expertise, and approach to patient care..."
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckIcon className="h-5 w-5 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="bg-teal-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white">
                  Personal Information
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start space-x-3">
                    <UserIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="text-lg font-medium text-gray-900">
                        Dr. {user.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-lg font-medium text-gray-900">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <PhoneIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="text-lg font-medium text-gray-900">
                        {user.phone}
                      </p>
                    </div>
                  </div>

                  {user.profile?.age && (
                    <div className="flex items-start space-x-3">
                      <CalendarIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Age</p>
                        <p className="text-lg font-medium text-gray-900">
                          {user.profile.age}
                        </p>
                      </div>
                    </div>
                  )}

                  {user.profile?.gender && (
                    <div className="flex items-start space-x-3">
                      <UserIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Gender</p>
                        <p className="text-lg font-medium text-gray-900 capitalize">
                          {user.profile.gender}
                        </p>
                      </div>
                    </div>
                  )}

                  {user.profile?.address && (
                    <div className="flex items-start space-x-3 md:col-span-2">
                      <UserIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="text-lg font-medium text-gray-900">
                          {user.profile.address}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="bg-teal-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white">
                  Professional Information
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-start space-x-3">
                      <BriefcaseIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Specialization</p>
                        <p className="text-lg font-medium text-gray-900">
                          {user.profile?.specialization || "Not specified"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <AcademicCapIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Qualifications</p>
                        <p className="text-lg font-medium text-gray-900">
                          {user.profile?.qualifications || "Not specified"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <CalendarIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Experience</p>
                        <p className="text-lg font-medium text-gray-900">
                          {user.profile?.experience || "Not specified"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {user.profile?.bio && (
                    <div className="border-t pt-4">
                      <div className="flex items-start space-x-3">
                        <DocumentTextIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Bio</p>
                          <p className="text-gray-700 mt-1">
                            {user.profile.bio}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // MLT Profile View
  if (user.role === "MLT") {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProfileHeader />
        <LogoutModal />

        {isEditing ? (
          <form
            onSubmit={mltForm.handleSubmit(onSubmitMLT)}
            className="space-y-6"
          >
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    {...mltForm.register("name")}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  {mltForm.formState.errors.name && (
                    <p className="mt-1 text-sm text-red-600">
                      {mltForm.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    {...mltForm.register("phone")}
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  {mltForm.formState.errors.phone && (
                    <p className="mt-1 text-sm text-red-600">
                      {mltForm.formState.errors.phone.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={user.username}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age
                  </label>
                  <input
                    {...mltForm.register("profile.age")}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter your age"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    {...mltForm.register("profile.gender")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    {...mltForm.register("profile.address")}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter your address"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Professional Information
              </h2>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specialization *
                  </label>
                  <select
                    {...mltForm.register("profile.specialization")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select specialization</option>
                    <option value="Hematology">Hematology</option>
                    <option value="Microbiology">Microbiology</option>
                    <option value="Biochemistry">Biochemistry</option>
                    <option value="Pathology">Pathology</option>
                    <option value="Radiology">Radiology</option>
                    <option value="Other">Other</option>
                  </select>
                  {mltForm.formState.errors.profile?.specialization && (
                    <p className="mt-1 text-sm text-red-600">
                      {mltForm.formState.errors.profile.specialization.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department *
                  </label>
                  <select
                    {...mltForm.register("profile.department")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select department</option>
                    <option value="Clinical Lab">Clinical Lab</option>
                    <option value="Pathology">Pathology</option>
                    <option value="Radiology">Radiology</option>
                    <option value="Blood Bank">Blood Bank</option>
                    <option value="Microbiology">Microbiology</option>
                  </select>
                  {mltForm.formState.errors.profile?.department && (
                    <p className="mt-1 text-sm text-red-600">
                      {mltForm.formState.errors.profile.department.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    License Number *
                  </label>
                  <input
                    {...mltForm.register("profile.licenseNumber")}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., MLT12345"
                  />
                  {mltForm.formState.errors.profile?.licenseNumber && (
                    <p className="mt-1 text-sm text-red-600">
                      {mltForm.formState.errors.profile.licenseNumber.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Qualifications *
                  </label>
                  <input
                    {...mltForm.register("profile.qualifications")}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., B.Sc MLT, M.Sc Medical Lab Technology"
                  />
                  {mltForm.formState.errors.profile?.qualifications && (
                    <p className="mt-1 text-sm text-red-600">
                      {mltForm.formState.errors.profile.qualifications.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Experience *
                  </label>
                  <input
                    {...mltForm.register("profile.experience")}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., 5 years"
                  />
                  {mltForm.formState.errors.profile?.experience && (
                    <p className="mt-1 text-sm text-red-600">
                      {mltForm.formState.errors.profile.experience.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    {...mltForm.register("profile.bio")}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Tell us about your expertise and experience in laboratory medicine..."
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckIcon className="h-5 w-5 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="bg-purple-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white">
                  Personal Information
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start space-x-3">
                    <UserIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="text-lg font-medium text-gray-900">
                        {user.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-lg font-medium text-gray-900">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <PhoneIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="text-lg font-medium text-gray-900">
                        {user.phone}
                      </p>
                    </div>
                  </div>

                  {user.profile?.age && (
                    <div className="flex items-start space-x-3">
                      <CalendarIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Age</p>
                        <p className="text-lg font-medium text-gray-900">
                          {user.profile.age}
                        </p>
                      </div>
                    </div>
                  )}

                  {user.profile?.gender && (
                    <div className="flex items-start space-x-3">
                      <UserIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Gender</p>
                        <p className="text-lg font-medium text-gray-900 capitalize">
                          {user.profile.gender}
                        </p>
                      </div>
                    </div>
                  )}

                  {user.profile?.address && (
                    <div className="flex items-start space-x-3 md:col-span-2">
                      <UserIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="text-lg font-medium text-gray-900">
                          {user.profile.address}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="bg-purple-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white">
                  Professional Information
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-start space-x-3">
                      <Microscope className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Specialization</p>
                        <p className="text-lg font-medium text-gray-900">
                          {user.profile?.specialization || "Not specified"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <BeakerIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Department</p>
                        <p className="text-lg font-medium text-gray-900">
                          {user.profile?.department || "Not specified"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <ClipboardIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">License Number</p>
                        <p className="text-lg font-medium text-gray-900">
                          {user.profile?.licenseNumber || "Not specified"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <AcademicCapIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Qualifications</p>
                        <p className="text-lg font-medium text-gray-900">
                          {user.profile?.qualifications || "Not specified"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <CalendarIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Experience</p>
                        <p className="text-lg font-medium text-gray-900">
                          {user.profile?.experience || "Not specified"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {user.profile?.bio && (
                    <div className="border-t pt-4">
                      <div className="flex items-start space-x-3">
                        <DocumentTextIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Bio</p>
                          <p className="text-gray-700 mt-1">
                            {user.profile.bio}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Admin Profile View
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Admin Profile</h1>
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
          Logout
        </button>
      </div>

      <LogoutModal />

      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="text-lg font-medium text-gray-900">{user.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-lg font-medium text-gray-900">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Username</p>
            <p className="text-lg font-medium text-gray-900">{user.username}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="text-lg font-medium text-gray-900">{user.phone}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
