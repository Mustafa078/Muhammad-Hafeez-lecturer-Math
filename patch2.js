const fs = require('fs');
let content = fs.readFileSync('artifacts/math-lecturer-portfolio/src/App.tsx', 'utf8');

// Remove from FormulaBoard
content = content.replace(
  '<div className="absolute inset-0 math-grid opacity-20" />\n      <MathParticleSystem />',
  ''
);

// Add to Home
const homeStart = content.indexOf('function Home() {');
const returnDiv = content.indexOf('<div className="min-h-screen selection:bg-[#d9a441] selection:text-[#23384b]">', homeStart);
if (returnDiv !== -1) {
  content = content.slice(0, returnDiv + 78) + '\n      <ParallaxGrid />\n      <MathParticleSystem />' + content.slice(returnDiv + 78);
}

fs.writeFileSync('artifacts/math-lecturer-portfolio/src/App.tsx', content);
