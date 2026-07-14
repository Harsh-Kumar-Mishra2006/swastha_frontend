import { useEffect, useRef, useState } from "react";
import {
  Heart,
  Activity,
  Shield,
  Users,
  Clock,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  Star,
  Quote,
} from "lucide-react";

const AboutUs = () => {
  const [isVisible, setIsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 },
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const stats = [
    {
      icon: Users,
      value: "50K+",
      label: "Happy Patients",
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: Activity,
      value: "100+",
      label: "Expert Doctors",
      color: "bg-green-50 text-green-600",
    },
    {
      icon: Shield,
      value: "15+",
      label: "Years Experience",
      color: "bg-purple-50 text-purple-600",
    },
    {
      icon: Heart,
      value: "24/7",
      label: "Emergency Support",
      color: "bg-red-50 text-red-600",
    },
  ];

  const teamMembers = [
    {
      name: "Dr. Sarah Johnson",
      role: "Chief Medical Officer",
      image:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      specialty: "Cardiology",
    },
    {
      name: "Dr. Michael Chen",
      role: "Head of Surgery",
      image:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      specialty: "Neurosurgery",
    },
    {
      name: "Dr. Emily Rodriguez",
      role: "Pediatrics Director",
      image:
        "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      specialty: "Pediatrics",
    },
  ];

  const values = [
    {
      icon: Heart,
      title: "Compassionate Care",
      description: "We treat every patient with empathy, respect, and dignity",
    },
    {
      icon: Shield,
      title: "Excellence",
      description:
        "Committed to the highest standards of medical care and safety",
    },
    {
      icon: Users,
      title: "Patient-Centered",
      description:
        "Your health and well-being are at the core of everything we do",
    },
  ];

  const testimonials = [
    {
      quote:
        "Swastha has completely transformed how I manage my health. The doctors are amazing!",
      author: "Priya Sharma",
      role: "Patient since 2020",
      rating: 5,
    },
    {
      quote:
        "The emergency support is truly 24/7. They saved my father's life.",
      author: "Rajesh Kumar",
      role: "Family member",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-teal-600 to-teal-800 text-white py-20">
        <div className="absolute inset-0 opacity-10 "></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              About Swastha
            </h1>
            <p className="text-xl md:text-2xl text-teal-100 max-w-3xl mx-auto">
              Your trusted partner in health, bringing quality healthcare to
              your fingertips
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-gradient-to-r from-neutral-100 to-teal-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Revolutionizing Healthcare Access
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                Swastha is an innovative e-health platform dedicated to making
                quality healthcare accessible to everyone. We connect patients
                with top medical professionals, provide reliable health
                information, and offer seamless digital health services.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg">
                Our mission is to empower individuals to take control of their
                health journey through technology, compassion, and expertise.
                With Swastha, healthcare is just a click away.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-6" ref={statsRef}>
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className={`bg-white p-4 rounded-xl shadow-sm border border-teal-100 transform transition-all duration-500 hover:scale-105 hover:shadow-lg ${
                      isVisible
                        ? "translate-y-0 opacity-100"
                        : "translate-y-10 opacity-0"
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div
                      className={`p-2 rounded-lg ${stat.color} inline-block mb-2`}
                    >
                      <stat.icon className="h-6 w-6" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                  alt="Medical team"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-teal-900/20 to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-teal-600 text-white p-6 rounded-2xl shadow-lg transform rotate-3 hover:rotate-0 transition-transform">
                <Heart className="h-8 w-8 mb-2 animate-pulse" />
                <p className="text-lg font-semibold">Your Health,</p>
                <p className="text-lg font-semibold">Our Priority</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-gray-50 p-8 rounded-2xl text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-8 w-8 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Dedicated professionals committed to your health
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {member.name}
                  </h3>
                  <p className="text-teal-600 font-medium">{member.role}</p>
                  <p className="text-gray-500 text-sm mt-1">
                    {member.specialty}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-r from-teal-600 to-teal-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">What Our Patients Say</h2>
            <p className="text-xl text-teal-100">
              Real stories from real people
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20"
              >
                <Quote className="h-8 w-8 text-teal-300 mb-4" />
                <p className="text-lg mb-4">{testimonial.quote}</p>
                <div className="flex items-center gap-2 mb-2">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="font-semibold">{testimonial.author}</p>
                <p className="text-sm text-teal-200">{testimonial.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Get In Touch
            </h2>
            <p className="text-xl text-gray-600">We're here to help you</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Phone</h3>
              <p className="text-gray-600">+1 (555) 123-4567</p>
            </div>
            <div className="text-center">
              <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Email</h3>
              <p className="text-gray-600">contact@swastha.com</p>
            </div>
            <div className="text-center">
              <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Address</h3>
              <p className="text-gray-600">123 Health Street, Medical City</p>
            </div>
            <div className="text-center">
              <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Hours</h3>
              <p className="text-gray-600">24/7 Emergency Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-teal-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to start your health journey?
          </h2>
          <p className="text-teal-100 mb-8 text-lg">
            Join thousands of satisfied patients who trust Swastha
          </p>
          <button className="bg-white text-teal-600 px-8 py-3 rounded-full font-semibold hover:bg-teal-50 transition-colors inline-flex items-center gap-2">
            Get Started Today
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
