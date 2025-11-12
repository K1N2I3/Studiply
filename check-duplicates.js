const fs = require('fs');
const content = fs.readFileSync('src/services/questService.js', 'utf8');

// 提取questTemplates对象
const start = content.indexOf('export const questTemplates = {');
const end = content.indexOf('export const getUserQuestProgress');

if (start === -1 || end === -1) {
  console.log('Could not find questTemplates');
  process.exit(1);
}

const questTemplatesCode = content.substring(start, end);
const lines = questTemplatesCode.split('\n');

const subjectKeys = [];
for (let i = 0; i < lines.length; i++) {
  const match = lines[i].match(/^  ([a-z-]+): \{/);
  if (match) {
    subjectKeys.push({ key: match[1], line: i + content.substring(0, start).split('\n').length });
  }
}

console.log('Subject keys found in questTemplates:');
subjectKeys.forEach(item => {
  console.log(`  Line ${item.line}: ${item.key}`);
});

// 检查重复
const duplicates = {};
subjectKeys.forEach(item => {
  if (duplicates[item.key]) {
    duplicates[item.key].push(item.line);
  } else {
    duplicates[item.key] = [item.line];
  }
});

console.log('\nDuplicates:');
Object.keys(duplicates).forEach(key => {
  if (duplicates[key].length > 1) {
    console.log(`  ${key}: ${duplicates[key].join(', ')}`);
  }
});

