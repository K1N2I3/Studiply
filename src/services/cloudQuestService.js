import { fetchQuests, fetchQuestByKey, saveQuest, saveQuestsBulk } from './questApi'

const transformQuestsToNested = (quests = []) => {
  const questData = {}
  quests.forEach((quest) => {
    const { subject = 'general', category = 'general', questId } = quest
    if (!questId) return
    if (!questData[subject]) {
      questData[subject] = {}
    }
    if (!questData[subject][category]) {
      questData[subject][category] = {}
    }
    questData[subject][category][questId] = quest
  })
  return questData
}

const flattenQuestData = (questsData = {}) => {
  const quests = []
  for (const [subject, categories] of Object.entries(questsData)) {
    for (const [category, questsMap] of Object.entries(categories)) {
      for (const [questId, questData] of Object.entries(questsMap)) {
        quests.push({ ...questData, subject, category, questId })
      }
    }
  }
  return quests
}

// 从云端获取所有quest数据
export const getCloudQuestData = async () => {
  try {
    const result = await fetchQuests()
    const questData = transformQuestsToNested(result.quests || [])
    return Object.keys(questData).length ? questData : FALLBACK_QUESTS
  } catch (error) {
    console.error('Error fetching cloud quest data:', error)
    return FALLBACK_QUESTS
  }
}

// 获取特定quest
export const getCloudQuest = async (subject, category, questId) => {
  try {
    const result = await fetchQuestByKey({ subject, category, questId })
    return result.quest || null
  } catch (error) {
    console.error('Error fetching quest:', error)
    return null
  }
}

// 保存quest到云端
export const saveCloudQuest = async (subject, category, questId, questData) => {
  try {
    await saveQuest({ subject, category, questId, ...questData })
    console.log('Quest saved to MongoDB successfully')
  } catch (error) {
    console.error('Error saving quest to MongoDB:', error)
  }
}

// 批量保存quests
export const saveCloudQuests = async (questsData) => {
  try {
    const quests = flattenQuestData(questsData)
    await saveQuestsBulk(quests)
    console.log('All quests saved to MongoDB successfully')
  } catch (error) {
    console.error('Error saving quests to MongoDB:', error)
  }
}

// 扩展的本地fallback数据 - 从入门到精通的学习路径
const FALLBACK_QUESTS = {
  // ==================== 意大利语学习路径 ====================
  italian: {
    grammar: {
      'quest-1': {
        id: 'quest-1',
        title: 'Italian Alphabet & Pronunciation',
        description: 'Learn the Italian alphabet and basic pronunciation rules',
        type: 'quest',
        difficulty: 'beginner',
        xpReward: 80,
        goldReward: 40,
        icon: '🇮🇹',
        timeEstimate: '25 min',
        skills: ['language-learning', 'pronunciation'],
        requirements: [],
        deliverables: [
          {
            type: 'pronunciation-exercises',
            description: 'Practice Italian alphabet pronunciation',
            format: 'audio'
          }
        ],
        resources: ['Italian alphabet guide', 'Audio pronunciation', 'Practice exercises'],
        learningMaterial: {
          title: "Italian Alphabet & Pronunciation Basics",
          content: `
# Italian Alphabet & Pronunciation Guide

## Italian Alphabet
Italian uses 21 letters, excluding J, K, W, X, Y (which are only used in foreign words).

### Basic Letters
A, B, C, D, E, F, G, H, I, L, M, N, O, P, Q, R, S, T, U, V, Z

### Pronunciation Rules
1. **Vowel Sounds**:
   - A: like "father" in English
   - E: like "bed" in English  
   - I: like "machine" in English
   - O: like "more" in English
   - U: like "rule" in English

2. **Consonant Sounds**:
   - C: [k] sound before a, o, u; [ch] sound before e, i
   - G: [g] sound before a, o, u; [j] sound before e, i
   - H: silent, but affects C and G pronunciation

### Common Greetings
- **Ciao** [chao] - Hello/Goodbye (informal)
- **Buongiorno** [bwon-jor-no] - Good morning
- **Buonasera** [bwona-se-ra] - Good evening
- **Salve** [sal-ve] - Hello (formal)

## Key Learning Points
1. Italian is a phonetic language - each letter has a fixed sound
2. Stress usually falls on the second-to-last syllable
3. Double consonants require extended pronunciation time
          `,
          readingTime: "5-8 minutes",
          keyPoints: [
            "Italian has 21 letters",
            "Vowel sounds are clear and distinct",
            "C and G pronunciation rules",
            "Common greeting usage contexts"
          ]
        },
        steps: [
          {
            id: 'step-1',
            title: 'Learn the Italian Alphabet',
            type: 'multiple-choice',
            question: 'How many letters are in the Italian alphabet?',
            options: ['21', '26', '25', '24'],
            correctAnswer: 0,
            explanation: 'The Italian alphabet has 21 letters, excluding J, K, W, X, and Y which are only used in foreign words.'
          },
          {
            id: 'step-2',
            title: 'Practice Pronunciation',
            type: 'text-input',
            question: 'Write the Italian word for "hello" using the Italian alphabet.',
            placeholder: 'Type the Italian word for hello...',
            correctAnswers: ['ciao', 'buongiorno', 'salve'],
            explanation: 'Common Italian greetings include "ciao" (informal), "buongiorno" (good morning), and "salve" (formal hello).'
          },
          {
            id: 'step-3',
            title: 'Vowel Sounds',
            type: 'multiple-choice',
            question: 'How do you pronounce the Italian letter "E"?',
            options: ['Like "bed" in English', 'Like "machine" in English', 'Like "more" in English', 'Like "rule" in English'],
            correctAnswer: 0,
            explanation: 'The Italian "E" is pronounced like the "e" in "bed" in English.'
          },
          {
            id: 'step-4',
            title: 'Consonant Rules',
            type: 'multiple-choice',
            question: 'How is the letter "C" pronounced before "E" and "I"?',
            options: ['[k] sound', '[ch] sound', '[s] sound', '[g] sound'],
            correctAnswer: 1,
            explanation: 'Before "E" and "I", the letter "C" is pronounced as [ch] sound, like in "ciao".'
          },
          {
            id: 'step-5',
            title: 'Double Consonants',
            type: 'multiple-choice',
            question: 'What is special about double consonants in Italian?',
            options: ['They are silent', 'They require extended pronunciation', 'They change the vowel sound', 'They are optional'],
            correctAnswer: 1,
            explanation: 'Double consonants in Italian require extended pronunciation time, making them distinct from single consonants.'
          }
        ]
      }
    }
  },
  mathematics: {
    algebra: {
      'quest-1': {
        id: 'quest-1',
        title: 'Linear Equations',
        description: 'Learn to solve linear equations with one variable',
        type: 'quest',
        difficulty: 'beginner',
        xpReward: 100,
        goldReward: 50,
        icon: '📐',
        timeEstimate: '30 min',
        skills: ['mathematical-thinking', 'problem-solving'],
        requirements: [],
        deliverables: [
          {
            type: 'equation-solving',
            description: 'Solve 10 linear equations',
            format: 'text'
          }
        ],
        resources: ['Algebra textbook', 'Practice problems', 'Video tutorials'],
        learningMaterial: {
          title: "Linear Equations Fundamentals",
          content: `
# Introduction to Linear Equations

## What are Linear Equations?
Linear equations are equations where the highest power is 1, typically in the form: ax + b = 0

## Basic Concepts

### 1. Equation Definition
- **Equation**: An equality containing unknown variables
- **Solution**: The value of the unknown that makes the equation true
- **Root**: The solution of the equation

### 2. Standard Form of Linear Equations
ax + b = 0 (a ≠ 0)

### 3. Steps to Solve Linear Equations
1. **Transpose**: Move terms with unknowns to one side, constants to the other
2. **Combine like terms**: Simplify the equation
3. **Divide by coefficient**: Divide both sides by the coefficient of the unknown

## Worked Examples

### Example 1: 2x + 3 = 7
**Step 1**: Transpose
2x = 7 - 3
2x = 4

**Step 2**: Divide by coefficient
x = 4 ÷ 2
x = 2

### Example 2: 3x - 5 = 10
**Step 1**: Transpose
3x = 10 + 5
3x = 15

**Step 2**: Divide by coefficient
x = 15 ÷ 3
x = 5

## Checking Your Answer
Substitute the solution back into the original equation to verify.

## Common Mistakes
1. Forgetting to change signs when transposing
2. Calculation errors when dividing by coefficient
3. Forgetting to check the answer
          `,
          readingTime: "6-10 minutes",
          keyPoints: [
            "Standard form of linear equations",
            "Basic steps to solve equations",
            "Transposing and combining like terms",
            "Importance of checking answers"
          ]
        },
        steps: [
          {
            id: 'step-1',
            title: 'Basic Concepts',
            type: 'multiple-choice',
            question: 'What is the solution to 2x + 3 = 7?',
            options: ['x = 2', 'x = 4', 'x = 5', 'x = 1'],
            correctAnswer: 0,
            explanation: 'Subtract 3 from both sides: 2x = 4, then divide by 2: x = 2'
          },
          {
            id: 'step-2',
            title: 'Practice',
            type: 'text-input',
            question: 'Solve: 3x - 5 = 10',
            placeholder: 'Enter your answer...',
            correctAnswers: ['x = 5', '5'],
            explanation: 'Add 5 to both sides: 3x = 15, then divide by 3: x = 5'
          },
          {
            id: 'step-3',
            title: 'Negative Coefficients',
            type: 'multiple-choice',
            question: 'What is the solution to -2x + 4 = 8?',
            options: ['x = 2', 'x = -2', 'x = 6', 'x = -6'],
            correctAnswer: 1,
            explanation: 'Subtract 4 from both sides: -2x = 4, then divide by -2: x = -2'
          },
          {
            id: 'step-4',
            title: 'Fractions in Equations',
            type: 'multiple-choice',
            question: 'What is the solution to (1/2)x + 3 = 7?',
            options: ['x = 8', 'x = 4', 'x = 2', 'x = 6'],
            correctAnswer: 0,
            explanation: 'Subtract 3 from both sides: (1/2)x = 4, then multiply by 2: x = 8'
          },
          {
            id: 'step-5',
            title: 'Word Problems',
            type: 'multiple-choice',
            question: 'If a number plus 5 equals 12, what is the number?',
            options: ['7', '17', '2.4', '60'],
            correctAnswer: 0,
            explanation: 'Let x be the number. Then x + 5 = 12, so x = 12 - 5 = 7'
          }
        ]
      }
    }
  },
  physics: {
    mechanics: {
      'quest-1': {
        id: 'quest-1',
        title: 'Newton\'s Laws of Motion',
        description: 'Understand the fundamental laws governing motion',
        type: 'quest',
        difficulty: 'beginner',
        xpReward: 120,
        goldReward: 60,
        icon: '⚛️',
        timeEstimate: '35 min',
        skills: ['scientific-thinking', 'analytical-reasoning'],
        requirements: [],
        deliverables: [
          {
            type: 'physics-problems',
            description: 'Solve motion problems using Newton\'s laws',
            format: 'text'
          }
        ],
        resources: ['Physics textbook', 'Interactive simulations', 'Problem sets'],
        learningMaterial: {
          title: "Newton's Laws of Motion",
          content: `
# Newton's Laws of Motion

## Introduction
Newton's three laws of motion form the foundation of classical mechanics and describe the relationship between forces and motion.

## Newton's First Law (Law of Inertia)
An object at rest stays at rest, and an object in motion stays in motion, unless acted upon by an external force.

### Key Concepts:
- **Inertia**: The tendency of objects to resist changes in motion
- **Equilibrium**: When forces are balanced, there is no acceleration
- **Examples**: A book on a table, a car coasting on a flat road

## Newton's Second Law
Force equals mass times acceleration (F = ma)

### Key Concepts:
- **Force**: A push or pull that causes acceleration
- **Mass**: The amount of matter in an object
- **Acceleration**: The rate of change of velocity
- **Examples**: Pushing a shopping cart, throwing a ball

## Newton's Third Law (Action-Reaction)
For every action, there is an equal and opposite reaction.

### Key Concepts:
- **Action-Reaction Pairs**: Forces always come in pairs
- **Equal Magnitude**: Forces are equal in strength
- **Opposite Direction**: Forces act in opposite directions
- **Examples**: Walking, rocket propulsion, swimming

## Applications

### Everyday Examples
- Walking: Your foot pushes backward, ground pushes you forward
- Driving: Engine pushes car forward, friction opposes motion
- Swimming: Arms push water backward, water pushes you forward

### Engineering Applications
- Rocket design and propulsion
- Vehicle safety systems
- Sports equipment design
          `,
          readingTime: "8-12 minutes",
          keyPoints: [
            "First Law: Objects resist changes in motion",
            "Second Law: F = ma relationship",
            "Third Law: Action-reaction pairs",
            "Real-world applications of Newton's laws"
          ]
        },
        steps: [
          {
            id: 'step-1',
            title: 'First Law',
            type: 'multiple-choice',
            question: 'What does Newton\'s First Law state?',
            options: [
              'F = ma',
              'An object at rest stays at rest',
              'For every action there is an equal reaction',
              'Energy is conserved'
            ],
            correctAnswer: 1,
            explanation: 'Newton\'s First Law states that an object at rest stays at rest, and an object in motion stays in motion, unless acted upon by an external force.'
          },
          {
            id: 'step-2',
            title: 'Second Law',
            type: 'multiple-choice',
            question: 'What is the formula for Newton\'s Second Law?',
            options: ['F = ma', 'E = mc²', 'v = d/t', 'P = mv'],
            correctAnswer: 0,
            explanation: 'Newton\'s Second Law states that Force equals mass times acceleration (F = ma).'
          },
          {
            id: 'step-3',
            title: 'Third Law',
            type: 'multiple-choice',
            question: 'What does Newton\'s Third Law state?',
            options: [
              'F = ma',
              'An object at rest stays at rest',
              'For every action there is an equal and opposite reaction',
              'Energy is conserved'
            ],
            correctAnswer: 2,
            explanation: 'Newton\'s Third Law states that for every action, there is an equal and opposite reaction.'
          },
          {
            id: 'step-4',
            title: 'Force Applications',
            type: 'multiple-choice',
            question: 'When you walk, what force pushes you forward?',
            options: [
              'Your foot pushing backward',
              'The ground pushing you forward',
              'Gravity pulling you down',
              'Air resistance'
            ],
            correctAnswer: 1,
            explanation: 'The ground pushes you forward (reaction force) when your foot pushes backward (action force).'
          },
          {
            id: 'step-5',
            title: 'Mass vs Weight',
            type: 'multiple-choice',
            question: 'What is the difference between mass and weight?',
            options: [
              'They are the same thing',
              'Mass is matter, weight is force',
              'Weight is matter, mass is force',
              'No difference'
            ],
            correctAnswer: 1,
            explanation: 'Mass is the amount of matter in an object, while weight is the force of gravity acting on that mass.'
          }
        ]
      }
    }
  },
  chemistry: {
    organic: {
      'quest-1': {
        id: 'quest-1',
        title: 'Organic Compounds',
        description: 'Learn about carbon-based molecules and their properties',
        type: 'quest',
        difficulty: 'beginner',
        xpReward: 110,
        goldReward: 55,
        icon: '🧪',
        timeEstimate: '40 min',
        skills: ['chemical-thinking', 'molecular-understanding'],
        requirements: [],
        deliverables: [
          {
            type: 'molecular-structures',
            description: 'Draw and identify organic compounds',
            format: 'diagram'
          }
        ],
        resources: ['Chemistry textbook', 'Molecular models', 'Interactive tools'],
        learningMaterial: {
          title: "Organic Compounds Fundamentals",
          content: `
# Introduction to Organic Compounds

## What are Organic Compounds?
Organic compounds are carbon-based molecules that form the basis of all living things and many synthetic materials.

## Carbon Chemistry

### Why Carbon is Special
- **Four valence electrons**: Can form 4 covalent bonds
- **Versatile bonding**: Single, double, and triple bonds
- **Chain formation**: Can form long chains and rings
- **Diversity**: Millions of possible compounds

### Types of Carbon Bonds
- **Single bonds**: C-C (alkanes)
- **Double bonds**: C=C (alkenes)
- **Triple bonds**: C≡C (alkynes)
- **Aromatic bonds**: Benzene rings

## Functional Groups

### Hydrocarbons
- **Alkanes**: Single bonds only (methane, ethane)
- **Alkenes**: Double bonds (ethene, propene)
- **Alkynes**: Triple bonds (ethyne, propyne)

### Oxygen-Containing Groups
- **Alcohols**: -OH group (methanol, ethanol)
- **Aldehydes**: -CHO group (formaldehyde, acetaldehyde)
- **Ketones**: -CO- group (acetone)
- **Carboxylic acids**: -COOH group (acetic acid)

### Nitrogen-Containing Groups
- **Amines**: -NH2 group (methylamine)
- **Amides**: -CONH2 group (acetamide)

## Importance of Organic Compounds

### Biological Significance
- **Proteins**: Made of amino acids
- **Carbohydrates**: Sugars and starches
- **Lipids**: Fats and oils
- **Nucleic acids**: DNA and RNA

### Industrial Applications
- **Pharmaceuticals**: Medicine development
- **Plastics**: Polymer chemistry
- **Fuels**: Petroleum products
- **Materials**: Synthetic fibers
          `,
          readingTime: "10-15 minutes",
          keyPoints: [
            "Carbon can form 4 covalent bonds",
            "Functional groups determine properties",
            "Organic compounds are essential for life",
            "Industrial applications of organic chemistry"
          ]
        },
        steps: [
          {
            id: 'step-1',
            title: 'Carbon Chemistry',
            type: 'multiple-choice',
            question: 'How many bonds can carbon form?',
            options: ['2', '3', '4', '6'],
            correctAnswer: 2,
            explanation: 'Carbon can form 4 covalent bonds, allowing it to create complex organic molecules.'
          },
          {
            id: 'step-2',
            title: 'Functional Groups',
            type: 'multiple-choice',
            question: 'What functional group is -OH?',
            options: ['Aldehyde', 'Ketone', 'Alcohol', 'Ether'],
            correctAnswer: 2,
            explanation: 'The -OH group is characteristic of alcohols.'
          },
          {
            id: 'step-3',
            title: 'Hydrocarbons',
            type: 'multiple-choice',
            question: 'What is the simplest hydrocarbon?',
            options: ['Ethane', 'Methane', 'Propane', 'Butane'],
            correctAnswer: 1,
            explanation: 'Methane (CH₄) is the simplest hydrocarbon with one carbon atom.'
          },
          {
            id: 'step-4',
            title: 'Isomers',
            type: 'multiple-choice',
            question: 'What are isomers?',
            options: [
              'Same molecular formula, different structure',
              'Different molecular formula, same structure',
              'Same atoms, different elements',
              'Different atoms, same elements'
            ],
            correctAnswer: 0,
            explanation: 'Isomers are compounds with the same molecular formula but different structural arrangements.'
          },
          {
            id: 'step-5',
            title: 'Organic Reactions',
            type: 'multiple-choice',
            question: 'What type of reaction is combustion?',
            options: [
              'Addition reaction',
              'Substitution reaction',
              'Oxidation reaction',
              'Reduction reaction'
            ],
            correctAnswer: 2,
            explanation: 'Combustion is an oxidation reaction where organic compounds react with oxygen to produce CO₂ and H₂O.'
          }
        ]
      }
    }
  },
  history: {
    ancient: {
      'quest-1': {
        id: 'quest-1',
        title: 'Ancient Civilizations',
        description: 'Explore the great civilizations of the ancient world',
        type: 'quest',
        difficulty: 'beginner',
        xpReward: 90,
        goldReward: 45,
        icon: '📜',
        timeEstimate: '30 min',
        skills: ['historical-thinking', 'cultural-understanding'],
        requirements: [],
        deliverables: [
          {
            type: 'timeline-creation',
            description: 'Create a timeline of ancient civilizations',
            format: 'text'
          }
        ],
        resources: ['History textbook', 'Maps', 'Archaeological evidence'],
        learningMaterial: {
          title: "Ancient Civilizations Overview",
          content: `
# Ancient Civilizations: Foundations of Human Society

## What are Ancient Civilizations?
Ancient civilizations were the first complex societies that developed writing, government, and advanced technologies.

## Key Ancient Civilizations

### Mesopotamia (3500-500 BCE)
- **Location**: Between Tigris and Euphrates rivers (modern Iraq)
- **Achievements**: First writing system (cuneiform), wheel, irrigation
- **Government**: City-states with kings
- **Culture**: Ziggurats, Epic of Gilgamesh

### Ancient Egypt (3100-30 BCE)
- **Location**: Nile River valley
- **Achievements**: Pyramids, hieroglyphics, calendar, medicine
- **Government**: Pharaohs as divine rulers
- **Culture**: Mummification, Book of the Dead

### Ancient Greece (800-146 BCE)
- **Location**: Greek peninsula and islands
- **Achievements**: Democracy, philosophy, theater, Olympics
- **Government**: City-states (Athens, Sparta)
- **Culture**: Mythology, art, architecture

### Ancient Rome (753 BCE-476 CE)
- **Location**: Italian peninsula, expanded across Mediterranean
- **Achievements**: Law, engineering, roads, aqueducts
- **Government**: Republic, then Empire
- **Culture**: Latin language, gladiators, Christianity

## Common Features of Ancient Civilizations

### Social Structure
- **Rulers**: Kings, pharaohs, emperors
- **Priests**: Religious leaders
- **Merchants**: Traders and craftspeople
- **Farmers**: Agricultural workers
- **Slaves**: Forced labor

### Technological Advances
- **Writing**: Record keeping and communication
- **Metallurgy**: Bronze and iron working
- **Architecture**: Monumental buildings
- **Mathematics**: Number systems and calculations
- **Astronomy**: Calendar systems

### Cultural Achievements
- **Art**: Sculpture, painting, pottery
- **Literature**: Epic poems, plays, histories
- **Religion**: Polytheistic belief systems
- **Philosophy**: Questions about life and existence
          `,
          readingTime: "8-12 minutes",
          keyPoints: [
            "Four major ancient civilizations",
            "Common features of early societies",
            "Technological and cultural achievements",
            "Social structure and government systems"
          ]
        },
        steps: [
          {
            id: 'step-1',
            title: 'Ancient Egypt',
            type: 'multiple-choice',
            question: 'Which civilization built the pyramids?',
            options: ['Ancient Greeks', 'Ancient Egyptians', 'Ancient Romans', 'Ancient Chinese'],
            correctAnswer: 1,
            explanation: 'The Ancient Egyptians built the pyramids as tombs for pharaohs.'
          },
          {
            id: 'step-2',
            title: 'Mesopotamia',
            type: 'multiple-choice',
            question: 'Where was the first writing system developed?',
            options: ['Egypt', 'Greece', 'Mesopotamia', 'China'],
            correctAnswer: 2,
            explanation: 'Cuneiform, the first known writing system, was developed in ancient Mesopotamia.'
          },
          {
            id: 'step-3',
            title: 'Ancient Greece',
            type: 'multiple-choice',
            question: 'What form of government was developed in ancient Athens?',
            options: ['Monarchy', 'Democracy', 'Dictatorship', 'Theocracy'],
            correctAnswer: 1,
            explanation: 'Ancient Athens developed democracy, where citizens could participate in government decisions.'
          },
          {
            id: 'step-4',
            title: 'Ancient Rome',
            type: 'multiple-choice',
            question: 'What was the Roman Empire known for?',
            options: [
              'Building pyramids',
              'Creating the first democracy',
              'Extensive road networks and law',
              'Inventing the wheel'
            ],
            correctAnswer: 2,
            explanation: 'The Roman Empire was known for its extensive road networks, legal system, and engineering achievements.'
          },
          {
            id: 'step-5',
            title: 'Cultural Achievements',
            type: 'multiple-choice',
            question: 'What was a common feature of ancient civilizations?',
            options: [
              'They all spoke the same language',
              'They all had writing systems and monumental architecture',
              'They all lived in the same climate',
              'They all used the same currency'
            ],
            correctAnswer: 1,
            explanation: 'Ancient civilizations commonly developed writing systems and built monumental architecture as expressions of their power and culture.'
          }
        ]
      }
    }
  },
  computerScience: {
    programming: {
      'quest-1': {
        id: 'quest-1',
        title: 'Introduction to Programming',
        description: 'Learn the basics of computer programming',
        type: 'quest',
        difficulty: 'beginner',
        xpReward: 130,
        goldReward: 65,
        icon: '💻',
        timeEstimate: '45 min',
        skills: ['logical-thinking', 'problem-solving'],
        requirements: [],
        deliverables: [
          {
            type: 'code-exercises',
            description: 'Write your first programs',
            format: 'code'
          }
        ],
        resources: ['Programming tutorial', 'Code editor', 'Practice exercises'],
        learningMaterial: {
          title: "Introduction to Programming",
          content: `
# Programming Fundamentals

## What is Programming?
Programming is the process of creating instructions for computers to follow. It involves writing code that tells a computer what to do.

## Basic Programming Concepts

### Variables
- **Definition**: Storage locations that hold data
- **Types**: Numbers, text, true/false values
- **Examples**: age = 25, name = "Alice", isStudent = true

### Data Types
- **Integers**: Whole numbers (1, 2, 3, -5)
- **Floats**: Decimal numbers (3.14, 2.5)
- **Strings**: Text data ("Hello", "World")
- **Booleans**: True or false values

### Control Structures
- **If statements**: Make decisions based on conditions
- **Loops**: Repeat actions multiple times
- **Functions**: Reusable blocks of code

## Programming Languages

### Popular Languages
- **Python**: Easy to learn, great for beginners
- **JavaScript**: Web development and applications
- **Java**: Enterprise software and Android apps
- **C++**: System programming and games

### Choosing a Language
- **Beginner-friendly**: Python, JavaScript
- **Web development**: HTML, CSS, JavaScript
- **Mobile apps**: Swift (iOS), Kotlin (Android)
- **Data science**: Python, R

## Problem-Solving Process

### 1. Understand the Problem
- Read the requirements carefully
- Identify inputs and expected outputs
- Break down complex problems

### 2. Plan Your Solution
- Think through the steps
- Consider different approaches
- Write pseudocode (plain English steps)

### 3. Write the Code
- Start with simple solutions
- Test frequently
- Debug errors as they appear

### 4. Test and Refine
- Test with different inputs
- Check edge cases
- Optimize if needed

## Programming Best Practices

### Code Organization
- Use meaningful variable names
- Add comments to explain complex logic
- Keep functions small and focused
- Follow consistent formatting

### Debugging Tips
- Read error messages carefully
- Use print statements to trace execution
- Test with simple examples first
- Ask for help when stuck
          `,
          readingTime: "10-15 minutes",
          keyPoints: [
            "Variables store data in programs",
            "Different data types for different information",
            "Control structures guide program flow",
            "Problem-solving process for programming"
          ]
        },
        steps: [
          {
            id: 'step-1',
            title: 'Variables',
            type: 'multiple-choice',
            question: 'What is a variable in programming?',
            options: [
              'A storage location for data',
              'A type of function',
              'A programming language',
              'A computer part'
            ],
            correctAnswer: 0,
            explanation: 'A variable is a storage location that holds data that can be changed during program execution.'
          },
          {
            id: 'step-2',
            title: 'Data Types',
            type: 'multiple-choice',
            question: 'Which is NOT a common data type?',
            options: ['String', 'Integer', 'Boolean', 'Triangle'],
            correctAnswer: 3,
            explanation: 'String, Integer, and Boolean are common data types. Triangle is not a programming data type.'
          },
          {
            id: 'step-3',
            title: 'Control Structures',
            type: 'multiple-choice',
            question: 'What is a loop in programming?',
            options: [
              'A way to stop a program',
              'A way to repeat code multiple times',
              'A way to store data',
              'A way to print text'
            ],
            correctAnswer: 1,
            explanation: 'A loop is a control structure that repeats a block of code multiple times.'
          },
          {
            id: 'step-4',
            title: 'Functions',
            type: 'multiple-choice',
            question: 'What is a function in programming?',
            options: [
              'A variable that stores data',
              'A reusable block of code that performs a task',
              'A type of loop',
              'A programming language'
            ],
            correctAnswer: 1,
            explanation: 'A function is a reusable block of code that performs a specific task and can be called multiple times.'
          },
          {
            id: 'step-5',
            title: 'Algorithms',
            type: 'multiple-choice',
            question: 'What is an algorithm?',
            options: [
              'A programming language',
              'A step-by-step procedure to solve a problem',
              'A type of variable',
              'A computer part'
            ],
            correctAnswer: 1,
            explanation: 'An algorithm is a step-by-step procedure or set of rules to solve a problem or complete a task.'
          }
        ]
      }
    }
  },
  literature: {
    poetry: {
      'quest-1': {
        id: 'quest-1',
        title: 'Poetry Analysis',
        description: 'Learn to analyze and understand poetry',
        type: 'quest',
        difficulty: 'beginner',
        xpReward: 95,
        goldReward: 47,
        icon: '📚',
        timeEstimate: '35 min',
        skills: ['literary-analysis', 'critical-thinking'],
        requirements: [],
        deliverables: [
          {
            type: 'poetry-analysis',
            description: 'Analyze a classic poem',
            format: 'text'
          }
        ],
        resources: ['Poetry anthology', 'Literary analysis guide', 'Examples'],
        learningMaterial: {
          title: "Poetry Analysis Fundamentals",
          content: `
# Understanding Poetry: A Beginner's Guide

## What is Poetry?
Poetry is a form of literature that uses language, rhythm, and imagery to express ideas and emotions in a concentrated and artistic way.

## Key Elements of Poetry

### Rhythm and Meter
- **Rhythm**: The pattern of stressed and unstressed syllables
- **Meter**: The regular pattern of rhythm in a poem
- **Examples**: Iambic pentameter, trochaic tetrameter

### Rhyme and Sound
- **Rhyme**: Words that sound the same at the end of lines
- **Alliteration**: Repetition of consonant sounds
- **Assonance**: Repetition of vowel sounds
- **Onomatopoeia**: Words that imitate sounds

### Figurative Language
- **Metaphor**: Direct comparison without "like" or "as"
- **Simile**: Comparison using "like" or "as"
- **Personification**: Giving human qualities to non-human things
- **Symbolism**: Using objects to represent ideas

## Types of Poetry

### Traditional Forms
- **Sonnet**: 14-line poem with specific rhyme scheme
- **Haiku**: 3-line poem with 5-7-5 syllable pattern
- **Limerick**: 5-line humorous poem
- **Ballad**: Narrative poem that tells a story

### Free Verse
- **No fixed structure**: No regular meter or rhyme
- **Natural speech patterns**: More conversational tone
- **Modern poetry**: Popular in 20th and 21st centuries

## How to Analyze Poetry

### Step 1: Read Aloud
- Listen to the rhythm and sound
- Notice the emotional impact
- Identify the overall mood

### Step 2: Identify Structure
- Count lines and stanzas
- Look for rhyme patterns
- Notice line breaks and punctuation

### Step 3: Analyze Language
- Find figurative language
- Look for repeated words or phrases
- Consider word choice and tone

### Step 4: Interpret Meaning
- What is the main theme?
- What emotions does it convey?
- What is the poet trying to say?

## Common Themes in Poetry
- **Love and relationships**
- **Nature and the environment**
- **Death and loss**
- **Identity and self-discovery**
- **Social and political issues**
          `,
          readingTime: "8-12 minutes",
          keyPoints: [
            "Poetry uses rhythm, rhyme, and figurative language",
            "Different types of poetry have different structures",
            "Analysis involves reading, structure, language, and meaning",
            "Common themes include love, nature, and identity"
          ]
        },
        steps: [
          {
            id: 'step-1',
            title: 'Poetic Devices',
            type: 'multiple-choice',
            question: 'What is a metaphor?',
            options: [
              'A comparison using like or as',
              'A direct comparison without like or as',
              'The repetition of sounds',
              'The pattern of stressed syllables'
            ],
            correctAnswer: 1,
            explanation: 'A metaphor is a direct comparison between two unlike things without using like or as.'
          },
          {
            id: 'step-2',
            title: 'Rhyme Scheme',
            type: 'multiple-choice',
            question: 'What is the rhyme scheme of a sonnet?',
            options: ['ABAB CDCD EFEF GG', 'AABB CCDD EEFF GG', 'ABBA ABBA CDE CDE', 'All of the above'],
            correctAnswer: 3,
            explanation: 'Different types of sonnets have different rhyme schemes, including all the options listed.'
          },
          {
            id: 'step-3',
            title: 'Simile vs Metaphor',
            type: 'multiple-choice',
            question: 'What is the difference between a simile and a metaphor?',
            options: [
              'No difference',
              'Simile uses like or as, metaphor does not',
              'Metaphor is longer than simile',
              'Simile is more poetic than metaphor'
            ],
            correctAnswer: 1,
            explanation: 'A simile uses like or as to make comparisons, while a metaphor makes direct comparisons without these words.'
          },
          {
            id: 'step-4',
            title: 'Poetry Forms',
            type: 'multiple-choice',
            question: 'What is a haiku?',
            options: [
              'A 14-line poem',
              'A 3-line poem with 5-7-5 syllables',
              'A poem without rhyme',
              'A long narrative poem'
            ],
            correctAnswer: 1,
            explanation: 'A haiku is a traditional Japanese poem with 3 lines and a 5-7-5 syllable pattern.'
          },
          {
            id: 'step-5',
            title: 'Poetry Themes',
            type: 'multiple-choice',
            question: 'What are common themes in poetry?',
            options: [
              'Only love and romance',
              'Love, nature, death, identity, and social issues',
              'Only nature and animals',
              'Only historical events'
            ],
            correctAnswer: 1,
            explanation: 'Poetry explores many themes including love, nature, death, identity, and social issues.'
          }
        ]
      }
    }
  },
  psychology: {
    cognitive: {
      'quest-1': {
        id: 'quest-1',
        title: 'Cognitive Psychology',
        description: 'Understand how the mind processes information',
        type: 'quest',
        difficulty: 'beginner',
        xpReward: 105,
        goldReward: 52,
        icon: '🧠',
        timeEstimate: '40 min',
        skills: ['psychological-thinking', 'research-methods'],
        requirements: [],
        deliverables: [
          {
            type: 'cognitive-experiment',
            description: 'Design a simple cognitive experiment',
            format: 'text'
          }
        ],
        resources: ['Psychology textbook', 'Research papers', 'Case studies'],
        learningMaterial: {
          title: "Cognitive Psychology Fundamentals",
          content: `
# Introduction to Cognitive Psychology

## What is Cognitive Psychology?
Cognitive psychology is the study of mental processes including how people think, perceive, remember, and learn.

## Key Mental Processes

### Memory Systems
- **Sensory Memory**: Brief storage of sensory information
- **Short-term Memory**: Temporary storage (7±2 items)
- **Long-term Memory**: Permanent storage of information
- **Working Memory**: Active processing of information

### Attention
- **Selective Attention**: Focusing on one thing while ignoring others
- **Divided Attention**: Paying attention to multiple things
- **Sustained Attention**: Maintaining focus over time
- **Attention Deficit**: Difficulty maintaining focus

### Perception
- **Bottom-up Processing**: Building perception from sensory input
- **Top-down Processing**: Using knowledge to interpret sensations
- **Gestalt Principles**: How we organize visual information
- **Perceptual Illusions**: When perception doesn't match reality

## Cognitive Development

### Information Processing Model
1. **Input**: Information enters the system
2. **Processing**: Information is analyzed and interpreted
3. **Storage**: Information is stored in memory
4. **Output**: Information is retrieved and used

### Problem-Solving Strategies
- **Algorithm**: Step-by-step procedure
- **Heuristic**: Mental shortcut or rule of thumb
- **Insight**: Sudden understanding of a problem
- **Trial and Error**: Trying different approaches

## Research Methods

### Experimental Design
- **Independent Variable**: What the researcher manipulates
- **Dependent Variable**: What is measured
- **Control Group**: Group that doesn't receive treatment
- **Random Assignment**: Randomly assigning participants to groups

### Cognitive Tasks
- **Memory Tests**: Recall and recognition tasks
- **Attention Tasks**: Focus and concentration tests
- **Problem-Solving Tasks**: Logic and reasoning tests
- **Reaction Time**: Speed of mental processing

## Applications

### Education
- **Learning Styles**: Visual, auditory, kinesthetic
- **Memory Techniques**: Mnemonics and chunking
- **Study Strategies**: Spaced repetition and elaboration

### Technology
- **User Interface Design**: Making technology user-friendly
- **Human-Computer Interaction**: How people use computers
- **Artificial Intelligence**: Modeling human cognition

### Clinical Applications
- **Cognitive Therapy**: Changing negative thought patterns
- **Memory Training**: Improving memory function
- **Attention Training**: Enhancing focus and concentration
          `,
          readingTime: "10-15 minutes",
          keyPoints: [
            "Cognitive psychology studies mental processes",
            "Memory, attention, and perception are key areas",
            "Research methods include experiments and tasks",
            "Applications in education, technology, and therapy"
          ]
        },
        steps: [
          {
            id: 'step-1',
            title: 'Memory Systems',
            type: 'multiple-choice',
            question: 'What are the three stages of memory?',
            options: [
              'Encoding, storage, retrieval',
              'Short-term, long-term, working',
              'Sensory, short-term, long-term',
              'Implicit, explicit, procedural'
            ],
            correctAnswer: 0,
            explanation: 'The three stages of memory are encoding (input), storage (retention), and retrieval (output).'
          },
          {
            id: 'step-2',
            title: 'Attention',
            type: 'multiple-choice',
            question: 'What is selective attention?',
            options: [
              'Paying attention to everything at once',
              'Focusing on one thing while ignoring others',
              'Remembering everything you see',
              'Processing information unconsciously'
            ],
            correctAnswer: 1,
            explanation: 'Selective attention is the ability to focus on one stimulus while filtering out others.'
          },
          {
            id: 'step-3',
            title: 'Perception',
            type: 'multiple-choice',
            question: 'What is perception?',
            options: [
              'The process of storing information',
              'The process of interpreting sensory information',
              'The process of forgetting information',
              'The process of learning new skills'
            ],
            correctAnswer: 1,
            explanation: 'Perception is the process of interpreting and organizing sensory information to understand the world.'
          },
          {
            id: 'step-4',
            title: 'Problem Solving',
            type: 'multiple-choice',
            question: 'What is the first step in problem solving?',
            options: [
              'Implementing a solution',
              'Defining the problem',
              'Testing the solution',
              'Gathering resources'
            ],
            correctAnswer: 1,
            explanation: 'The first step in problem solving is defining and understanding the problem clearly.'
          },
          {
            id: 'step-5',
            title: 'Cognitive Development',
            type: 'multiple-choice',
            question: 'Who developed the theory of cognitive development?',
            options: [
              'Sigmund Freud',
              'Jean Piaget',
              'B.F. Skinner',
              'Carl Rogers'
            ],
            correctAnswer: 1,
            explanation: 'Jean Piaget developed the theory of cognitive development, describing how children\'s thinking changes with age.'
          }
        ]
      }
    }
  },
  sociology: {
    'social-structures': {
      'quest-1': {
        id: 'quest-1',
        title: 'Social Institutions',
        description: 'Learn about social institutions and their functions',
        type: 'quest',
        difficulty: 'beginner',
        xpReward: 100,
        goldReward: 50,
        icon: '👥',
        timeEstimate: '35 min',
        skills: ['sociological-thinking', 'social-analysis'],
        requirements: [],
        deliverables: [
          {
            type: 'social-analysis',
            description: 'Analyze a social institution in your community',
            format: 'text'
          }
        ],
        resources: ['Sociology textbook', 'Social research', 'Community studies'],
        learningMaterial: {
          title: "Social Institutions and Society",
          content: `
# Understanding Social Institutions

## What are Social Institutions?
Social institutions are organized patterns of beliefs and behaviors centered on basic social needs. They provide structure and stability to society.

## Major Social Institutions

### Family
- **Definition**: The basic unit of society, responsible for reproduction and socialization
- **Functions**: Child-rearing, emotional support, economic cooperation
- **Types**: Nuclear, extended, single-parent, blended families
- **Changes**: From traditional to modern family structures

### Education
- **Purpose**: Transmitting knowledge, skills, and cultural values
- **Functions**: Socialization, social mobility, economic preparation
- **Levels**: Primary, secondary, higher education
- **Issues**: Access, quality, inequality in education

### Religion
- **Definition**: System of beliefs and practices related to the sacred
- **Functions**: Meaning-making, social cohesion, moral guidance
- **Types**: Monotheistic, polytheistic, non-theistic
- **Role**: Personal spirituality and social organization

### Government/Politics
- **Purpose**: Making and enforcing laws, maintaining order
- **Functions**: Law-making, defense, public services
- **Types**: Democracy, authoritarianism, totalitarianism
- **Power**: How power is distributed and exercised

### Economy
- **Definition**: System for producing, distributing, and consuming goods
- **Functions**: Resource allocation, employment, wealth creation
- **Types**: Capitalism, socialism, mixed economies
- **Issues**: Inequality, unemployment, economic cycles

## How Institutions Work Together

### Interdependence
- Institutions are interconnected and influence each other
- Changes in one institution affect others
- Example: Economic changes affect family structures

### Socialization
- Institutions teach us how to behave in society
- They transmit cultural values and norms
- They prepare us for different social roles

### Social Control
- Institutions maintain social order
- They enforce rules and norms
- They provide consequences for deviant behavior

## Studying Social Institutions

### Sociological Perspectives
- **Functionalist**: How institutions contribute to social stability
- **Conflict**: How institutions maintain inequality
- **Symbolic Interactionist**: How people create meaning in institutions

### Research Methods
- **Surveys**: Asking people about their experiences
- **Interviews**: In-depth conversations with individuals
- **Observation**: Watching how institutions work in practice
- **Historical Analysis**: Studying how institutions change over time
          `,
          readingTime: "8-12 minutes",
          keyPoints: [
            "Social institutions provide structure to society",
            "Major institutions include family, education, religion, government, and economy",
            "Institutions are interconnected and influence each other",
            "Sociologists study institutions from different perspectives"
          ]
        },
        steps: [
          {
            id: 'step-1',
            title: 'Social Institutions',
            type: 'multiple-choice',
            question: 'Which is NOT a major social institution?',
            options: ['Family', 'Education', 'Government', 'Weather'],
            correctAnswer: 3,
            explanation: 'Family, Education, and Government are major social institutions. Weather is a natural phenomenon, not a social institution.'
          },
          {
            id: 'step-2',
            title: 'Social Functions',
            type: 'multiple-choice',
            question: 'What is the primary function of education?',
            options: [
              'To provide entertainment',
              'To socialize individuals and transmit culture',
              'To make money',
              'To control the weather'
            ],
            correctAnswer: 1,
            explanation: 'Education serves to socialize individuals and transmit cultural knowledge from one generation to the next.'
          },
          {
            id: 'step-3',
            title: 'Social Stratification',
            type: 'multiple-choice',
            question: 'What is social stratification?',
            options: [
              'The process of making friends',
              'The division of society into different social classes',
              'The study of weather patterns',
              'The organization of schools'
            ],
            correctAnswer: 1,
            explanation: 'Social stratification is the division of society into different social classes based on factors like wealth, power, and status.'
          },
          {
            id: 'step-4',
            title: 'Social Groups',
            type: 'multiple-choice',
            question: 'What is a primary group?',
            options: [
              'A large organization',
              'A small, intimate group with close relationships',
              'A group of strangers',
              'A government agency'
            ],
            correctAnswer: 1,
            explanation: 'A primary group is a small, intimate group with close, personal relationships, like family or close friends.'
          },
          {
            id: 'step-5',
            title: 'Social Change',
            type: 'multiple-choice',
            question: 'What causes social change?',
            options: [
              'Only natural disasters',
              'Technological innovation, social movements, and cultural shifts',
              'Only government decisions',
              'Only individual choices'
            ],
            correctAnswer: 1,
            explanation: 'Social change is caused by multiple factors including technological innovation, social movements, cultural shifts, and other social forces.'
          }
        ]
      }
    }
  },
  economics: {
    microeconomics: {
      'quest-1': {
        id: 'quest-1',
        title: 'Supply and Demand',
        description: 'Understand the fundamental principles of market economics',
        type: 'quest',
        difficulty: 'beginner',
        xpReward: 110,
        goldReward: 55,
        icon: '💰',
        timeEstimate: '30 min',
        skills: ['economic-thinking', 'market-analysis'],
        requirements: [],
        deliverables: [
          {
            type: 'market-analysis',
            description: 'Analyze supply and demand for a product',
            format: 'text'
          }
        ],
        resources: ['Economics textbook', 'Market data', 'Case studies'],
        learningMaterial: {
          title: "Supply and Demand Fundamentals",
          content: `
# Understanding Supply and Demand

## What is Supply and Demand?
Supply and demand is the fundamental economic model that explains how prices are determined in markets.

## The Law of Demand
- **Definition**: As price increases, quantity demanded decreases
- **Reason**: People buy less when things are more expensive
- **Graph**: Downward-sloping demand curve
- **Example**: If pizza costs $20, fewer people will buy it than if it costs $5

## The Law of Supply
- **Definition**: As price increases, quantity supplied increases
- **Reason**: Higher prices make it more profitable to produce
- **Graph**: Upward-sloping supply curve
- **Example**: If pizza sells for $20, more restaurants will want to make pizza

## Market Equilibrium
- **Definition**: Where supply and demand curves intersect
- **Equilibrium Price**: The price where quantity supplied equals quantity demanded
- **Equilibrium Quantity**: The amount bought and sold at equilibrium price
- **Market Clearing**: No excess supply or demand

## Factors Affecting Demand

### Price of the Good
- **Direct relationship**: Higher price = lower demand
- **Movement along curve**: Price changes cause movement along demand curve

### Other Factors (Shift the Curve)
- **Income**: Higher income usually increases demand
- **Tastes and Preferences**: What people like changes demand
- **Prices of Related Goods**: Substitutes and complements
- **Population**: More people = more demand
- **Expectations**: Future price expectations affect current demand

## Factors Affecting Supply

### Price of the Good
- **Direct relationship**: Higher price = higher supply
- **Movement along curve**: Price changes cause movement along supply curve

### Other Factors (Shift the Curve)
- **Cost of Production**: Higher costs reduce supply
- **Technology**: Better technology increases supply
- **Number of Sellers**: More sellers = more supply
- **Government Policies**: Taxes and regulations affect supply
- **Natural Conditions**: Weather affects agricultural supply

## Market Dynamics

### Shortage
- **Definition**: When demand exceeds supply at current price
- **Result**: Prices tend to rise
- **Example**: Popular concert tickets sell out quickly

### Surplus
- **Definition**: When supply exceeds demand at current price
- **Result**: Prices tend to fall
- **Example**: Too many winter coats in summer

### Price Elasticity
- **Elastic Demand**: Quantity demanded changes significantly with price
- **Inelastic Demand**: Quantity demanded changes little with price
- **Factors**: Availability of substitutes, necessity of good, time period

## Real-World Applications

### Consumer Behavior
- Understanding why people buy certain products
- How advertising affects demand
- Seasonal demand patterns

### Business Decisions
- Setting prices to maximize profit
- Deciding what to produce
- Responding to market changes

### Government Policy
- Price controls and their effects
- Taxes and subsidies
- Market regulation
          `,
          readingTime: "10-15 minutes",
          keyPoints: [
            "Demand decreases as price increases",
            "Supply increases as price increases",
            "Equilibrium occurs where supply and demand intersect",
            "Many factors can shift supply and demand curves"
          ]
        },
        steps: [
          {
            id: 'step-1',
            title: 'Demand Curve',
            type: 'multiple-choice',
            question: 'What happens to demand when price increases?',
            options: [
              'Demand increases',
              'Demand decreases',
              'Demand stays the same',
              'Demand becomes infinite'
            ],
            correctAnswer: 1,
            explanation: 'According to the law of demand, when price increases, quantity demanded decreases (and vice versa).'
          },
          {
            id: 'step-2',
            title: 'Market Equilibrium',
            type: 'multiple-choice',
            question: 'What is market equilibrium?',
            options: [
              'When supply equals demand',
              'When prices are highest',
              'When there is no competition',
              'When government controls prices'
            ],
            correctAnswer: 0,
            explanation: 'Market equilibrium occurs when supply equals demand, determining the market price and quantity.'
          },
          {
            id: 'step-3',
            title: 'Supply Factors',
            type: 'multiple-choice',
            question: 'What happens to supply when production costs increase?',
            options: [
              'Supply increases',
              'Supply decreases',
              'Supply stays the same',
              'Supply becomes infinite'
            ],
            correctAnswer: 1,
            explanation: 'When production costs increase, suppliers are less willing to produce at the same price, so supply decreases.'
          },
          {
            id: 'step-4',
            title: 'Price Elasticity',
            type: 'multiple-choice',
            question: 'What is elastic demand?',
            options: [
              'Demand that never changes',
              'Demand that changes significantly with price',
              'Demand that is always high',
              'Demand that is always low'
            ],
            correctAnswer: 1,
            explanation: 'Elastic demand means that quantity demanded changes significantly when price changes.'
          },
          {
            id: 'step-5',
            title: 'Market Shortages',
            type: 'multiple-choice',
            question: 'What happens in a market shortage?',
            options: [
              'Prices tend to fall',
              'Prices tend to rise',
              'Supply and demand are equal',
              'No one wants the product'
            ],
            correctAnswer: 1,
            explanation: 'In a shortage, demand exceeds supply, so prices tend to rise as buyers compete for limited goods.'
          }
        ]
      }
    }
  },
  geography: {
    physical: {
      'quest-1': {
        id: 'quest-1',
        title: 'Earth\'s Physical Features',
        description: 'Learn about the Earth\'s landforms and natural features',
        type: 'quest',
        difficulty: 'beginner',
        xpReward: 90,
        goldReward: 45,
        icon: '🌍',
        timeEstimate: '30 min',
        skills: ['geographical-thinking', 'spatial-analysis'],
        requirements: [],
        deliverables: [
          {
            type: 'landform-identification',
            description: 'Identify different landforms on a map',
            format: 'diagram'
          }
        ],
        resources: ['Geography textbook', 'Maps', 'Satellite imagery'],
        learningMaterial: {
          title: "Earth's Physical Features and Landforms",
          content: `
# Understanding Earth's Physical Geography

## What is Physical Geography?
Physical geography studies the natural features and processes of Earth's surface, including landforms, climate, and ecosystems.

## Major Landforms

### Mountains
- **Formation**: Tectonic plate collision, volcanic activity
- **Characteristics**: High elevation, steep slopes, rocky terrain
- **Examples**: Himalayas, Andes, Rocky Mountains
- **Importance**: Water sources, biodiversity, recreation

### Plains
- **Formation**: Sediment deposition, erosion
- **Characteristics**: Flat or gently rolling terrain
- **Examples**: Great Plains, Pampas, Steppes
- **Importance**: Agriculture, transportation, settlement

### Plateaus
- **Formation**: Uplift, volcanic activity
- **Characteristics**: Elevated flat areas
- **Examples**: Tibetan Plateau, Colorado Plateau
- **Importance**: Water sources, mineral resources

### Valleys
- **Formation**: River erosion, glacial activity
- **Characteristics**: Low areas between higher land
- **Examples**: Grand Canyon, Rhine Valley
- **Importance**: Transportation routes, fertile soil

## Water Features

### Rivers
- **Formation**: Precipitation, snowmelt, springs
- **Characteristics**: Flowing water, erosion and deposition
- **Examples**: Amazon, Nile, Mississippi
- **Importance**: Transportation, irrigation, hydroelectric power

### Lakes
- **Formation**: Glacial activity, tectonic movement, volcanic craters
- **Characteristics**: Standing water bodies
- **Examples**: Great Lakes, Lake Baikal, Caspian Sea
- **Importance**: Freshwater supply, recreation, transportation

### Oceans
- **Formation**: Tectonic plate movement
- **Characteristics**: Large saltwater bodies
- **Examples**: Pacific, Atlantic, Indian Ocean
- **Importance**: Climate regulation, transportation, resources

## Climate and Weather

### Climate Zones
- **Tropical**: Hot and humid year-round
- **Temperate**: Four distinct seasons
- **Polar**: Cold year-round
- **Desert**: Hot and dry
- **Mediterranean**: Hot, dry summers; mild, wet winters

### Weather Patterns
- **Precipitation**: Rain, snow, sleet, hail
- **Temperature**: Daily and seasonal variations
- **Wind**: Global wind patterns, local breezes
- **Storms**: Hurricanes, tornadoes, blizzards

## Natural Processes

### Erosion
- **Water Erosion**: Rivers, rain, waves
- **Wind Erosion**: Sand and dust movement
- **Glacial Erosion**: Ice movement and melting
- **Effects**: Landform changes, soil loss

### Deposition
- **River Deposition**: Deltas, floodplains
- **Wind Deposition**: Sand dunes, loess
- **Glacial Deposition**: Moraines, till
- **Effects**: New landforms, fertile soil

### Tectonic Activity
- **Plate Movement**: Continental drift
- **Earthquakes**: Sudden ground movement
- **Volcanoes**: Magma and ash eruption
- **Effects**: Mountain building, landform creation

## Human Impact

### Environmental Changes
- **Deforestation**: Loss of forest cover
- **Urbanization**: City growth and expansion
- **Pollution**: Air, water, and soil contamination
- **Climate Change**: Global temperature increase

### Conservation
- **Protected Areas**: National parks, wildlife reserves
- **Sustainable Development**: Balancing growth and environment
- **Renewable Energy**: Solar, wind, hydroelectric power
- **Environmental Policies**: Laws and regulations
          `,
          readingTime: "8-12 minutes",
          keyPoints: [
            "Physical geography studies Earth's natural features",
            "Major landforms include mountains, plains, plateaus, and valleys",
            "Water features include rivers, lakes, and oceans",
            "Natural processes like erosion and deposition shape the landscape"
          ]
        },
        steps: [
          {
            id: 'step-1',
            title: 'Landforms',
            type: 'multiple-choice',
            question: 'What is the highest type of landform?',
            options: ['Hill', 'Mountain', 'Plateau', 'Valley'],
            correctAnswer: 1,
            explanation: 'Mountains are the highest landforms, typically rising more than 1,000 feet above surrounding land.'
          },
          {
            id: 'step-2',
            title: 'Water Bodies',
            type: 'multiple-choice',
            question: 'What is the largest ocean?',
            options: ['Atlantic', 'Pacific', 'Indian', 'Arctic'],
            correctAnswer: 1,
            explanation: 'The Pacific Ocean is the largest ocean, covering more than 30% of Earth\'s surface.'
          },
          {
            id: 'step-3',
            title: 'Climate Zones',
            type: 'multiple-choice',
            question: 'What characterizes a tropical climate?',
            options: [
              'Four distinct seasons',
              'Hot and humid year-round',
              'Cold year-round',
              'Hot and dry'
            ],
            correctAnswer: 1,
            explanation: 'Tropical climates are characterized by hot and humid conditions year-round with little seasonal variation.'
          },
          {
            id: 'step-4',
            title: 'Natural Processes',
            type: 'multiple-choice',
            question: 'What is erosion?',
            options: [
              'The building up of landforms',
              'The wearing away of landforms by natural forces',
              'The creation of mountains',
              'The formation of rivers'
            ],
            correctAnswer: 1,
            explanation: 'Erosion is the process of wearing away landforms by natural forces like water, wind, and ice.'
          },
          {
            id: 'step-5',
            title: 'Tectonic Activity',
            type: 'multiple-choice',
            question: 'What causes earthquakes?',
            options: [
              'Weather changes',
              'Movement of tectonic plates',
              'Ocean currents',
              'Wind patterns'
            ],
            correctAnswer: 1,
            explanation: 'Earthquakes are caused by the movement and interaction of tectonic plates beneath Earth\'s surface.'
          }
        ]
      }
    }
  },
  art: {
    painting: {
      'quest-1': {
        id: 'quest-1',
        title: 'Art History and Techniques',
        description: 'Explore different art movements and painting techniques',
        type: 'quest',
        difficulty: 'beginner',
        xpReward: 85,
        goldReward: 42,
        icon: '🎨',
        timeEstimate: '35 min',
        skills: ['artistic-thinking', 'visual-analysis'],
        requirements: [],
        deliverables: [
          {
            type: 'art-analysis',
            description: 'Analyze a famous painting',
            format: 'text'
          }
        ],
        resources: ['Art history book', 'Museum collections', 'Artist biographies'],
        learningMaterial: {
          title: "Art History and Visual Techniques",
          content: `
# Understanding Art History and Techniques

## What is Art?
Art is the expression of human creativity and imagination through visual, auditory, or performance forms.

## Major Art Movements

### Renaissance (1400-1600)
- **Characteristics**: Realistic representation, perspective, humanism
- **Key Artists**: Leonardo da Vinci, Michelangelo, Raphael
- **Techniques**: Oil painting, chiaroscuro, linear perspective
- **Famous Works**: Mona Lisa, Sistine Chapel ceiling

### Impressionism (1860-1880)
- **Characteristics**: Capturing light and color, loose brushstrokes
- **Key Artists**: Claude Monet, Pierre-Auguste Renoir, Edgar Degas
- **Techniques**: Plein air painting, broken color, visible brushstrokes
- **Famous Works**: Water Lilies, Luncheon of the Boating Party

### Post-Impressionism (1880-1900)
- **Characteristics**: Emotional expression, bold colors, geometric forms
- **Key Artists**: Vincent van Gogh, Paul Cézanne, Paul Gauguin
- **Techniques**: Thick paint application, bold color choices
- **Famous Works**: Starry Night, The Card Players

### Modern Art (1900-1970)
- **Characteristics**: Breaking traditional rules, experimentation
- **Key Artists**: Pablo Picasso, Henri Matisse, Jackson Pollock
- **Techniques**: Cubism, abstract expressionism, collage
- **Famous Works**: Les Demoiselles d'Avignon, Guernica

## Art Techniques

### Drawing
- **Pencil**: Graphite, charcoal, colored pencils
- **Ink**: Pen and ink, brush and ink, markers
- **Paper**: Different textures and weights
- **Methods**: Hatching, cross-hatching, stippling

### Painting
- **Watercolor**: Transparent, fluid, quick-drying
- **Oil**: Rich colors, slow-drying, blendable
- **Acrylic**: Fast-drying, versatile, water-soluble
- **Tempera**: Egg-based, matte finish, traditional

### Sculpture
- **Materials**: Stone, wood, metal, clay, glass
- **Methods**: Carving, modeling, casting, assembling
- **Techniques**: Relief, in-the-round, installation
- **Tools**: Chisels, hammers, files, welding equipment

### Digital Art
- **Software**: Photoshop, Illustrator, Procreate
- **Tablets**: Drawing tablets, stylus pens
- **Techniques**: Digital painting, vector graphics, 3D modeling
- **Advantages**: Undo function, layers, infinite colors

## Elements of Art

### Line
- **Definition**: A mark made by a moving point
- **Types**: Straight, curved, thick, thin, broken
- **Functions**: Outline, texture, movement, direction

### Shape
- **Definition**: A two-dimensional area with boundaries
- **Types**: Geometric (circles, squares) and organic (natural forms)
- **Functions**: Composition, balance, emphasis

### Color
- **Primary**: Red, blue, yellow (cannot be mixed)
- **Secondary**: Green, orange, purple (mixed from primaries)
- **Warm Colors**: Red, orange, yellow (energy, warmth)
- **Cool Colors**: Blue, green, purple (calm, distance)

### Texture
- **Definition**: The surface quality of an object
- **Types**: Rough, smooth, bumpy, soft, hard
- **Methods**: Actual texture (real) and implied texture (visual)

### Space
- **Positive Space**: The subject or objects in artwork
- **Negative Space**: The empty areas around objects
- **Perspective**: Creating depth and dimension
- **Overlap**: Objects in front of others

## Principles of Design

### Balance
- **Symmetrical**: Equal weight on both sides
- **Asymmetrical**: Unequal but balanced composition
- **Radial**: Elements arranged around a center point

### Emphasis
- **Focal Point**: The main area of interest
- **Methods**: Color, size, contrast, placement
- **Purpose**: Directing the viewer's attention

### Movement
- **Definition**: The path the eye follows through artwork
- **Methods**: Lines, shapes, colors, repetition
- **Types**: Actual movement (kinetic art) and implied movement

### Unity
- **Definition**: All elements working together harmoniously
- **Methods**: Repetition, similarity, proximity
- **Purpose**: Creating a cohesive composition
          `,
          readingTime: "10-15 minutes",
          keyPoints: [
            "Art movements reflect historical and cultural changes",
            "Different techniques use various materials and methods",
            "Elements of art are the building blocks of visual composition",
            "Principles of design guide how elements are arranged"
          ]
        },
        steps: [
          {
            id: 'step-1',
            title: 'Art Movements',
            type: 'multiple-choice',
            question: 'Which art movement is known for its emphasis on light and color?',
            options: ['Cubism', 'Impressionism', 'Surrealism', 'Abstract Expressionism'],
            correctAnswer: 1,
            explanation: 'Impressionism is known for its emphasis on capturing light and color in outdoor scenes.'
          },
          {
            id: 'step-2',
            title: 'Painting Techniques',
            type: 'multiple-choice',
            question: 'What is chiaroscuro?',
            options: [
              'A type of brush',
              'The use of light and dark contrast',
              'A color mixing technique',
              'A canvas preparation method'
            ],
            correctAnswer: 1,
            explanation: 'Chiaroscuro is the use of light and dark contrast to create depth and volume in painting.'
          },
          {
            id: 'step-3',
            title: 'Elements of Art',
            type: 'multiple-choice',
            question: 'What are the primary colors?',
            options: [
              'Red, blue, green',
              'Red, blue, yellow',
              'Orange, purple, green',
              'Black, white, gray'
            ],
            correctAnswer: 1,
            explanation: 'The primary colors are red, blue, and yellow - they cannot be created by mixing other colors.'
          },
          {
            id: 'step-4',
            title: 'Principles of Design',
            type: 'multiple-choice',
            question: 'What is balance in art?',
            options: [
              'The use of bright colors',
              'The distribution of visual weight in a composition',
              'The size of the artwork',
              'The speed of creating art'
            ],
            correctAnswer: 1,
            explanation: 'Balance is the distribution of visual weight in a composition, creating a sense of stability.'
          },
          {
            id: 'step-5',
            title: 'Art History',
            type: 'multiple-choice',
            question: 'Who painted the Mona Lisa?',
            options: [
              'Vincent van Gogh',
              'Leonardo da Vinci',
              'Pablo Picasso',
              'Michelangelo'
            ],
            correctAnswer: 1,
            explanation: 'Leonardo da Vinci painted the Mona Lisa, one of the most famous paintings in the world.'
          }
        ]
      }
    }
  },
  music: {
    theory: {
      'quest-1': {
        id: 'quest-1',
        title: 'Music Theory Fundamentals',
        description: 'Learn the basics of music theory and notation',
        type: 'quest',
        difficulty: 'beginner',
        xpReward: 95,
        goldReward: 47,
        icon: '🎵',
        timeEstimate: '40 min',
        skills: ['musical-thinking', 'aural-skills'],
        requirements: [],
        deliverables: [
          {
            type: 'music-composition',
            description: 'Write a simple melody',
            format: 'notation'
          }
        ],
        resources: ['Music theory book', 'Piano/keyboard', 'Notation software'],
        learningMaterial: {
          title: "Music Theory Fundamentals",
          content: `
# Understanding Music Theory

## What is Music Theory?
Music theory is the study of how music works, including the principles and practices of musical composition and performance.

## Musical Notes and Scales

### The Musical Alphabet
- **Notes**: A, B, C, D, E, F, G (then repeats)
- **Sharps (#)**: Raise a note by half step
- **Flats (b)**: Lower a note by half step
- **Natural (♮)**: Cancel a sharp or flat

### Major Scales
- **Pattern**: Whole-Whole-Half-Whole-Whole-Whole-Half
- **C Major**: C-D-E-F-G-A-B-C (all white keys)
- **G Major**: G-A-B-C-D-E-F#-G (one sharp)
- **F Major**: F-G-A-Bb-C-D-E-F (one flat)

### Minor Scales
- **Natural Minor**: Same pattern as major, starting on different note
- **Harmonic Minor**: Raised 7th note
- **Melodic Minor**: Raised 6th and 7th ascending, natural descending

## Intervals and Chords

### Intervals
- **Unison**: Same note (C to C)
- **Second**: Two notes apart (C to D)
- **Third**: Three notes apart (C to E)
- **Perfect Fourth**: Four notes apart (C to F)
- **Perfect Fifth**: Five notes apart (C to G)
- **Octave**: Eight notes apart (C to C)

### Triads (Three-Note Chords)
- **Major Triad**: Root, major third, perfect fifth (C-E-G)
- **Minor Triad**: Root, minor third, perfect fifth (C-Eb-G)
- **Diminished Triad**: Root, minor third, diminished fifth (C-Eb-Gb)
- **Augmented Triad**: Root, major third, augmented fifth (C-E-G#)

### Seventh Chords
- **Major 7th**: Major triad + major 7th (C-E-G-B)
- **Minor 7th**: Minor triad + minor 7th (C-Eb-G-Bb)
- **Dominant 7th**: Major triad + minor 7th (C-E-G-Bb)
- **Half-Diminished**: Diminished triad + minor 7th (C-Eb-Gb-Bb)

## Rhythm and Time

### Note Values
- **Whole Note**: 4 beats (semibreve)
- **Half Note**: 2 beats (minim)
- **Quarter Note**: 1 beat (crotchet)
- **Eighth Note**: 1/2 beat (quaver)
- **Sixteenth Note**: 1/4 beat (semiquaver)

### Time Signatures
- **4/4 Time**: 4 beats per measure, quarter note gets 1 beat
- **3/4 Time**: 3 beats per measure (waltz time)
- **2/4 Time**: 2 beats per measure (march time)
- **6/8 Time**: 6 eighth notes per measure (compound time)

### Tempo
- **Largo**: Very slow (40-60 BPM)
- **Andante**: Walking pace (76-108 BPM)
- **Moderato**: Moderate (108-120 BPM)
- **Allegro**: Fast (120-168 BPM)
- **Presto**: Very fast (168-200 BPM)

## Musical Forms

### Binary Form (A-B)
- **A Section**: First musical idea
- **B Section**: Contrasting musical idea
- **Example**: Many folk songs and dances

### Ternary Form (A-B-A)
- **A Section**: First musical idea
- **B Section**: Contrasting middle section
- **A Section**: Return of first idea (often varied)
- **Example**: Many classical minuets

### Sonata Form
- **Exposition**: Present main themes
- **Development**: Develop and transform themes
- **Recapitulation**: Restate themes in original key
- **Example**: First movements of symphonies

## Harmony and Key Relationships

### Circle of Fifths
- **Purpose**: Shows relationships between keys
- **Clockwise**: Each key is a fifth higher
- **Sharps**: Keys with sharps increase clockwise
- **Flats**: Keys with flats increase counterclockwise

### Chord Progressions
- **I-V-vi-IV**: Common pop progression (C-G-Am-F)
- **ii-V-I**: Jazz progression (Dm-G-C)
- **I-vi-IV-V**: 50s progression (C-Am-F-G)
- **Function**: How chords work together harmonically

## Musical Instruments

### String Instruments
- **Violin**: Highest pitched, four strings
- **Viola**: Slightly lower than violin
- **Cello**: Lower pitched, held between knees
- **Double Bass**: Lowest pitched, largest

### Wind Instruments
- **Woodwinds**: Flute, clarinet, oboe, bassoon
- **Brass**: Trumpet, trombone, French horn, tuba
- **Reed Instruments**: Use reeds to produce sound
- **Valve Instruments**: Use valves to change pitch

### Percussion
- **Pitched**: Xylophone, timpani, piano
- **Non-pitched**: Snare drum, cymbals, triangle
- **Rhythm**: Provide rhythmic foundation
- **Color**: Add timbral variety
          `,
          readingTime: "12-18 minutes",
          keyPoints: [
            "Music theory explains how music works",
            "Scales and chords are the building blocks of harmony",
            "Rhythm and time signatures organize musical time",
            "Different forms provide structure to musical pieces"
          ]
        },
        steps: [
          {
            id: 'step-1',
            title: 'Musical Notes',
            type: 'multiple-choice',
            question: 'How many notes are in a major scale?',
            options: ['5', '7', '8', '12'],
            correctAnswer: 1,
            explanation: 'A major scale consists of 7 different notes, typically arranged in a specific pattern of whole and half steps.'
          },
          {
            id: 'step-2',
            title: 'Time Signatures',
            type: 'multiple-choice',
            question: 'What does 4/4 time signature mean?',
            options: [
              '4 beats per measure, quarter note gets 1 beat',
              '4 measures per song',
              '4 different instruments',
              '4 minutes long'
            ],
            correctAnswer: 0,
            explanation: '4/4 time signature means 4 beats per measure, with the quarter note receiving 1 beat.'
          },
          {
            id: 'step-3',
            title: 'Major Scales',
            type: 'multiple-choice',
            question: 'What is the pattern for a major scale?',
            options: [
              'Whole-Whole-Half-Whole-Whole-Whole-Half',
              'Half-Whole-Half-Whole-Half-Whole-Half',
              'Whole-Half-Whole-Whole-Half-Whole-Whole',
              'All whole steps'
            ],
            correctAnswer: 0,
            explanation: 'The major scale pattern is Whole-Whole-Half-Whole-Whole-Whole-Half (W-W-H-W-W-W-H).'
          },
          {
            id: 'step-4',
            title: 'Intervals',
            type: 'multiple-choice',
            question: 'What is a perfect fifth?',
            options: [
              'Two notes that are the same',
              'Five notes apart in the scale',
              'The interval between C and G',
              'A chord with five notes'
            ],
            correctAnswer: 2,
            explanation: 'A perfect fifth is the interval between C and G (or any note and the note five steps up the scale).'
          },
          {
            id: 'step-5',
            title: 'Chords',
            type: 'multiple-choice',
            question: 'What is a major triad?',
            options: [
              'Three notes played together',
              'A chord with a root, major third, and perfect fifth',
              'A chord with only major notes',
              'A chord with four notes'
            ],
            correctAnswer: 1,
            explanation: 'A major triad consists of a root note, a major third (4 semitones up), and a perfect fifth (7 semitones up).'
          }
        ]
      }
    }
  },
  philosophy: {
    ethics: {
      'quest-1': {
        id: 'quest-1',
        title: 'Introduction to Ethics',
        description: 'Explore fundamental ethical theories and moral reasoning',
        type: 'quest',
        difficulty: 'beginner',
        xpReward: 100,
        goldReward: 50,
        icon: '🤔',
        timeEstimate: '35 min',
        skills: ['ethical-reasoning', 'critical-thinking'],
        requirements: [],
        deliverables: [
          {
            type: 'ethical-analysis',
            description: 'Analyze a moral dilemma using ethical theories',
            format: 'text'
          }
        ],
        resources: ['Ethics textbook', 'Philosophical readings', 'Case studies'],
        learningMaterial: {
          title: "Introduction to Utilitarianism",
          content: `
# Utilitarian Ethics

## What is Utilitarianism?
Utilitarianism is an ethical theory that judges the moral value of actions based on their consequences, particularly their impact on overall happiness.

## Core Principles

### 1. Greatest Happiness Principle
- Actions are right if they promote the greatest happiness
- Consider the interests of all affected parties
- Pursue the maximization of overall welfare

### 2. Consequentialism
- The moral value of actions depends entirely on their results
- Motives and intentions are not the primary criteria for moral judgment
- The goodness of outcomes determines the rightness of actions

## Key Thinkers

### Jeremy Bentham
- Founder of utilitarianism
- Proposed "greatest happiness for the greatest number"
- Emphasized quantitative calculation of pleasure and pain

### John Stuart Mill
- Developed Bentham's theory
- Distinguished between higher and lower pleasures
- Emphasized the importance of individual liberty

## Types of Utilitarianism

### 1. Act Utilitarianism
- Each action is judged by its specific consequences
- Direct calculation of each action's utility

### 2. Rule Utilitarianism
- Actions are judged by the consequences of following rules
- Considers the general utility of rules

## Practical Applications

### Medical Ethics
- Resource allocation: How to distribute limited medical resources
- Euthanasia: Moral considerations for relieving suffering

### Public Policy
- Cost-benefit analysis
- Social welfare policy development

## Criticisms and Responses

### Main Criticisms
1. **Justice Problem**: May sacrifice minority interests
2. **Calculation Difficulty**: Hard to accurately calculate consequences
3. **Rights Neglect**: May ignore individual rights

### Utilitarian Responses
1. Consideration of long-term consequences
2. Importance of rules
3. Balance between rights and utility
          `,
          readingTime: "8-12 minutes",
          keyPoints: [
            "Core principles of utilitarianism",
            "Key ideas of Bentham and Mill",
            "Act vs Rule utilitarianism",
            "Practical applications and criticisms"
          ]
        },
        steps: [
          {
            id: 'step-1',
            title: 'Utilitarianism Basics',
            type: 'multiple-choice',
            question: 'What is utilitarianism?',
            options: [
              'A theory that focuses on individual rights',
              'A theory that judges actions by their consequences',
              'A theory that emphasizes duty and obligation',
              'A theory that prioritizes personal virtue'
            ],
            correctAnswer: 1,
            explanation: 'Utilitarianism is a consequentialist theory that judges the morality of actions based on their outcomes and consequences.'
          },
          {
            id: 'step-2',
            title: 'Greatest Happiness Principle',
            type: 'multiple-choice',
            question: 'What is the greatest happiness principle?',
            options: [
              'Actions are right if they promote individual happiness',
              'Actions are right if they promote the greatest happiness for the greatest number',
              'Actions are right if they follow moral rules',
              'Actions are right if they demonstrate virtue'
            ],
            correctAnswer: 1,
            explanation: 'The greatest happiness principle states that actions are right if they promote the greatest happiness for the greatest number of people.'
          },
          {
            id: 'step-3',
            title: 'Deontological Ethics',
            type: 'multiple-choice',
            question: 'What is deontological ethics?',
            options: [
              'Ethics based on consequences',
              'Ethics based on duties and rules',
              'Ethics based on character',
              'Ethics based on divine commands'
            ],
            correctAnswer: 1,
            explanation: 'Deontological ethics is based on duties and rules, where actions are right or wrong based on their adherence to moral rules, regardless of consequences.'
          },
          {
            id: 'step-4',
            title: 'Virtue Ethics',
            type: 'multiple-choice',
            question: 'What is the focus of virtue ethics?',
            options: [
              'Following rules and duties',
              'Consequences of actions',
              'Character and moral virtues',
              'Divine commands'
            ],
            correctAnswer: 2,
            explanation: 'Virtue ethics focuses on developing good character traits and moral virtues rather than following rules or calculating consequences.'
          },
          {
            id: 'step-5',
            title: 'Moral Dilemmas',
            type: 'multiple-choice',
            question: 'What is a moral dilemma?',
            options: [
              'A situation with no moral implications',
              'A situation where moral principles conflict',
              'A situation with only one right answer',
              'A situation involving only good outcomes'
            ],
            correctAnswer: 1,
            explanation: 'A moral dilemma is a situation where two or more moral principles or values conflict, making it difficult to determine the right course of action.'
          }
        ]
      }
    }
  },
  biology: {
    'cell-biology': {
      'quest-1': {
        id: 'quest-1',
        title: 'Cell Structure and Function',
        description: 'Learn about the basic structure and function of cells',
        type: 'quest',
        difficulty: 'beginner',
        xpReward: 110,
        goldReward: 55,
        icon: '🧬',
        timeEstimate: '40 min',
        skills: ['scientific-thinking', 'biological-understanding'],
        requirements: [],
        deliverables: [
          {
            type: 'cell-diagram',
            description: 'Draw and label a plant cell',
            format: 'diagram'
          }
        ],
        resources: ['Biology textbook', 'Microscope images', 'Interactive models'],
        learningMaterial: {
          title: "Cell Structure and Function",
          content: `
# Cells: The Basic Unit of Life

## Cell Theory
1. All living things are composed of cells
2. Cells are the basic unit of life
3. New cells come from existing cells

## Basic Cell Structure

### 1. Cell Membrane
- **Function**: Controls what enters and leaves the cell
- **Structure**: Phospholipid bilayer
- **Feature**: Selectively permeable

### 2. Cytoplasm
- **Function**: Main site of cellular metabolism
- **Composition**: Organelles and cytosol
- **Feature**: Semi-fluid state

### 3. Nucleus
- **Function**: Controls cell activities and heredity
- **Structure**: Nuclear membrane, nucleolus, chromatin
- **Feature**: Unique to eukaryotic cells

## Important Organelles

### Mitochondria
- **Function**: Cellular respiration, ATP production
- **Structure**: Double membrane, folded inner membrane
- **Feature**: Has its own DNA

### Chloroplasts (Plant cells)
- **Function**: Photosynthesis
- **Structure**: Double membrane, contains chlorophyll
- **Feature**: Converts light energy to chemical energy

### Endoplasmic Reticulum
- **Function**: Protein synthesis and transport
- **Types**: Rough ER, Smooth ER
- **Feature**: Connected to nuclear membrane

### Golgi Apparatus
- **Function**: Protein processing and secretion
- **Structure**: Stacked flattened vesicles
- **Feature**: Works with ER

## Cell Types

### Prokaryotic Cells
- **Features**: No nuclear membrane, no organelles
- **Examples**: Bacteria, cyanobacteria
- **Size**: Usually smaller

### Eukaryotic Cells
- **Features**: Has nuclear membrane, has organelles
- **Examples**: Plant and animal cells
- **Size**: Usually larger

## Cell Division

### Mitosis
- **Process**: Interphase, prophase, metaphase, anaphase, telophase
- **Result**: Two identical daughter cells
- **Purpose**: Growth and repair

### Meiosis
- **Process**: Two consecutive divisions
- **Result**: Four different daughter cells
- **Purpose**: Formation of reproductive cells
          `,
          readingTime: "10-15 minutes",
          keyPoints: [
            "Basic principles of cell theory",
            "Functions of cell membrane, cytoplasm, and nucleus",
            "Roles of important organelles",
            "Differences between prokaryotic and eukaryotic cells"
          ]
        },
        steps: [
          {
            id: 'step-1',
            title: 'Cell Theory',
            type: 'multiple-choice',
            question: 'What is the powerhouse of the cell?',
            options: ['Nucleus', 'Mitochondria', 'Ribosomes', 'Golgi apparatus'],
            correctAnswer: 1,
            explanation: 'Mitochondria are often called the powerhouse of the cell because they produce ATP, the energy currency of the cell.'
          },
          {
            id: 'step-2',
            title: 'Cell Organelles',
            type: 'multiple-choice',
            question: 'Which organelle is responsible for photosynthesis in plant cells?',
            options: ['Mitochondria', 'Chloroplasts', 'Nucleus', 'Endoplasmic reticulum'],
            correctAnswer: 1,
            explanation: 'Chloroplasts contain chlorophyll and are responsible for photosynthesis in plant cells.'
          },
          {
            id: 'step-3',
            title: 'Cell Membrane',
            type: 'multiple-choice',
            question: 'What is the function of the cell membrane?',
            options: [
              'To produce energy',
              'To control what enters and leaves the cell',
              'To store genetic material',
              'To perform photosynthesis'
            ],
            correctAnswer: 1,
            explanation: 'The cell membrane controls what enters and leaves the cell, maintaining homeostasis and protecting the cell.'
          },
          {
            id: 'step-4',
            title: 'Prokaryotic vs Eukaryotic',
            type: 'multiple-choice',
            question: 'What is the main difference between prokaryotic and eukaryotic cells?',
            options: [
              'Size difference',
              'Eukaryotic cells have a nucleus, prokaryotic cells do not',
              'Prokaryotic cells are more complex',
              'No difference'
            ],
            correctAnswer: 1,
            explanation: 'The main difference is that eukaryotic cells have a membrane-bound nucleus, while prokaryotic cells do not.'
          },
          {
            id: 'step-5',
            title: 'Cell Division',
            type: 'multiple-choice',
            question: 'What process creates new cells?',
            options: [
              'Photosynthesis',
              'Cellular respiration',
              'Cell division (mitosis)',
              'Protein synthesis'
            ],
            correctAnswer: 2,
            explanation: 'Cell division, specifically mitosis, is the process by which cells reproduce and create new cells.'
          }
        ]
      }
    }
  }
};

// 获取quest数据（优先使用本地数据以确保学习材料显示）
export const getQuestData = async (subject, category, questId) => {
  try {
    // 优先使用本地fallback数据（包含学习材料）
    if (FALLBACK_QUESTS[subject] && FALLBACK_QUESTS[subject][category] && FALLBACK_QUESTS[subject][category][questId]) {
      console.log('使用本地数据（包含学习材料）:', FALLBACK_QUESTS[subject][category][questId]);
      return FALLBACK_QUESTS[subject][category][questId];
    }
    
    // 如果本地没有，再尝试从云端获取
    const cloudData = await getCloudQuest(subject, category, questId);
    if (cloudData) {
      console.log('使用云端数据:', cloudData);
      return cloudData;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting quest data:', error);
    return null;
  }
};

// 获取所有quest数据
export const getAllQuestData = async () => {
  try {
    const cloudData = await getCloudQuestData();
    if (Object.keys(cloudData).length > 0) {
      return cloudData;
    }
    
    // 如果云端没有数据，返回本地fallback
    return FALLBACK_QUESTS;
  } catch (error) {
    console.error('Error getting all quest data:', error);
    return FALLBACK_QUESTS;
  }
};

// 其他现有的函数保持不变
export const getUserQuestProgress = async (userId) => {
  try {
    console.log('Getting user quest progress for userId:', userId);
    
    // 从新的Firebase集合获取用户进度
    const userProgressRef = doc(db, 'studyprogress', userId);
    const userProgressDoc = await getDoc(userProgressRef);
    
    if (userProgressDoc.exists()) {
      const data = userProgressDoc.data();
      console.log('User progress found in Firebase studyprogress:', data);
      return data;
    } else {
      console.log('No user progress found in Firebase studyprogress, creating new');
      // 创建新的用户进度数据
      const newProgress = {
        totalXP: 0,
        gold: 0,
        completedQuests: [],
        currentLevel: 1,
        skills: {},
        achievements: [],
        questHistory: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // 保存新的进度数据
      await setDoc(userProgressRef, newProgress);
      console.log('New user progress created in studyprogress collection');
      return newProgress;
    }
  } catch (error) {
    console.error('Error getting user quest progress:', error);
    // 返回默认的用户进度数据
    return {
      totalXP: 0,
      gold: 0,
      completedQuests: [],
      currentLevel: 1,
      skills: {},
      achievements: []
    };
  }
};

export const updateQuestProgress = async (userId, questId, subject, category, questType, xpEarned, goldEarned, deliverables) => {
  try {
    console.log('Starting quest progress update...');
    
    // 获取当前用户进度
    const currentProgress = await getUserQuestProgress(userId);
    console.log('Current progress:', currentProgress);
    
    // 生成唯一的quest标识符
    const uniqueQuestId = `${subject}_${category}_${questId}`;
    
    // 检查是否已经完成过这个quest（检查原始ID和唯一ID）
    const isAlreadyCompleted = currentProgress.completedQuests && 
                              (currentProgress.completedQuests.includes(questId) || 
                               currentProgress.completedQuests.includes(uniqueQuestId));
    if (isAlreadyCompleted) {
      console.log('Quest already completed, skipping update');
      return currentProgress;
    }
    
    // 更新进度
    const updatedProgress = {
      ...currentProgress,
      totalXP: (currentProgress.totalXP || 0) + xpEarned,
      gold: (currentProgress.gold || 0) + goldEarned,
      completedQuests: [...(currentProgress.completedQuests || []), uniqueQuestId],
      questHistory: [
        ...(currentProgress.questHistory || []),
        {
          questId,
          subject,
          category,
          questType,
          xpEarned,
          goldEarned,
          completedAt: new Date().toISOString(),
          deliverables
        }
      ]
    };
    
    console.log('Updated progress to save:', updatedProgress);
    
    // 保存到新的云端集合
    console.log('Attempting to save to Firebase studyprogress...');
    const userProgressRef = doc(db, 'studyprogress', userId);
    console.log('Firebase document reference:', userProgressRef);
    console.log('Data to save:', updatedProgress);
    
    try {
      await setDoc(userProgressRef, updatedProgress, { merge: true });
      console.log('Quest progress successfully saved to Firebase');
      
      // 验证保存是否成功
      const savedDoc = await getDoc(userProgressRef);
      console.log('Verification - saved document:', savedDoc.exists() ? savedDoc.data() : 'Document not found');
      
      // 更新用户等级
      const levelUpdateResult = await updateUserLevel(userId, updatedProgress.totalXP);
      
      return levelUpdateResult;
    } catch (firebaseError) {
      console.error('Firebase save error:', firebaseError);
      throw firebaseError;
    }
  } catch (error) {
    console.error('Error updating quest progress:', error);
    // 即使保存失败，也返回本地更新
    return {
      totalXP: (await getUserQuestProgress(userId)).totalXP + xpEarned,
      gold: (await getUserQuestProgress(userId)).gold + goldEarned,
      completedQuests: [...(await getUserQuestProgress(userId)).completedQuests, questId]
    };
  }
};

export const isQuestUnlocked = (questId, subject, category, userProgress) => {
  // 保持现有实现
  return true;
};

export const isQuestCompleted = (questId, subject, category, userProgress) => {
  console.log(`🔍 Checking quest completion for:`, {
    questId,
    subject,
    category,
    userProgress: userProgress ? 'exists' : 'null',
    completedQuests: userProgress?.completedQuests || 'none'
  });
  
  if (!userProgress || !userProgress.completedQuests) {
    console.log(`❌ Quest ${questId} not completed: no userProgress or completedQuests`);
    return false;
  }
  
  // 生成唯一的quest标识符：subject_category_questId
  const uniqueQuestId = `${subject}_${category}_${questId}`;
  
  // 检查多种可能的ID格式（向后兼容）
  const possibleIds = [
    questId, // 原始ID (quest-1)
    uniqueQuestId, // 唯一标识符 (italian_grammar_quest-1)
    `${questId}_${subject}_${category}`, // 另一种可能的格式
    `${subject}_${category}_${questId}` // 标准格式
  ];
  
  const isCompleted = possibleIds.some(id => userProgress.completedQuests.includes(id));
  
  console.log(`✅ Quest ${questId} completion check:`, {
    completedQuests: userProgress.completedQuests,
    questId,
    uniqueQuestId,
    possibleIds,
    isCompleted,
    matches: possibleIds.map(id => ({
      id,
      match: userProgress.completedQuests.includes(id)
    }))
  });
  
  return isCompleted;
};

// 临时调试函数：重置用户进度
export const resetUserQuestProgress = async (userId) => {
  try {
    console.log('Resetting user quest progress for userId:', userId);
    
    const defaultProgress = {
      totalXP: 0,
      gold: 0,
      completedQuests: [],
      currentLevel: 1,
      skills: {},
      achievements: [],
      questHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const userProgressRef = doc(db, 'studyprogress', userId);
    await setDoc(userProgressRef, defaultProgress);
    
    console.log('User quest progress reset successfully');
    return defaultProgress;
  } catch (error) {
    console.error('Error resetting user quest progress:', error);
    throw error;
  }
};

// 删除旧的quest记录
export const deleteOldQuestRecords = async (userId) => {
  try {
    console.log('Deleting old quest records for userId:', userId);
    
    // 删除旧的userProgress集合中的记录
    const oldUserProgressRef = doc(db, 'userProgress', userId);
    await deleteDoc(oldUserProgressRef);
    console.log('Old userProgress record deleted');
    
    // 删除旧的questProgress集合中的记录（如果存在）
    const oldQuestProgressRef = doc(db, 'questProgress', userId);
    try {
      await deleteDoc(oldQuestProgressRef);
      console.log('Old questProgress record deleted');
    } catch (error) {
      console.log('No old questProgress record to delete');
    }
    
    console.log('Old quest records deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting old quest records:', error);
    throw error;
  }
};

export const getAvailableQuests = async (subject, category, userProgress) => {
  try {
    console.log('Getting available quests for:', { subject, category, userProgress });
    
    // 直接使用本地fallback数据，确保包含所有新增的quest
    if (FALLBACK_QUESTS[subject] && FALLBACK_QUESTS[subject][category]) {
      console.log('Using fallback data for quests');
      const quests = Object.values(FALLBACK_QUESTS[subject][category]).map(quest => {
        const isCompleted = isQuestCompleted(quest.id, subject, category, userProgress);
        console.log(`Fallback quest ${quest.id} completion status: ${isCompleted}`);
        return {
          ...quest,
          isUnlocked: isQuestUnlocked(quest.id, subject, category, userProgress),
          isCompleted: isCompleted
        };
      });
      
      console.log('Final fallback quests with completion status:', quests);
      return quests;
    }
    
    console.log('No quest data found for:', { subject, category });
    console.log('Available subjects:', Object.keys(FALLBACK_QUESTS));
    console.log('Available categories for', subject, ':', FALLBACK_QUESTS[subject] ? Object.keys(FALLBACK_QUESTS[subject]) : 'none');
    return [];
  } catch (error) {
    console.error('Error getting available quests:', error);
    return [];
  }
};

export const getAIMentorSuggestions = (userProgress) => {
  // 保持现有实现
  return [];
};

export const getPortfolioItems = (userProgress) => {
  // 保持现有实现
  return [];
};

// 学科定义
export const subjects = {
  italian: { 
    name: 'Italian', 
    icon: '🇮🇹', 
    color: '#4CAF50',
    categories: ['grammar', 'vocabulary', 'conversation']
  },
  philosophy: { 
    name: 'Philosophy', 
    icon: '🤔', 
    color: '#9C27B0',
    categories: ['ethics', 'logic', 'metaphysics']
  },
  biology: { 
    name: 'Biology', 
    icon: '🧬', 
    color: '#4CAF50',
    categories: ['cell-biology', 'genetics', 'ecology']
  },
  mathematics: { 
    name: 'Mathematics', 
    icon: '📐', 
    color: '#2196F3',
    categories: ['algebra', 'geometry', 'calculus']
  },
  physics: { 
    name: 'Physics', 
    icon: '⚛️', 
    color: '#FF9800',
    categories: ['mechanics', 'thermodynamics', 'electromagnetism']
  },
  chemistry: { 
    name: 'Chemistry', 
    icon: '🧪', 
    color: '#E91E63',
    categories: ['organic', 'inorganic', 'physical']
  },
  history: { 
    name: 'History', 
    icon: '📜', 
    color: '#795548',
    categories: ['ancient', 'medieval', 'modern']
  },
  literature: { 
    name: 'Literature', 
    icon: '📚', 
    color: '#607D8B',
    categories: ['poetry', 'prose', 'drama']
  },
  computerScience: { 
    name: 'Computer Science', 
    icon: '💻', 
    color: '#00BCD4',
    categories: ['programming', 'algorithms', 'data-structures']
  },
  psychology: { 
    name: 'Psychology', 
    icon: '🧠', 
    color: '#FF5722',
    categories: ['cognitive', 'behavioral', 'social']
  },
  sociology: { 
    name: 'Sociology', 
    icon: '👥', 
    color: '#3F51B5',
    categories: ['social-structures', 'culture', 'deviance']
  },
  economics: { 
    name: 'Economics', 
    icon: '💰', 
    color: '#8BC34A',
    categories: ['microeconomics', 'macroeconomics', 'finance']
  },
  geography: { 
    name: 'Geography', 
    icon: '🌍', 
    color: '#4CAF50',
    categories: ['physical', 'human', 'environmental']
  },
  art: { 
    name: 'Art', 
    icon: '🎨', 
    color: '#E91E63',
    categories: ['painting', 'sculpture', 'digital']
  },
  music: { 
    name: 'Music', 
    icon: '🎵', 
    color: '#9C27B0',
    categories: ['theory', 'composition', 'performance']
  }
};

// 跨学科技能
export const crossSubjectSkills = {
  'critical-thinking': { name: 'Critical Thinking', icon: '🧠', description: 'Analyze and evaluate information' },
  'problem-solving': { name: 'Problem Solving', icon: '🔧', description: 'Find solutions to complex problems' },
  'communication': { name: 'Communication', icon: '💬', description: 'Express ideas clearly and effectively' },
  'research': { name: 'Research', icon: '🔍', description: 'Gather and analyze information' },
  'creativity': { name: 'Creativity', icon: '✨', description: 'Generate original ideas and solutions' },
  'collaboration': { name: 'Collaboration', icon: '🤝', description: 'Work effectively with others' },
  'time-management': { name: 'Time Management', icon: '⏰', description: 'Organize and prioritize tasks' },
  'adaptability': { name: 'Adaptability', icon: '🔄', description: 'Adjust to new situations and challenges' }
};

// 保持向后兼容的questTemplates导出
export const questTemplates = {};

// 动态加载questTemplates数据
export const loadQuestTemplates = async () => {
  try {
    console.log('Loading quest templates...');
    // 直接使用本地fallback数据，确保包含所有新增的quest
    console.log('Using fallback quest data with all new quests');
    return FALLBACK_QUESTS;
  } catch (error) {
    console.error('Error loading quest templates:', error);
    console.log('Using fallback quest data due to error');
    return FALLBACK_QUESTS;
  }
};

// ==================== 等级系统 ====================

// 等级配置
export const LEVEL_CONFIG = {
  // 每个等级所需的总经验值
  experienceRequired: (level) => {
    if (level <= 1) return 0;
    // 使用指数增长公式: XP = 100 * (level - 1)^1.5
    return Math.floor(100 * Math.pow(level - 1, 1.5));
  },
  
  // 根据经验值计算等级
  calculateLevel: (totalXP) => {
    let level = 1;
    while (LEVEL_CONFIG.experienceRequired(level + 1) <= totalXP) {
      level++;
    }
    return level;
  },
  
  // 计算当前等级进度
  calculateLevelProgress: (totalXP) => {
    const currentLevel = LEVEL_CONFIG.calculateLevel(totalXP);
    const currentLevelXP = LEVEL_CONFIG.experienceRequired(currentLevel);
    const nextLevelXP = LEVEL_CONFIG.experienceRequired(currentLevel + 1);
    const progressXP = totalXP - currentLevelXP;
    const requiredXP = nextLevelXP - currentLevelXP;
    
    return {
      currentLevel,
      nextLevel: currentLevel + 1,
      progressXP,
      requiredXP,
      progressPercentage: Math.round((progressXP / requiredXP) * 100)
    };
  },
  
  // 等级奖励
  getLevelRewards: (level) => {
    const rewards = {
      gold: level * 50, // 每级50金币
      skillPoints: Math.floor(level / 2), // 每2级1个技能点
      achievements: []
    };
    
    // 特殊等级奖励
    if (level >= 5) rewards.achievements.push('Rising Star');
    if (level >= 10) rewards.achievements.push('Experienced Learner');
    if (level >= 20) rewards.achievements.push('Knowledge Seeker');
    if (level >= 30) rewards.achievements.push('Master Scholar');
    if (level >= 50) rewards.achievements.push('Legendary Academic');
    
    return rewards;
  }
};

// 更新用户等级
export const updateUserLevel = async (userId, newTotalXP) => {
  try {
    console.log('Updating user level for userId:', userId, 'newTotalXP:', newTotalXP);
    
    const levelProgress = LEVEL_CONFIG.calculateLevelProgress(newTotalXP);
    const levelRewards = LEVEL_CONFIG.getLevelRewards(levelProgress.currentLevel);
    
    // 获取当前用户进度
    const currentProgress = await getUserQuestProgress(userId);
    
    // 检查是否升级了
    const oldLevel = currentProgress.currentLevel || 1;
    const newLevel = levelProgress.currentLevel;
    const leveledUp = newLevel > oldLevel;
    
    // 更新用户进度
    const updatedProgress = {
      ...currentProgress,
      totalXP: newTotalXP,
      currentLevel: newLevel,
      levelProgress: levelProgress,
      updatedAt: new Date().toISOString()
    };
    
    // 如果升级了，添加奖励
    if (leveledUp) {
      updatedProgress.gold = (updatedProgress.gold || 0) + levelRewards.gold;
      updatedProgress.skillPoints = (updatedProgress.skillPoints || 0) + levelRewards.skillPoints;
      updatedProgress.achievements = [
        ...(updatedProgress.achievements || []),
        ...levelRewards.achievements
      ];
      
      console.log(`🎉 User leveled up! Level ${oldLevel} → ${newLevel}`);
      console.log('Level rewards:', levelRewards);
    }
    
    // 保存到Firebase
    const userProgressRef = doc(db, 'studyprogress', userId);
    await setDoc(userProgressRef, updatedProgress, { merge: true });
    
    console.log('User level updated successfully');
    return {
      ...updatedProgress,
      leveledUp,
      levelRewards: leveledUp ? levelRewards : null
    };
  } catch (error) {
    console.error('Error updating user level:', error);
    throw error;
  }
};
