const fs = require('fs');
const path = require('path');

// Function to fix encoding of a file
function fixFileEncoding(filePath) {
  try {
    console.log(`Fixing encoding for: ${filePath}`);
    
    // Read file content
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Write back with UTF-8 encoding
    fs.writeFileSync(filePath, content, 'utf8');
    
    console.log(`✅ Fixed: ${filePath}`);
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
  }
}

// Files to fix
const filesToFix = [
  'telegram-bot/bot.js',
  'api-server/server.js',
  'my-project-web/src/components/MenuComponent.tsx',
  'my-project/src/components/MenuComponent.tsx'
];

// Fix each file
filesToFix.forEach(file => {
  if (fs.existsSync(file)) {
    fixFileEncoding(file);
  } else {
    console.log(`⚠️ File not found: ${file}`);
  }
});

console.log('🎉 Encoding fix completed!');
