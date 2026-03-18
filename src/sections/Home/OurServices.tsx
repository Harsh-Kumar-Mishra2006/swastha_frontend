// sections/home/OurServices.tsx
import React from "react";
import {
  Pill,
  Microscope,
  PhoneCall,
  FileText,
  Calendar,
  Video,
} from "lucide-react";

const OurServices = () => {
  const services = [
    {
      icon: Video,
      title: "Video Consultation",
      description: "Connect with top doctors from the comfort of your home",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Calendar,
      title: "Appointment Booking",
      description: "Easy scheduling with your preferred healthcare providers",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Pill,
      title: "Medicine Delivery",
      description: "Get prescribed medicines delivered to your doorstep",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: FileText,
      title: "Digital Health Records",
      description: "Secure storage and access to your medical history",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: Microscope,
      title: "Lab Tests",
      description: "Book lab tests with home sample collection",
      color: "from-indigo-500 to-purple-500",
    },
    {
      icon: PhoneCall,
      title: "24/7 Helpline",
      description: "Round-the-clock medical assistance and support",
      color: "from-teal-500 to-green-500",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-neutral-100 to-teal-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-teal-600 font-semibold text-sm uppercase tracking-wider">
            Our Services
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">
            Comprehensive Healthcare Solutions
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need for better health, all in one place
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-r ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
              />

              <div
                className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${service.color} text-white mb-6`}
              >
                <service.icon className="h-8 w-8" />
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {service.title}
              </h3>
              <p className="text-gray-600 mb-4">{service.description}</p>

              <a
                href="#"
                className="inline-flex items-center text-teal-600 font-medium hover:text-teal-700 transition-colors"
              >
                Learn More
                <svg
                  className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurServices;
