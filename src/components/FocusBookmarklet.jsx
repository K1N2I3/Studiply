import React, { useState } from 'react'
import { Bookmark, Copy, Check, ExternalLink, Shield, Smartphone, Globe } from 'lucide-react'

const FocusBookmarklet = () => {
  const [copied, setCopied] = useState(false)
  
  // 专门为Studiply设计的书签小工具代码
  const bookmarkletCode = `javascript:(function(){if(window.location.hostname.includes('instagram.com')||window.location.hostname.includes('facebook.com')||window.location.hostname.includes('tiktok.com')||window.location.hostname.includes('twitter.com')||window.location.hostname.includes('snapchat.com')||window.location.hostname.includes('youtube.com')||window.location.hostname.includes('netflix.com')||window.location.hostname.includes('reddit.com')||window.location.hostname.includes('discord.com')){window.location.href='https://studiply-kcpvhtz3e-ken-lins-projects-98d57120.vercel.app/focus';}})();`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(bookmarkletCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = bookmarkletCode
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      try {
        document.execCommand('copy')
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error('Failed to copy: ', err)
      }
      document.body.removeChild(textArea)
    }
  }

  const blockedSites = [
    { name: 'Instagram', icon: '📷', blocked: true },
    { name: 'Facebook', icon: '📘', blocked: true },
    { name: 'TikTok', icon: '🎵', blocked: true },
    { name: 'Twitter', icon: '🐦', blocked: true },
    { name: 'Snapchat', icon: '👻', blocked: true },
    { name: 'YouTube', icon: '📺', blocked: true },
    { name: 'Netflix', icon: '🎬', blocked: true },
    { name: 'Reddit', icon: '🤖', blocked: true },
    { name: 'Discord', icon: '💬', blocked: true }
  ]

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 p-6 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Bookmark className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Focus Bookmarklet</h2>
          </div>
          <p className="text-blue-100">Automatically redirect distracting sites to Focus Mode</p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* How it works */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-100">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center">
            <Shield className="w-5 h-5 text-blue-600 mr-2" />
            How it Works
          </h3>
          <div className="space-y-2 text-sm text-gray-700">
            <p>• Save this bookmarklet to your browser bookmarks</p>
            <p>• When you visit distracting sites, click the bookmark</p>
            <p>• Instantly redirect to Studiply Focus Mode</p>
            <p>• Stay focused on your studies!</p>
          </div>
        </div>

        {/* Blocked Sites */}
        <div>
          <h3 className="font-bold text-gray-900 mb-3">Protected Sites</h3>
          <div className="grid grid-cols-3 gap-2">
            {blockedSites.map((site) => (
              <div key={site.name} className={`flex items-center space-x-2 p-2 rounded-lg text-sm ${
                site.blocked 
                  ? 'bg-red-50 text-red-700 border border-red-200' 
                  : 'bg-green-50 text-green-700 border border-green-200'
              }`}>
                <span className="text-lg">{site.icon}</span>
                <span className="font-medium">{site.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bookmarklet Code */}
        <div>
          <h3 className="font-bold text-gray-900 mb-3 flex items-center">
            <Bookmark className="w-5 h-5 text-purple-600 mr-2" />
            Bookmarklet Code
          </h3>
          <div className="bg-gray-900 rounded-xl p-4 relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400 font-mono">Drag to bookmarks or copy</span>
              <button
                onClick={copyToClipboard}
                className="flex items-center space-x-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <div className="bg-gray-800 rounded-lg p-3 overflow-x-auto">
              <code className="text-green-400 text-xs font-mono break-all">
                {bookmarkletCode}
              </code>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center">
            <Smartphone className="w-5 h-5 text-green-600 mr-2" />
            Setup Instructions
          </h3>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</div>
              <p>Copy the bookmarklet code above</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</div>
              <p>Create a new bookmark in your browser</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</div>
              <p>Paste the code as the bookmark URL</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</div>
              <p>Name it "Focus Redirect" or similar</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">5</div>
              <p>Click the bookmark when on distracting sites!</p>
            </div>
          </div>
        </div>

        {/* Test Button */}
        <div className="text-center">
          <a
            href={bookmarkletCode}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Test Bookmarklet</span>
          </a>
          <p className="text-xs text-gray-500 mt-2">Click to test the redirect (will work on social media sites)</p>
        </div>
      </div>
    </div>
  )
}

export default FocusBookmarklet
