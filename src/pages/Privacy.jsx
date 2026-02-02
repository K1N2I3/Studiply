import React from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { Shield, Lock, Eye, FileText, Mail, ArrowLeft } from 'lucide-react'

const Privacy = () => {
  const { isDark } = useTheme()

  return (
    <div
      className={`min-h-screen ${
        isDark
          ? 'bg-gradient-to-br from-[#08051a] via-[#120b2c] to-[#1c1142] text-white'
          : 'bg-gradient-to-br from-[#f4f2ff] via-[#f9f0ff] to-[#ffe9f5] text-slate-900'
      }`}
      style={{ paddingTop: '80px' }}
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className={`inline-flex items-center gap-2 mb-4 text-sm font-medium transition hover:opacity-80 ${
              isDark ? 'text-purple-300' : 'text-purple-600'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-3 rounded-xl ${
              isDark ? 'bg-purple-500/20' : 'bg-purple-100'
            }`}>
              <Shield className={`w-6 h-6 ${
                isDark ? 'text-purple-300' : 'text-purple-600'
              }`} />
            </div>
            <h1 className="text-4xl font-bold">Privacy Policy</h1>
          </div>
          <p className={`text-sm ${
            isDark ? 'text-white/70' : 'text-slate-600'
          }`}>
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Content */}
        <div className={`rounded-2xl p-8 ${
          isDark ? 'bg-white/5 border border-white/10' : 'bg-white border border-slate-200'
        } shadow-xl`}>
          <div className="prose prose-lg max-w-none">
            {/* Introduction */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                1. Introduction
              </h2>
              <p className={`mb-4 leading-relaxed ${
                isDark ? 'text-white/90' : 'text-slate-700'
              }`}>
                Welcome to Studiply ("we," "our," or "us"). We are committed to protecting your privacy and ensuring you have a positive experience on our platform. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our educational platform and services.
              </p>
              <p className={`leading-relaxed ${
                isDark ? 'text-white/90' : 'text-slate-700'
              }`}>
                By using Studiply, you agree to the collection and use of information in accordance with this policy.
              </p>
            </section>

            {/* Information We Collect */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                2. Information We Collect
              </h2>
              <h3 className="text-xl font-semibold mb-3 mt-4">2.1 Personal Information</h3>
              <p className={`mb-3 leading-relaxed ${
                isDark ? 'text-white/90' : 'text-slate-700'
              }`}>
                We collect information that you provide directly to us, including:
              </p>
              <ul className={`list-disc pl-6 mb-4 space-y-2 ${
                isDark ? 'text-white/90' : 'text-slate-700'
              }`}>
                <li>Name and email address</li>
                <li>School and grade level information</li>
                <li>Phone number (optional)</li>
                <li>Profile information and preferences</li>
                <li>Payment information (processed securely through third-party providers)</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-4">2.2 Usage Data</h3>
              <p className={`mb-3 leading-relaxed ${
                isDark ? 'text-white/90' : 'text-slate-700'
              }`}>
                We automatically collect certain information when you use our services:
              </p>
              <ul className={`list-disc pl-6 mb-4 space-y-2 ${
                isDark ? 'text-white/90' : 'text-slate-700'
              }`}>
                <li>Device information and browser type</li>
                <li>IP address and location data</li>
                <li>Usage patterns and interaction with our platform</li>
                <li>Learning progress and achievements</li>
              </ul>
            </section>

            {/* How We Use Your Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5" />
                3. How We Use Your Information
              </h2>
              <p className={`mb-3 leading-relaxed ${
                isDark ? 'text-white/90' : 'text-slate-700'
              }`}>
                We use the collected information for various purposes:
              </p>
              <ul className={`list-disc pl-6 mb-4 space-y-2 ${
                isDark ? 'text-white/90' : 'text-slate-700'
              }`}>
                <li>To provide, maintain, and improve our educational services</li>
                <li>To personalize your learning experience</li>
                <li>To process transactions and send related information</li>
                <li>To send you notifications, updates, and educational content</li>
                <li>To monitor and analyze usage patterns to enhance our platform</li>
                <li>To detect, prevent, and address technical issues and security threats</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            {/* Data Security */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                4. Data Security
              </h2>
              <p className={`mb-3 leading-relaxed ${
                isDark ? 'text-white/90' : 'text-slate-700'
              }`}>
                We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your data, we cannot guarantee absolute security.
              </p>
            </section>

            {/* Third-Party Services */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">5. Third-Party Services</h2>
              <p className={`mb-3 leading-relaxed ${
                isDark ? 'text-white/90' : 'text-slate-700'
              }`}>
                Our platform may integrate with third-party services, including:
              </p>
              <ul className={`list-disc pl-6 mb-4 space-y-2 ${
                isDark ? 'text-white/90' : 'text-slate-700'
              }`}>
                <li>Firebase (authentication and data storage)</li>
                <li>Payment processors (Stripe, etc.)</li>
                <li>Email service providers</li>
                <li>Analytics services</li>
              </ul>
              <p className={`leading-relaxed ${
                isDark ? 'text-white/90' : 'text-slate-700'
              }`}>
                These third-party services have their own privacy policies. We encourage you to review their privacy policies to understand how they handle your information.
              </p>
            </section>

            {/* Your Rights */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">6. Your Rights</h2>
              <p className={`mb-3 leading-relaxed ${
                isDark ? 'text-white/90' : 'text-slate-700'
              }`}>
                You have the right to:
              </p>
              <ul className={`list-disc pl-6 mb-4 space-y-2 ${
                isDark ? 'text-white/90' : 'text-slate-700'
              }`}>
                <li>Access and receive a copy of your personal data</li>
                <li>Rectify inaccurate or incomplete information</li>
                <li>Request deletion of your personal data</li>
                <li>Object to processing of your personal data</li>
                <li>Request restriction of processing</li>
                <li>Data portability</li>
              </ul>
              <p className={`leading-relaxed ${
                isDark ? 'text-white/90' : 'text-slate-700'
              }`}>
                To exercise these rights, please contact us using the information provided below.
              </p>
            </section>

            {/* Children's Privacy */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">7. Children's Privacy</h2>
              <p className={`mb-3 leading-relaxed ${
                isDark ? 'text-white/90' : 'text-slate-700'
              }`}>
                Our services are designed for educational purposes and may be used by students under the age of 18. We take special care to protect the privacy of young users. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
              </p>
            </section>

            {/* Changes to This Policy */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">8. Changes to This Privacy Policy</h2>
              <p className={`leading-relaxed ${
                isDark ? 'text-white/90' : 'text-slate-700'
              }`}>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
              </p>
            </section>

            {/* Contact Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5" />
                9. Contact Us
              </h2>
              <p className={`mb-3 leading-relaxed ${
                isDark ? 'text-white/90' : 'text-slate-700'
              }`}>
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className={`p-4 rounded-lg ${
                isDark ? 'bg-white/5 border border-white/10' : 'bg-slate-50 border border-slate-200'
              }`}>
                <p className={`font-semibold mb-2 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>Studiply</p>
                <p className={`${
                  isDark ? 'text-white/80' : 'text-slate-700'
                }`}>
                  Email: <a 
                    href="mailto:studiply.email@gmail.com" 
                    className={`underline hover:opacity-80 ${
                      isDark ? 'text-purple-300' : 'text-purple-600'
                    }`}
                  >
                    studiply.email@gmail.com
                  </a>
                </p>
                <p className={`mt-2 ${
                  isDark ? 'text-white/80' : 'text-slate-700'
                }`}>
                  Website: <a 
                    href="https://studiply.it" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`underline hover:opacity-80 ${
                      isDark ? 'text-purple-300' : 'text-purple-600'
                    }`}
                  >
                    https://studiply.it
                  </a>
                </p>
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className={`text-sm ${
            isDark ? 'text-white/60' : 'text-slate-500'
          }`}>
            © {new Date().getFullYear()} Studiply. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Privacy
