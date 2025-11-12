import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  where,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore'
import { db } from '../firebase/config'
import { getLanguageContent } from '../data/languageContent'

// Daily Language Practice - Casual Learning Structure
export const skillTreeData = {
  language: {
    id: 'language',
    name: 'Language',
    icon: 'BookOpen',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'from-blue-50 to-cyan-50',
    description: 'Learn languages through casual daily practice with vocabulary and basic grammar',
    hasLanguageSelection: true,
    availableLanguages: [
      { id: 'spanish', name: 'Spanish', flag: '🇪🇸', nativeName: 'Español' },
      { id: 'french', name: 'French', flag: '🇫🇷', nativeName: 'Français' },
      { id: 'german', name: 'German', flag: '🇩🇪', nativeName: 'Deutsch' },
      { id: 'italian', name: 'Italian', flag: '🇮🇹', nativeName: 'Italiano' },
      { id: 'japanese', name: 'Japanese', flag: '🇯🇵', nativeName: '日本語' },
      { id: 'korean', name: 'Korean', flag: '🇰🇷', nativeName: '한국어' },
      { id: 'chinese', name: 'Chinese', flag: '🇨🇳', nativeName: '中文' }
    ],
    units: [
      {
        id: 'week1',
        title: 'Week 1: Essential Daily Words',
        description: 'Words you use every day - greetings, common objects',
        icon: '🌱',
        color: 'green',
        lessons: [
          {
            id: 'daily_greetings',
            title: 'Daily Greetings',
            description: 'Good morning, hello, how are you',
            icon: '👋',
            difficulty: 'beginner',
            xpReward: 15,
            lessons: [
              {
                id: 'greetings_basic',
                title: 'Basic Greetings',
                type: 'vocabulary',
                content: {
                  exercises: [
                    { type: 'translate', question: 'Good morning', answer: 'Buenos días', options: ['Buenos días', 'Buenas tardes', 'Buenas noches', 'Hola'] },
                    { type: 'translate', question: 'How are you?', answer: '¿Cómo estás?', options: ['¿Cómo estás?', '¿Qué tal?', '¿Cómo te va?', 'Bien, gracias'] },
                    { type: 'translate', question: 'I\'m fine, thank you', answer: 'Bien, gracias', options: ['Bien, gracias', 'Muy bien', 'Regular', 'Mal'] }
                  ]
                }
              }
            ]
          },
          {
            id: 'common_objects',
            title: 'Common Objects',
            description: 'Water, food, house, car - everyday items',
            icon: '🏠',
            difficulty: 'beginner',
            xpReward: 15,
            lessons: [
              {
                id: 'objects_basic',
                title: 'Basic Objects',
                type: 'vocabulary',
                content: {
                  exercises: [
                    { type: 'translate', question: 'Water', answer: 'Agua', options: ['Agua', 'Comida', 'Casa', 'Coche'] },
                    { type: 'translate', question: 'Food', answer: 'Comida', options: ['Agua', 'Comida', 'Casa', 'Coche'] },
                    { type: 'translate', question: 'House', answer: 'Casa', options: ['Agua', 'Comida', 'Casa', 'Coche'] }
                  ]
                }
              }
            ]
          }
        ]
      },
      {
        id: 'week2',
        title: 'Week 2: Basic Grammar',
        description: 'Essential grammar for daily use - verbs, numbers',
        icon: '📚',
        color: 'blue',
        lessons: [
          {
            id: 'basic_verbs',
            title: 'Essential Verbs',
            description: 'I am, you are, I have, I want',
            icon: '🔤',
            difficulty: 'beginner',
            xpReward: 20,
            lessons: [
              {
                id: 'verbs_basic',
                title: 'Basic Verbs',
                type: 'grammar',
                content: {
                  exercises: [
                    { type: 'translate', question: 'I am', answer: 'Yo soy', options: ['Yo soy', 'Tú eres', 'Él es', 'Nosotros somos'] },
                    { type: 'translate', question: 'You are', answer: 'Tú eres', options: ['Yo soy', 'Tú eres', 'Él es', 'Nosotros somos'] },
                    { type: 'translate', question: 'I have', answer: 'Yo tengo', options: ['Yo tengo', 'Tú tienes', 'Él tiene', 'Nosotros tenemos'] }
                  ]
                }
              }
            ]
          },
          {
            id: 'numbers',
            title: 'Numbers 1-20',
            description: 'Learn to count from one to twenty',
            icon: '🔢',
            difficulty: 'beginner',
            xpReward: 15,
            lessons: [
              {
                id: 'numbers_basic',
                title: 'Basic Numbers',
                type: 'vocabulary',
                content: {
                  exercises: [
                    { type: 'translate', question: 'One', answer: 'Uno', options: ['Uno', 'Dos', 'Tres', 'Cuatro'] },
                    { type: 'translate', question: 'Five', answer: 'Cinco', options: ['Cinco', 'Seis', 'Siete', 'Ocho'] },
                    { type: 'translate', question: 'Ten', answer: 'Diez', options: ['Diez', 'Once', 'Doce', 'Trece'] }
                  ]
                }
              }
            ]
          }
        ]
      },
      {
        id: 'week3',
        title: 'Week 3: Daily Conversations',
        description: 'Common phrases for daily life - shopping, directions',
        icon: '💬',
        color: 'purple',
        lessons: [
          {
            id: 'shopping',
            title: 'Shopping',
            description: 'How much does it cost? I would like to buy...',
            icon: '🛒',
            difficulty: 'intermediate',
            xpReward: 25,
            lessons: [
              {
                id: 'shopping_basic',
                title: 'Shopping Phrases',
                type: 'conversation',
                content: {
                  exercises: [
                    { type: 'translate', question: 'How much does it cost?', answer: '¿Cuánto cuesta?', options: ['¿Cuánto cuesta?', '¿Dónde está?', '¿Qué hora es?', '¿Cómo se dice?'] },
                    { type: 'translate', question: 'I would like to buy...', answer: 'Me gustaría comprar...', options: ['Me gustaría comprar...', '¿Tiene...?', 'Es muy caro', 'Es barato'] }
                  ]
                }
              }
            ]
          },
          {
            id: 'directions',
            title: 'Asking for Directions',
            description: 'Where is...? How do I get to...?',
            icon: '🗺️',
            difficulty: 'intermediate',
            xpReward: 25,
            lessons: [
              {
                id: 'directions_basic',
                title: 'Direction Phrases',
                type: 'conversation',
                content: {
                  exercises: [
                    { type: 'translate', question: 'Where is...?', answer: '¿Dónde está...?', options: ['¿Dónde está...?', '¿Cómo llego a...?', '¿Está lejos?', '¿Está cerca?'] },
                    { type: 'translate', question: 'How do I get to...?', answer: '¿Cómo llego a...?', options: ['¿Cómo llego a...?', '¿Dónde está...?', '¿Está lejos?', '¿Está cerca?'] }
                  ]
                }
              }
            ]
          }
        ]
      },
      {
        id: 'week4',
        title: 'Week 4: Food & Dining',
        description: 'Essential food vocabulary and restaurant phrases',
        icon: '🍽️',
        color: 'orange',
        lessons: [
          {
            id: 'food_vocabulary',
            title: 'Food Vocabulary',
            description: 'Bread, rice, meat, vegetables',
            icon: '🍞',
            difficulty: 'beginner',
            xpReward: 20,
            lessons: [
              {
                id: 'food_basic',
                title: 'Basic Food Words',
                type: 'vocabulary',
                content: {
                  exercises: [
                    { type: 'translate', question: 'Bread', answer: 'Pan', options: ['Pan', 'Arroz', 'Pasta', 'Carne'] },
                    { type: 'translate', question: 'Rice', answer: 'Arroz', options: ['Pan', 'Arroz', 'Pasta', 'Carne'] },
                    { type: 'translate', question: 'Meat', answer: 'Carne', options: ['Pan', 'Arroz', 'Pasta', 'Carne'] }
                  ]
                }
              }
            ]
          },
          {
            id: 'restaurant',
            title: 'At the Restaurant',
            description: 'I would like to order... What do you recommend?',
            icon: '🍕',
            difficulty: 'intermediate',
            xpReward: 25,
            lessons: [
              {
                id: 'restaurant_basic',
                title: 'Restaurant Phrases',
                type: 'conversation',
                content: {
                  exercises: [
                    { type: 'translate', question: 'I would like to order...', answer: 'Me gustaría pedir...', options: ['Me gustaría pedir...', '¿Qué recomienda?', 'La cuenta, por favor', '¿Tiene...?'] },
                    { type: 'translate', question: 'What do you recommend?', answer: '¿Qué recomienda?', options: ['¿Qué recomienda?', 'Me gustaría pedir...', 'La cuenta, por favor', '¿Tiene...?'] }
                  ]
                }
              }
            ]
          }
        ]
      }
    ],
    // 保留旧的scenarios结构以兼容现有代码
    scenarios: [
      {
        id: 'conversation',
        name: 'Daily Conversation',
        level: 1,
        description: 'Practice everyday conversation skills with natural dialogue flow',
        unlocked: true,
        steps: [
          {
            id: 1,
            character: 'Friend',
            message: 'Hi! How was your day? I heard you had an interesting experience yesterday.',
            expectedResponse: ['day', 'good', 'interesting'],
            hints: ['Be natural and friendly', 'Share something about your day', 'Ask about their day too'],
            userInputType: 'voice'
          },
          {
            id: 2,
            character: 'Friend',
            message: 'That sounds amazing! Can you tell me more about what happened?',
            expectedResponse: ['tell', 'more', 'happened'],
            hints: ['Provide more details', 'Use descriptive language', 'Keep the conversation engaging'],
            userInputType: 'choice',
            choices: ['Sure! Let me tell you all about it...', 'Well, it was quite surprising actually...', 'I\'d love to share the details with you...']
          },
          {
            id: 3,
            character: 'Friend',
            message: 'That\'s incredible! What did you learn from this experience?',
            expectedResponse: ['learn', 'experience', 'insight'],
            hints: ['Share your insights', 'What did you gain from this?', 'Be reflective'],
            userInputType: 'voice'
          }
        ]
      },
      {
        id: 'presentation',
        name: 'Public Speaking',
        level: 2,
        description: 'Practice presenting your ideas clearly and confidently to an audience',
        unlocked: true,
        steps: [
          {
            id: 1,
            character: 'Audience Member',
            message: 'Welcome! We\'re excited to hear your presentation. Could you start by introducing yourself and your topic?',
            expectedResponse: ['introduce', 'topic', 'presentation'],
            hints: ['Be confident and clear', 'Introduce yourself briefly', 'State your main topic clearly'],
            userInputType: 'voice'
          },
          {
            id: 2,
            character: 'Audience Member',
            message: 'Thank you for that introduction. Can you tell us why this topic is important to you?',
            expectedResponse: ['important', 'reason', 'motivation'],
            hints: ['Explain your personal connection', 'Share your motivation', 'Make it relatable'],
            userInputType: 'choice',
            choices: ['This topic has personally affected my life...', 'I believe this is crucial for our society...', 'Through my research, I discovered...']
          }
        ]
      },
      {
        id: 'debate',
        name: 'Debate & Discussion',
        level: 3,
        description: 'Engage in structured debates and thoughtful discussions',
        unlocked: false,
        steps: [
          {
            id: 1,
            character: 'Debate Moderator',
            message: 'Welcome to today\'s debate. The topic is: "Technology improves education." You\'re arguing FOR this position. What\'s your opening statement?',
            expectedResponse: ['technology', 'education', 'improves'],
            hints: ['State your position clearly', 'Provide evidence', 'Be persuasive'],
            userInputType: 'voice'
          },
          {
            id: 2,
            character: 'Opponent',
            message: 'I disagree. Technology can be distracting and reduces face-to-face interaction. How do you respond?',
            expectedResponse: ['response', 'counter', 'argument'],
            hints: ['Acknowledge their point', 'Provide counter-evidence', 'Stay respectful'],
            userInputType: 'voice'
          },
          {
            id: 3,
            character: 'Debate Moderator',
            message: 'Excellent exchange! Now, what\'s your closing statement that summarizes your main points?',
            expectedResponse: ['summary', 'conclusion', 'points'],
            hints: ['Summarize key arguments', 'End strongly', 'Be concise'],
            userInputType: 'voice'
          }
        ]
      },
      {
        id: 'writing',
        name: 'Creative Writing',
        level: 4,
        description: 'Develop creative writing skills through storytelling exercises',
        unlocked: false,
        steps: [
          {
            id: 1,
            character: 'Writing Instructor',
            message: 'Let\'s start with a creative prompt: "A mysterious door appears in your bedroom wall." Begin your story with the first paragraph.',
            expectedResponse: ['story', 'beginning', 'paragraph'],
            hints: ['Set the scene', 'Create intrigue', 'Use descriptive language'],
            userInputType: 'voice'
          },
          {
            id: 2,
            character: 'Writing Instructor',
            message: 'Great start! Now develop your character. What do they think and feel about this mysterious door?',
            expectedResponse: ['character', 'feelings', 'thoughts'],
            hints: ['Show character emotions', 'Use inner dialogue', 'Make it personal'],
            userInputType: 'voice'
          },
          {
            id: 3,
            character: 'Writing Instructor',
            message: 'Perfect! Now create tension. What happens when they try to open the door?',
            expectedResponse: ['tension', 'conflict', 'opening'],
            hints: ['Build suspense', 'Create obstacles', 'Leave readers wanting more'],
            userInputType: 'voice'
          }
        ]
      },
      {
        id: 'literature',
        name: 'Literature Analysis',
        level: 5,
        description: 'Analyze literary works and express critical thinking',
        unlocked: false,
        steps: [
          {
            id: 1,
            character: 'Literature Professor',
            message: 'We\'re analyzing this excerpt: "The old man sat alone in the dimly lit room, memories flooding his mind like a river breaking its banks." What literary device is being used here?',
            expectedResponse: ['metaphor', 'simile', 'imagery'],
            hints: ['Look for comparisons', 'Identify figurative language', 'Consider the effect'],
            userInputType: 'choice',
            choices: ['Simile - "like a river breaking its banks"', 'Metaphor - comparing memories to a river', 'Personification - giving memories human qualities']
          },
          {
            id: 2,
            character: 'Literature Professor',
            message: 'Excellent! Now analyze the deeper meaning. What does this passage suggest about the character\'s emotional state?',
            expectedResponse: ['meaning', 'emotions', 'analysis'],
            hints: ['Consider the symbolism', 'Think about the mood', 'Connect to character psychology'],
            userInputType: 'voice'
          },
          {
            id: 3,
            character: 'Literature Professor',
            message: 'Brilliant analysis! Finally, how does this passage contribute to the overall theme of the work?',
            expectedResponse: ['theme', 'contribution', 'overall'],
            hints: ['Think about the bigger picture', 'Connect to universal themes', 'Consider the author\'s message'],
            userInputType: 'voice'
          }
        ]
      }
    ]
  },
  mathematics: {
    id: 'mathematics',
    name: 'Mathematics',
    icon: 'Calculator',
    color: 'from-purple-500 to-indigo-500',
    bgColor: 'from-purple-50 to-indigo-50',
    description: 'Develop mathematical thinking, problem-solving skills, and logical reasoning through practical applications',
    scenarios: [
      {
        id: 'algebra',
        name: 'Algebra Fundamentals',
        level: 1,
        description: 'Solve algebraic problems step by step with interactive guidance',
        unlocked: true,
        steps: [
          {
            id: 1,
            character: 'Math Tutor',
            message: 'Let\'s solve this equation: 2x + 5 = 13. What should be our first step?',
            expectedResponse: ['subtract', 'isolate', 'variable'],
            hints: ['Think about isolating the variable', 'What operation should we do first?', 'Remember the order of operations'],
            userInputType: 'choice',
            choices: ['Subtract 5 from both sides', 'Divide by 2 first', 'Add 5 to both sides']
          },
          {
            id: 2,
            character: 'Math Tutor',
            message: 'Great! After subtracting 5, we get 2x = 8. Now what\'s the next step to solve for x?',
            expectedResponse: ['divide', '2', 'both sides'],
            hints: ['We need to isolate x', 'What\'s the coefficient of x?', 'Divide both sides by the same number'],
            userInputType: 'voice'
          },
          {
            id: 3,
            character: 'Math Tutor',
            message: 'Perfect! So x = 4. Let\'s verify this answer by substituting back into the original equation.',
            expectedResponse: ['verify', 'substitute', 'check'],
            hints: ['Replace x with 4', 'Calculate both sides', 'Check if they\'re equal'],
            userInputType: 'voice'
          }
        ]
      },
      {
        id: 'geometry',
        name: 'Geometry & Shapes',
        level: 2,
        description: 'Explore geometric concepts and spatial reasoning',
        unlocked: true,
        steps: [
          {
            id: 1,
            character: 'Geometry Teacher',
            message: 'We have a right triangle with legs of 3 and 4 units. What\'s the length of the hypotenuse?',
            expectedResponse: ['hypotenuse', 'pythagorean', '5'],
            hints: ['Use the Pythagorean theorem', 'a² + b² = c²', 'Calculate step by step'],
            userInputType: 'choice',
            choices: ['5 units', '7 units', '25 units']
          }
        ]
      },
      {
        id: 'calculus',
        name: 'Calculus Concepts',
        level: 3,
        description: 'Understand limits, derivatives, and integrals',
        unlocked: false,
        steps: [
          {
            id: 1,
            character: 'Calculus Professor',
            message: 'Let\'s find the derivative of f(x) = x³ + 2x² - 5x + 1. What\'s the first step?',
            expectedResponse: ['power', 'rule', 'derivative'],
            hints: ['Use the power rule', 'Differentiate each term separately', 'Remember: d/dx(xⁿ) = nxⁿ⁻¹'],
            userInputType: 'choice',
            choices: ['Apply the power rule to each term', 'Use the product rule', 'Factor the equation first']
          },
          {
            id: 2,
            character: 'Calculus Professor',
            message: 'Great! Now apply the power rule. What\'s the derivative of x³?',
            expectedResponse: ['3x²', '3x', 'x²'],
            hints: ['Power rule: xⁿ becomes nxⁿ⁻¹', 'For x³: 3x²', 'Lower the power by 1'],
            userInputType: 'voice'
          },
          {
            id: 3,
            character: 'Calculus Professor',
            message: 'Perfect! Now complete the derivative. What\'s the final answer?',
            expectedResponse: ['3x²', '4x', '5'],
            hints: ['Combine all terms', 'f\'(x) = 3x² + 4x - 5', 'Check each term'],
            userInputType: 'voice'
          }
        ]
      },
      {
        id: 'statistics',
        name: 'Statistics & Data',
        level: 4,
        description: 'Analyze data and understand statistical concepts',
        unlocked: false,
        steps: [
          {
            id: 1,
            character: 'Statistics Professor',
            message: 'We have test scores: [85, 92, 78, 96, 88, 91]. What\'s the mean?',
            expectedResponse: ['mean', 'average', '88.3'],
            hints: ['Add all numbers', 'Divide by count', 'Mean = sum/n'],
            userInputType: 'voice'
          },
          {
            id: 2,
            character: 'Statistics Professor',
            message: 'Good! Now find the median. First, what do we need to do with the data?',
            expectedResponse: ['sort', 'order', 'arrange'],
            hints: ['Arrange in order', 'Find middle value', 'Sort first'],
            userInputType: 'choice',
            choices: ['Sort the data in ascending order', 'Find the highest value', 'Calculate the range']
          },
          {
            id: 3,
            character: 'Statistics Professor',
            message: 'Excellent! With sorted data [78, 85, 88, 91, 92, 96], what\'s the median?',
            expectedResponse: ['89.5', '88', '91'],
            hints: ['Even number of values', 'Average the two middle numbers', '(88 + 91) / 2'],
            userInputType: 'voice'
          }
        ]
      },
      {
        id: 'advanced',
        name: 'Advanced Mathematics',
        level: 5,
        description: 'Explore complex mathematical theories and applications',
        unlocked: false,
        steps: [
          {
            id: 1,
            character: 'Advanced Math Professor',
            message: 'Solve this complex equation: z² + 2z + 2 = 0, where z is a complex number.',
            expectedResponse: ['quadratic', 'formula', 'complex'],
            hints: ['Use quadratic formula', 'a=1, b=2, c=2', 'z = (-b ± √(b²-4ac))/2a'],
            userInputType: 'voice'
          },
          {
            id: 2,
            character: 'Advanced Math Professor',
            message: 'Good start! Calculate the discriminant b² - 4ac. What do you get?',
            expectedResponse: ['-4', 'negative', '4-8'],
            hints: ['b² - 4ac = 2² - 4(1)(2)', '= 4 - 8', '= -4'],
            userInputType: 'voice'
          },
          {
            id: 3,
            character: 'Advanced Math Professor',
            message: 'Perfect! Since discriminant is negative, what does this tell us about the roots?',
            expectedResponse: ['complex', 'imaginary', 'conjugate'],
            hints: ['Negative discriminant = complex roots', 'They come in conjugate pairs', 'z = -1 ± i'],
            userInputType: 'voice'
          }
        ]
      }
    ]
  },
  physics: {
    id: 'physics',
    name: 'Physics',
    icon: 'Atom',
    color: 'from-pink-500 to-rose-500',
    bgColor: 'from-pink-50 to-rose-50',
    description: 'Explore the laws of nature, scientific principles, and physical phenomena through hands-on experiments',
    scenarios: [
      {
        id: 'mechanics',
        name: 'Classical Mechanics',
        level: 1,
        description: 'Explore motion, forces, and energy through interactive physics problems',
        unlocked: true,
        steps: [
          {
            id: 1,
            character: 'Physics Professor',
            message: 'A ball is dropped from a height of 20 meters. What force is acting on it, and what happens to its velocity?',
            expectedResponse: ['gravity', 'force', 'velocity'],
            hints: ['Think about gravitational force', 'What happens to velocity as it falls?', 'Consider Newton\'s laws'],
            userInputType: 'voice'
          },
          {
            id: 2,
            character: 'Physics Professor',
            message: 'Excellent! Now, if we ignore air resistance, what can we say about the ball\'s acceleration?',
            expectedResponse: ['constant', 'acceleration', 'gravity'],
            hints: ['Gravitational acceleration is constant', 'What\'s the value of g on Earth?', 'Acceleration doesn\'t change during free fall'],
            userInputType: 'choice',
            choices: ['It accelerates at 9.8 m/s²', 'Acceleration increases as it falls', 'There\'s no acceleration without air resistance']
          },
          {
            id: 3,
            character: 'Physics Professor',
            message: 'Great understanding! Now, how long will it take for the ball to reach the ground?',
            expectedResponse: ['time', 'equation', 'calculate'],
            hints: ['Use the kinematic equation', 'h = ½gt²', 'Solve for t'],
            userInputType: 'voice'
          }
        ]
      },
      {
        id: 'thermodynamics',
        name: 'Heat & Energy',
        level: 2,
        description: 'Understand heat transfer and energy conservation',
        unlocked: true,
        steps: [
          {
            id: 1,
            character: 'Physics Professor',
            message: 'A 1kg block of ice at 0°C is heated until it becomes water at 100°C. What energy is involved?',
            expectedResponse: ['latent', 'specific', 'heat'],
            hints: ['Consider phase change energy', 'Latent heat of fusion', 'Specific heat of water'],
            userInputType: 'voice'
          }
        ]
      },
      {
        id: 'electricity',
        name: 'Electricity & Magnetism',
        level: 3,
        description: 'Explore electric and magnetic fields',
        unlocked: false,
        steps: [
          {
            id: 1,
            character: 'Physics Professor',
            message: 'A 2μC charge is placed 3cm from a -4μC charge. What\'s the electric force between them?',
            expectedResponse: ['coulomb', 'force', 'electrostatic'],
            hints: ['Use Coulomb\'s law', 'F = k(q₁q₂)/r²', 'k = 9×10⁹ N⋅m²/C²'],
            userInputType: 'voice'
          },
          {
            id: 2,
            character: 'Physics Professor',
            message: 'Good! Now calculate the magnitude. What\'s the value of q₁q₂?',
            expectedResponse: ['8', 'μC²', '2×4'],
            hints: ['q₁ = 2μC, q₂ = -4μC', 'Ignore the sign for magnitude', '2 × 4 = 8'],
            userInputType: 'choice',
            choices: ['8μC²', '6μC²', '-8μC²']
          },
          {
            id: 3,
            character: 'Physics Professor',
            message: 'Perfect! Now plug into Coulomb\'s law. What\'s the final force?',
            expectedResponse: ['800', 'N', 'newton'],
            hints: ['F = (9×10⁹)(8×10⁻¹²)/(0.03)²', '= 72×10⁻³/9×10⁻⁴', '= 800 N'],
            userInputType: 'voice'
          }
        ]
      },
      {
        id: 'waves',
        name: 'Waves & Optics',
        level: 4,
        description: 'Understand wave properties and light behavior',
        unlocked: false,
        steps: [
          {
            id: 1,
            character: 'Physics Professor',
            message: 'Light travels from air (n=1.0) to water (n=1.33) at 30° angle. What\'s the refracted angle?',
            expectedResponse: ['snell', 'refraction', 'angle'],
            hints: ['Use Snell\'s law', 'n₁sinθ₁ = n₂sinθ₂', 'sinθ₂ = (1.0)sin(30°)/1.33'],
            userInputType: 'voice'
          },
          {
            id: 2,
            character: 'Physics Professor',
            message: 'Excellent! Calculate sin(30°). What\'s the value?',
            expectedResponse: ['0.5', 'half', '1/2'],
            hints: ['sin(30°) = 0.5', 'This is a standard angle', 'sin(30°) = 1/2'],
            userInputType: 'choice',
            choices: ['0.5', '0.866', '0.707']
          },
          {
            id: 3,
            character: 'Physics Professor',
            message: 'Great! Now solve for θ₂. What\'s the refracted angle?',
            expectedResponse: ['22', 'degrees', '22°'],
            hints: ['sinθ₂ = 0.5/1.33 = 0.376', 'θ₂ = sin⁻¹(0.376)', '≈ 22°'],
            userInputType: 'voice'
          }
        ]
      },
      {
        id: 'quantum',
        name: 'Quantum Physics',
        level: 5,
        description: 'Explore quantum mechanics and modern physics',
        unlocked: false,
        steps: [
          {
            id: 1,
            character: 'Quantum Physics Professor',
            message: 'An electron has wavelength 500nm. What\'s its momentum using de Broglie equation?',
            expectedResponse: ['de broglie', 'momentum', 'wavelength'],
            hints: ['λ = h/p', 'p = h/λ', 'h = 6.63×10⁻³⁴ J⋅s'],
            userInputType: 'voice'
          },
          {
            id: 2,
            character: 'Quantum Physics Professor',
            message: 'Good! What\'s the wavelength in meters?',
            expectedResponse: ['5×10⁻⁷', 'meters', '500nm'],
            hints: ['500nm = 500×10⁻⁹m', '= 5×10⁻⁷m', 'Convert nanometers to meters'],
            userInputType: 'choice',
            choices: ['5×10⁻⁷m', '5×10⁻⁹m', '5×10⁻⁶m']
          },
          {
            id: 3,
            character: 'Quantum Physics Professor',
            message: 'Perfect! Now calculate momentum. What\'s the value?',
            expectedResponse: ['1.33×10⁻²⁷', 'kg⋅m/s', 'momentum'],
            hints: ['p = h/λ = (6.63×10⁻³⁴)/(5×10⁻⁷)', '= 1.33×10⁻²⁷ kg⋅m/s', 'This is very small!'],
            userInputType: 'voice'
          }
        ]
      }
    ]
  }
}

// 获取用户技能树进度
export const getUserSkillProgress = async (userId) => {
  try {
    const progressRef = doc(db, 'skillProgress', userId)
    const progressSnap = await getDoc(progressRef)
    
    if (progressSnap.exists()) {
      return progressSnap.data()
    }
    
    // 如果用户没有进度记录，创建初始进度
    const initialProgress = {
      userId,
      paths: {
        language: { 
          progress: 0, 
          completedLessons: [], 
          completedUnits: [],
          selectedLanguage: null // 用户选择的语言
        },
        mathematics: { 
          progress: 0, 
          completedLessons: [], 
          completedUnits: []
        },
        physics: { 
          progress: 0, 
          completedLessons: [], 
          completedUnits: []
        }
      },
      totalXP: 0,
      streak: 0,
      lessonsCompleted: 0,
      achievements: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }
    
    await setDoc(progressRef, initialProgress)
    return initialProgress
  } catch (error) {
    console.error('Error getting user skill progress:', error)
    throw error
  }
}

// 更新用户课程完成状态
export const updateLessonProgress = async (userId, pathId, unitId, lessonId, xpEarned) => {
  try {
    console.log('=== STARTING LESSON PROGRESS UPDATE ===')
    console.log('Parameters:', { userId, pathId, unitId, lessonId, xpEarned })
    
    // 先测试简单的写入权限
    console.log('=== TESTING FIREBASE WRITE PERMISSIONS ===')
    const testRef = doc(db, 'test', userId)
    try {
      await setDoc(testRef, { 
        test: true, 
        timestamp: serverTimestamp(),
        message: 'Permission test'
      })
      console.log('✅ Firebase write permission test: SUCCESS')
    } catch (permError) {
      console.error('❌ Firebase write permission test: FAILED', permError)
      throw new Error(`Firebase write permission denied: ${permError.message}`)
    }
    
    const progressRef = doc(db, 'skillProgress', userId)
    const progressSnap = await getDoc(progressRef)
    
    let currentProgress
    if (!progressSnap.exists()) {
      // 如果用户进度不存在，创建初始进度
      console.log('User progress not found, creating initial progress...')
      currentProgress = {
        userId,
        paths: {},
        totalXP: 0,
        streak: 0,
        lessonsCompleted: 0,
        achievements: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
    } else {
      currentProgress = progressSnap.data()
      console.log('=== LOADING FROM FIREBASE ===')
      console.log('Loaded progress:', JSON.stringify(currentProgress, null, 2))
    }
    
    // 确保路径进度存在，但不覆盖现有数据
    if (!currentProgress.paths) {
      currentProgress.paths = {}
    }
    if (!currentProgress.paths[pathId]) {
      currentProgress.paths[pathId] = { 
        progress: 0, 
        completedLessons: [], 
        completedUnits: [],
        selectedLanguage: null
      }
    }
    
    const pathProgress = currentProgress.paths[pathId]
    
    // 确保数组存在
    if (!pathProgress.completedLessons) {
      pathProgress.completedLessons = []
    }
    if (!pathProgress.completedUnits) {
      pathProgress.completedUnits = []
    }
    
    // 更新课程完成状态
    const lessonKey = `${unitId}_${lessonId}`
    console.log('=== ADDING LESSON ===')
    console.log('Adding lesson:', lessonKey)
    console.log('Current completed:', [...pathProgress.completedLessons])
    
    if (!pathProgress.completedLessons.includes(lessonKey)) {
      pathProgress.completedLessons.push(lessonKey)
      console.log('✅ Lesson added successfully')
    } else {
      console.log('⚠️ Lesson already completed')
    }
    
    console.log('Final completed lessons:', [...pathProgress.completedLessons])
    
    // 检查单元是否完成
    const unit = skillTreeData[pathId]?.units?.find(u => u.id === unitId)
    if (unit) {
      const unitLessons = unit.lessons || []
      const completedUnitLessons = unitLessons.filter(lesson => 
        pathProgress.completedLessons.includes(`${unitId}_${lesson.id}`)
      )
      
      // 如果单元的所有课程都完成了，标记单元为完成
      if (completedUnitLessons.length === unitLessons.length && 
          !pathProgress.completedUnits.includes(unitId)) {
        pathProgress.completedUnits.push(unitId)
      }
    }
    
    // 更新进度百分比
    const totalLessons = skillTreeData[pathId]?.units?.reduce((total, unit) => 
      total + (unit.lessons?.length || 0), 0) || 0
    const completedCount = pathProgress.completedLessons.length
    pathProgress.progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0
    
    // 更新总XP和连击
    const oldXP = currentProgress.totalXP || 0
    const newXP = oldXP + xpEarned
    currentProgress.totalXP = newXP
    currentProgress.streak = (currentProgress.streak || 0) + 1
    currentProgress.lessonsCompleted = (currentProgress.lessonsCompleted || 0) + 1
    
    console.log('=== XP CALCULATION ===')
    console.log('Old XP:', oldXP)
    console.log('XP earned:', xpEarned)
    console.log('New XP:', newXP)
    
    console.log('=== UPDATING LESSON PROGRESS ===')
    console.log('Lesson:', lessonKey)
    console.log('Completed lessons before:', [...pathProgress.completedLessons])
    console.log('Total XP:', currentProgress.totalXP)
    console.log('Streak:', currentProgress.streak)
    console.log('Lessons completed:', currentProgress.lessonsCompleted)
    
    console.log('=== SAVING TO FIREBASE ===')
    console.log('Path progress to save:', JSON.stringify(pathProgress, null, 2))
    
    const updateData = {
      [`paths.${pathId}.completedLessons`]: pathProgress.completedLessons,
      [`paths.${pathId}.completedUnits`]: pathProgress.completedUnits,
      [`paths.${pathId}.progress`]: pathProgress.progress,
      [`paths.${pathId}.selectedLanguage`]: pathProgress.selectedLanguage,
      totalXP: currentProgress.totalXP,
      streak: currentProgress.streak,
      lessonsCompleted: currentProgress.lessonsCompleted,
      updatedAt: serverTimestamp()
    }
    
    console.log('Update data:', JSON.stringify(updateData, null, 2))
    
    try {
      // 使用updateDoc精确更新，避免覆盖其他数据
      await updateDoc(progressRef, updateData)
      console.log('✅ Firebase update successful')
      
      // 验证保存是否成功
      const verifySnap = await getDoc(progressRef)
      if (verifySnap.exists()) {
        const savedData = verifySnap.data()
        console.log('✅ Verification - Saved data:', JSON.stringify(savedData, null, 2))
        console.log('✅ Verification - Total XP:', savedData.totalXP)
        console.log('✅ Verification - Completed lessons:', savedData.paths?.[pathId]?.completedLessons)
      } else {
        console.error('❌ Verification failed - Document does not exist')
      }
    } catch (updateError) {
      console.error('❌ Firebase update failed:', updateError)
      console.log('🔄 Trying alternative save method with setDoc...')
      
      // 备选方案：使用setDoc保存整个文档
      try {
        await setDoc(progressRef, currentProgress, { merge: true })
        console.log('✅ Alternative save method successful')
        
        // 再次验证
        const verifySnap2 = await getDoc(progressRef)
        if (verifySnap2.exists()) {
          const savedData2 = verifySnap2.data()
          console.log('✅ Alternative verification - Total XP:', savedData2.totalXP)
          console.log('✅ Alternative verification - Completed lessons:', savedData2.paths?.[pathId]?.completedLessons)
        }
      } catch (altError) {
        console.error('❌ Alternative save method also failed:', altError)
        throw new Error(`Both save methods failed. UpdateDoc: ${updateError.message}, SetDoc: ${altError.message}`)
      }
    }
    return currentProgress
  } catch (error) {
    console.error('Error updating lesson progress:', error)
    console.error('Error details:', {
      userId,
      pathId,
      unitId,
      lessonId,
      xpEarned,
      error: error.message,
      stack: error.stack
    })
    throw error
  }
}

// 更新用户场景完成状态（保留旧函数以兼容性）
export const updateScenarioProgress = async (userId, pathId, scenarioId, score, responses) => {
  try {
    const progressRef = doc(db, 'skillProgress', userId)
    const progressSnap = await getDoc(progressRef)
    
    if (!progressSnap.exists()) {
      throw new Error('User progress not found')
    }
    
    const currentProgress = progressSnap.data()
    const pathProgress = currentProgress.paths[pathId]
    
    // 更新场景完成状态
    if (!pathProgress.completedScenarios.includes(scenarioId)) {
      pathProgress.completedScenarios.push(scenarioId)
    }
    
    // 更新进度百分比
    const totalScenarios = skillTreeData[pathId].scenarios.length
    const completedCount = pathProgress.completedScenarios.length
    pathProgress.progress = Math.round((completedCount / totalScenarios) * 100)
    
    // 更新总分数
    currentProgress.totalScore += score
    
    // 保存场景响应数据
    const scenarioDataRef = doc(db, 'scenarioResponses', `${userId}_${pathId}_${scenarioId}`)
    await setDoc(scenarioDataRef, {
      userId,
      pathId,
      scenarioId,
      score,
      responses,
      completedAt: serverTimestamp()
    })
    
    // 更新进度
    await updateDoc(progressRef, {
      [`paths.${pathId}`]: pathProgress,
      totalScore: currentProgress.totalScore,
      updatedAt: serverTimestamp()
    })
    
    return currentProgress
  } catch (error) {
    console.error('Error updating scenario progress:', error)
    throw error
  }
}

// 获取技能树数据
export const getSkillTreeData = () => {
  return skillTreeData
}

// 获取特定路径数据
export const getPathData = (pathId) => {
  return skillTreeData[pathId]
}

// 获取特定场景数据
export const getScenarioData = (pathId, scenarioId) => {
  const path = skillTreeData[pathId]
  if (!path) return null
  
  return path.scenarios.find(scenario => scenario.id === scenarioId)
}

// 保存用户选择的语言
export const saveLanguageSelection = async (userId, languageId) => {
  try {
    const progressRef = doc(db, 'skillProgress', userId)
    await updateDoc(progressRef, {
      'paths.language.selectedLanguage': languageId,
      updatedAt: serverTimestamp()
    })
  } catch (error) {
    console.error('Error saving language selection:', error)
    throw error
  }
}

// 检查课程是否完成
export const isLessonCompleted = (userProgress, pathId, unitId, lessonId) => {
  const lessonKey = `${unitId}_${lessonId}`
  
  if (!userProgress || !userProgress.paths[pathId]) {
    return false
  }
  
  const pathProgress = userProgress.paths[pathId]
  const completed = pathProgress.completedLessons?.includes(lessonKey) || false
  
  console.log(`🔍 Check ${lessonKey}: ${completed ? '✅' : '❌'}`)
  
  return completed
}

// 检查单元是否完成
export const isUnitCompleted = (userProgress, pathId, unitId) => {
  if (!userProgress || !userProgress.paths[pathId]) return false
  
  const pathProgress = userProgress.paths[pathId]
  return pathProgress.completedUnits?.includes(unitId) || false
}

// 检查单元是否解锁
export const isUnitUnlocked = (userProgress, pathId, unitId) => {
  if (!userProgress || !userProgress.paths[pathId]) return false
  
  // 对于语言路径，需要先选择语言
  if (pathId === 'language' && !userProgress.paths[pathId].selectedLanguage) {
    return false
  }
  
  // 第一个单元默认解锁
  const pathData = skillTreeData[pathId]
  const firstUnit = pathData?.units?.[0]
  if (unitId === firstUnit?.id) return true
  
  // 检查前置单元是否完成
  const unitIndex = pathData?.units?.findIndex(u => u.id === unitId)
  if (unitIndex <= 0) return true
  
  // 检查前一个单元是否完成
  const previousUnit = pathData?.units?.[unitIndex - 1]
  return isUnitCompleted(userProgress, pathId, previousUnit?.id)
}

// 检查课程是否解锁
export const isLessonUnlocked = (userProgress, pathId, unitId, lessonId) => {
  if (!userProgress || !userProgress.paths[pathId]) {
    return false
  }
  
  // 如果课程已经完成，直接返回true
  if (isLessonCompleted(userProgress, pathId, unitId, lessonId)) {
    console.log(`🔓 Unlock ${unitId}_${lessonId}: ✅ (already completed)`)
    return true
  }
  
  // 单元必须解锁
  const unitUnlocked = isUnitUnlocked(userProgress, pathId, unitId)
  if (!unitUnlocked) {
    return false
  }
  
  // 对于语言路径，需要先选择语言
  if (pathId === 'language' && !userProgress.paths[pathId].selectedLanguage) {
    return false
  }
  
  // 第一个课程默认解锁
  const pathData = skillTreeData[pathId]
  const unit = pathData?.units?.find(u => u.id === unitId)
  const firstLesson = unit?.lessons?.[0]
  if (lessonId === firstLesson?.id) {
    console.log(`🔓 Unlock ${unitId}_${lessonId}: ✅ (first lesson)`)
    return true
  }
  
  // 检查前置课程是否完成
  const lessonIndex = unit?.lessons?.findIndex(l => l.id === lessonId)
  if (lessonIndex <= 0) {
    return true
  }
  
  // 检查前一个课程是否完成
  const previousLesson = unit?.lessons?.[lessonIndex - 1]
  const previousCompleted = isLessonCompleted(userProgress, pathId, unitId, previousLesson?.id)
  
  console.log(`🔓 Unlock ${unitId}_${lessonId}: ${previousCompleted ? '✅' : '❌'} (prev: ${previousLesson?.id})`)
  
  return previousCompleted
}

// 检查场景是否解锁（保留旧函数以兼容性）
export const isScenarioUnlocked = (userProgress, pathId, scenarioId) => {
  if (!userProgress || !userProgress.paths[pathId]) return false
  
  // 对于语言路径，需要先选择语言
  if (pathId === 'language' && !userProgress.paths[pathId].selectedLanguage) {
    return false
  }
  
  const pathData = skillTreeData[pathId]
  const scenario = pathData.scenarios.find(s => s.id === scenarioId)
  
  if (!scenario) return false
  
  // 所有场景都默认解锁（只要选择了语言）
  return true
}

// 根据选择的语言动态生成课程内容 - 新的日常练习结构
export const getDynamicLessonContent = (pathId, unitId, lessonId, selectedLanguage) => {
  console.log('=== getDynamicLessonContent ===')
  console.log('Parameters:', { pathId, unitId, lessonId, selectedLanguage })
  
  if (pathId !== 'language') {
    // 非语言路径使用原始数据
    console.log('Non-language path, returning default lesson data')
    return {
      id: lessonId,
      title: 'Lesson Not Found',
      description: 'This lesson is not available yet',
      icon: '❓',
      difficulty: 'beginner',
      xpReward: 10,
      lessons: [
        {
          id: 'default',
          title: 'Default Exercise',
          type: 'translate',
          content: {
            exercises: [
              { 
                type: 'translate', 
                question: 'Hello', 
                answer: 'Hello', 
                options: ['Hello', 'Goodbye', 'Thank you'] 
              }
            ]
          }
        }
      ]
    }
  }

  const languageContent = getLanguageContent(selectedLanguage)
  console.log('Language content:', languageContent)
  
  // 通用的课程内容获取函数
  const getLessonFromWeek = (weekId, lessonId) => {
    const weekContent = languageContent.dailyPractice?.[weekId]
    console.log(`${weekId} content:`, weekContent)
    
    if (!weekContent || !weekContent.lessons) {
      console.log(`No lessons found in ${weekId}`)
      return null
    }
    
    const lessonContent = weekContent.lessons.find(l => l.id === lessonId)
    console.log(`Lesson content for ${lessonId}:`, lessonContent)
    
    if (lessonContent && lessonContent.exercises && Array.isArray(lessonContent.exercises)) {
      return {
        id: lessonId,
        title: lessonContent.title,
        description: lessonContent.description,
        icon: lessonContent.icon,
        difficulty: lessonContent.difficulty,
        xpReward: lessonContent.xpReward,
        lessons: [
          {
            id: `${lessonId}_exercises`,
            title: lessonContent.title,
            type: lessonContent.type,
            content: {
              exercises: lessonContent.exercises || []
            }
          }
        ]
      }
    }
    
    return null
  }
  
  // 尝试从对应的周获取课程内容
  const lessonData = getLessonFromWeek(unitId, lessonId)
  
  if (lessonData) {
    console.log('Found lesson data:', lessonData)
    return lessonData
  }

  console.log('No matching content found, returning default lesson data')
  // 如果找不到对应的内容，返回默认内容
  return {
    id: lessonId,
    title: 'Lesson Not Found',
    description: 'This lesson is not available yet',
    icon: '❓',
    difficulty: 'beginner',
    xpReward: 10,
    lessons: [
      {
        id: 'default',
        title: 'Default Exercise',
        type: 'translate',
        content: {
          exercises: [
            { 
              type: 'translate', 
              question: 'Hello', 
              answer: 'Hello', 
              options: ['Hello', 'Goodbye', 'Thank you'] 
            }
          ]
        }
      }
    ]
  }
}
