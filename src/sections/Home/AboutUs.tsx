// sections/home/AboutUs.tsx
import React from "react";
import { Heart, Activity, Shield, Users } from "lucide-react";

const AboutUs = () => {
  const stats = [
    { icon: Users, value: "50K+", label: "Happy Patients" },
    { icon: Activity, value: "100+", label: "Expert Doctors" },
    { icon: Shield, value: "15+", label: "Years Experience" },
    { icon: Heart, value: "24/7", label: "Emergency Support" },
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-neutral-100 to-teal-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            About Swastha
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your trusted partner in health, bringing quality healthcare to your
            fingertips
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-teal-600">
              Revolutionizing Healthcare Access
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Swastha is an innovative e-health platform dedicated to making
              quality healthcare accessible to everyone. We connect patients
              with top medical professionals, provide reliable health
              information, and offer seamless digital health services.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our mission is to empower individuals to take control of their
              health journey through technology, compassion, and expertise. With
              Swastha, healthcare is just a click away.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-6">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-xl shadow-sm border border-teal-100"
                >
                  <stat.icon className="h-8 w-8 text-teal-600 mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
              alt="Medical team"
              className="rounded-2xl shadow-2xl"
            />
            <div className="absolute -bottom-6 -left-6 bg-teal-600 text-white p-6 rounded-2xl shadow-lg">
              <Heart className="h-8 w-8 mb-2" />
              <p className="text-lg font-semibold">Your Health,</p>
              <p className="text-lg font-semibold">Our Priority</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
