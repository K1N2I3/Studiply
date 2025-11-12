import React, { useState } from 'react'
import { Download, Chrome, Shield, CheckCircle, AlertTriangle, ExternalLink, ArrowLeft } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useNavigate } from 'react-router-dom'

const ExtensionDownload = () => {
  const { isDark } = useTheme()
  const navigate = useNavigate()
  const [downloadStep, setDownloadStep] = useState(0)

    const handleDownloadWithIcons = () => {
    const link = document.createElement('a')
    link.href = '/studiply-focus-extension-fixed.zip'
    link.download = 'studiply-focus-extension-fixed.zip'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    setDownloadStep(1)
  }


  const installationSteps = [
    {
      step: 1,
      title: "Download Extension",
      description: "Click the download button to get the Studiply Focus Mode extension",
      icon: Download,
      completed: downloadStep >= 1
    },
    {
      step: 2,
      title: "Extract Files",
      description: "Extract the downloaded ZIP file to a folder on your computer",
      icon: Chrome,
      completed: downloadStep >= 2
    },
    {
      step: 3,
      title: "Install in Chrome",
      description: "Open Chrome Extensions page and enable Developer mode",
      icon: Shield,
      completed: downloadStep >= 3,
      copyText: "chrome://extensions/"
    },
    {
      step: 4,
      title: "Load Extension",
      description: "Click 'Load unpacked' and select the extracted folder",
      icon: CheckCircle,
      completed: downloadStep >= 4
    }
  ]

  return (
    <div className={`min-h-screen relative overflow-hidden ${
      isDark
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'
        : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
    }`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {isDark ? (
          <>
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute top-40 left-40 w-60 h-60 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-40 h-40 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          </>
        ) : (
          <>
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full filter blur-xl opacity-40 animate-pulse shadow-2xl shadow-purple-300/50"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full filter blur-xl opacity-40 animate-pulse shadow-2xl shadow-blue-300/50"></div>
            <div className="absolute top-40 left-40 w-60 h-60 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full filter blur-xl opacity-40 animate-pulse shadow-2xl shadow-pink-300/50"></div>
            <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-full filter blur-xl opacity-40 animate-pulse shadow-2xl shadow-cyan-300/50"></div>
          </>
        )}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Back Button */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/focus-mode')}
            className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
              isDark
                ? 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                : 'bg-white/80 text-gray-700 hover:bg-white border border-gray-200'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Focus Mode</span>
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="group relative inline-block">
            <div className={`absolute inset-0 rounded-3xl blur-xl transition-all duration-500 group-hover:blur-2xl ${
              isDark
                ? 'bg-gradient-to-r from-purple-500/30 to-blue-500/30 shadow-2xl shadow-purple-500/20'
                : 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 shadow-2xl shadow-purple-300/30'
            }`}></div>
            <div className={`relative backdrop-blur-sm rounded-3xl shadow-2xl border overflow-hidden transition-all duration-300 group-hover:scale-105 ${
              isDark
                ? 'bg-white/10 border-white/20 group-hover:border-purple-400/50'
                : 'bg-white/90 border-white/20 group-hover:border-purple-200/50'
            }`}>
              <div className="p-8">
                <div className="flex items-center justify-center mb-4">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                    isDark
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500'
                      : 'bg-gradient-to-r from-purple-600 to-blue-600'
                  }`}>
                    <Chrome className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h1 className={`text-4xl font-bold mb-4 ${
                  isDark
                    ? 'bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent'
                    : 'bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent drop-shadow-lg'
                }`}>
                  Studiply Focus Mode Extension
                </h1>
                <p className={`text-lg ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Block distracting websites during your focus sessions
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="group relative">
            <div className={`absolute inset-0 rounded-2xl blur-lg transition-all duration-500 group-hover:blur-xl ${
              isDark
                ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 shadow-2xl shadow-green-500/10'
                : 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 shadow-2xl shadow-green-300/20'
            }`}></div>
            <div className={`relative backdrop-blur-sm rounded-2xl shadow-xl border transition-all duration-300 group-hover:scale-105 ${
              isDark
                ? 'bg-white/10 border-white/20 group-hover:border-green-400/50'
                : 'bg-white/90 border-white/20 group-hover:border-green-200/50'
            }`}>
              <div className="p-6 text-center">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 ${
                  isDark
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                    : 'bg-gradient-to-r from-green-600 to-emerald-600'
                }`}>
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className={`text-xl font-bold mb-2 ${
                  isDark ? 'text-white' : 'text-gray-800'
                }`}>
                  Website Blocking
                </h3>
                <p className={`text-sm ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Automatically block distracting websites during focus sessions
                </p>
              </div>
            </div>
          </div>

          <div className="group relative">
            <div className={`absolute inset-0 rounded-2xl blur-lg transition-all duration-500 group-hover:blur-xl ${
              isDark
                ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 shadow-2xl shadow-blue-500/10'
                : 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10 shadow-2xl shadow-blue-300/20'
            }`}></div>
            <div className={`relative backdrop-blur-sm rounded-2xl shadow-xl border transition-all duration-300 group-hover:scale-105 ${
              isDark
                ? 'bg-white/10 border-white/20 group-hover:border-blue-400/50'
                : 'bg-white/90 border-white/20 group-hover:border-blue-200/50'
            }`}>
              <div className="p-6 text-center">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 ${
                  isDark
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                    : 'bg-gradient-to-r from-blue-600 to-cyan-600'
                }`}>
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className={`text-xl font-bold mb-2 ${
                  isDark ? 'text-white' : 'text-gray-800'
                }`}>
                  Easy Setup
                </h3>
                <p className={`text-sm ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Simple one-click installation process
                </p>
              </div>
            </div>
          </div>

          <div className="group relative">
            <div className={`absolute inset-0 rounded-2xl blur-lg transition-all duration-500 group-hover:blur-xl ${
              isDark
                ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 shadow-2xl shadow-purple-500/10'
                : 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 shadow-2xl shadow-purple-300/20'
            }`}></div>
            <div className={`relative backdrop-blur-sm rounded-2xl shadow-xl border transition-all duration-300 group-hover:scale-105 ${
              isDark
                ? 'bg-white/10 border-white/20 group-hover:border-purple-400/50'
                : 'bg-white/90 border-white/20 group-hover:border-purple-200/50'
            }`}>
              <div className="p-6 text-center">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 ${
                  isDark
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600'
                }`}>
                  <ExternalLink className="w-6 h-6 text-white" />
                </div>
                <h3 className={`text-xl font-bold mb-2 ${
                  isDark ? 'text-white' : 'text-gray-800'
                }`}>
                  Seamless Integration
                </h3>
                <p className={`text-sm ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Works automatically with Studiply focus sessions
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Download Section */}
        <div className="max-w-2xl mx-auto">
          <div className="group relative">
            <div className={`absolute inset-0 rounded-3xl blur-xl transition-all duration-500 group-hover:blur-2xl ${
              isDark
                ? 'bg-gradient-to-r from-orange-500/30 to-red-500/30 shadow-2xl shadow-orange-500/20'
                : 'bg-gradient-to-r from-orange-500/20 to-red-500/20 shadow-2xl shadow-orange-300/30'
            }`}></div>
            <div className={`relative backdrop-blur-sm rounded-3xl shadow-2xl border transition-all duration-300 group-hover:scale-105 ${
              isDark
                ? 'bg-white/10 border-white/20 group-hover:border-orange-400/50'
                : 'bg-white/90 border-white/20 group-hover:border-orange-200/50'
            }`}>
              <div className="p-8 text-center">
                <h2 className={`text-2xl font-bold mb-4 ${
                  isDark ? 'text-white' : 'text-gray-800'
                }`}>
                  Download Extension
                </h2>
                <p className={`text-lg mb-6 ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Download the Studiply Focus Mode extension to block distracting websites during your focus sessions
                </p>
                
                <div className="flex justify-center">
                  <button
                    onClick={handleDownloadWithIcons}
                    className={`inline-flex items-center space-x-3 px-8 py-4 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105 ${
                      isDark
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl shadow-blue-300/30 hover:shadow-blue-300/50'
                    }`}
                  >
                    <Download className="w-7 h-7" />
                    <span>Download Extension</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Installation Instructions */}
          <div className="mt-8 space-y-4">
            {installationSteps.map((step, index) => {
              const IconComponent = step.icon
              return (
                <div key={step.step} className="group relative">
                  <div className={`absolute inset-0 rounded-2xl blur-lg transition-all duration-500 ${
                    isDark
                      ? 'bg-gradient-to-r from-gray-500/10 to-slate-500/10'
                      : 'bg-gradient-to-r from-gray-500/5 to-slate-500/5'
                  }`}></div>
                  <div className={`relative backdrop-blur-sm rounded-2xl shadow-xl border transition-all duration-300 ${
                    isDark
                      ? 'bg-white/10 border-white/20'
                      : 'bg-white/90 border-white/20'
                  }`}>
                    <div className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          step.completed
                            ? isDark
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                              : 'bg-gradient-to-r from-green-600 to-emerald-600'
                            : isDark
                              ? 'bg-gradient-to-r from-gray-500 to-slate-500'
                              : 'bg-gradient-to-r from-gray-400 to-slate-400'
                        }`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className={`text-lg font-bold ${
                            isDark ? 'text-white' : 'text-gray-800'
                          }`}>
                            Step {step.step}: {step.title}
                          </h3>
                          <p className={`text-sm ${
                            isDark ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            {step.description}
                            {step.copyText && (
                              <div className="mt-2">
                                <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-lg text-xs font-mono ${
                                  isDark 
                                    ? 'bg-gray-800 text-gray-300 border border-gray-600' 
                                    : 'bg-gray-100 text-gray-700 border border-gray-300'
                                }`}>
                                  <span>{step.copyText}</span>
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(step.copyText)
                                      // 可以添加一个简单的提示
                                    }}
                                    className={`ml-2 px-2 py-1 rounded text-xs transition-colors duration-200 ${
                                      isDark 
                                        ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                                    }`}
                                  >
                                    Copy
                                  </button>
                                </div>
                              </div>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
            
            <div className="group relative">
              <div className={`absolute inset-0 rounded-2xl blur-lg transition-all duration-500 ${
                isDark
                  ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 shadow-2xl shadow-yellow-500/10'
                  : 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 shadow-2xl shadow-yellow-300/20'
              }`}></div>
              <div className={`relative backdrop-blur-sm rounded-2xl shadow-xl border transition-all duration-300 ${
                isDark
                  ? 'bg-white/10 border-white/20'
                  : 'bg-white/90 border-white/20'
              }`}>
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isDark
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                        : 'bg-gradient-to-r from-yellow-600 to-orange-600'
                    }`}>
                      <AlertTriangle className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-lg font-bold mb-2 ${
                        isDark ? 'text-white' : 'text-gray-800'
                      }`}>
                        Important Notes
                      </h3>
                      <ul className={`text-sm space-y-1 ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        <li>• The extension only works on Chrome/Chromium browsers</li>
                        <li>• You need to enable Developer mode in Chrome Extensions</li>
                        <li>• The extension will only block websites during active focus sessions</li>
                        <li>• All data is stored locally on your device</li>
                        <li>• <strong>Coming Soon:</strong> Chrome Web Store version for easy installation!</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExtensionDownload
