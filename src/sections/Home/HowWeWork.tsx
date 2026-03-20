import {
  Search,
  Calendar,
  Video,
  ClipboardCheck,
  Truck,
  Pill,
} from "lucide-react";

const HowWeWork = () => {
  const steps = [
    {
      icon: Search,
      title: "Find a Doctor",
      description: "Search by specialty, location, or condition",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Calendar,
      title: "Book Appointment",
      description: "Choose a convenient time slot",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Video,
      title: "Video Consultation",
      description: "Connect with doctor via secure video call",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: ClipboardCheck,
      title: "Get Prescription",
      description: "Receive digital prescription",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: Pill,
      title: "Order Medicines",
      description: "Medicines delivered to your home",
      color: "from-indigo-500 to-purple-500",
    },
    {
      icon: Truck,
      title: "Follow-up Care",
      description: "Regular health updates and check-ins",
      color: "from-teal-500 to-green-500",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-neutral-100 to-teal-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How Swastha Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your journey to better health in four simple steps
          </p>
        </div>

        <div className="relative">
          {/* Connection Line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-teal-200 hidden lg:block" />

          <div className="grid lg:grid-cols-6 gap-4 relative">
            {steps.map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative z-10">
                  <div
                    className={`w-20 h-20 mx-auto bg-gradient-to-r ${step.color} rounded-2xl text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}
                  >
                    <step.icon className="h-10 w-10" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-bold lg:hidden">
                    {index + 1}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600">{step.description}</p>

                {/* Step number for desktop */}
                <div className="hidden lg:block mt-4 text-teal-600 font-bold text-lg">
                  Step {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <button className="px-8 py-4 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors shadow-lg hover:shadow-xl">
            Start Your Health Journey
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowWeWork;
