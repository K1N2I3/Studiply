import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  const features = [
    {
      title: 'Peer Tutoring',
      description: 'Connect with fellow students for personalized help and collaborative learning',
      icon: '👥',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Focus Mode',
      description: 'Block distracting apps and websites to maintain concentration during study sessions',
      icon: '🛡️',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Study Missions',
      description: 'Complete daily challenges and earn rewards to stay motivated and track progress',
      icon: '🎯',
      color: 'from-purple-500 to-purple-600'
    }
  ]

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-12 bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-gray-200 mb-8">
            <span className="text-sm font-medium text-gray-600">🎓 A platform for students to learn together</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Learn Together,
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {' '}Achieve More
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Connect with fellow students for peer tutoring, use focus tools to stay concentrated, 
            and complete study missions to track your progress.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary text-lg px-8 py-4">
              Start Learning Today
            </Link>
            <Link to="/tutoring" className="btn-secondary text-lg px-8 py-4">
              Explore Tutors
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful tools designed to help you learn more effectively and achieve your academic goals
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card-elevated group">
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">{feature.title}</h3>
                <p className="text-gray-600 text-center leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How Studiply Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in three simple steps and begin your learning journey today
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-blue-200 to-transparent"></div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Sign Up</h3>
              <p className="text-gray-600 leading-relaxed">Create your free account and set up your profile in minutes</p>
            </div>
            
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-green-200 to-transparent"></div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Connect & Learn</h3>
              <p className="text-gray-600 leading-relaxed">Find tutors, join study groups, or get help with your homework</p>
            </div>
            
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Achieve Goals</h3>
              <p className="text-gray-600 leading-relaxed">Track your progress and unlock achievements as you learn</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Create your account and start connecting with other students for collaborative learning
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="bg-white text-blue-600 hover:bg-gray-50 font-semibold py-4 px-8 rounded-lg text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Get Started Free
            </Link>
            <Link 
              to="/tutoring" 
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-200"
            >
              Browse Tutors
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
