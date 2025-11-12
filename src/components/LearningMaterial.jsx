import React, { useState } from 'react';
import { X, Clock, CheckCircle, BookOpen } from 'lucide-react';

const LearningMaterial = ({ 
  learningMaterial, 
  onComplete, 
  onSkip,
  isVisible = true 
}) => {
  const [readingProgress, setReadingProgress] = useState(0);
  const [hasRead, setHasRead] = useState(false);

  if (!isVisible || !learningMaterial) {
    return null;
  }

  const handleReadingComplete = () => {
    setHasRead(true);
    setReadingProgress(100);
  };

  const handleContinue = () => {
    if (onComplete) {
      onComplete();
    }
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Learning Material
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Please read the following content before starting the quest
              </p>
            </div>
          </div>
          <button
            onClick={handleSkip}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Reading Info */}
          <div className="flex items-center justify-between mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-700 dark:text-blue-300">
                  Estimated reading time: {learningMaterial.readingTime}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${readingProgress}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {readingProgress}%
                </span>
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {learningMaterial.title}
          </h1>

          {/* Content */}
          <div 
            className="prose prose-lg max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ 
              __html: learningMaterial.content.replace(/\n/g, '<br/>').replace(/#{1,6}\s/g, (match) => {
                const level = match.trim().length;
                return `<h${level} class="text-${level === 1 ? '3xl' : level === 2 ? '2xl' : 'xl'} font-bold mt-6 mb-3">`;
              }).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>')
            }}
          />

          {/* Key Points */}
          {learningMaterial.keyPoints && learningMaterial.keyPoints.length > 0 && (
            <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-3">
                Key Learning Points
              </h3>
              <ul className="space-y-2">
                {learningMaterial.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <span className="text-yellow-700 dark:text-yellow-300">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSkip}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Skip Learning
            </button>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleReadingComplete}
              className={`px-4 py-2 rounded-lg transition-colors ${
                hasRead 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' 
                  : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50'
              }`}
            >
              {hasRead ? '✓ Read' : 'Mark as Read'}
            </button>
            <button
              onClick={handleContinue}
              disabled={!hasRead}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                hasRead
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400'
              }`}
            >
              Start Quest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningMaterial;
