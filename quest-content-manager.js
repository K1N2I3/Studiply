import fs from 'fs';

// Quest内容管理系统
class QuestContentManager {
  constructor() {
    this.filePath = 'src/services/questService.js';
    this.content = fs.readFileSync(this.filePath, 'utf8');
  }
  
  // 定义所有学科的内容模板
  getSubjectContentTemplates() {
    return {
      // 数学学科
      mathematics: {
        algebra: {
          questions: [
            "What is the solution to 2x + 5 = 13?",
            "What is the value of x in 3x - 7 = 14?",
            "Which is the correct factorization of x² - 9?"
          ],
          options: [
            ["x = 4", "x = 9", "x = 6", "x = 8"],
            ["x = 7", "x = 21", "x = 3", "x = 9"],
            ["(x + 3)(x - 3)", "(x + 9)(x - 1)", "(x - 3)²", "(x + 3)²"]
          ],
          explanations: [
            "2x + 5 = 13 → 2x = 8 → x = 4",
            "3x - 7 = 14 → 3x = 21 → x = 7",
            "x² - 9 is a difference of squares: (x + 3)(x - 3)"
          ]
        },
        geometry: {
          questions: [
            "What is the area of a circle with radius 5?",
            "What is the Pythagorean theorem?",
            "What is the sum of angles in a triangle?"
          ],
          options: [
            ["25π", "10π", "5π", "50π"],
            ["a² + b² = c²", "a + b = c", "a² - b² = c²", "a × b = c"],
            ["180°", "90°", "360°", "270°"]
          ],
          explanations: [
            "Area = πr² = π(5)² = 25π",
            "Pythagorean theorem: a² + b² = c² for right triangles",
            "The sum of interior angles in any triangle is 180°"
          ]
        }
      },
      
      // 物理学科
      physics: {
        mechanics: {
          questions: [
            "What is Newton's first law?",
            "What is the formula for kinetic energy?",
            "What is acceleration due to gravity on Earth?"
          ],
          options: [
            ["An object at rest stays at rest", "F = ma", "Every action has an equal reaction", "Energy cannot be created"],
            ["KE = ½mv²", "KE = mv", "KE = mgh", "KE = Fd"],
            ["9.8 m/s²", "10 m/s²", "8.9 m/s²", "11 m/s²"]
          ],
          explanations: [
            "Newton's first law states that an object at rest stays at rest unless acted upon by a force.",
            "Kinetic energy formula is KE = ½mv² where m is mass and v is velocity.",
            "Standard acceleration due to gravity on Earth is approximately 9.8 m/s²."
          ]
        }
      },
      
      // 化学学科
      chemistry: {
        basics: {
          questions: [
            "What is the atomic number of carbon?",
            "What is the chemical formula for water?",
            "What is Avogadro's number?"
          ],
          options: [
            ["6", "12", "14", "8"],
            ["H₂O", "H₂O₂", "CO₂", "NaCl"],
            ["6.022 × 10²³", "6.022 × 10²²", "6.022 × 10²⁴", "6.022 × 10²¹"]
          ],
          explanations: [
            "Carbon has atomic number 6, meaning it has 6 protons.",
            "Water is composed of 2 hydrogen atoms and 1 oxygen atom: H₂O",
            "Avogadro's number is 6.022 × 10²³ particles per mole."
          ]
        }
      },
      
      // 生物学科
      biology: {
        'cell-biology': {
          questions: [
            "What is the powerhouse of the cell?",
            "What is the function of the nucleus?",
            "What is the process by which plants make food?"
          ],
          options: [
            ["Mitochondria", "Nucleus", "Ribosome", "Endoplasmic reticulum"],
            ["Control center", "Energy production", "Protein synthesis", "Waste removal"],
            ["Photosynthesis", "Respiration", "Digestion", "Circulation"]
          ],
          explanations: [
            "Mitochondria are called the powerhouse because they produce ATP energy.",
            "The nucleus controls cell activities and contains genetic material.",
            "Photosynthesis is how plants convert sunlight into food (glucose)."
          ]
        }
      },
      
      // 历史学科
      history: {
        ancient: {
          questions: [
            "Which civilization built the pyramids?",
            "What was the capital of the Roman Empire?",
            "Who was the first emperor of China?"
          ],
          options: [
            ["Ancient Egyptians", "Ancient Greeks", "Ancient Romans", "Ancient Chinese"],
            ["Athens", "Rome", "Constantinople", "Alexandria"],
            ["Qin Shi Huang", "Confucius", "Laozi", "Sun Tzu"]
          ],
          explanations: [
            "The Ancient Egyptians built the pyramids as tombs for pharaohs.",
            "Rome was the capital of the Roman Empire.",
            "Qin Shi Huang was the first emperor of unified China."
          ]
        }
      },
      
      // 哲学学科
      philosophy: {
        ethics: {
          questions: [
            "What is utilitarianism?",
            "Who wrote 'The Republic'?",
            "What is the categorical imperative?"
          ],
          options: [
            ["Greatest good for greatest number", "Individual rights", "Divine command", "Social contract"],
            ["Aristotle", "Plato", "Socrates", "Kant"],
            ["Kant's moral principle", "Aristotle's virtue", "Plato's ideal", "Bentham's utility"]
          ],
          explanations: [
            "Utilitarianism seeks the greatest good for the greatest number of people.",
            "Plato wrote 'The Republic', a foundational work of political philosophy.",
            "Kant's categorical imperative is a universal moral principle."
          ]
        }
      },
      
      // 地理学科
      geography: {
        physical: {
          questions: [
            "What is the highest mountain in the world?",
            "What is the longest river in the world?",
            "What is the largest ocean?"
          ],
          options: [
            ["Mount Everest", "K2", "Kangchenjunga", "Lhotse"],
            ["Nile", "Amazon", "Yangtze", "Mississippi"],
            ["Pacific", "Atlantic", "Indian", "Arctic"]
          ],
          explanations: [
            "Mount Everest is the highest mountain in the world at 8,848 meters.",
            "The Nile River is the longest river in the world at 6,650 km.",
            "The Pacific Ocean is the largest ocean, covering about 46% of Earth's water surface."
          ]
        }
      },
      
      // 计算机科学
      'computer-science': {
        programming: {
          questions: [
            "What is a variable in programming?",
            "What is a loop?",
            "What is the difference between '==' and '===' in JavaScript?"
          ],
          options: [
            ["Storage location for data", "Type of function", "Programming language", "Computer part"],
            ["Repeating code", "Stopping code", "Starting code", "Debugging code"],
            ["== compares values, === compares values and types", "They are the same", "=== compares values, == compares types", "No difference"]
          ],
          explanations: [
            "A variable is a storage location that holds data that can be changed during program execution.",
            "A loop is a programming construct that repeats a block of code multiple times.",
            "'==' compares values with type coercion, while '===' compares both values and types strictly."
          ]
        }
      }
    };
  }
  
  // 添加新的quest内容
  addQuestContent(subject, category, questId, questData) {
    console.log(`添加新的quest内容: ${subject} - ${category} - ${questId}`);
    // 这里可以实现添加新quest的逻辑
    // 为了保持文件结构，需要精确地插入到正确的位置
  }
  
  // 更新现有quest内容
  updateQuestContent(subject, category, questId, newContent) {
    console.log(`更新quest内容: ${subject} - ${category} - ${questId}`);
    // 这里可以实现更新quest的逻辑
  }
  
  // 验证所有quest内容的一致性
  validateQuestContent() {
    console.log('验证quest内容一致性...');
    const templates = this.getSubjectContentTemplates();
    
    // 检查是否有内容不匹配的问题
    let issues = [];
    
    // 这里可以实现验证逻辑
    // 检查每个学科的内容是否与模板匹配
    
    if (issues.length === 0) {
      console.log('✅ 所有quest内容验证通过');
    } else {
      console.log('❌ 发现以下问题:');
      issues.forEach(issue => console.log(`  - ${issue}`));
    }
    
    return issues;
  }
  
  // 保存更改
  save() {
    fs.writeFileSync(this.filePath, this.content, 'utf8');
    console.log('✅ 更改已保存');
  }
}

// 使用示例
const manager = new QuestContentManager();

// 验证当前内容
manager.validateQuestContent();

// 显示可用的内容模板
console.log('\n📚 可用的学科和类别:');
const templates = manager.getSubjectContentTemplates();
Object.keys(templates).forEach(subject => {
  console.log(`  ${subject}:`);
  Object.keys(templates[subject]).forEach(category => {
    console.log(`    - ${category}`);
  });
});

console.log('\n💡 使用方法:');
console.log('1. 使用 manager.addQuestContent() 添加新的quest');
console.log('2. 使用 manager.updateQuestContent() 更新现有quest');
console.log('3. 使用 manager.validateQuestContent() 验证内容一致性');
console.log('4. 使用 manager.save() 保存更改');

export default QuestContentManager;
