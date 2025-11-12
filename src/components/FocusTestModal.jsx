import React, { useState, useEffect } from 'react';
import { X, Clock, Target, Brain, CheckCircle } from 'lucide-react';

const FocusTestModal = ({ isOpen, onClose, onComplete, subject = 'Italian' }) => {
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // 根据学科生成测试题目
  const generateQuestions = (subject) => {
    const questions = {
      italian: [
        {
          question: "What does 'Ciao' mean in Italian?",
          options: ["Hello", "Goodbye", "Thank you", "Please"],
          correct: 0
        },
        {
          question: "How do you say 'Good morning' in Italian?",
          options: ["Buonasera", "Buongiorno", "Buonanotte", "Arrivederci"],
          correct: 1
        },
        {
          question: "What is the Italian word for 'water'?",
          options: ["Acqua", "Pane", "Vino", "Caffè"],
          correct: 0
        }
      ],
      mathematics: [
        {
          question: "What is 15 + 27?",
          options: ["42", "41", "43", "40"],
          correct: 0
        },
        {
          question: "What is 8 × 7?",
          options: ["54", "56", "58", "60"],
          correct: 1
        },
        {
          question: "What is 144 ÷ 12?",
          options: ["11", "12", "13", "14"],
          correct: 1
        }
      ],
      philosophy: [
        {
          question: "Who wrote 'The Republic'?",
          options: ["Aristotle", "Plato", "Socrates", "Descartes"],
          correct: 1
        },
        {
          question: "What is the main principle of utilitarianism?",
          options: ["Greatest good for greatest number", "Individual rights", "Divine command", "Virtue ethics"],
          correct: 0
        },
        {
          question: "What does 'cogito ergo sum' mean?",
          options: ["I think therefore I am", "I see therefore I believe", "I know therefore I exist", "I feel therefore I am"],
          correct: 0
        }
      ],
      biology: [
        {
          question: "What is the powerhouse of the cell?",
          options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi apparatus"],
          correct: 1
        },
        {
          question: "What is the process by which plants make food?",
          options: ["Respiration", "Photosynthesis", "Digestion", "Fermentation"],
          correct: 1
        },
        {
          question: "What is the basic unit of heredity?",
          options: ["Chromosome", "Gene", "DNA", "Protein"],
          correct: 1
        }
      ]
    };

    return questions[subject.toLowerCase()] || questions.italian;
  };

  const questions = generateQuestions(subject);

  // 倒计时
  useEffect(() => {
    if (isOpen && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isCompleted) {
      handleComplete();
    }
  }, [isOpen, timeLeft]);

  // 重置状态
  useEffect(() => {
    if (isOpen) {
      setTimeLeft(30);
      setCurrentQuestion(0);
      setSelectedAnswer(null);
      setScore(0);
      setIsCompleted(false);
    }
  }, [isOpen]);

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === questions[currentQuestion].correct) {
      setScore(score + 1);
    }
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    setIsCompleted(true);
    setTimeout(() => {
      onComplete(score, questions.length);
      onClose();
    }, 2000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-xl">
              <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Focus Test
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {subject} - 30 seconds
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Timer */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Time Remaining
            </span>
            <span className={`text-lg font-bold ${
              timeLeft <= 10 ? 'text-red-500' : 'text-purple-600 dark:text-purple-400'
            }`}>
              {formatTime(timeLeft)}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-1000 ${
                timeLeft <= 10 ? 'bg-red-500' : 'bg-purple-500'
              }`}
              style={{ width: `${(timeLeft / 30) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        {!isCompleted ? (
          <div>
            {/* Progress */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Score: {score}/{currentQuestion}
              </span>
            </div>

            {/* Question */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {questions[currentQuestion].question}
              </h3>
              
              <div className="space-y-3">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full p-3 text-left rounded-xl border-2 transition-all ${
                      selectedAnswer === index
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Next Button */}
            <button
              onClick={handleNextQuestion}
              disabled={selectedAnswer === null}
              className={`w-full py-3 rounded-xl font-medium transition-colors ${
                selectedAnswer !== null
                  ? 'bg-purple-500 hover:bg-purple-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              }`}
            >
              {currentQuestion < questions.length - 1 ? 'Next Question' : 'Complete Test'}
            </button>
          </div>
        ) : (
          /* Completion Screen */
          <div className="text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Test Completed!
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                You scored {score} out of {questions.length}
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span className="font-medium text-gray-900 dark:text-white">
                  Focus Level: {score >= questions.length * 0.8 ? 'Excellent' : score >= questions.length * 0.6 ? 'Good' : 'Needs Improvement'}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {score >= questions.length * 0.8 
                  ? 'You\'re ready to focus! You can now access social media.'
                  : 'Consider taking a short break before using social media.'
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FocusTestModal;
