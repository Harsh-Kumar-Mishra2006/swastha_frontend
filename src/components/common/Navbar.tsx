// components/layout/Navbar.tsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  Stethoscope,
  Bell,
  User,
  Menu,
  X,
  LogOut,
  ChevronDown,
  Shield,
  LayoutDashboard,
} from "lucide-react";
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Our Doctors", href: "/doctors" },
    { name: "Contact Us", href: "/contact" },
  ];

  if (isAuthenticated && user?.role === "admin") {
    navLinks.push({ name: "Add Doctor", href: "/add-doctor" });
    navLinks.push({ name: "Add MLT", href: "/add-mlt" });
  } else if (isAuthenticated && user?.role === "doctor") {
    navLinks.push({
      name: "Active appointments",
      href: "/active-appointments",
    });
    navLinks.push({ name: "View Patients", href: "/view-patients" });
    navLinks.push({ name: "Add Report", href: "/add-report" });
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileMenuOpen(false);
      setIsMobileMenuOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getDashboardLink = () => {
    if (!user) return "/";
    switch (user.role) {
      case "patient":
        return "/patient/dashboard";
      case "doctor":
        return "/doctor/dashboard";
      case "admin":
        return "/admin/dashboard";
      default:
        return "/";
    }
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/10 backdrop-blur-xl shadow-2xl border-b border-teal-100"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand - Always visible */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Stethoscope
                className={`h-8 w-8 transition-all duration-300 group-hover:scale-110 ${
                  isScrolled ? "text-teal-600" : "text-teal-400"
                }`}
              />
              <div
                className={`absolute -top-1 -right-1 h-3 w-3 rounded-full animate-pulse ${
                  isScrolled ? "bg-teal-700" : "bg-teal-500"
                }`}
              ></div>
            </div>
            <span
              className={`text-2xl font-bold transition-all duration-300 ${
                isScrolled
                  ? "bg-gradient-to-r from-teal-800 to-emerald-600 bg-clip-text text-transparent"
                  : "text-teal-400"
              }`}
            >
              Swastha
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`font-medium transition-colors duration-200 relative group ${
                  isScrolled
                    ? "text-gray-700 hover:text-teal-600"
                    : "text-gray-500 hover:text-teal-700"
                }`}
              >
                {link.name}
                <span
                  className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                    isScrolled ? "bg-teal-600" : "bg-white"
                  }`}
                ></span>
              </Link>
            ))}
          </div>

          {/* Right Side - Auth Buttons or Profile */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated && user ? (
              // Logged In - Show Profile Menu and Notifications
              <>
                {/* Notification Bell */}
                <Link
                  to="/notifications"
                  className={`relative p-2 transition-colors rounded-full ${
                    isScrolled
                      ? "text-gray-600 hover:text-teal-600 hover:bg-teal-300"
                      : "text-gray-400 hover:text-gray-600 hover:bg-white/10"
                  }`}
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
                </Link>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      isScrolled
                        ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:from-teal-600 hover:to-emerald-600 shadow-md hover:shadow-lg"
                        : "bg-green-500 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30"
                    }`}
                  >
                    <User className="h-4 w-4" />
                    <span>{user.name?.split(" ")[0] || "Profile"}</span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${isProfileMenuOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 border border-gray-100 animate-fadeIn">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                          {user.role}
                        </p>
                      </div>

                      <Link
                        to="/profile"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-teal-50 transition-colors"
                      >
                        <User className="h-4 w-4 mr-2 text-teal-600" />
                        Profile
                      </Link>

                      <Link
                        to={getDashboardLink()}
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-teal-50 transition-colors"
                      >
                        <LayoutDashboard className="h-4 w-4 mr-2 text-teal-600" />
                        Dashboard
                      </Link>

                      {user.role === "admin" && (
                        <Link
                          to="/admin"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center px-4 py-2 text-gray-700 hover:bg-teal-50 transition-colors"
                        >
                          <Shield className="h-4 w-4 mr-2 text-teal-600" />
                          Admin Panel
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              // Not Logged In - Show Login/Signup Buttons
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isScrolled
                      ? "text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                      : "text-white hover:text-teal-200 hover:bg-white/10"
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isScrolled
                      ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:from-teal-600 hover:to-emerald-600 shadow-md hover:shadow-lg"
                      : "bg-white text-teal-600 hover:bg-teal-50"
                  }`}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              isScrolled
                ? "text-gray-600 hover:text-teal-600 hover:bg-teal-50"
                : "text-white hover:text-teal-200 hover:bg-white/10"
            }`}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-teal-100 animate-slideDown">
          <div className="px-4 py-3 space-y-3">
            {/* Navigation Links */}
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="block py-2 text-gray-700 hover:text-teal-600 font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            {/* Mobile Auth Section */}
            <div className="pt-3 border-t border-gray-100">
              {isAuthenticated && user ? (
                // Mobile Logged In View
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 pb-2">
                    <div className="bg-teal-100 p-2 rounded-full">
                      <User className="h-5 w-5 text-teal-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500 capitalize">
                        {user.role}
                      </p>
                    </div>
                  </div>

                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 py-2 text-gray-700 hover:text-teal-600"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="h-5 w-5" />
                    <span>Profile</span>
                  </Link>

                  <Link
                    to={getDashboardLink()}
                    className="flex items-center space-x-2 py-2 text-gray-700 hover:text-teal-600"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>

                  <Link
                    to="/notifications"
                    className="flex items-center space-x-2 py-2 text-gray-700 hover:text-teal-600"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Bell className="h-5 w-5" />
                    <span>Notifications</span>
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      3
                    </span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 py-2 text-red-600 hover:text-red-700"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                // Mobile Not Logged In View
                <div className="space-y-3">
                  <Link
                    to="/login"
                    className="block w-full text-center py-2 text-teal-600 font-medium border border-teal-600 rounded-lg hover:bg-teal-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="block w-full text-center py-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-medium rounded-lg hover:from-teal-700 hover:to-emerald-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
