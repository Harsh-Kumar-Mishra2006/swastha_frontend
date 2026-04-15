// components/payments/QRPaymentPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { usePayment } from "../../hooks/usePayment";
import {
  QrCode,
  Copy,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  ArrowLeft,
  IndianRupee,
  Shield,
  Upload,
  FileText,
  Loader,
  Info,
  Home,
} from "lucide-react";
import toast from "react-hot-toast";

const QRPaymentPage = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { getQRPaymentDetails, uploadPaymentScreenshot, getPaymentStatus } =
    usePayment();

  const [qrDetails, setQrDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string>("pending");
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds
  const [redirectTimer, setRedirectTimer] = useState<NodeJS.Timeout | null>(null);

  // Form states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [transactionId, setTransactionId] = useState("");
  const [transactionReference, setTransactionReference] = useState("");
  const [paymentTime, setPaymentTime] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const appointmentData = location.state?.appointmentDetails;
  const doctorData = location.state?.doctor;

  useEffect(() => {
    if (!appointmentId) {
      toast.error("Invalid appointment");
      navigate("/");
      return;
    }

    fetchQRDetails();
    checkExistingPayment();

    // Timer for appointment expiry
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          toast.error("Appointment expired. Please book again.");
          navigate("/doctors");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      if (redirectTimer) {
        clearTimeout(redirectTimer);
      }
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [appointmentId]);

  const fetchQRDetails = async () => {
    try {
      const response = await getQRPaymentDetails(appointmentId!);
      if (response) {
        setQrDetails(response);
      }
    } catch (error) {
      console.error("Error fetching QR details:", error);
      toast.error("Failed to load payment details");
    } finally {
      setLoading(false);
    }
  };

  const checkExistingPayment = async () => {
    try {
      const response = await getPaymentStatus(appointmentId!);
      if (response && response.paymentStatus === "paid") {
        setPaymentStatus("success");
        toast.success("Payment already verified! Redirecting to home...");
        
        // Redirect to home after 3 seconds
        const timer = setTimeout(() => {
          navigate("/");
        }, 3000);
        setRedirectTimer(timer);
        
      } else if (response && response.paymentStatus === "pending") {
        setPaymentStatus("submitted");
        toast("Payment already submitted, pending verification", {
          icon: "⏳",
        });
      }
    } catch (error) {
      // No payment found, continue with new payment
      console.log("No existing payment");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("UPI ID copied to clipboard");
  };

  const handleSubmitPayment = async () => {
    if (!selectedFile) {
      toast.error("Please upload payment screenshot");
      return;
    }
    if (!transactionId.trim()) {
      toast.error("Please enter transaction ID/UTR number");
      return;
    }

    setUploading(true);
    try {
      const response = await uploadPaymentScreenshot(
        appointmentId!,
        selectedFile,
        transactionId,
        transactionReference,
        paymentTime || new Date().toISOString(),
      );

      if (response && response.success) {
        setPaymentStatus("submitted");
        toast.success(response.message);
        
        // Clean up preview URL
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }
        
        // Auto redirect to home after 5 seconds on successful submission
        const timer = setTimeout(() => {
          navigate("/");
        }, 5000);
        setRedirectTimer(timer);
      }
    } catch (error: any) {
      console.error("Error uploading payment:", error);
      toast.error(
        error.response?.data?.error || "Failed to upload payment proof",
      );
    } finally {
      setUploading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Success State - Payment Verified
  if (paymentStatus === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 pt-24 pb-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="mb-6">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Appointment Confirmed! 🎉
            </h2>
            <p className="text-gray-600 mb-4">
              Your payment has been verified and appointment is confirmed.
            </p>
            <p className="text-sm text-gray-500 mb-8">
              Redirecting to home page in a few seconds...
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/")}
                className="px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
              >
                <Home className="h-5 w-5" />
                Go to Home
              </button>
              <button
                onClick={() => navigate("/my-appointments")}
                className="px-6 py-3 border-2 border-teal-600 text-teal-600 rounded-lg font-semibold hover:bg-teal-50 transition-colors"
              >
                View My Appointments
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Submitted State - Waiting for Verification
  if (paymentStatus === "submitted") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 pt-24 pb-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="mb-6">
              <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                <Clock className="h-12 w-12 text-yellow-600" />
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Payment Submitted! ⏳
            </h2>
            <p className="text-gray-600 mb-4">
              Your payment screenshot has been received.
            </p>
            <p className="text-gray-600 mb-4">
              Our team will verify your payment within 24 hours.
            </p>
            <p className="text-sm text-gray-500 mb-8">
              Redirecting to home page in a few seconds...
            </p>

            <div className="bg-blue-50 rounded-lg p-4 mb-8 text-left">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-800 font-medium">
                    What happens next?
                  </p>
                  <ul className="text-xs text-blue-700 mt-2 space-y-1">
                    <li>• Admin will review your payment screenshot</li>
                    <li>• Once verified, appointment will be confirmed</li>
                    <li>• You'll receive email notification</li>
                    <li>• Check status in "My Appointments" page</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/")}
                className="px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
              >
                <Home className="h-5 w-5" />
                Go to Home
              </button>
              <button
                onClick={() => navigate("/my-appointments")}
                className="px-6 py-3 border-2 border-teal-600 text-teal-600 rounded-lg font-semibold hover:bg-teal-50 transition-colors"
              >
                View My Appointments
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 pt-24 pb-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex flex-col items-center justify-center py-12">
              <Loader className="h-16 w-16 text-teal-600 animate-spin mb-4" />
              <p className="text-gray-600">Loading payment details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-teal-600 mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </button>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column - QR Code & Payment Info */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <QrCode className="h-5 w-5 mr-2" />
                Scan & Pay
              </h2>
            </div>

            {/* Timer */}
            <div className="bg-amber-50 px-6 py-3 border-b border-amber-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-amber-700">
                  <Clock className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">
                    Complete payment within
                  </span>
                </div>
                <span
                  className={`font-mono font-bold text-lg ${
                    timeLeft < 300
                      ? "text-red-600 animate-pulse"
                      : "text-amber-700"
                  }`}
                >
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>

            <div className="p-6">
              {/* QR Code Image */}
              <div className="flex flex-col items-center mb-6">
                <div className="bg-white p-4 rounded-xl border-2 border-gray-200 mb-3 shadow-lg">
                  <img
                    src={qrDetails?.qrCodeUrl || "/images/payment-qr.png"}
                    alt="Payment QR Code"
                    className="w-64 h-64 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Cline x1='3' y1='9' x2='21' y2='9'%3E%3C/line%3E%3Cline x1='3' y1='15' x2='21' y2='15'%3E%3C/line%3E%3Cline x1='9' y1='21' x2='9' y2='9'%3E%3C/line%3E%3C/svg%3E";
                    }}
                  />
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  Scan this QR code with any UPI app
                </p>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span>PhonePe</span>
                  <span>•</span>
                  <span>Google Pay</span>
                  <span>•</span>
                  <span>PayTM</span>
                </div>
              </div>

              {/* UPI ID */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-xs text-gray-500 mb-2">
                  Or pay using UPI ID:
                </p>
                <div className="flex items-center justify-between bg-white border rounded-lg p-3">
                  <span className="font-mono text-sm">
                    {qrDetails?.upiId || "yourbusiness@upi"}
                  </span>
                  <button
                    onClick={() =>
                      copyToClipboard(qrDetails?.upiId || "yourbusiness@upi")
                    }
                    className="flex items-center space-x-1 text-teal-600 hover:text-teal-700"
                  >
                    <Copy className="h-4 w-4" />
                    <span className="text-xs">
                      {copied ? "Copied!" : "Copy"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Security Note */}
              <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                <Shield className="h-3 w-3" />
                <span>Your payment is secure and encrypted</span>
              </div>
            </div>
          </div>

          {/* Right Column - Upload Screenshot */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Upload className="h-5 w-5 mr-2" />
                Upload Payment Proof
              </h2>
            </div>

            <div className="p-6">
              {/* Appointment Summary */}
              {doctorData && (
                <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-gray-700 mb-2">
                    Appointment Summary
                  </h3>
                  <div className="text-sm">
                    <p className="text-gray-600">Dr. {doctorData.name}</p>
                    <p className="text-gray-500">{doctorData.specialization}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      {appointmentData?.appointmentDate &&
                        new Date(
                          appointmentData.appointmentDate,
                        ).toLocaleDateString()}{" "}
                      • {appointmentData?.appointmentTime}
                    </p>
                  </div>
                </div>
              )}

              {/* Amount Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
                  <IndianRupee className="h-4 w-4 mr-1 text-teal-600" />
                  Amount to Pay
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Consultation Fee</span>
                    <span className="font-medium">
                      ₹
                      {qrDetails?.consultationFee ||
                        appointmentData?.consultationFee ||
                        500}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Convenience Fee (2%)</span>
                    <span className="font-medium">
                      ₹
                      {qrDetails?.convenienceFee ||
                        appointmentData?.convenienceFee ||
                        10}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 my-2 pt-2">
                    <div className="flex justify-between font-bold">
                      <span>Total Amount</span>
                      <span className="text-teal-600 text-lg">
                        ₹
                        {qrDetails?.amount ||
                          appointmentData?.totalAmount ||
                          510}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upload Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transaction ID / UTR Number *
                  </label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                    placeholder="Enter transaction ID from your UPI app"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transaction Reference (Optional)
                  </label>
                  <input
                    type="text"
                    value={transactionReference}
                    onChange={(e) => setTransactionReference(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                    placeholder="Any additional reference"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Time
                  </label>
                  <input
                    type="datetime-local"
                    value={paymentTime}
                    onChange={(e) => setPaymentTime(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Screenshot *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-teal-400 transition-colors">
                    <input
                      type="file"
                      id="screenshotUpload"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="screenshotUpload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      {previewUrl ? (
                        <div className="relative">
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="max-h-48 rounded-lg mb-2"
                          />
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              setSelectedFile(null);
                              setPreviewUrl(null);
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload className="h-8 w-8 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-600 font-medium">
                            Click to upload screenshot
                          </span>
                          <span className="text-xs text-gray-500 mt-1">
                            JPEG, PNG (Max 5MB)
                          </span>
                        </>
                      )}
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Upload clear screenshot showing transaction ID and amount
                  </p>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-yellow-700 font-medium">
                        Important Note
                      </p>
                      <p className="text-xs text-yellow-600 mt-1">
                        Your appointment will be confirmed only after our team
                        verifies your payment. This usually takes up to 24
                        hours.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSubmitPayment}
                  disabled={uploading || !selectedFile || !transactionId}
                  className="w-full py-4 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-teal-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all transform hover:scale-105"
                >
                  {uploading ? (
                    <>
                      <Loader className="h-5 w-5 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <FileText className="h-5 w-5" />
                      <span>Submit Payment Proof</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <Info className="h-5 w-5 mr-2 text-teal-600" />
            Payment Instructions
          </h3>
          <ol className="space-y-3">
            {qrDetails?.instructions?.map(
              (instruction: string, idx: number) => (
                <li
                  key={idx}
                  className="flex items-start text-sm text-gray-700"
                >
                  <span className="bg-teal-100 text-teal-700 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  {instruction}
                </li>
              ),
            )}
            {!qrDetails?.instructions && (
              <>
                <li className="flex items-start text-sm text-gray-700">
                  <span className="bg-teal-100 text-teal-700 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0 mt-0.5">
                    1
                  </span>
                  Scan the QR code using any UPI app (Google Pay, PhonePe,
                  Paytm, etc.)
                </li>
                <li className="flex items-start text-sm text-gray-700">
                  <span className="bg-teal-100 text-teal-700 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0 mt-0.5">
                    2
                  </span>
                  Verify the payee name and amount
                </li>
                <li className="flex items-start text-sm text-gray-700">
                  <span className="bg-teal-100 text-teal-700 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0 mt-0.5">
                    3
                  </span>
                  Complete the payment
                </li>
                <li className="flex items-start text-sm text-gray-700">
                  <span className="bg-teal-100 text-teal-700 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0 mt-0.5">
                    4
                  </span>
                  Take a screenshot of the payment success screen
                </li>
                <li className="flex items-start text-sm text-gray-700">
                  <span className="bg-teal-100 text-teal-700 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0 mt-0.5">
                    5
                  </span>
                  Upload the screenshot above with transaction ID
                </li>
              </>
            )}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default QRPaymentPage;