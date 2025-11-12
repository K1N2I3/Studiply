import fs from 'fs';

// 读取questService.js文件
const filePath = 'src/services/questService.js';
let content = fs.readFileSync(filePath, 'utf8');

// 只修复哲学学科的第一个问题，这是最关键的问题
function fixPhilosophyOnly(content) {
  let updatedContent = content;
  
  // 找到哲学学科的第一个问题并替换
  updatedContent = updatedContent.replace(
    /"question": "What is the powerhouse of the cell\?"/g,
    '"question": "What is utilitarianism?"'
  );
  
  // 替换选项
  updatedContent = updatedContent.replace(
    /"options": \[\s*"Mitochondria",\s*"Nucleus",\s*"Ribosome",\s*"Endoplasmic reticulum"\s*\]/g,
    '"options": [\n              "Greatest good for greatest number",\n              "Individual rights",\n              "Divine command",\n              "Social contract"\n            ]'
  );
  
  // 替换解释
  updatedContent = updatedContent.replace(
    /"explanation": "Mitochondria are called the powerhouse because they produce ATP energy\."/g,
    '"explanation": "Utilitarianism seeks the greatest good for the greatest number of people."'
  );
  
  return updatedContent;
}

// 执行修复
console.log('开始修复哲学学科内容...');
const updatedContent = fixPhilosophyOnly(content);

// 写回文件
fs.writeFileSync(filePath, updatedContent, 'utf8');
console.log('✅ 哲学学科内容修复完成！');
console.log('现在哲学学科显示正确的伦理学内容了');
