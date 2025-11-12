import React, { useState } from 'react'
import { X, Globe, Check } from 'lucide-react'
import { getAvailableLanguages } from '../data/languageContent'

const LanguageSelectionModal = ({ isOpen, onClose, onLanguageSelect, selectedLanguage }) => {
  const [tempSelection, setTempSelection] = useState(selectedLanguage)
  const languages = getAvailableLanguages()

  const handleConfirm = () => {
    if (tempSelection) {
      onLanguageSelect(tempSelection)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col border border-gray-100">
        {/* Header - Fixed */}
        <div className="flex-shrink-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 p-8 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center shadow-lg">
                <Globe className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Choose Your Language</h2>
                <p className="text-gray-600 text-lg">Select the language you want to learn</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-8">
          {/* Language Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
            {languages.map((language) => (
              <button
                key={language.id}
                onClick={() => setTempSelection(language.id)}
                className={`group p-6 rounded-3xl border-2 transition-all duration-300 hover:scale-105 hover:-translate-y-1 relative overflow-hidden ${
                  tempSelection === language.id
                    ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-xl shadow-indigo-200/50'
                    : 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow-lg'
                }`}
              >
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-indigo-100/30 to-purple-100/30 rounded-full -translate-y-8 translate-x-8"></div>
                
                <div className="text-center relative z-10">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">{language.flag}</div>
                  <div className="text-lg font-bold text-gray-900 mb-2">
                    {language.name}
                  </div>
                  <div className="text-sm text-gray-600 mb-3">
                    {language.nativeName}
                  </div>
                  {tempSelection === language.id && (
                    <div className="flex justify-center">
                      <div className="p-2 bg-indigo-100 rounded-full">
                        <Check className="w-5 h-5 text-indigo-600" />
                      </div>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Selected Language Info */}
          {tempSelection && (
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 mb-8 border border-indigo-200 shadow-lg">
              <h3 className="font-bold text-indigo-900 mb-4 text-xl">Selected Language</h3>
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-4xl">
                  {languages.find(l => l.id === tempSelection)?.flag}
                </span>
                <div>
                  <div className="font-bold text-indigo-800 text-xl">
                    {languages.find(l => l.id === tempSelection)?.name}
                  </div>
                  <div className="text-lg text-indigo-600">
                    {languages.find(l => l.id === tempSelection)?.nativeName}
                  </div>
                </div>
              </div>
              <p className="text-indigo-700 leading-relaxed">
                You'll practice conversations, grammar, and vocabulary in this language through interactive scenarios and exercises.
              </p>
            </div>
          )}

        </div>

        {/* Footer - Fixed */}
        <div className="flex-shrink-0 border-t border-gray-200 p-8 bg-white/95 backdrop-blur-sm rounded-b-3xl">
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-8 py-4 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!tempSelection}
              className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl hover:from-indigo-600 hover:to-purple-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
            >
              Confirm Selection
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LanguageSelectionModal
