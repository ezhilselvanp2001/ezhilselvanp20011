import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  PieChart,
  Target,
  Bell,
  RefreshCw,
  Zap,
  Linkedin,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToHowItWorks = () => {
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  };

  const features = [
    {
      icon: BarChart3,
      title: "Track Personal Expenses",
      description: "Easily log and categorize your daily spending with our intuitive interface.",
    },
    {
      icon: PieChart,
      title: "Visual Analytics",
      description: "Get insights into your spending patterns with beautiful charts and graphs.",
    },
    {
      icon: Target,
      title: "Monthly Budgets",
      description: "Set and track monthly budgets to stay on top of your financial goals.",
    },
    {
      icon: Bell,
      title: "Reminders & Alerts",
      description: "Never miss a payment or budget deadline with smart notifications.",
    },
    {
      icon: RefreshCw,
      title: "Recurring Expenses",
      description: "Automatically track subscriptions and recurring monthly expenses.",
    },
    {
      icon: Zap,
      title: "Real-Time Sync",
      description: "Your data is always up-to-date across all your devices.",
    },
  ];

  const steps = [
    {
      step: "1",
      title: "Add Your Expenses",
      description: "Quickly log your daily expenses with just a few taps. Categorize and tag them for better organization.",
    },
    {
      step: "2",
      title: "Review Your Spending",
      description: "View detailed analytics and insights about your spending patterns. Identify areas for improvement.",
    },
    {
      step: "3",
      title: "Plan & Optimize",
      description: "Set budgets, track progress, and make informed decisions to improve your financial health.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="backdrop-blur bg-white/80 shadow-sm sticky top-0 z-50 border-b">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
          <div className="flex justify-between items-center py-3 sm:py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-xl sm:text-2xl font-extrabold text-indigo-600">Expense
                <span className="text-lg sm:text-xl font-bold text-gray-900">Trace</span>
              </span>
            </Link>


            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
              <Link
                to="/signin"
                className="text-sm lg:text-base text-gray-700 hover:text-indigo-600 transition font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="bg-indigo-600 text-white px-4 lg:px-5 py-2 rounded-full hover:bg-indigo-700 transition font-semibold text-sm lg:text-base"
              >
                Get Started
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden px-3 sm:px-4 pb-3 sm:pb-4 pt-2 border-t bg-white space-y-2 sm:space-y-3">
            <Link
              to="/signin"
              onClick={() => setIsMenuOpen(false)}
              className="block text-sm sm:text-base text-gray-700 hover:text-indigo-600 font-medium"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              onClick={() => setIsMenuOpen(false)}
              className="block bg-indigo-600 text-white text-center py-2 rounded-md hover:bg-indigo-700 font-medium text-sm sm:text-base"
            >
              Get Started
            </Link>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-50 to-white py-12 sm:py-16 lg:py-20 px-3 sm:px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            Take control of your finances
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-3 sm:mb-4">
            Your personal expense tracker to master your money
          </p>
          <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Easily track your spending, visualize trends, and manage your budget—all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-indigo-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full hover:bg-indigo-700 transition font-semibold flex items-center justify-center text-sm sm:text-base"
            >
              Get Started
              <ArrowRight className="ml-1.5 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
            <button
              onClick={scrollToHowItWorks}
              className="border border-indigo-600 text-indigo-600 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full hover:bg-indigo-50 transition font-medium text-sm sm:text-base"
            >
              See How It Works
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white px-3 sm:px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              Everything you need to track your expenses
            </h2>
            <p className="text-base sm:text-lg text-gray-600">
              Comprehensive tools to help you manage your finances effectively
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-4 sm:p-6 hover:shadow-lg transition-shadow">
                <div className="bg-indigo-100 rounded-lg p-2 sm:p-3 w-fit mb-3 sm:mb-4">
                  <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-12 sm:py-16 lg:py-20 bg-gray-50 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              Stay on top of your personal finances in 3 easy steps
            </h2>
            <p className="text-base sm:text-lg text-gray-600">
              Simple, effective approach to expense tracking
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-indigo-600 text-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-lg sm:text-xl font-bold mx-auto mb-3 sm:mb-4">
                  {step.step}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                  {step.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 sm:py-16 lg:py-20 bg-indigo-600 px-3 sm:px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">
            Build smarter money habits with ExpenseTrace
          </h2>
          <p className="text-lg sm:text-xl text-indigo-100 mb-6 sm:mb-8">
            Join thousands taking control of their finances today.
          </p>
          <Link
            to="/signup"
            className="bg-white text-indigo-600 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full hover:bg-gray-100 transition font-medium inline-flex items-center text-sm sm:text-base"
          >
            Start Now
            <ArrowRight className="ml-1.5 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-8 sm:pt-12 pb-4 sm:pb-6 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center mb-3 sm:mb-4 space-x-2">
              <Link to="/" className="flex items-center space-x-1">
                <span className="text-xl sm:text-2xl font-extrabold text-indigo-600">Expense
                <span className="text-lg sm:text-xl font-bold text-white">Trace</span></span>
              </Link>
            </div>
            <p className="text-sm sm:text-base text-gray-400">
              Your smart companion for tracking, analyzing, and managing daily finances.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">Quick Links</h4>
            <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base text-gray-400">
              <li><Link to="/signup" className="hover:text-white">Sign Up</Link></li>
              <li><Link to="/signin" className="hover:text-white">Sign In</Link></li>
              <li><button onClick={scrollToHowItWorks} className="hover:text-white">How It Works</button></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">Contact</h4>
            <p className="text-sm sm:text-base text-gray-400">support@expensetrace.com</p>
            <p className="text-sm sm:text-base text-gray-400">+91-98765-43210</p>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">Follow Us</h4>
            <div className="flex space-x-4 text-indigo-400">
              <Linkedin className="h-5 w-5 sm:h-6 sm:w-6 hover:text-white cursor-pointer" />
            </div>
          </div>
        </div>
        <div className="mt-6 sm:mt-8 text-center text-gray-500 text-xs sm:text-sm">
          © 2025 ExpenseTrace. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
