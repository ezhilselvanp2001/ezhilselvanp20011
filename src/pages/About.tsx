import { ExternalLink,Linkedin, Mail, Heart, Users, Calendar, Star } from 'lucide-react';

function About() {
  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About ExpenseTracer</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Your personal expense tracker to master your money. Built with love to help you take control of your finances.
        </p>
      </div>

      {/* Mission Section */}
      <div className="bg-white rounded-lg shadow p-6 sm:p-8 mb-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-lg text-indigo-600 font-medium">
            Empowering financial freedom through simple expense tracking
          </p>
        </div>
        
        <div className="prose prose-lg max-w-none text-gray-600">
          <p className="mb-4">
            ExpenseTracer was created with the belief that everyone deserves to have a clear picture of their financial health. 
            We make it easy to track, analyze, and optimize your spending habits so you can achieve your financial goals.
          </p>
          <p>
            Whether you're saving for a vacation, paying off debt, or just want to understand where your money goes, 
            ExpenseTracer provides the tools and insights you need to make informed financial decisions.
          </p>
        </div>
      </div>

      {/* Key Features Section */}
      <div className="bg-white rounded-lg shadow p-6 sm:p-8 mb-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Key Features</h2>
          <p className="text-lg text-gray-600">
            Everything you need for complete expense management
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[
            { title: 'Expense Tracking', description: 'Log and categorize your daily expenses with ease' },
            { title: 'Budget Management', description: 'Set and monitor budgets to stay on track' },
            { title: 'Visual Analytics', description: 'Beautiful charts and insights into your spending' },
            { title: 'Recurring Transactions', description: 'Automate tracking of regular expenses' },
            { title: 'Category Organization', description: 'Organize expenses with custom categories' },
            { title: 'Financial Insights', description: 'Get actionable insights to improve your finances' },
          ].map((feature, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center text-gray-600">
          <p>
            From simple expense logging to advanced analytics and budgeting tools, 
            ExpenseTracer grows with your financial management needs.
          </p>
        </div>
      </div>

      {/* Version Information */}
      <div className="bg-white rounded-lg shadow p-6 sm:p-8 mb-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Version Information</h2>
          <p className="text-lg text-gray-600">
            Current application details and updates
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-indigo-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Star className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">v2.1.0</h3>
            <p className="text-gray-600">Current Version</p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Jan 2024</h3>
            <p className="text-gray-600">Last Updated</p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">10K+</h3>
            <p className="text-gray-600">Happy Users</p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-white rounded-lg shadow p-6 sm:p-8 mb-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet the Team</h2>
          <p className="text-lg text-gray-600">
            The people behind ExpenseTracer
          </p>
        </div>

        <div className="flex justify-center">
          <div className="bg-gray-50 rounded-lg p-6 max-w-sm text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">EP</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Ezhil selvan P</h3>
            <p className="text-gray-600 mb-4">Full-stack Developer</p>
            <a
              href="https://www.linkedin.com/in/ezhil-selvan-p-79a80520a/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              <Linkedin className="h-5 w-5 mr-2" />
              LinkedIn Profile
              <ExternalLink className="h-4 w-4 ml-1" />
            </a>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-white rounded-lg shadow p-6 sm:p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Contact</h2>
          <p className="text-lg text-gray-600">
            Support & Feedback
          </p>
          <p className="text-gray-600 mt-2">
            We love hearing from our users
          </p>
        </div>

        <div className="max-w-2xl mx-auto text-center">
          <p className="text-gray-600 mb-8">
            Have questions, suggestions, or just want to say hello? We're here to help and always looking to improve ExpenseTracer.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href="mailto:support@expensetrace.com"
              className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-medium"
            >
              <Mail className="h-5 w-5 mr-2" />
              Contact Support
            </a>
            <a
              href="#"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
            >
              <ExternalLink className="h-5 w-5 mr-2" />
              Documentation
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-12 pt-8 border-t border-gray-200">
        <div className="flex items-center justify-center text-gray-600 mb-4">
          <span>Made with</span>
          <Heart className="h-5 w-5 text-red-500 mx-2" />
          <span>for better financial management</span>
        </div>
        <p className="text-sm text-gray-500">
          © 2025 ExpenseTracer. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default About;