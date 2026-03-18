// sections/home/Testimonials.tsx
import React, { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Priya Sharma",
      location: "Mumbai",
      rating: 5,
      comment:
        "Swastha has transformed how I manage my family's health. The video consultations are seamless, and the doctors are truly expert. My mother's regular check-ups have become so much easier!",
      image:
        "https://images.unsplash.com/photo-1494790108777-2fd0db1c9b3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      treatment: "Regular Health Check-ups",
    },
    {
      id: 2,
      name: "Rahul Mehta",
      location: "Delhi",
      rating: 5,
      comment:
        "The medicine delivery service is a lifesaver! During my father's treatment, we never had to worry about rushing to the pharmacy. Everything was delivered on time.",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      treatment: "Medicine Delivery",
    },
    {
      id: 3,
      name: "Anita Desai",
      location: "Bangalore",
      rating: 5,
      comment:
        "As a working professional, finding time for health check-ups was always difficult. Swastha's at-home lab test service is incredibly convenient. Highly recommended!",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      treatment: "Lab Tests",
    },
    {
      id: 4,
      name: "Dr. Suresh Kumar",
      location: "Chennai",
      rating: 5,
      comment:
        "Even as a doctor myself, I use Swastha for my family's healthcare needs. The platform is intuitive and the quality of care is exceptional.",
      image:
        "https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      treatment: "Family Healthcare",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  };

  return (
    <section className="py-20 bg-gradient-to-br from-teal-600 to-emerald-600 relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12">
          <Quote className="h-16 w-16 text-white/30 mx-auto mb-4" />
          <h2 className="text-4xl font-bold text-white mb-4">
            What Our Patients Say
          </h2>
          <p className="text-xl text-teal-100">Real stories from real people</p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Main Testimonial */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 relative">
            {/* Quote icon */}
            <Quote className="absolute top-8 right-8 h-16 w-16 text-teal-100" />

            {/* Rating */}
            <div className="flex mb-6">
              {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                <Star
                  key={i}
                  className="h-6 w-6 text-yellow-400 fill-current"
                />
              ))}
            </div>

            {/* Comment */}
            <p className="text-xl text-gray-700 mb-8 italic leading-relaxed">
              "{testimonials[currentIndex].comment}"
            </p>

            {/* Patient Info */}
            <div className="flex items-center">
              <img
                src={testimonials[currentIndex].image}
                alt={testimonials[currentIndex].name}
                className="w-16 h-16 rounded-full object-cover mr-4"
              />
              <div>
                <h4 className="font-semibold text-gray-900 text-lg">
                  {testimonials[currentIndex].name}
                </h4>
                <p className="text-gray-600">
                  {testimonials[currentIndex].location}
                </p>
                <p className="text-sm text-teal-600 mt-1">
                  {testimonials[currentIndex].treatment}
                </p>
              </div>
            </div>

            {/* Navigation */}
            <div className="absolute bottom-8 right-8 flex space-x-2">
              <button
                onClick={prevTestimonial}
                className="p-2 bg-teal-100 text-teal-600 rounded-full hover:bg-teal-200 transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextTestimonial}
                className="p-2 bg-teal-100 text-teal-600 rounded-full hover:bg-teal-200 transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "w-8 bg-white"
                    : "w-2 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-12 text-center text-white">
            <div>
              <div className="text-3xl font-bold">10K+</div>
              <div className="text-teal-100">Happy Patients</div>
            </div>
            <div>
              <div className="text-3xl font-bold">4.9</div>
              <div className="text-teal-100">Average Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold">50+</div>
              <div className="text-teal-100">Cities</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
