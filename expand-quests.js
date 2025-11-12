// 扩展所有quest到5个步骤的脚本
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, setDoc, doc } from 'firebase/firestore';

// Firebase配置
const firebaseConfig = {
  apiKey: "AIzaSyBLASoEG5NwdnsVov-lvT_KJX1rg-m6QLc",
  authDomain: "study-hub-1297a.firebaseapp.com",
  projectId: "study-hub-1297a",
  storageBucket: "study-hub-1297a.firebasestorage.app",
  messagingSenderId: "278786999386",
  appId: "1:278786999386:web:7f7d9a148714565cd28463"
};

// 初始化Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 为每个学科和类别生成额外的题目
const generateAdditionalSteps = (subject, category, questId, currentSteps) => {
  const additionalSteps = [];
  const currentStepCount = currentSteps.length;
  
  // 根据学科和类别生成相关题目
  const subjectQuestions = {
    italian: {
      grammar: [
        {
          id: `step-${currentStepCount + 1}`,
          title: 'Verb Conjugation',
          type: 'multiple-choice',
          question: 'How do you conjugate the verb "essere" (to be) in the present tense for "io" (I)?',
          options: ['sono', 'sei', 'è', 'siamo'],
          correctAnswer: 0,
          explanation: 'The first person singular of "essere" is "sono" (I am).'
        },
        {
          id: `step-${currentStepCount + 2}`,
          title: 'Articles',
          type: 'multiple-choice',
          question: 'What is the correct article for "casa" (house)?',
          options: ['il', 'la', 'lo', 'l\''],
          correctAnswer: 1,
          explanation: '"Casa" is feminine, so it takes the article "la".'
        }
      ]
    },
    mathematics: {
      algebra: [
        {
          id: `step-${currentStepCount + 1}`,
          title: 'Quadratic Equations',
          type: 'multiple-choice',
          question: 'What is the solution to x² - 5x + 6 = 0?',
          options: ['x = 2, x = 3', 'x = 1, x = 6', 'x = -2, x = -3', 'x = 0, x = 5'],
          correctAnswer: 0,
          explanation: 'Factoring: (x-2)(x-3) = 0, so x = 2 or x = 3.'
        },
        {
          id: `step-${currentStepCount + 2}`,
          title: 'Linear Functions',
          type: 'multiple-choice',
          question: 'What is the slope of the line y = 3x + 2?',
          options: ['2', '3', '5', '1'],
          correctAnswer: 1,
          explanation: 'In the form y = mx + b, m is the slope, which is 3.'
        }
      ]
    },
    physics: {
      mechanics: [
        {
          id: `step-${currentStepCount + 1}`,
          title: 'Newton\'s Laws',
          type: 'multiple-choice',
          question: 'According to Newton\'s second law, F = ?',
          options: ['ma', 'mv', 'm/a', 'm²a'],
          correctAnswer: 0,
          explanation: 'Newton\'s second law states that force equals mass times acceleration (F = ma).'
        },
        {
          id: `step-${currentStepCount + 2}`,
          title: 'Kinetic Energy',
          type: 'multiple-choice',
          question: 'What is the kinetic energy formula?',
          options: ['KE = ½mv²', 'KE = mv', 'KE = mgh', 'KE = Fd'],
          correctAnswer: 0,
          explanation: 'Kinetic energy is KE = ½mv² where m is mass and v is velocity.'
        }
      ]
    },
    chemistry: {
      organic: [
        {
          id: `step-${currentStepCount + 1}`,
          title: 'Carbon Bonding',
          type: 'multiple-choice',
          question: 'How many bonds can carbon form?',
          options: ['2', '3', '4', '5'],
          correctAnswer: 2,
          explanation: 'Carbon can form 4 covalent bonds due to its 4 valence electrons.'
        },
        {
          id: `step-${currentStepCount + 2}`,
          title: 'Functional Groups',
          type: 'multiple-choice',
          question: 'What functional group is -OH?',
          options: ['Aldehyde', 'Ketone', 'Alcohol', 'Ester'],
          correctAnswer: 2,
          explanation: '-OH is the hydroxyl group, characteristic of alcohols.'
        }
      ]
    },
    history: {
      ancient: [
        {
          id: `step-${currentStepCount + 1}`,
          title: 'Ancient Civilizations',
          type: 'multiple-choice',
          question: 'Which ancient civilization built the pyramids?',
          options: ['Greeks', 'Romans', 'Egyptians', 'Mesopotamians'],
          correctAnswer: 2,
          explanation: 'The ancient Egyptians built the pyramids as tombs for their pharaohs.'
        },
        {
          id: `step-${currentStepCount + 2}`,
          title: 'Roman Empire',
          type: 'multiple-choice',
          question: 'Who was the first Roman Emperor?',
          options: ['Julius Caesar', 'Augustus', 'Nero', 'Constantine'],
          correctAnswer: 1,
          explanation: 'Augustus (originally Octavian) was the first Roman Emperor.'
        }
      ]
    },
    computerScience: {
      programming: [
        {
          id: `step-${currentStepCount + 1}`,
          title: 'Data Types',
          type: 'multiple-choice',
          question: 'What is the difference between int and float?',
          options: ['int stores integers, float stores decimals', 'No difference', 'int is faster', 'float is smaller'],
          correctAnswer: 0,
          explanation: 'int stores whole numbers, while float stores decimal numbers.'
        },
        {
          id: `step-${currentStepCount + 2}`,
          title: 'Functions',
          type: 'multiple-choice',
          question: 'What does a function return?',
          options: ['Nothing', 'A value', 'An error', 'A variable'],
          correctAnswer: 1,
          explanation: 'Functions can return a value, though some may return void (nothing).'
        }
      ]
    }
  };

  // 获取对应学科的题目
  const questions = subjectQuestions[subject]?.[category] || [];
  
  // 如果当前步骤少于5个，添加更多步骤
  for (let i = currentStepCount; i < 5; i++) {
    const questionIndex = i - currentStepCount;
    if (questions[questionIndex]) {
      additionalSteps.push(questions[questionIndex]);
    } else {
      // 生成通用题目
      additionalSteps.push({
        id: `step-${i + 1}`,
        title: `Advanced ${subject} ${category}`,
        type: 'multiple-choice',
        question: `What is an important concept in ${subject} ${category}?`,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: 0,
        explanation: `This is an important concept in ${subject} ${category}.`
      });
    }
  }

  return additionalSteps;
};

async function expandAllQuests() {
  console.log('开始扩展所有quest到5个步骤...');
  
  try {
    // 获取所有quest数据
    const questsRef = collection(db, 'quests');
    const snapshot = await getDocs(questsRef);
    
    console.log(`找到 ${snapshot.size} 个quest需要扩展`);
    
    const updatePromises = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      const { subject, category, questId, steps } = data;
      
      if (steps && steps.length < 5) {
        console.log(`扩展 ${subject}/${category}/${questId}: ${steps.length} -> 5 步骤`);
        
        // 生成额外的步骤
        const additionalSteps = generateAdditionalSteps(subject, category, questId, steps);
        const updatedSteps = [...steps, ...additionalSteps];
        
        // 更新quest数据
        const updatedData = {
          ...data,
          steps: updatedSteps,
          timeEstimate: `${Math.max(30, steps.length * 10 + 20)} min` // 调整时间估计
        };
        
        updatePromises.push(setDoc(doc.ref, updatedData));
      } else {
        console.log(`${subject}/${category}/${questId} 已经有 ${steps?.length || 0} 个步骤，跳过`);
      }
    });
    
    await Promise.all(updatePromises);
    console.log('✅ 所有quest已成功扩展到5个步骤！');
    
  } catch (error) {
    console.error('❌ 扩展quest时出错:', error);
  }
}

expandAllQuests().catch(console.error);
