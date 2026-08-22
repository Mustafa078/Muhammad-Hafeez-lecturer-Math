const fs = require('fs');
const content = fs.readFileSync('artifacts/math-lecturer-portfolio/src/App.tsx', 'utf8');

const mathParticleStart = content.indexOf('function MathParticleSystem() {');
const mathParticleEnd = content.indexOf('function FormulaBoard() {');

const before = content.slice(0, mathParticleStart);
const after = content.slice(mathParticleEnd);

const newMathParticleSystem = `
function ParallaxGrid() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 4000], [0, -400]);
  return (
    <motion.div
      style={{ y }}
      className="fixed inset-[-100%] z-[49] pointer-events-none opacity-[0.06] math-grid"
      aria-hidden="true"
    />
  );
}

function MathParticleSystem() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles = [];
    let animationFrameId;
    const symbols = ['∫', '∑', 'π', '∞', 'Δ', 'Ω', 'μ', 'θ', 'ƒ', 'α', 'β', 'γ', 'λ'];
    const mouse = { x: -1000, y: -1000, radius: 220 };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const numParticles = Math.floor((canvas.width * canvas.height) / 12000);
      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          size: Math.random() * 12 + 10,
          symbol: symbols[Math.floor(Math.random() * symbols.length)],
          opacity: Math.random() * 0.2 + 0.05,
        });
      }
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          p.x += (dx / distance) * force * 1.5;
          p.y += (dy / distance) * force * 1.5;
        }

        ctx.font = \`\${p.size}px "Playfair Display", serif\`;
        ctx.fillStyle = \`rgba(217, 164, 65, \${p.opacity})\`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.symbol, p.x, p.y);

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx2 = p.x - p2.x;
          const dy2 = p.y - p2.y;
          const distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

          if (distance2 < 120) {
            const distToMouse = Math.min(
              Math.sqrt(Math.pow(p.x - mouse.x, 2) + Math.pow(p.y - mouse.y, 2)),
              Math.sqrt(Math.pow(p2.x - mouse.x, 2) + Math.pow(p2.y - mouse.y, 2))
            );
            
            let lineOpacity = 0.08 * (1 - distance2 / 120);
            if (distToMouse < 220) {
              lineOpacity = Math.max(lineOpacity, 0.3 * (1 - distToMouse / 220) * (1 - distance2 / 120));
            }
            
            ctx.beginPath();
            ctx.strokeStyle = \`rgba(217, 164, 65, \${lineOpacity})\`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
      animationFrameId = requestAnimationFrame(draw);
    };

    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-[50] pointer-events-none opacity-40" aria-hidden="true" />;
}

`;

fs.writeFileSync('artifacts/math-lecturer-portfolio/src/App.tsx', before + newMathParticleSystem + after);
