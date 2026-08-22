const fs = require('fs');
let content = fs.readFileSync('artifacts/math-lecturer-portfolio/src/App.tsx', 'utf8');

content = content.replace(
  '<div className="min-h-[100dvh] overflow-hidden">',
  '<div className="min-h-[100dvh] relative">'
);

// Make ParallaxGrid more visible
content = content.replace(
  'opacity-[0.06] math-grid"',
  'opacity-[0.2] math-grid"'
);

// Make MathParticleSystem more visible
content = content.replace(
  'opacity: Math.random() * 0.2 + 0.05,',
  'opacity: Math.random() * 0.5 + 0.3,'
);
content = content.replace(
  'className="fixed inset-0 z-[50] pointer-events-none opacity-40"',
  'className="fixed inset-0 z-[99] pointer-events-none opacity-100"'
);

content = content.replace(
  /const handleMouseMove = \(e\) => {/g,
  'const handleMouseMove = (e: MouseEvent) => {'
);

fs.writeFileSync('artifacts/math-lecturer-portfolio/src/App.tsx', content);
