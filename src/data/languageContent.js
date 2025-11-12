// Daily Language Practice - Casual Learning Content
export const languageContent = {
  spanish: {
    name: 'Spanish',
    flag: '🇪🇸',
    nativeName: 'Español',
    dailyPractice: {
      // Week 1: Essential Daily Words
      week1: {
        title: 'Essential Daily Words',
        description: 'Words you use every day',
        lessons: [
          {
            id: 'daily_greetings',
            title: 'Daily Greetings',
            type: 'vocabulary',
            difficulty: 'beginner',
            xpReward: 15,
            exercises: [
              { 
                type: 'translate', 
                question: 'Good morning', 
                answer: 'Buenos días', 
                options: ['Buenos días', 'Buenas tardes', 'Buenas noches', 'Hola'] 
              },
              { 
                type: 'translate', 
                question: 'Good afternoon', 
                answer: 'Buenas tardes', 
                options: ['Buenos días', 'Buenas tardes', 'Buenas noches', 'Hola'] 
              },
              { 
                type: 'translate', 
                question: 'How are you?', 
                answer: '¿Cómo estás?', 
                options: ['¿Cómo estás?', '¿Qué tal?', '¿Cómo te va?', 'Bien, gracias'] 
              },
              { 
                type: 'translate', 
                question: 'I\'m fine, thank you', 
                answer: 'Bien, gracias', 
                options: ['Bien, gracias', 'Muy bien', 'Regular', 'Mal'] 
              }
            ]
          },
          {
            id: 'common_objects',
            title: 'Common Objects',
            type: 'vocabulary',
            difficulty: 'beginner',
            xpReward: 15,
            exercises: [
              { 
                type: 'translate', 
                question: 'Water', 
                answer: 'Agua', 
                options: ['Agua', 'Comida', 'Casa', 'Coche'] 
              },
              { 
                type: 'translate', 
                question: 'Food', 
                answer: 'Comida', 
                options: ['Agua', 'Comida', 'Casa', 'Coche'] 
              },
              { 
                type: 'translate', 
                question: 'House', 
                answer: 'Casa', 
                options: ['Agua', 'Comida', 'Casa', 'Coche'] 
              },
              { 
                type: 'translate', 
                question: 'Car', 
                answer: 'Coche', 
                options: ['Agua', 'Comida', 'Casa', 'Coche'] 
              }
            ]
          }
        ]
      },
      // Week 2: Basic Grammar
      week2: {
        title: 'Basic Grammar',
        description: 'Essential grammar for daily use',
        lessons: [
          {
            id: 'basic_verbs',
            title: 'Essential Verbs',
            type: 'grammar',
            difficulty: 'beginner',
            xpReward: 20,
            exercises: [
              { 
                type: 'translate', 
                question: 'I am', 
                answer: 'Yo soy', 
                options: ['Yo soy', 'Tú eres', 'Él es', 'Nosotros somos'] 
              },
              { 
                type: 'translate', 
                question: 'You are', 
                answer: 'Tú eres', 
                options: ['Yo soy', 'Tú eres', 'Él es', 'Nosotros somos'] 
              },
              { 
                type: 'translate', 
                question: 'I have', 
                answer: 'Yo tengo', 
                options: ['Yo tengo', 'Tú tienes', 'Él tiene', 'Nosotros tenemos'] 
              },
              { 
                type: 'translate', 
                question: 'I want', 
                answer: 'Yo quiero', 
                options: ['Yo quiero', 'Tú quieres', 'Él quiere', 'Nosotros queremos'] 
              }
            ]
          },
          {
            id: 'numbers',
            title: 'Numbers 1-20',
            type: 'vocabulary',
            difficulty: 'beginner',
            xpReward: 15,
            exercises: [
              { 
                type: 'translate', 
                question: 'One', 
                answer: 'Uno', 
                options: ['Uno', 'Dos', 'Tres', 'Cuatro'] 
              },
              { 
                type: 'translate', 
                question: 'Five', 
                answer: 'Cinco', 
                options: ['Cinco', 'Seis', 'Siete', 'Ocho'] 
              },
              { 
                type: 'translate', 
                question: 'Ten', 
                answer: 'Diez', 
                options: ['Diez', 'Once', 'Doce', 'Trece'] 
              },
              { 
                type: 'translate', 
                question: 'Twenty', 
                answer: 'Veinte', 
                options: ['Dieciocho', 'Diecinueve', 'Veinte', 'Veintiuno'] 
              }
            ]
          }
        ]
      },
      // Week 3: Daily Conversations
      week3: {
        title: 'Daily Conversations',
        description: 'Common phrases for daily life',
        lessons: [
          {
            id: 'shopping',
            title: 'Shopping',
            type: 'conversation',
            difficulty: 'intermediate',
            xpReward: 25,
            exercises: [
              { 
                type: 'translate', 
                question: 'How much does it cost?', 
                answer: '¿Cuánto cuesta?', 
                options: ['¿Cuánto cuesta?', '¿Dónde está?', '¿Qué hora es?', '¿Cómo se dice?'] 
              },
              { 
                type: 'translate', 
                question: 'I would like to buy...', 
                answer: 'Me gustaría comprar...', 
                options: ['Me gustaría comprar...', '¿Tiene...?', 'Es muy caro', 'Es barato'] 
              },
              { 
                type: 'translate', 
                question: 'Do you have...?', 
                answer: '¿Tiene...?', 
                options: ['¿Tiene...?', '¿Dónde está...?', '¿Cuánto cuesta?', 'Me gustaría...'] 
              }
            ]
          },
          {
            id: 'directions',
            title: 'Asking for Directions',
            type: 'conversation',
            difficulty: 'intermediate',
            xpReward: 25,
            exercises: [
              { 
                type: 'translate', 
                question: 'Where is...?', 
                answer: '¿Dónde está...?', 
                options: ['¿Dónde está...?', '¿Cómo llego a...?', '¿Está lejos?', '¿Está cerca?'] 
              },
              { 
                type: 'translate', 
                question: 'How do I get to...?', 
                answer: '¿Cómo llego a...?', 
                options: ['¿Cómo llego a...?', '¿Dónde está...?', '¿Está lejos?', '¿Está cerca?'] 
              },
              { 
                type: 'translate', 
                question: 'Is it far?', 
                answer: '¿Está lejos?', 
                options: ['¿Está lejos?', '¿Está cerca?', '¿Dónde está?', '¿Cómo llego?'] 
              }
            ]
          }
        ]
      },
      // Week 4: Food & Dining
      week4: {
        title: 'Food & Dining',
        description: 'Essential food vocabulary and phrases',
        lessons: [
          {
            id: 'food_vocabulary',
            title: 'Food Vocabulary',
            type: 'vocabulary',
            difficulty: 'beginner',
            xpReward: 20,
            exercises: [
              { 
                type: 'translate', 
                question: 'Bread', 
                answer: 'Pan', 
                options: ['Pan', 'Arroz', 'Pasta', 'Carne'] 
              },
              { 
                type: 'translate', 
                question: 'Rice', 
                answer: 'Arroz', 
                options: ['Pan', 'Arroz', 'Pasta', 'Carne'] 
              },
              { 
                type: 'translate', 
                question: 'Meat', 
                answer: 'Carne', 
                options: ['Pan', 'Arroz', 'Pasta', 'Carne'] 
              },
              { 
                type: 'translate', 
                question: 'Vegetables', 
                answer: 'Verduras', 
                options: ['Verduras', 'Frutas', 'Leche', 'Huevos'] 
              }
            ]
          },
          {
            id: 'restaurant',
            title: 'At the Restaurant',
            type: 'conversation',
            difficulty: 'intermediate',
            xpReward: 25,
            exercises: [
              { 
                type: 'translate', 
                question: 'I would like to order...', 
                answer: 'Me gustaría pedir...', 
                options: ['Me gustaría pedir...', '¿Qué recomienda?', 'La cuenta, por favor', '¿Tiene...?'] 
              },
              { 
                type: 'translate', 
                question: 'What do you recommend?', 
                answer: '¿Qué recomienda?', 
                options: ['¿Qué recomienda?', 'Me gustaría pedir...', 'La cuenta, por favor', '¿Tiene...?'] 
              },
              { 
                type: 'translate', 
                question: 'The bill, please', 
                answer: 'La cuenta, por favor', 
                options: ['La cuenta, por favor', '¿Qué recomienda?', 'Me gustaría pedir...', '¿Tiene...?'] 
              }
            ]
          }
        ]
      }
    }
  },

  french: {
    name: 'French',
    flag: '🇫🇷',
    nativeName: 'Français',
    dailyPractice: {
      week1: {
        title: 'Essential Daily Words',
        description: 'Words you use every day',
        lessons: [
          {
            id: 'daily_greetings',
            title: 'Daily Greetings',
            type: 'vocabulary',
            difficulty: 'beginner',
            xpReward: 15,
            exercises: [
              { 
                type: 'translate', 
                question: 'Good morning', 
                answer: 'Bonjour', 
                options: ['Bonjour', 'Bonsoir', 'Bonne nuit', 'Salut'] 
              },
              { 
                type: 'translate', 
                question: 'Good evening', 
                answer: 'Bonsoir', 
                options: ['Bonjour', 'Bonsoir', 'Bonne nuit', 'Salut'] 
              },
              { 
                type: 'translate', 
                question: 'How are you?', 
                answer: 'Comment allez-vous?', 
                options: ['Comment allez-vous?', 'Comment ça va?', 'Ça va bien?', 'Très bien, merci'] 
              },
              { 
                type: 'translate', 
                question: 'Very well, thank you', 
                answer: 'Très bien, merci', 
                options: ['Très bien, merci', 'Ça va', 'Pas mal', 'Mal'] 
              }
            ]
          },
          {
            id: 'common_objects',
            title: 'Common Objects',
            type: 'vocabulary',
            difficulty: 'beginner',
            xpReward: 15,
            exercises: [
              { 
                type: 'translate', 
                question: 'Water', 
                answer: 'Eau', 
                options: ['Eau', 'Nourriture', 'Maison', 'Voiture'] 
              },
              { 
                type: 'translate', 
                question: 'Food', 
                answer: 'Nourriture', 
                options: ['Eau', 'Nourriture', 'Maison', 'Voiture'] 
              },
              { 
                type: 'translate', 
                question: 'House', 
                answer: 'Maison', 
                options: ['Eau', 'Nourriture', 'Maison', 'Voiture'] 
              },
              { 
                type: 'translate', 
                question: 'Car', 
                answer: 'Voiture', 
                options: ['Eau', 'Nourriture', 'Maison', 'Voiture'] 
              }
            ]
          }
        ]
      },
      week2: {
        title: 'Basic Grammar',
        description: 'Essential grammar for daily use',
        lessons: [
          {
            id: 'basic_verbs',
            title: 'Essential Verbs',
            type: 'grammar',
            difficulty: 'beginner',
            xpReward: 20,
            exercises: [
              { 
                type: 'translate', 
                question: 'I am', 
                answer: 'Je suis', 
                options: ['Je suis', 'Tu es', 'Il est', 'Nous sommes'] 
              },
              { 
                type: 'translate', 
                question: 'You are', 
                answer: 'Tu es', 
                options: ['Je suis', 'Tu es', 'Il est', 'Nous sommes'] 
              },
              { 
                type: 'translate', 
                question: 'I have', 
                answer: 'J\'ai', 
                options: ['J\'ai', 'Tu as', 'Il a', 'Nous avons'] 
              },
              { 
                type: 'translate', 
                question: 'I want', 
                answer: 'Je veux', 
                options: ['Je veux', 'Tu veux', 'Il veut', 'Nous voulons'] 
              }
            ]
          },
          {
            id: 'numbers',
            title: 'Numbers 1-20',
            type: 'vocabulary',
            difficulty: 'beginner',
            xpReward: 15,
            exercises: [
              { 
                type: 'translate', 
                question: 'One', 
                answer: 'Un', 
                options: ['Un', 'Deux', 'Trois', 'Quatre'] 
              },
              { 
                type: 'translate', 
                question: 'Five', 
                answer: 'Cinq', 
                options: ['Cinq', 'Six', 'Sept', 'Huit'] 
              },
              { 
                type: 'translate', 
                question: 'Ten', 
                answer: 'Dix', 
                options: ['Dix', 'Onze', 'Douze', 'Treize'] 
              },
              { 
                type: 'translate', 
                question: 'Twenty', 
                answer: 'Vingt', 
                options: ['Dix-huit', 'Dix-neuf', 'Vingt', 'Vingt-et-un'] 
              }
            ]
          }
        ]
      }
    }
  },

  german: {
    name: 'German',
    flag: '🇩🇪',
    nativeName: 'Deutsch',
    dailyPractice: {
      week1: {
        title: 'Essential Daily Words',
        description: 'Words you use every day',
        lessons: [
          {
            id: 'daily_greetings',
            title: 'Daily Greetings',
            type: 'vocabulary',
            difficulty: 'beginner',
            xpReward: 15,
            exercises: [
              { 
                type: 'translate', 
                question: 'Good morning', 
                answer: 'Guten Morgen', 
                options: ['Guten Morgen', 'Guten Tag', 'Guten Abend', 'Hallo'] 
              },
              { 
                type: 'translate', 
                question: 'Good day', 
                answer: 'Guten Tag', 
                options: ['Guten Morgen', 'Guten Tag', 'Guten Abend', 'Hallo'] 
              },
              { 
                type: 'translate', 
                question: 'How are you?', 
                answer: 'Wie geht es Ihnen?', 
                options: ['Wie geht es Ihnen?', 'Wie geht\'s?', 'Alles gut?', 'Gut, danke'] 
              },
              { 
                type: 'translate', 
                question: 'Good, thank you', 
                answer: 'Gut, danke', 
                options: ['Gut, danke', 'Sehr gut', 'Es geht', 'Schlecht'] 
              }
            ]
          },
          {
            id: 'common_objects',
            title: 'Common Objects',
            type: 'vocabulary',
            difficulty: 'beginner',
            xpReward: 15,
            exercises: [
              { 
                type: 'translate', 
                question: 'Water', 
                answer: 'Wasser', 
                options: ['Wasser', 'Essen', 'Haus', 'Auto'] 
              },
              { 
                type: 'translate', 
                question: 'Food', 
                answer: 'Essen', 
                options: ['Wasser', 'Essen', 'Haus', 'Auto'] 
              },
              { 
                type: 'translate', 
                question: 'House', 
                answer: 'Haus', 
                options: ['Wasser', 'Essen', 'Haus', 'Auto'] 
              },
              { 
                type: 'translate', 
                question: 'Car', 
                answer: 'Auto', 
                options: ['Wasser', 'Essen', 'Haus', 'Auto'] 
              }
            ]
          }
        ]
      },
      week2: {
        title: 'Basic Grammar',
        description: 'Essential grammar for daily use',
        lessons: [
          {
            id: 'basic_verbs',
            title: 'Essential Verbs',
            type: 'grammar',
            difficulty: 'beginner',
            xpReward: 20,
            exercises: [
              { 
                type: 'translate', 
                question: 'I am', 
                answer: 'Ich bin', 
                options: ['Ich bin', 'Du bist', 'Er ist', 'Wir sind'] 
              },
              { 
                type: 'translate', 
                question: 'You are', 
                answer: 'Du bist', 
                options: ['Ich bin', 'Du bist', 'Er ist', 'Wir sind'] 
              },
              { 
                type: 'translate', 
                question: 'I have', 
                answer: 'Ich habe', 
                options: ['Ich habe', 'Du hast', 'Er hat', 'Wir haben'] 
              },
              { 
                type: 'translate', 
                question: 'I want', 
                answer: 'Ich möchte', 
                options: ['Ich möchte', 'Du möchtest', 'Er möchte', 'Wir möchten'] 
              }
            ]
          }
        ]
      }
    }
  },

  italian: {
    name: 'Italian',
    flag: '🇮🇹',
    nativeName: 'Italiano',
    dailyPractice: {
      week1: {
        title: 'Essential Daily Words',
        description: 'Words you use every day',
        lessons: [
          {
            id: 'daily_greetings',
            title: 'Daily Greetings',
            type: 'vocabulary',
            difficulty: 'beginner',
            xpReward: 15,
            exercises: [
              { 
                type: 'translate', 
                question: 'Good morning', 
                answer: 'Buongiorno', 
                options: ['Buongiorno', 'Buonasera', 'Buonanotte', 'Ciao'] 
              },
              { 
                type: 'translate', 
                question: 'Good evening', 
                answer: 'Buonasera', 
                options: ['Buongiorno', 'Buonasera', 'Buonanotte', 'Ciao'] 
              },
              { 
                type: 'translate', 
                question: 'How are you?', 
                answer: 'Come stai?', 
                options: ['Come stai?', 'Come va?', 'Tutto bene?', 'Bene, grazie'] 
              },
              { 
                type: 'translate', 
                question: 'Fine, thank you', 
                answer: 'Bene, grazie', 
                options: ['Bene, grazie', 'Molto bene', 'Così così', 'Male'] 
              }
            ]
          }
        ]
      }
    }
  },

  japanese: {
    name: 'Japanese',
    flag: '🇯🇵',
    nativeName: '日本語',
    dailyPractice: {
      week1: {
        title: 'Essential Daily Words',
        description: 'Words you use every day',
        lessons: [
          {
            id: 'daily_greetings',
            title: 'Daily Greetings',
            type: 'vocabulary',
            difficulty: 'beginner',
            xpReward: 15,
            exercises: [
              { 
                type: 'translate', 
                question: 'Good morning', 
                answer: 'おはよう', 
                options: ['おはよう', 'こんにちは', 'こんばんは', 'さようなら'] 
              },
              { 
                type: 'translate', 
                question: 'Hello (daytime)', 
                answer: 'こんにちは', 
                options: ['おはよう', 'こんにちは', 'こんばんは', 'さようなら'] 
              },
              { 
                type: 'translate', 
                question: 'Good evening', 
                answer: 'こんばんは', 
                options: ['おはよう', 'こんにちは', 'こんばんは', 'さようなら'] 
              },
              { 
                type: 'translate', 
                question: 'Thank you', 
                answer: 'ありがとう', 
                options: ['ありがとう', 'すみません', 'ごめんなさい', 'どういたしまして'] 
              }
            ]
          }
        ]
      }
    }
  },

  korean: {
    name: 'Korean',
    flag: '🇰🇷',
    nativeName: '한국어',
    dailyPractice: {
      week1: {
        title: 'Essential Daily Words',
        description: 'Words you use every day',
        lessons: [
          {
            id: 'daily_greetings',
            title: 'Daily Greetings',
            type: 'vocabulary',
            difficulty: 'beginner',
            xpReward: 15,
            exercises: [
              { 
                type: 'translate', 
                question: 'Good morning', 
                answer: '좋은 아침', 
                options: ['좋은 아침', '안녕하세요', '안녕히 가세요', '감사합니다'] 
              },
              { 
                type: 'translate', 
                question: 'Hello', 
                answer: '안녕하세요', 
                options: ['좋은 아침', '안녕하세요', '안녕히 가세요', '감사합니다'] 
              },
              { 
                type: 'translate', 
                question: 'Goodbye', 
                answer: '안녕히 가세요', 
                options: ['좋은 아침', '안녕하세요', '안녕히 가세요', '감사합니다'] 
              },
              { 
                type: 'translate', 
                question: 'Thank you', 
                answer: '감사합니다', 
                options: ['감사합니다', '죄송합니다', '미안합니다', '천만에요'] 
              }
            ]
          }
        ]
      }
    }
  },

  chinese: {
    name: 'Chinese',
    flag: '🇨🇳',
    nativeName: '中文',
    dailyPractice: {
      week1: {
        title: 'Essential Daily Words',
        description: 'Words you use every day',
        lessons: [
          {
            id: 'daily_greetings',
            title: 'Daily Greetings',
            type: 'vocabulary',
            difficulty: 'beginner',
            xpReward: 15,
            exercises: [
              { 
                type: 'translate', 
                question: 'Good morning', 
                answer: '早上好', 
                options: ['早上好', '你好', '晚上好', '再见'] 
              },
              { 
                type: 'translate', 
                question: 'Hello', 
                answer: '你好', 
                options: ['早上好', '你好', '晚上好', '再见'] 
              },
              { 
                type: 'translate', 
                question: 'Good evening', 
                answer: '晚上好', 
                options: ['早上好', '你好', '晚上好', '再见'] 
              },
              { 
                type: 'translate', 
                question: 'Thank you', 
                answer: '谢谢', 
                options: ['谢谢', '对不起', '不好意思', '不客气'] 
              }
            ]
          }
        ]
      }
    }
  }
}

// Get language content for a specific language
export const getLanguageContent = (languageId) => {
  return languageContent[languageId] || languageContent.spanish
}

// Get all available languages
export const getAvailableLanguages = () => {
  return Object.keys(languageContent).map(id => ({
    id,
    ...languageContent[id]
  }))
}

// Get daily practice content for a specific language and week
export const getDailyPracticeContent = (languageId, weekId) => {
  const language = getLanguageContent(languageId)
  return language.dailyPractice?.[weekId] || null
}

// Get all weeks for a language
export const getLanguageWeeks = (languageId) => {
  const language = getLanguageContent(languageId)
  return Object.keys(language.dailyPractice || {})
}