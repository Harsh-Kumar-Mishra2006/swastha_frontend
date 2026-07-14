import { useState, useEffect } from "react";
import { motion, useMotionValue } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Send,
  Loader2,
  CheckCircle2,
  Clock,
  Star,
  Users,
  Shield,
} from "lucide-react";

// Contact info card component with improved design
const ContactInfoCard = ({ icon, title, details, delay, gradient }: any) => {
  return (
    <motion.div
      className="group relative bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-teal-500/50 transition-all duration-500 overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      whileHover={{ y: -8, scale: 1.02 }}
    >
      {/* Gradient overlay on hover */}
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${gradient}`}
      />

      <div className="relative z-10">
        <div className="text-4xl mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 inline-block">
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
        {details.map((detail: string, idx: number) => (
          <p
            key={idx}
            className="text-slate-300/80 text-sm mb-1.5 flex items-start gap-2"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400/60 mt-1.5 flex-shrink-0" />
            {detail}
          </p>
        ))}
      </div>
    </motion.div>
  );
};

// Floating shape decoration with enhanced animations
const FloatingShape = ({ delay, x, y, size, color, rotation = 0 }: any) => {
  return (
    <motion.div
      className={`absolute rounded-full ${color} opacity-20 blur-3xl`}
      style={{ width: size, height: size, left: x, top: y }}
      animate={{
        y: [0, -40, 0, 20, 0],
        x: [0, 30, -10, 20, 0],
        rotate: [0, rotation, -rotation, 0],
        scale: [1, 1.1, 0.9, 1.1, 1],
      }}
      transition={{
        duration: 10,
        delay,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      }}
    />
  );
};

// Stats counter component
const StatItem = ({ value, label, icon: Icon, delay }: any) => {
  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <div className="flex items-center justify-center gap-2 text-3xl font-bold text-white mb-1">
        <Icon className="w-6 h-6 text-teal-400" />
        <span>{value}</span>
      </div>
      <p className="text-slate-400 text-sm">{label}</p>
    </motion.div>
  );
};

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      mouseX.set(e.clientX - centerX);
      mouseY.set(e.clientY - centerY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0a0f1e] via-[#0d1b2a] to-[#1a2a3a] overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0  opacity-50" />

      {/* Decorative floating shapes with enhanced colors */}
      <FloatingShape
        delay={0}
        x="5%"
        y="10%"
        size="300px"
        color="bg-gradient-to-br from-teal-500/30 to-cyan-500/30"
        rotation={45}
      />
      <FloatingShape
        delay={2.5}
        x="85%"
        y="60%"
        size="350px"
        color="bg-gradient-to-br from-purple-500/30 to-pink-500/30"
        rotation={-30}
      />
      <FloatingShape
        delay={4}
        x="15%"
        y="75%"
        size="250px"
        color="bg-gradient-to-br from-emerald-500/30 to-teal-500/30"
        rotation={60}
      />
      <FloatingShape
        delay={1.5}
        x="75%"
        y="15%"
        size="200px"
        color="bg-gradient-to-br from-blue-500/30 to-indigo-500/30"
        rotation={-45}
      />
      <FloatingShape
        delay={3}
        x="45%"
        y="90%"
        size="180px"
        color="bg-gradient-to-br from-orange-500/20 to-red-500/20"
        rotation={20}
      />

      {/* Main Content */}
      <div className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section with enhanced design */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-block mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className="px-6 py-2.5 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 backdrop-blur-md rounded-full text-teal-300 border border-teal-500/30 text-sm font-medium shadow-lg shadow-teal-500/10">
                📞 24/7 Support Available
              </span>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Get in Touch
              <span className="block bg-gradient-to-r from-teal-300 via-cyan-300 to-emerald-300 bg-clip-text text-transparent mt-2">
                With Our Team
              </span>
            </motion.h1>

            <motion.p
              className="text-lg text-slate-300/80 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Have questions about Swastha? We're here to help. Reach out to us
              anytime and our dedicated team will assist you promptly.
            </motion.p>

            {/* Stats Section */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto mt-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <StatItem value="24/7" label="Support" icon={Clock} delay={0.1} />
              <StatItem
                value="100%"
                label="Satisfaction"
                icon={Star}
                delay={0.2}
              />
              <StatItem
                value="50K+"
                label="Patients"
                icon={Users}
                delay={0.3}
              />
              <StatItem
                value="99.9%"
                label="Uptime"
                icon={Shield}
                delay={0.4}
              />
            </motion.div>
          </motion.div>

          {/* Contact Info Grid with improved cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <ContactInfoCard
              icon="📍"
              title="Visit Us"
              details={[
                "123 Healthcare Avenue",
                "Medicity District",
                "Mumbai - 400001",
              ]}
              delay={0.1}
              gradient="bg-gradient-to-br from-teal-500 to-cyan-500"
            />
            <ContactInfoCard
              icon="📞"
              title="Call Us"
              details={[
                "+91 1800 123 4567",
                "+91 22 6789 0123",
                "Mon - Sat, 9 AM - 8 PM",
              ]}
              delay={0.2}
              gradient="bg-gradient-to-br from-purple-500 to-pink-500"
            />
            <ContactInfoCard
              icon="✉️"
              title="Email Us"
              details={[
                "support@swastha.com",
                "care@swastha.com",
                "24/7 response within 2 hours",
              ]}
              delay={0.3}
              gradient="bg-gradient-to-br from-blue-500 to-indigo-500"
            />
            <ContactInfoCard
              icon="💬"
              title="Social Media"
              details={[
                "@swastha_health",
                "facebook.com/swastha",
                "linkedin.com/company/swastha",
              ]}
              delay={0.4}
              gradient="bg-gradient-to-br from-orange-500 to-red-500"
            />
          </div>

          {/* Contact Form & Map Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form with improved design */}
            <motion.div
              className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl shadow-black/20"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-xl border border-teal-500/30">
                  <Send className="w-6 h-6 text-teal-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Send us a Message
                  </h2>
                  <p className="text-slate-400 text-sm">
                    We'll get back to you within 24 hours
                  </p>
                </div>
              </div>

              {isSubmitted && (
                <motion.div
                  className="mb-6 p-4 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/50 rounded-xl text-emerald-300 text-sm flex items-center gap-3"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  <span>
                    Thank you for reaching out! We'll get back to you within 24
                    hours.
                  </span>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="group">
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Full Name *
                  </label>
                  <div
                    className={`relative transition-all duration-300 ${focusedField === "name" ? "scale-[1.02]" : ""}`}
                  >
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("name")}
                      onBlur={() => setFocusedField(null)}
                      required
                      className="w-full px-4 py-3.5 bg-white/10 border-2 border-white/10 rounded-xl text-white placeholder-slate-400/60 focus:outline-none focus:border-teal-500 focus:bg-white/15 transition-all duration-300"
                      placeholder="John Doe"
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-500/0 via-teal-500/0 to-cyan-500/0 group-focus-within:from-teal-500/5 group-focus-within:via-teal-500/10 group-focus-within:to-cyan-500/5 transition-all duration-500 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Email Address *
                  </label>
                  <div
                    className={`relative transition-all duration-300 ${focusedField === "email" ? "scale-[1.02]" : ""}`}
                  >
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      required
                      className="w-full px-4 py-3.5 bg-white/10 border-2 border-white/10 rounded-xl text-white placeholder-slate-400/60 focus:outline-none focus:border-teal-500 focus:bg-white/15 transition-all duration-300"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Subject *
                  </label>
                  <div
                    className={`relative transition-all duration-300 ${focusedField === "subject" ? "scale-[1.02]" : ""}`}
                  >
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("subject")}
                      onBlur={() => setFocusedField(null)}
                      required
                      className="w-full px-4 py-3.5 bg-white/10 border-2 border-white/10 rounded-xl text-white focus:outline-none focus:border-teal-500 focus:bg-white/15 transition-all duration-300 appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-slate-800 text-slate-300">
                        Select a subject
                      </option>
                      <option value="appointment" className="bg-slate-800">
                        🩺 Book an Appointment
                      </option>
                      <option value="support" className="bg-slate-800">
                        ⚙️ Technical Support
                      </option>
                      <option value="feedback" className="bg-slate-800">
                        💡 Feedback & Suggestions
                      </option>
                      <option value="partnership" className="bg-slate-800">
                        🤝 Partnership Inquiry
                      </option>
                      <option value="other" className="bg-slate-800">
                        📝 Other
                      </option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Message *
                  </label>
                  <div
                    className={`relative transition-all duration-300 ${focusedField === "message" ? "scale-[1.02]" : ""}`}
                  >
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("message")}
                      onBlur={() => setFocusedField(null)}
                      required
                      rows={5}
                      className="w-full px-4 py-3.5 bg-white/10 border-2 border-white/10 rounded-xl text-white placeholder-slate-400/60 focus:outline-none focus:border-teal-500 focus:bg-white/15 transition-all duration-300 resize-none"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="relative w-full py-4 bg-gradient-to-r from-teal-500 via-teal-500 to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-teal-500/30 disabled:opacity-70 overflow-hidden group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative flex items-center justify-center gap-3">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </span>
                </motion.button>
              </form>
            </motion.div>

            {/* Right Column - Map & Info */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              {/* Map Card */}
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl shadow-black/20 overflow-hidden">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="w-5 h-5 text-teal-400" />
                  <h3 className="text-xl font-semibold text-white">
                    Find Us Here
                  </h3>
                </div>
                <div className="rounded-2xl overflow-hidden h-72 w-full bg-slate-800/50 relative">
                  <iframe
                    title="Swastha Location Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.837447557615!2d72.834125!3d19.075983!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c9e7a8f2f7f7%3A0x3b3f3f3f3f3f3f3f!2sMumbai!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-2xl"
                  />
                </div>
              </div>

              {/* Emergency Contact Card */}
              <motion.div
                className="relative bg-gradient-to-r from-teal-600/20 via-cyan-600/20 to-emerald-600/20 backdrop-blur-xl rounded-3xl p-6 border border-teal-500/30 shadow-2xl shadow-teal-500/10 overflow-hidden group"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative flex items-start gap-5">
                  <div className="p-3 bg-red-500/20 rounded-2xl border border-red-500/30 animate-pulse">
                    <span className="text-3xl">🚨</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">
                      Emergency? Need Immediate Help?
                    </h3>
                    <p className="text-slate-300/80 text-sm mb-4">
                      For medical emergencies, please call our 24/7 helpline
                    </p>
                    <a
                      href="tel:+9118001234567"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all duration-300 group-hover:scale-105"
                    >
                      <Phone className="w-5 h-5" />
                      +91 1800 123 4567
                    </a>
                  </div>
                </div>
              </motion.div>

              {/* Working Hours Card */}
              <motion.div
                className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl shadow-black/20"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <Clock className="w-5 h-5 text-teal-400" />
                  <h3 className="text-xl font-semibold text-white">
                    Working Hours
                  </h3>
                </div>
                <div className="space-y-3">
                  {[
                    { day: "Monday - Friday", hours: "9:00 AM - 8:00 PM" },
                    { day: "Saturday", hours: "10:00 AM - 6:00 PM" },
                    { day: "Sunday", hours: "10:00 AM - 2:00 PM" },
                  ].map((item, idx) => (
                    <motion.div
                      key={idx}
                      className="flex justify-between items-center py-2.5 border-b border-white/5 last:border-0"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <span className="text-slate-300/80">{item.day}</span>
                      <span className="text-white font-medium">
                        {item.hours}
                      </span>
                    </motion.div>
                  ))}
                  <div className="flex justify-between items-center pt-3 mt-2 border-t border-teal-500/20">
                    <span className="text-slate-300/80 font-medium">
                      Emergency Support
                    </span>
                    <span className="text-teal-300 font-semibold bg-teal-500/20 px-3 py-1 rounded-full text-sm border border-teal-500/30">
                      24/7 Available
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* FAQ Section with improved design */}
          <motion.div
            className="mt-20 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="inline-block px-6 py-2.5 bg-white/5 backdrop-blur-md rounded-full border border-white/10 mb-6">
              <span className="text-teal-300 text-sm font-medium">❓ FAQ</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Frequently Asked{" "}
              <span className="bg-gradient-to-r from-teal-300 to-cyan-300 bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
            <p className="text-slate-300/80 max-w-2xl mx-auto leading-relaxed">
              Can't find what you're looking for? Check out our{" "}
              <a
                href="#"
                className="text-teal-400 hover:text-teal-300 underline underline-offset-4 transition-colors duration-300 font-medium"
              >
                FAQ page
              </a>{" "}
              or reach out to our support team.
            </p>
            <motion.div
              className="mt-8 flex justify-center gap-4 flex-wrap"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <a
                href="#"
                className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                <MessageCircle className="w-5 h-5 text-teal-400" />
                Live Chat
              </a>
              <a
                href="mailto:support@swastha.com"
                className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl text-white font-medium shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                <Mail className="w-5 h-5" />
                Email Support
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
