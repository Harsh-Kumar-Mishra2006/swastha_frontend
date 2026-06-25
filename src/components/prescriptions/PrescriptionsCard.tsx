// src/components/prescription/PrescriptionCard.tsx

import React from "react";
import {
  Pill,
  Calendar,
  User,
  Stethoscope,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Prescription } from "../../types/prescription";

interface PrescriptionCardProps {
  prescription: Prescription;
  onClick?: () => void;
  compact?: boolean;
}

const PrescriptionCard: React.FC<PrescriptionCardProps> = ({
  prescription,
  onClick,
  compact = false,
}) => {
  const getStatusConfig = (status: string) => {
    const configs = {
      active: {
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
        label: "Active",
      },
      draft: {
        color: "bg-gray-100 text-gray-800",
        icon: Clock,
        label: "Draft",
      },
      dispensed: {
        color: "bg-blue-100 text-blue-800",
        icon: CheckCircle,
        label: "Dispensed",
      },
      expired: {
        color: "bg-red-100 text-red-800",
        icon: AlertCircle,
        label: "Expired",
      },
      cancelled: {
        color: "bg-gray-100 text-gray-800",
        icon: XCircle,
        label: "Cancelled",
      },
    };
    return configs[status as keyof typeof configs] || configs.active;
  };

  const statusConfig = getStatusConfig(prescription.prescription_status);
  const StatusIcon = statusConfig.icon;

  if (compact) {
    return (
      <div
        onClick={onClick}
        className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-pointer"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h4 className="font-semibold text-gray-900 truncate">
                {prescription.diagnosis}
              </h4>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}
              >
                <StatusIcon className="h-3 w-3 mr-1" />
                {statusConfig.label}
              </span>
            </div>
            <p className="text-sm text-gray-600 truncate">
              Dr. {prescription.doctor_name}
            </p>
            <div className="flex items-center mt-1 text-xs text-gray-400">
              <Calendar className="h-3 w-3 mr-1" />
              {new Date(prescription.prescription_date).toLocaleDateString()}
              <span className="mx-2">•</span>
              <Pill className="h-3 w-3 mr-1" />
              {prescription.medications.length} medication(s)
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-bold text-gray-900">
              {prescription.diagnosis}
            </h3>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color}`}
            >
              <StatusIcon className="h-4 w-4 mr-1" />
              {statusConfig.label}
            </span>
          </div>
          <p className="text-gray-600">{prescription.disease}</p>
        </div>
        <div className="text-right text-sm">
          <p className="text-gray-500">Prescribed on</p>
          <p className="font-medium">
            {new Date(prescription.prescription_date).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-xs text-gray-500">Doctor</p>
          <p className="font-medium text-sm flex items-center">
            <Stethoscope className="h-4 w-4 mr-1 text-teal-600" />
            {prescription.doctor_name}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Patient</p>
          <p className="font-medium text-sm flex items-center">
            <User className="h-4 w-4 mr-1 text-blue-600" />
            {prescription.patient_name}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Medications</p>
          <p className="font-medium text-sm flex items-center">
            <Pill className="h-4 w-4 mr-1 text-purple-600" />
            {prescription.medications.length} item(s)
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Refills</p>
          <p className="font-medium text-sm">
            {prescription.refills_remaining} / {prescription.refills_allowed}
          </p>
        </div>
      </div>

      {prescription.patient_instructions.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <p className="text-xs text-gray-500">Instructions</p>
          <ul className="mt-1 space-y-0.5">
            {prescription.patient_instructions
              .slice(0, 2)
              .map((instruction, index) => (
                <li
                  key={index}
                  className="text-sm text-gray-700 flex items-start"
                >
                  <FileText className="h-3 w-3 mr-1 text-purple-500 mt-0.5 flex-shrink-0" />
                  {instruction}
                </li>
              ))}
            {prescription.patient_instructions.length > 2 && (
              <li className="text-sm text-gray-500">
                + {prescription.patient_instructions.length - 2} more
                instruction(s)
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PrescriptionCard;
