import { useState, useEffect } from "react";
import { motion, useMotionValue } from "framer-motion";

// Contact info card component
const ContactInfoCard = ({ icon, title, details, delay }: any) => {
  return (
    <motion.div
      className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-teal-500/50 transition-all duration-300 group"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
    >
      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      {details.map((detail: string, idx: number) => (
        <p key={idx} className="text-slate-300 text-sm mb-1">
          {detail}
        </p>
      ))}
    </motion.div>
  );
};

// Floating shape decoration
const FloatingShape = ({ delay, x, y, size, color }: any) => {
  return (
    <motion.div
      className={`absolute rounded-full ${color} opacity-20 blur-3xl`}
      style={{ width: size, height: size, left: x, top: y }}
      animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
      transition={{
        duration: 8,
        delay,
        repeat: Infinity,
        repeatType: "reverse",
      }}
    />
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
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  // Mouse move effect for background
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
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 overflow-hidden">
      {/* Decorative floating shapes */}
      <FloatingShape
        delay={0}
        x="5%"
        y="15%"
        size="250px"
        color="bg-teal-500"
      />
      <FloatingShape
        delay={2}
        x="85%"
        y="70%"
        size="300px"
        color="bg-cyan-500"
      />
      <FloatingShape
        delay={4}
        x="15%"
        y="80%"
        size="200px"
        color="bg-emerald-500"
      />
      <FloatingShape
        delay={1}
        x="75%"
        y="10%"
        size="180px"
        color="bg-blue-500"
      />

      {/* Main Content */}
      <div className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="inline-block mb-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className="px-4 py-1.5 bg-white/5 backdrop-blur-md rounded-full text-teal-300 border border-white/10 text-sm font-medium">
                📞 Get in Touch
              </span>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Contact{" "}
              <span className="bg-gradient-to-r from-teal-300 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                Us
              </span>
            </motion.h1>

            <motion.p
              className="text-lg text-slate-300 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Have questions about Swastha? We're here to help. Reach out to us
              anytime.
            </motion.p>
          </motion.div>

          {/* Contact Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <ContactInfoCard
              icon="📍"
              title="Visit Us"
              details={[
                "123 Healthcare Avenue",
                "Medicity District",
                "Mumbai - 400001",
              ]}
              delay={0.1}
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
            />
          </div>

          {/* Contact Form & Map Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <motion.div
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-white/10"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-white mb-6">
                Send us a Message
              </h2>

              {isSubmitted && (
                <motion.div
                  className="mb-6 p-4 bg-emerald-500/20 border border-emerald-500/50 rounded-xl text-emerald-300 text-sm"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  ✅ Thank you for reaching out! We'll get back to you within 24
                  hours.
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-colors"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-colors"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Subject *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-teal-500 transition-colors"
                  >
                    <option value="" className="bg-slate-800">
                      Select a subject
                    </option>
                    <option value="appointment" className="bg-slate-800">
                      Book an Appointment
                    </option>
                    <option value="support" className="bg-slate-800">
                      Technical Support
                    </option>
                    <option value="feedback" className="bg-slate-800">
                      Feedback & Suggestions
                    </option>
                    <option value="partnership" className="bg-slate-800">
                      Partnership Inquiry
                    </option>
                    <option value="other" className="bg-slate-800">
                      Other
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-colors resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-teal-500/25 disabled:opacity-70"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    "Send Message"
                  )}
                </motion.button>
              </form>
            </motion.div>

            {/* Map & Additional Info */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              {/* Map Card */}
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Find Us Here
                </h3>
                <div className="rounded-xl overflow-hidden h-64 w-full bg-slate-800 relative">
                  <iframe
                    title="Swastha Location Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.837447557615!2d72.834125!3d19.075983!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c9e7a8f2f7f7%3A0x3b3f3f3f3f3f3f3f!2sMumbai!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-xl"
                  />
                </div>
              </div>

              {/* Emergency Contact Card */}
              <div className="bg-gradient-to-r from-teal-600/20 to-cyan-600/20 backdrop-blur-lg rounded-2xl p-6 border border-teal-500/30">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">🚨</div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">
                      Emergency? Need Immediate Help?
                    </h3>
                    <p className="text-slate-300 text-sm mb-3">
                      For medical emergencies, please call our 24/7 helpline
                    </p>
                    <a
                      href="tel:+9118001234567"
                      className="inline-flex items-center gap-2 text-teal-300 font-semibold hover:text-teal-200 transition-colors"
                    >
                      📞 +91 1800 123 4567
                      <svg
                        className="w-4 h-4"
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
                    </a>
                  </div>
                </div>
              </div>

              {/* Working Hours Card */}
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">
                  🕒 Working Hours
                </h3>
                <div className="space-y-2 text-slate-300">
                  <div className="flex justify-between py-2 border-b border-white/10">
                    <span>Monday - Friday</span>
                    <span className="text-white">9:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/10">
                    <span>Saturday</span>
                    <span className="text-white">10:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/10">
                    <span>Sunday</span>
                    <span className="text-white">10:00 AM - 2:00 PM</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span>Emergency Support</span>
                    <span className="text-teal-300 font-medium">
                      24/7 Available
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* FAQ Section */}
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              Frequently Asked <span className="text-teal-300">Questions</span>
            </h2>
            <p className="text-slate-300 mb-8">
              Can't find what you're looking for? Check out our{" "}
              <a href="#" className="text-teal-400 hover:underline">
                FAQ page
              </a>{" "}
              or reach out to our support team.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
