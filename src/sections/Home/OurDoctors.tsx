// sections/home/OurDoctors.tsx
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star, Mail, Phone } from "lucide-react";

const OurDoctors = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const doctors = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      experience: "15+ years",
      rating: 4.9,
      patients: "10k+",
      image:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      education: "MBBS, MD - Cardiology, AIIMS",
      availability: "Mon-Fri, 9AM-5PM",
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialty: "Neurologist",
      experience: "12+ years",
      rating: 4.8,
      patients: "8k+",
      image:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      education: "MBBS, MD - Neurology, Harvard Medical",
      availability: "Mon-Thu, 10AM-6PM",
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      specialty: "Pediatrician",
      experience: "10+ years",
      rating: 4.9,
      patients: "12k+",
      image:
        "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      education: "MBBS, MD - Pediatrics, Stanford",
      availability: "Mon-Sat, 8AM-4PM",
    },
    {
      id: 4,
      name: "Dr. James Wilson",
      specialty: "Orthopedic Surgeon",
      experience: "20+ years",
      rating: 5.0,
      patients: "15k+",
      image:
        "https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      education: "MBBS, MS - Orthopedics, Johns Hopkins",
      availability: "Tue-Sat, 9AM-5PM",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % doctors.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [doctors.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % doctors.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + doctors.length) % doctors.length);
  };

  return (
    <section className="py-20 bg-gradient-to-r from-neutral-100 to-teal-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our Expert Doctors
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Meet our team of experienced healthcare professionals
          </p>
        </div>

        <div className="relative">
          {/* Main Slide */}
          <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 scale-105 hover:scale-110"
              style={{ backgroundImage: `url(${doctors[currentIndex].image})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            </div>

            {/* Doctor Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <div className="max-w-3xl">
                <h3 className="text-3xl font-bold mb-2">
                  {doctors[currentIndex].name}
                </h3>
                <p className="text-xl text-teal-300 mb-4">
                  {doctors[currentIndex].specialty}
                </p>

                <div className="flex flex-wrap gap-6 mb-4">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 mr-2 fill-current" />
                    <span>{doctors[currentIndex].rating} Rating</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold mr-2">
                      {doctors[currentIndex].experience}
                    </span>
                    Experience
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold mr-2">
                      {doctors[currentIndex].patients}
                    </span>
                    Patients
                  </div>
                </div>

                <p className="text-gray-200 mb-4">
                  {doctors[currentIndex].education}
                </p>
                <p className="text-gray-300 mb-6">
                  Available: {doctors[currentIndex].availability}
                </p>

                <div className="flex space-x-4">
                  <button className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                    Book Appointment
                  </button>
                  <button className="p-3 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors">
                    <Mail className="h-5 w-5" />
                  </button>
                  <button className="p-3 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors">
                    <Phone className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
          >
            <ChevronLeft className="h-6 w-6 text-gray-800" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
          >
            <ChevronRight className="h-6 w-6 text-gray-800" />
          </button>

          {/* Slide Indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {doctors.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "w-8 bg-teal-600"
                    : "w-2 bg-gray-300 hover:bg-teal-400"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Doctor Cards Grid (Alternative view) */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <img
                src={doctor.image}
                alt={doctor.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h4 className="font-semibold text-gray-900 mb-1">
                  {doctor.name}
                </h4>
                <p className="text-teal-600 text-sm mb-2">{doctor.specialty}</p>
                <div className="flex items-center text-sm text-gray-600">
                  <Star className="h-4 w-4 text-yellow-400 mr-1 fill-current" />
                  <span>
                    {doctor.rating} · {doctor.experience}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurDoctors;
