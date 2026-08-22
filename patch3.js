const fs = require('fs');
let content = fs.readFileSync('artifacts/math-lecturer-portfolio/src/App.tsx', 'utf8');

content = content.replace(
  '<div className="min-h-[100dvh] overflow-hidden">',
  '<div className="min-h-[100dvh] overflow-hidden">\n      <ParallaxGrid />\n      <MathParticleSystem />'
);

fs.writeFileSync('artifacts/math-lecturer-portfolio/src/App.tsx', content);
