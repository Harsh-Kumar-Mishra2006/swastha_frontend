import { useEffect, useState } from "react";
import { motion, useMotionValue, AnimatePresence } from "framer-motion";
import AnimatedBackground from "../AnimatedBackground";

// Simple floating shape for decoration
const FloatingShape = ({ delay, x, y, size, color }: any) => {
  return (
    <motion.div
      className={`absolute rounded-full ${color} opacity-20 blur-3xl`}
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
      }}
      animate={{
        y: [0, -30, 0],
        x: [0, 20, 0],
      }}
      transition={{
        duration: 8,
        delay,
        repeat: Infinity,
        repeatType: "reverse",
      }}
    />
  );
};

const PatientHeroPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
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

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 overflow-hidden">
      <AnimatedBackground mouseX={mouseX} mouseY={mouseY} />

      {/* Decorative floating shapes */}
      <FloatingShape
        delay={0}
        x="10%"
        y="20%"
        size="300px"
        color="bg-teal-500"
      />
      <FloatingShape
        delay={2}
        x="80%"
        y="60%"
        size="400px"
        color="bg-cyan-500"
      />
      <FloatingShape
        delay={4}
        x="20%"
        y="70%"
        size="250px"
        color="bg-emerald-500"
      />
      <FloatingShape
        delay={1}
        x="70%"
        y="10%"
        size="200px"
        color="bg-blue-500"
      />

      {/* Initial Load Animation */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            className="fixed inset-0 bg-slate-900 z-50 flex items-center justify-center"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          {/* Floating Badge */}
          <motion.div
            className="inline-block mb-8"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="px-5 py-2 bg-white/5 backdrop-blur-md rounded-full text-teal-300 border border-white/10 text-sm font-medium">
              ✨ Trusted by 50,000+ patients & doctors
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Welcome to{" "}
            <motion.span
              className="inline-block bg-gradient-to-r from-teal-300 via-cyan-300 to-emerald-300 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{ backgroundSize: "200% 200%" }}
            >
              Swastha
            </motion.span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            className="text-lg md:text-xl text-slate-300 mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            Bridging the gap between patients and healthcare providers through
            innovative technology and compassionate care.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
          >
            <motion.button
              className="group relative px-8 py-3.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium rounded-full overflow-hidden shadow-lg shadow-teal-500/25"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
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
              </span>
            </motion.button>

            <motion.button
              className="px-8 py-3.5 bg-white/5 backdrop-blur-sm text-white font-medium rounded-full border border-white/10 hover:bg-white/10 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Learn More
            </motion.button>
          </motion.div>

          {/* Simple Stats Row */}
          <motion.div
            className="flex flex-wrap justify-center gap-8 md:gap-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.9 }}
          >
            {[
              { value: "500+", label: "Expert Doctors", icon: "👨‍⚕️" },
              { value: "50+", label: "Clinics", icon: "🏥" },
              { value: "50k+", label: "Happy Patients", icon: "😊" },
              { value: "24/7", label: "Support", icon: "🆘" },
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + idx * 0.1 }}
              >
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-2xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-2 bg-white/50 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PatientHeroPage;
