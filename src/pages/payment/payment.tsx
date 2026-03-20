import { useParams } from "react-router-dom";
import PaymentPage from "../../components/payment/paymentPage";

const Payment = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();

  if (!appointmentId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 pt-24 pb-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <p className="text-red-600">Invalid appointment ID</p>
          </div>
        </div>
      </div>
    );
  }

  return <PaymentPage />;
};

export default Payment;
