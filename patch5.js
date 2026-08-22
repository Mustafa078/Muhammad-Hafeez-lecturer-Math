const fs = require('fs');
let content = fs.readFileSync('artifacts/math-lecturer-portfolio/src/App.tsx', 'utf8');

// Restore MathParticleSystem to low opacity, but keep z-index high enough so it renders over section backgrounds
content = content.replace(
  'opacity: Math.random() * 0.5 + 0.3,',
  'opacity: Math.random() * 0.15 + 0.05,'
);
content = content.replace(
  'className="fixed inset-0 z-[99] pointer-events-none opacity-100"',
  'className="fixed inset-0 z-[49] pointer-events-none mix-blend-plus-lighter opacity-70"'
);

fs.writeFileSync('artifacts/math-lecturer-portfolio/src/App.tsx', content);
