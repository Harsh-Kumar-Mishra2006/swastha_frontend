import { useEffect, useState } from "react";
import { motion, useMotionValue, AnimatePresence } from "framer-motion";
import AnimatedBackground from "../AnimatedBackground";

// Feature card component
const FeatureCard = ({ icon, title, description, index, color }: any) => {
  return (
    <motion.div
      className={`relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 p-6 cursor-pointer group`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{
        y: -10,
        transition: { duration: 0.3 },
      }}
      viewport={{ once: true }}
    >
      {/* Glow effect on hover */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${color}40, transparent 70%)`,
        }}
      />

      {/* Icon with animation */}
      <motion.div
        className="text-4xl mb-4 relative z-10"
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.6 }}
      >
        {icon}
      </motion.div>

      <h3 className="text-xl font-bold text-white mb-2 relative z-10">
        {title}
      </h3>
      <p className="text-white/70 relative z-10">{description}</p>

      {/* Decorative line */}
      <motion.div
        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent"
        initial={{ width: 0 }}
        whileHover={{ width: "100%" }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

// Stat card component
const StatCard = ({ value, label, icon, delay }: any) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value);
    const duration = 2000;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start > end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <motion.div
        className="text-4xl mb-2"
        animate={{
          y: [0, -10, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
          delay: delay,
        }}
      >
        {icon}
      </motion.div>
      <div className="text-3xl font-bold text-white mb-1">{count}+</div>
      <div className="text-white/80">{label}</div>
    </motion.div>
  );
};

// Service card component
const ServiceCard = ({ image, title, description, index }: any) => {
  return (
    <motion.div
      className="relative h-80 rounded-2xl overflow-hidden group"
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
    >
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Content */}
      <motion.div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-sm text-white/80">{description}</p>
      </motion.div>

      {/* Title always visible */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white bg-gradient-to-t from-black/60 to-transparent group-hover:opacity-0 transition-opacity duration-300">
        <h3 className="text-xl font-bold">{title}</h3>
      </div>
    </motion.div>
  );
};

const PatientHeroPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Mouse position tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    setIsLoaded(true);

    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      mouseX.set(e.clientX - centerX);
      mouseY.set(e.clientY - centerY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      role: "Cardiologist",
      content:
        "Swastha has revolutionized how I connect with patients. The platform is intuitive and secure.",
      avatar: "👩‍⚕️",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Patient",
      content:
        "Managing my health records has never been easier. I feel more in control of my healthcare journey.",
      avatar: "👨",
      rating: 5,
    },
    {
      name: "Dr. Emily Williams",
      role: "Pediatrician",
      content:
        "The telemedicine features are outstanding. My young patients love the interactive consultations.",
      avatar: "👩‍⚕️",
      rating: 5,
    },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-b to-cyan-400 from-lime-400 overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground mouseX={mouseX} mouseY={mouseY} />

      {/* Initial Load Animation */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            className="fixed inset-0 bg-white z-50 flex items-center justify-center"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="w-20 h-20 border-4 border-teal-500 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            {/* Floating Badge */}
            <motion.div
              className="inline-block mb-8"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="px-4 py-2 bg-white/10 backdrop-blur-lg rounded-full text-white border border-white/20">
                🏥 Trusted by 50,000+ patients & doctors
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <span className="inline-block">Welcome to</span>
              <br />
              <motion.span
                className="inline-block bg-gradient-to-r from-yellow-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{
                  backgroundSize: "200% 200%",
                }}
              >
                Swastha
              </motion.span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Bridging the gap between patients and healthcare providers through
              <span className="font-semibold text-yellow-300">
                {" "}
                innovative technology
              </span>
              and
              <span className="font-semibold text-cyan-300">
                {" "}
                compassionate care
              </span>
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <motion.button
                className="group relative px-8 py-4 bg-gradient-to-r from-teal-400 to-cyan-400 text-white font-semibold rounded-xl overflow-hidden shadow-2xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-teal-600 to-cyan-600"
                  initial={{ x: "100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative z-10 flex items-center gap-2">
                  Find a Doctor
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </motion.button>

              <motion.button
                className="px-8 py-4 bg-white/10 backdrop-blur-lg text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <StatCard
                value="500"
                label="Expert Doctors"
                icon="👨‍⚕️"
                delay={0}
              />
              <StatCard value="50" label="Clinics" icon="🏥" delay={0.1} />
              <StatCard
                value="50k"
                label="Happy Patients"
                icon="😊"
                delay={0.2}
              />
              <StatCard value="24/7" label="Support" icon="🆘" delay={0.3} />
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Why Choose <span className="text-yellow-300">Swastha</span>?
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                Experience healthcare reimagined with our cutting-edge features
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard
                icon="🚀"
                title="Instant Consultations"
                description="Connect with doctors within minutes through our video consultation platform"
                index={0}
                color="#14b8a6"
              />
              <FeatureCard
                icon="🔒"
                title="Secure Health Records"
                description="Your medical data is encrypted and stored with bank-level security"
                index={1}
                color="#06b6d4"
              />
              <FeatureCard
                icon="🤖"
                title="AI Health Assistant"
                description="24/7 intelligent support for your health queries and appointment scheduling"
                index={2}
                color="#8b5cf6"
              />
              <FeatureCard
                icon="💊"
                title="Medicine Delivery"
                description="Get prescribed medicines delivered to your doorstep"
                index={3}
                color="#ec4899"
              />
              <FeatureCard
                icon="📊"
                title="Health Analytics"
                description="Track your health metrics with beautiful visualizations"
                index={4}
                color="#f59e0b"
              />
              <FeatureCard
                icon="👥"
                title="Family Accounts"
                description="Manage health records for your entire family in one place"
                index={5}
                color="#10b981"
              />
            </div>
          </div>
        </section>

        {/* Services Showcase */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Our <span className="text-pink-300">Services</span>
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                Comprehensive healthcare solutions at your fingertips
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <ServiceCard
                image="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                title="Expert Doctors"
                description="Consult with top specialists from various fields"
                index={0}
              />
              <ServiceCard
                image="https://images.unsplash.com/photo-1666214280557-f1b5022eb634?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                title="Modern Facilities"
                description="State-of-the-art equipment and comfortable environment"
                index={1}
              />
              <ServiceCard
                image="https://images.unsplash.com/photo-1631815588090-d4bfec5b1b98?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                title="24/7 Care"
                description="Round-the-clock medical support and emergency services"
                index={2}
              />
              <ServiceCard
                image="https://images.unsplash.com/photo-1581056771107-24ca5f033842?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                title="Digital Records"
                description="Secure and accessible health data management"
                index={3}
              />
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                What People <span className="text-yellow-300">Say</span>
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                Trusted by thousands of patients and healthcare providers
              </p>
            </motion.div>

            <div className="relative h-64">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonial}
                  className="absolute inset-0"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 max-w-3xl mx-auto">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-4xl">
                        {testimonials[activeTestimonial].avatar}
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-white">
                          {testimonials[activeTestimonial].name}
                        </h4>
                        <p className="text-white/70">
                          {testimonials[activeTestimonial].role}
                        </p>
                      </div>
                    </div>
                    <p className="text-white/90 text-lg italic mb-4">
                      "{testimonials[activeTestimonial].content}"
                    </p>
                    <div className="flex gap-1 text-yellow-300">
                      {[...Array(testimonials[activeTestimonial].rating)].map(
                        (_, i) => (
                          <span key={i}>★</span>
                        ),
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Dots indicator */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === activeTestimonial ? "bg-white w-6" : "bg-white/50"
                  }`}
                  onClick={() => setActiveTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-4xl mx-auto bg-gradient-to-r from-teal-500 to-cyan-500 rounded-3xl p-12 text-center relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {/* Background decoration */}
            <motion.div
              className="absolute inset-0 bg-white/10"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
            />

            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Ready to Start Your Health Journey?
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Join thousands of satisfied patients and doctors on Swastha
                today
              </p>
              <motion.button
                className="px-8 py-4 bg-white text-teal-600 font-semibold rounded-xl shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started Now
              </motion.button>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default PatientHeroPage;
