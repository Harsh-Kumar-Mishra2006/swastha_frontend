import {
  ShoppingBasket,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Mail,
  Phone,
  Truck,
  Heart,
  ArrowRight,
  Download,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    swastha: [
      { name: "Get Appointments", href: "#" },
      { name: "View Health Records", href: "#" },
      { name: "Consult Doctors", href: "#" },
      { name: "Prescriptions", href: "#" },
      { name: "Health Tips", href: "#" },
      { name: "Wellness Programs", href: "#" },
      { name: "Health Checkups", href: "#" },
      { name: "Health Resources", href: "#" },
    ],
    services: [
      { name: "Swastha Health Services", href: "#" },
      { name: "Health Insurance", href: "#" },
      { name: "Health Plans", href: "#" },
      { name: "Health Programs", href: "#" },
      { name: "Health Checkups", href: "#" },
      { name: "Golden Coupans for free Treatment", href: "#" },
    ],
    help: [
      { name: "FAQ", href: "#" },
      { name: "Appointment Information", href: "#" },
      { name: "Cancellation Policy", href: "#" },
      { name: "Contact Us", href: "#" },
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Accessibility", href: "#" },
    ],
    company: [
      { name: "About Us", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Press & Media", href: "#" },
      { name: "Sustainability", href: "#" },
      { name: "Affiliate Program", href: "#" },
      { name: "Partner With Us", href: "#" },
      { name: "Blog", href: "#" },
    ],
  };

  const paymentMethods = [
    { name: "Visa", icon: "💳" },
    { name: "Mastercard", icon: "💳" },
    { name: "PayPal", icon: "💰" },
    { name: "Apple Pay", icon: "" },
    { name: "Google Pay", icon: "G" },
    { name: "Amex", icon: "💳" },
  ];

  return (
    <footer className="bg-gradient-to-r from-teal-200 via-cyan-200 to-emerald-200 border-t border-gray-200">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-2 rounded-lg">
                <ShoppingBasket className="h-8 w-8 text-white" />
              </div>
              <div>
                <span className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">
                  Swastha
                </span>
                <p className="text-sm text-gray-500 mt-1">
                  Your Trusted Health Companion
                </p>
              </div>
            </div>

            <p className="text-gray-600 mb-6 max-w-md">
              Get anytime access to your health records, book appointments, and
              consult with top doctors from the comfort of your home. Swastha is
              here to make healthcare easier for you.
            </p>

            {/* Newsletter Subscription */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Stay Updated
              </h3>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <button className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-6 py-3 rounded-lg font-medium hover:from-emerald-700 hover:to-teal-800 transition-all duration-200 flex items-center justify-center">
                  Follow Us
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Connect With Us
              </h3>
              <div className="flex space-x-3">
                {[
                  {
                    icon: <Facebook className="h-5 w-5" />,
                    color: "bg-blue-600",
                    hover: "bg-blue-700",
                  },
                  {
                    icon: <Twitter className="h-5 w-5" />,
                    color: "bg-sky-500",
                    hover: "bg-sky-600",
                  },
                  {
                    icon: <Instagram className="h-5 w-5" />,
                    color: "bg-pink-600",
                    hover: "bg-pink-700",
                  },
                  {
                    icon: <Linkedin className="h-5 w-5" />,
                    color: "bg-blue-700",
                    hover: "bg-blue-800",
                  },
                  {
                    icon: <Youtube className="h-5 w-5" />,
                    color: "bg-red-600",
                    hover: "bg-red-700",
                  },
                ].map((social, index) => (
                  <a
                    key={index}
                    href="#"
                    className={`${social.color} hover:${social.hover} text-white p-2.5 rounded-lg transition-all duration-200 hover:-translate-y-1`}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <ShoppingBasket className="h-5 w-5 mr-2 text-emerald-600" />
              Swastha
            </h3>
            <ul className="space-y-2">
              {footerLinks.swastha.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-600 hover:text-emerald-600 transition-colors duration-150 flex items-center group"
                  >
                    <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Truck className="h-5 w-5 mr-2 text-emerald-600" />
              Services
            </h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-600 hover:text-emerald-600 transition-colors duration-150 flex items-center group"
                  >
                    <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Help & Support
              </h3>
              <ul className="space-y-2">
                {footerLinks.help.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-gray-600 hover:text-emerald-600 transition-colors duration-150"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Company
              </h3>
              <ul className="space-y-2">
                {footerLinks.company.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-gray-600 hover:text-emerald-600 transition-colors duration-150"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-emerald-100 to-teal-100 p-3 rounded-lg">
                <Phone className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Call Us</h4>
                <p className="text-gray-600">5375498985</p>
                <p className="text-sm text-gray-500">24/7 Customer Support</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-emerald-100 to-teal-100 p-3 rounded-lg">
                <Mail className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Email Us</h4>
                <p className="text-gray-600">support@Swastha.com</p>
                <p className="text-sm text-gray-500">Response within 2 hours</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-8">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">
            We Accept
          </h4>
          <div className="flex flex-wrap gap-3">
            {paymentMethods.map((method, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 px-4 py-2 rounded-lg flex items-center space-x-2 hover:border-emerald-300 transition-colors duration-150"
              >
                <span className="text-lg">{method.icon}</span>
                <span className="text-sm font-medium text-gray-700">
                  {method.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Apps */}
        <div className="mt-8 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Get the Swastha App
              </h3>
              <p className="text-gray-600">
                Book appointments, track health records, and get exclusive
                offers.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-900 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-400">
                © {currentYear} Swastha. All rights reserved.
              </p>
            </div>

            <div className="flex items-center space-x-6">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-150"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-150"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-150"
              >
                Cookie Policy
              </a>
              <div className="flex items-center text-gray-400">
                <Heart className="h-4 w-4 mr-2 fill-current text-red-500" />
                Made with love for all Users
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
