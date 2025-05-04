import ChatWidget from './ChatWidget'
import { useState } from 'react'

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-[#00a0d2]">WebMD</span>
                  <span className="mx-2 text-gray-300">|</span>
                  <span className="text-2xl font-bold text-[#00a0d2]">AI Assistant</span>
                </div>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-[#00a0d2]">Conditions</a>
              <a href="#" className="text-gray-700 hover:text-[#00a0d2]">Drugs & Supplements</a>
              <a href="#" className="text-gray-700 hover:text-[#00a0d2]">Well-Being</a>
              <a href="#" className="text-gray-700 hover:text-[#00a0d2]">Symptom Checker</a>
              <a href="#" className="text-gray-700 hover:text-[#00a0d2]">Find a Doctor</a>
            </nav>
            <div className="md:hidden">
              <button
                onClick={() => setIsChatOpen(!isChatOpen)}
                className="text-gray-700 hover:text-[#00a0d2]"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a href="#" className="block px-3 py-2 text-gray-700 hover:text-[#00a0d2]">Conditions</a>
            <a href="#" className="block px-3 py-2 text-gray-700 hover:text-[#00a0d2]">Drugs & Supplements</a>
            <a href="#" className="block px-3 py-2 text-gray-700 hover:text-[#00a0d2]">Well-Being</a>
            <a href="#" className="block px-3 py-2 text-gray-700 hover:text-[#00a0d2]">Symptom Checker</a>
            <a href="#" className="block px-3 py-2 text-gray-700 hover:text-[#00a0d2]">Find a Doctor</a>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#00a0d2] to-[#0078a8] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">Your Health Questions Answered</h2>
            <p className="text-xl mb-8">Get instant answers to your health-related questions with WebMD's AI-powered chat assistant</p>
            <button 
              onClick={() => setIsChatOpen(true)}
              className="bg-white text-[#00a0d2] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Chat
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Health Topics */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4 text-[#00a0d2]">Health Topics</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-700 hover:text-[#00a0d2]">Heart Health</a></li>
              <li><a href="#" className="text-gray-700 hover:text-[#00a0d2]">Mental Health</a></li>
              <li><a href="#" className="text-gray-700 hover:text-[#00a0d2]">Diabetes</a></li>
              <li><a href="#" className="text-gray-700 hover:text-[#00a0d2]">Cancer</a></li>
              <li><a href="#" className="text-gray-700 hover:text-[#00a0d2]">Allergies</a></li>
            </ul>
          </div>

          {/* Latest Articles */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4 text-[#00a0d2]">Latest Articles</h3>
            <div className="space-y-4">
              <article>
                <h4 className="font-medium text-gray-900">Understanding Your Symptoms</h4>
                <p className="text-sm text-gray-600">Learn how to identify and manage common health symptoms</p>
              </article>
              <article>
                <h4 className="font-medium text-gray-900">Healthy Living Tips</h4>
                <p className="text-sm text-gray-600">Simple changes for a healthier lifestyle</p>
              </article>
            </div>
          </div>

          {/* Tools & Resources */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4 text-[#00a0d2]">Tools & Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-700 hover:text-[#00a0d2]">Symptom Checker</a></li>
              <li><a href="#" className="text-gray-700 hover:text-[#00a0d2]">Drug Interaction Checker</a></li>
              <li><a href="#" className="text-gray-700 hover:text-[#00a0d2]">BMI Calculator</a></li>
              <li><a href="#" className="text-gray-700 hover:text-[#00a0d2]">Find a Doctor</a></li>
            </ul>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-semibold mb-4 text-[#00a0d2]">About Us</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-[#00a0d2]">Our Mission</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#00a0d2]">Editorial Policy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#00a0d2]">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-[#00a0d2]">Health Topics</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-[#00a0d2]">Conditions</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#00a0d2]">Drugs & Supplements</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#00a0d2]">Well-Being</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-[#00a0d2]">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-[#00a0d2]">News</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#00a0d2]">Blogs</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#00a0d2]">Webinars</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-[#00a0d2]">Contact</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-[#00a0d2]">Support</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#00a0d2]">Feedback</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#00a0d2]">Careers</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-600">
            <p>© 2024 WebMD LLC. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Chat Widget */}
      <ChatWidget isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
    </div>
  )
}

export default App 