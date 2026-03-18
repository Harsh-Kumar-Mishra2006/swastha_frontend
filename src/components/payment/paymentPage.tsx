// components/payments/PaymentPage.tsx
import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { usePayment } from "../../hooks/usePayment";
import {
  CreditCard,
  Smartphone,
  Clock,
  CheckCircle,
  XCircle,
  QrCode,
  Copy,
  ChevronRight,
  AlertCircle,
  Download,
  RefreshCw,
  ArrowLeft,
  IndianRupee,
  Shield,
  Wallet,
} from "lucide-react";
import toast from "react-hot-toast";

const PaymentPage = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    loading,
    paymentOrder,
    createPaymentOrder,
    pollPaymentStatus,
    downloadReceipt,
    resetPaymentOrder,
  } = usePayment();

  const [paymentMethod, setPaymentMethod] = useState<
    "upi" | "card" | "netbanking"
  >("upi");
  const [paymentStatus, setPaymentStatus] = useState<
    "pending" | "processing" | "success" | "failed"
  >("pending");
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds
  const [copied, setCopied] = useState(false);
  const [paymentInitiated, setPaymentInitiated] = useState(false);

  const appointmentData = location.state?.appointmentDetails;
  const doctorData = location.state?.doctor;

  useEffect(() => {
    if (!appointmentId) {
      toast.error("Invalid appointment");
      navigate("/appointments");
      return;
    }

    initializePayment();

    return () => {
      resetPaymentOrder();
    };
  }, [appointmentId]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (paymentStatus === "pending" && timeLeft > 0 && paymentInitiated) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (
      timeLeft === 0 &&
      paymentStatus === "pending" &&
      paymentInitiated
    ) {
      setPaymentStatus("failed");
      toast.error("Payment timeout. Please try again.");
    }
    return () => clearTimeout(timer);
  }, [timeLeft, paymentStatus, paymentInitiated]);

  useEffect(() => {
    if (paymentOrder?.orderId && paymentStatus === "processing") {
      const cleanup = pollPaymentStatus(paymentOrder.orderId, () => {
        setPaymentStatus("success");
        toast.success("Payment successful! Your appointment is confirmed.", {
          duration: 5000,
          icon: "🎉",
        });
      });
      return cleanup;
    }
  }, [paymentOrder, paymentStatus]);

  const initializePayment = async () => {
    try {
      const order = await createPaymentOrder(appointmentId!);
      if (order) {
        setPaymentStatus("pending");
      }
    } catch (error: any) {
      console.error("Error creating payment:", error);
      if (error.response?.data?.error?.includes("expired")) {
        toast.error("Appointment expired. Please book again.");
        setTimeout(() => navigate("/doctors"), 3000);
      } else {
        toast.error("Failed to initialize payment");
      }
    }
  };

  const handlePayment = () => {
    setPaymentStatus("processing");
    setPaymentInitiated(true);

    // Redirect to Cashfree payment page
    if (paymentOrder?.cashfree?.paymentLink) {
      window.open(paymentOrder.cashfree.paymentLink, "_self");
    } else {
      // Mock payment for development
      toast.success("Processing payment... (Test Mode)");

      // Simulate successful payment after 3 seconds
      setTimeout(() => {
        setPaymentStatus("success");
        toast.success("Payment successful! (Test Mode)");
      }, 3000);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("UPI ID copied to clipboard");
  };

  const handleRetry = () => {
    setPaymentStatus("pending");
    setTimeLeft(1800);
    setPaymentInitiated(false);
    initializePayment();
  };

  const handleGoBack = () => {
    if (paymentStatus === "success") {
      navigate("/my-appointments");
    } else {
      navigate(-1);
    }
  };

  // Success State
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
              Payment Successful! 🎉
            </h2>
            <p className="text-gray-600 mb-8">
              Your appointment has been confirmed. A confirmation has been sent
              to your email.
            </p>

            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold text-gray-700 mb-4">
                Payment Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <span className="text-gray-600">Appointment ID:</span>
                  <span className="font-mono font-medium">
                    {appointmentId?.slice(-8)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Amount Paid:</span>
                  <span className="font-bold text-xl text-teal-600">
                    ₹{paymentOrder?.amount || appointmentData?.totalAmount}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-mono text-sm">
                    {paymentOrder?.orderId ||
                      "TXN" + Date.now().toString().slice(-8)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="capitalize bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm">
                    {paymentMethod} (Test)
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => downloadReceipt(appointmentId!)}
                className="px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 flex items-center justify-center space-x-2 transition-colors"
              >
                <Download className="h-5 w-5" />
                <span>Download Receipt</span>
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

  // Failed State
  if (paymentStatus === "failed") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 pt-24 pb-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="mb-6">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <XCircle className="h-12 w-12 text-red-600" />
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Payment Failed
            </h2>
            <p className="text-gray-600 mb-4">
              Your payment could not be processed. Please try again.
            </p>
            <p className="text-sm text-gray-500 mb-8">
              Your appointment is still pending and will expire in 30 minutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleRetry}
                className="px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 flex items-center justify-center space-x-2 transition-colors"
              >
                <RefreshCw className="h-5 w-5" />
                <span>Try Again</span>
              </button>
              <button
                onClick={() => navigate("/doctors")}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Browse Doctors
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading State
  if (loading && !paymentOrder) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 pt-24 pb-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-600 border-t-transparent mb-4"></div>
              <p className="text-gray-600">Initializing payment...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Payment Pending/Processing State
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 pt-24 pb-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={handleGoBack}
          className="flex items-center text-gray-600 hover:text-teal-600 mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Wallet className="h-5 w-5 mr-2" />
                Complete Payment
              </h2>
              <Shield className="h-5 w-5 text-white opacity-75" />
            </div>
          </div>

          {/* Timer Warning */}
          {paymentInitiated && (
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
          )}

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
                </div>
              </div>
            )}

            {/* Order Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
                <IndianRupee className="h-4 w-4 mr-1 text-teal-600" />
                Order Summary
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Consultation Fee</span>
                  <span className="font-medium">
                    ₹
                    {paymentOrder?.consultationFee ||
                      appointmentData?.consultationFee ||
                      500}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Convenience Fee (2%)</span>
                  <span className="font-medium">
                    ₹
                    {paymentOrder?.convenienceFee ||
                      appointmentData?.convenienceFee ||
                      10}
                  </span>
                </div>
                <div className="border-t border-gray-200 my-2 pt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total Amount</span>
                    <span className="text-teal-600 text-lg">
                      ₹
                      {paymentOrder?.amount ||
                        appointmentData?.totalAmount ||
                        510}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-3">
                Select Payment Method
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setPaymentMethod("upi")}
                  className={`p-4 border-2 rounded-lg flex flex-col items-center space-y-2 transition-all ${
                    paymentMethod === "upi"
                      ? "border-teal-600 bg-teal-50 ring-2 ring-teal-200"
                      : "border-gray-200 hover:border-teal-300 hover:bg-gray-50"
                  }`}
                >
                  <Smartphone
                    className={`h-6 w-6 ${
                      paymentMethod === "upi"
                        ? "text-teal-600"
                        : "text-gray-500"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      paymentMethod === "upi"
                        ? "text-teal-600"
                        : "text-gray-700"
                    }`}
                  >
                    UPI
                  </span>
                </button>

                <button
                  onClick={() => setPaymentMethod("card")}
                  disabled
                  className="p-4 border-2 border-gray-200 rounded-lg flex flex-col items-center space-y-2 opacity-50 cursor-not-allowed bg-gray-50"
                >
                  <CreditCard className="h-6 w-6 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Card
                  </span>
                  <span className="text-xs text-gray-400">Coming Soon</span>
                </button>

                <button
                  onClick={() => setPaymentMethod("netbanking")}
                  disabled
                  className="p-4 border-2 border-gray-200 rounded-lg flex flex-col items-center space-y-2 opacity-50 cursor-not-allowed bg-gray-50"
                >
                  <span className="text-sm font-medium text-gray-700">
                    NetBanking
                  </span>
                  <span className="text-xs text-gray-400">Coming Soon</span>
                </button>
              </div>
            </div>

            {/* UPI Payment Section */}
            {paymentMethod === "upi" && (
              <div className="space-y-6">
                {/* Test Mode Notice */}
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-blue-700 font-medium">
                        Test Mode Active
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        This is a test payment. No real money will be deducted.
                      </p>
                    </div>
                  </div>
                </div>

                {/* QR Code */}
                <div className="flex flex-col items-center">
                  <div className="bg-white p-4 rounded-xl border-2 border-gray-200 mb-3 shadow-lg">
                    <QrCode className="h-48 w-48 text-gray-800" />
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
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-2">
                    Or pay using UPI ID:
                  </p>
                  <div className="flex items-center justify-between bg-white border rounded-lg p-3">
                    <span className="font-mono text-sm">test@cashfree</span>
                    <button
                      onClick={() => copyToClipboard("test@cashfree")}
                      className="flex items-center space-x-1 text-teal-600 hover:text-teal-700"
                    >
                      <Copy className="h-4 w-4" />
                      <span className="text-xs">
                        {copied ? "Copied!" : "Copy"}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Pay Button */}
                <button
                  onClick={handlePayment}
                  disabled={paymentStatus === "processing"}
                  className="w-full py-4 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-teal-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all transform hover:scale-105"
                >
                  {paymentStatus === "processing" ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>
                        Pay ₹
                        {paymentOrder?.amount ||
                          appointmentData?.totalAmount ||
                          510}
                      </span>
                      <ChevronRight className="h-5 w-5" />
                    </>
                  )}
                </button>

                {/* Security Note */}
                <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                  <Shield className="h-3 w-3" />
                  <span>Your payment is secure and encrypted</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
