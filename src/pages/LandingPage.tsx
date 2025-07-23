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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-extrabold text-indigo-600">Expense
                <span className="text-xl font-bold text-gray-900">Trace</span>
              </span>
            </Link>


            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                to="/signin"
                className="text-gray-700 hover:text-indigo-600 transition font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="bg-indigo-600 text-white px-5 py-2 rounded-full hover:bg-indigo-700 transition font-semibold"
              >
                Get Started
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden px-4 pb-4 pt-2 border-t bg-white space-y-3">
            <Link
              to="/signin"
              onClick={() => setIsMenuOpen(false)}
              className="block text-gray-700 hover:text-indigo-600 font-medium"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              onClick={() => setIsMenuOpen(false)}
              className="block bg-indigo-600 text-white text-center py-2 rounded-md hover:bg-indigo-700 font-medium"
            >
              Get Started
            </Link>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-50 to-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Take control of your finances
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Your personal expense tracker to master your money
          </p>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Easily track your spending, visualize trends, and manage your budget—all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-indigo-600 text-white px-8 py-3 rounded-full hover:bg-indigo-700 transition font-semibold flex items-center justify-center"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <button
              onClick={scrollToHowItWorks}
              className="border border-indigo-600 text-indigo-600 px-8 py-3 rounded-full hover:bg-indigo-50 transition font-medium"
            >
              See How It Works
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything you need to track your expenses
            </h2>
            <p className="text-lg text-gray-600">
              Comprehensive tools to help you manage your finances effectively
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="bg-indigo-100 rounded-lg p-3 w-fit mb-4">
                  <feature.icon className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-50 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Stay on top of your personal finances in 3 easy steps
            </h2>
            <p className="text-lg text-gray-600">
              Simple, effective approach to expense tracking
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-indigo-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-indigo-600 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Build smarter money habits with ExpenseTrace
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands taking control of their finances today.
          </p>
          <Link
            to="/signup"
            className="bg-white text-indigo-600 px-8 py-3 rounded-full hover:bg-gray-100 transition font-medium inline-flex items-center"
          >
            Start Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-12 pb-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center mb-4 space-x-2">
              <Link to="/" className="flex items-center space-x-1">
                <span className="text-2xl font-extrabold text-indigo-600">Expense
                <span className="text-xl font-bold text-white">Trace</span></span>
              </Link>
            </div>
            <p className="text-gray-400">
              Your smart companion for tracking, analyzing, and managing daily finances.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/signup" className="hover:text-white">Sign Up</Link></li>
              <li><Link to="/signin" className="hover:text-white">Sign In</Link></li>
              <li><button onClick={scrollToHowItWorks} className="hover:text-white">How It Works</button></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Contact</h4>
            <p className="text-gray-400">support@expensetrace.com</p>
            <p className="text-gray-400">+91-98765-43210</p>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Follow Us</h4>
            <div className="flex space-x-4 text-indigo-400">
              <Linkedin className="hover:text-white cursor-pointer" />
            </div>
          </div>
        </div>
        <div className="mt-8 text-center text-gray-500 text-sm">
          © 2025 ExpenseTrace. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
