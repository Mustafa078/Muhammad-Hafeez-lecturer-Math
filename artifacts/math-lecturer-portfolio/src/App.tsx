import { type ReactNode, useEffect, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ArrowDownRight, ArrowUpRight, BarChart3, BookOpen, BrainCircuit, ChevronDown, CircleDot, Download, GraduationCap, LineChart, Mail, MapPin, Menu, MessageCircle, Phone, Quote, Sigma, Sparkles, X } from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { motion, useScroll, useTransform } from 'framer-motion';
const lecturerPortrait = "/download.png";

const queryClient = new QueryClient();

const navItems = [
  { label: 'Approach', id: 'approach' },
  { label: 'Expertise', id: 'expertise' },
  { label: 'Journey', id: 'journey' },
  { label: 'Notes', id: 'notes' },
  { label: 'Contact', id: 'contact' },
];

const expertise = [
  {
    number: '01',
    title: 'Advanced mathematics',
    description: 'From calculus and algebra to the ideas that sit underneath them — explained with patience, structure, and a reason to care.',
    icon: Sigma,
    tone: 'burgundy',
  },
  {
    number: '02',
    title: 'Statistical analysis',
    description: 'Turning tables of figures into evidence: distributions, inference, uncertainty, and the questions good data can answer.',
    icon: BarChart3,
    tone: 'teal',
  },
  {
    number: '03',
    title: 'Mathematical modeling',
    description: 'Building useful simplifications of the real world, then testing where an elegant model holds — and where it does not.',
    icon: LineChart,
    tone: 'ochre',
  },
  {
    number: '04',
    title: 'Problem-solving',
    description: 'A methodical way through unfamiliar problems: notice the pattern, choose the tool, make the invisible steps visible.',
    icon: BrainCircuit,
    tone: 'navy',
  },
];

const principles = [
  {
    title: 'Begin with the why',
    detail: 'A formula is easier to remember when a learner first understands the question it was invented to answer.',
  },
  {
    title: 'Make the invisible visible',
    detail: 'I use diagrams, careful notation, and plain language to give every abstract step somewhere to land.',
  },
  {
    title: 'Invite better questions',
    detail: 'The best lesson is not a performance of certainty. It is a room where curiosity becomes precise.',
  },
];

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.7, delay: delay / 1000, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}


function ParallaxGrid() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 4000], [0, -400]);
  return (
    <motion.div
      style={{ y }}
      className="fixed inset-[-100%] z-[49] pointer-events-none opacity-[0.2] math-grid"
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
          opacity: Math.random() * 0.15 + 0.05,
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
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

        ctx.font = `${p.size}px "Playfair Display", serif`;
        ctx.fillStyle = `rgba(217, 164, 65, ${p.opacity})`;
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
            ctx.strokeStyle = `rgba(217, 164, 65, ${lineOpacity})`;
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

  return <canvas ref={canvasRef} className="fixed inset-0 z-[49] pointer-events-none mix-blend-plus-lighter opacity-70" aria-hidden="true" />;
}

function FormulaBoard() {
  const boardRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const board = boardRef.current;
    const orbit = orbitRef.current;
    if (!board || !orbit) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = board.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const moveX = (x - centerX) * -0.04;
      const moveY = (y - centerY) * -0.04;
      
      orbit.style.transform = `translate(${moveX}px, ${moveY}px)`;
    };

    const handleMouseLeave = () => {
      orbit.style.transform = `translate(0px, 0px)`;
    };

    board.addEventListener('mousemove', handleMouseMove);
    board.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      board.removeEventListener('mousemove', handleMouseMove);
      board.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div ref={boardRef} className="relative min-h-[470px] overflow-hidden rounded-[2rem] border border-[#d2b674]/30 bg-[#23384b] p-7 text-[#f7f3ed] shadow-[0_26px_70px_rgba(52,39,35,.18)] sm:p-10" data-testid="card-formula-board">
      
      <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full border border-[#d9a441]/40" />
      <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full border border-[#d9a441]/25" />
      <svg ref={orbitRef} className="hero-orbit absolute -right-4 top-8 h-[300px] w-[300px] opacity-80 transition-transform duration-300 ease-out" viewBox="0 0 300 300" fill="none" aria-hidden="true">
        <circle cx="150" cy="150" r="102" stroke="#d9a441" strokeWidth="1.5" strokeDasharray="3 9" className="orbit-dash" />
        <path d="M48 194C74 145 107 113 153 101C196 90 218 67 235 37" stroke="#e8d9b6" strokeWidth="1.2" />
        <path d="M52 198L235 37" stroke="#d9a441" strokeWidth="1" strokeDasharray="5 7" />
        <circle cx="52" cy="198" r="5" fill="#d9a441" className="hero-dot" />
        <circle cx="153" cy="101" r="4" fill="#f7f3ed" />
        <circle cx="235" cy="37" r="5" fill="#d9a441" className="hero-dot" />
      </svg>
      <div className="relative flex items-start justify-between">
        <span className="font-mono-ui text-[10px] uppercase tracking-[.2em] text-[#d9a441]">A working notebook</span>
        <span className="font-mono-ui text-[10px] text-[#b8c5ca]">01 / 04</span>
      </div>
      <img src={lecturerPortrait} alt="M. Hafeez, Mathematics Lecturer" className="hero-portrait absolute bottom-0 right-0 z-[1] h-[320px] w-auto object-contain object-bottom sm:right-3 sm:h-[385px]" data-testid="image-lecturer-portrait" />
      <div className="relative z-[2] mt-24 max-w-[225px] sm:max-w-[245px]">
        <p className="font-display text-3xl italic leading-[1.08] text-[#f3e5c2] sm:text-4xl">“A good model is a conversation with reality.”</p>
        <div className="mt-6 h-px w-14 bg-[#d9a441]" />
        <p className="mt-3 font-mono-ui text-[9px] uppercase tracking-[.14em] text-[#b8c5ca]">M. Hafeez · teaching mathematics</p>
      </div>
      <div className="absolute bottom-6 left-6 z-[3] flex flex-col items-start gap-1 sm:bottom-8 sm:left-10">
        <div className="formula-float font-display text-[2.5rem] leading-none text-[#d9a441]">∫ f(x) dx</div>
        <div className="rounded-full border border-[#f7f3ed]/20 px-3 py-1.5 font-mono-ui text-[10px] uppercase tracking-[.15em] text-[#b8c5ca]">Faisalabad, PK</div>
      </div>
      <div className="formula-float-delay absolute bottom-[100px] right-[60px] z-[0] font-display text-5xl text-[#f7f3ed]/30 sm:right-[220px]">P(A | B)</div>
    </div>
  );
}

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('top');
  const [selectedPrinciple, setSelectedPrinciple] = useState(0);
  const [noteOpen, setNoteOpen] = useState(false);

  useEffect(() => {
    const sectionIds = ['approach', 'expertise', 'journey', 'notes', 'contact'];
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveSection(visible.target.id);
    }, { rootMargin: '-20% 0px -65% 0px', threshold: [0.12, 0.4, 0.7] });
    sectionIds.forEach((id) => {
      const node = document.getElementById(id);
      if (node) observer.observe(node);
    });
    return () => observer.disconnect();
  }, []);

  const handleNavigation = (id: string) => {
    setMenuOpen(false);
    scrollToSection(id);
  };

  return (
    <div className="min-h-[100dvh] relative">
      <ParallaxGrid />
      <MathParticleSystem />
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[#d2c7b9]/70 bg-[#f7f3ed]/90 backdrop-blur-xl" data-testid="header-site">
        <div className="section-shell flex h-[76px] items-center justify-between">
          <button onClick={() => handleNavigation('top')} className="group flex items-center gap-3 text-left" data-testid="button-home">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#6e2338] font-display text-xl italic text-[#f7f3ed]">M</span>
            <span>
              <span className="block text-[12px] font-bold tracking-[.18em] text-[#23384b]">M. HAFEEZ</span>
              <span className="block font-mono-ui text-[9px] uppercase tracking-[.13em] text-[#6d736e]">Mathematics lecturer</span>
            </span>
          </button>
          <nav className="hidden items-center gap-7 md:flex" aria-label="Main navigation">
            {navItems.map((item) => (
              <button key={item.id} onClick={() => handleNavigation(item.id)} className={`nav-link text-[11px] font-semibold uppercase tracking-[.12em] ${activeSection === item.id ? 'active' : ''}`} data-testid={`link-nav-${item.id}`}>
                {item.label}
              </button>
            ))}
            <a href="/m-hafeez-cv.pdf" target="_blank" rel="noopener noreferrer" className="button-primary ml-2 py-3 text-[10px]" data-testid="link-download-cv-nav">
              <Download size={14} strokeWidth={1.8} /> Download CV
            </a>
          </nav>
          <button onClick={() => setMenuOpen(!menuOpen)} className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d2c7b9] text-[#6e2338] md:hidden" aria-label={menuOpen ? 'Close menu' : 'Open menu'} data-testid="button-mobile-menu">
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
        {menuOpen && (
          <div className="border-t border-[#d2c7b9]/70 bg-[#f7f3ed] px-5 py-5 md:hidden" data-testid="menu-mobile">
            <nav className="section-shell flex flex-col gap-1" aria-label="Mobile navigation">
              {navItems.map((item, index) => (
                <button key={item.id} onClick={() => handleNavigation(item.id)} className="flex items-center justify-between border-b border-[#d2c7b9]/70 py-3 text-left text-sm font-semibold text-[#23384b]" data-testid={`link-mobile-${item.id}`}>
                  <span><span className="mr-3 font-mono-ui text-[10px] text-[#b28a34]">0{index + 1}</span>{item.label}</span><ArrowUpRight size={15} />
                </button>
              ))}
              <a href="/m-hafeez-cv.pdf" target="_blank" rel="noopener noreferrer" className="button-primary mt-4 w-fit" data-testid="link-download-cv-mobile"><Download size={14} /> Download CV</a>
            </nav>
          </div>
        )}
      </header>

      <main id="top">
        <section className="relative pt-32 sm:pt-40" data-testid="section-hero">
          <div className="section-shell grid items-center gap-14 pb-20 lg:grid-cols-[1.02fr_.98fr] lg:gap-20 lg:pb-28">
            <Reveal>
              <p className="eyebrow mb-6 flex items-center gap-3"><CircleDot size={11} className="text-[#d9a441]" /> Mathematics, made human</p>
              <h1 className="max-w-[700px] font-display text-[clamp(3.5rem,8vw,7.7rem)] leading-[.91] tracking-[-.055em] text-[#23384b]" data-testid="text-hero-title">
                The <span className="ink-line text-[#6e2338]">logic</span><br />behind the<br /><em className="text-[#6e2338]">world.</em>
              </h1>
              <p className="mt-9 max-w-[510px] text-[17px] leading-8 text-[#5e676b]" data-testid="text-hero-intro">
                I am <strong className="font-semibold text-[#23384b]">M. Hafeez</strong>, an experienced Mathematics Lecturer in Faisalabad. For 19 years, I have helped learners move from “I cannot” to “let me try another way.”
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-6">
                <button onClick={() => scrollToSection('approach')} className="button-primary" data-testid="button-explore-approach">Explore my approach <ArrowDownRight size={16} /></button>
                <button onClick={() => scrollToSection('contact')} className="button-quiet" data-testid="button-start-conversation">Start a conversation <ArrowUpRight size={16} /></button>
              </div>
              <div className="mt-14 flex items-center gap-4">
                <div className="flex -space-x-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#f7f3ed] bg-[#6e2338] font-display text-sm italic text-[#f7f3ed]">M</span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#f7f3ed] bg-[#d9a441] text-[#23384b]"><Sigma size={14} /></span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#f7f3ed] bg-[#4e7c78] text-[#f7f3ed]"><BookOpen size={14} /></span>
                </div>
                <p className="font-mono-ui text-[10px] uppercase leading-5 tracking-[.1em] text-[#6d736e]">A classroom for<br />curious minds</p>
              </div>
            </Reveal>
            <Reveal delay={130}><FormulaBoard /></Reveal>
          </div>
          <div className="border-y border-[#d2c7b9] bg-[#efe8dc]" data-testid="stats-strip">
            <div className="section-shell grid grid-cols-2 divide-x divide-[#d2c7b9] sm:grid-cols-5">
              <div className="py-6 pr-5 sm:py-7"><p className="font-display text-4xl text-[#6e2338]" data-testid="stat-years">19</p><p className="mt-1 font-mono-ui text-[9px] uppercase tracking-[.13em] text-[#6d736e]">years teaching</p></div>
              <div className="py-6 pl-5 sm:py-7 sm:pl-7"><p className="font-display text-4xl text-[#23384b]" data-testid="stat-superior-college">04</p><p className="mt-1 font-mono-ui text-[9px] uppercase tracking-[.13em] text-[#6d736e]">years · Superior College</p></div>
              <div className="border-t border-[#d2c7b9] py-6 pr-5 sm:border-t-0 sm:py-7 sm:pl-7"><p className="font-display text-4xl text-[#4e7c78]" data-testid="stat-punjab-college">07</p><p className="mt-1 font-mono-ui text-[9px] uppercase tracking-[.13em] text-[#6d736e]">years · Punjab College</p></div>
              <div className="border-t border-[#d2c7b9] py-6 pl-5 sm:border-t-0 sm:py-7 sm:pl-7"><p className="font-display text-4xl text-[#4e7c78]" data-testid="stat-ucp">02</p><p className="mt-1 font-mono-ui text-[9px] uppercase tracking-[.13em] text-[#6d736e]">years · UCP Faisalabad</p></div>
              <div className="border-t border-[#d2c7b9] py-6 pr-5 sm:border-t-0 sm:py-7"><p className="font-display text-4xl text-[#b28a34]" data-testid="stat-edinburgh">02</p><p className="mt-1 font-mono-ui text-[9px] uppercase tracking-[.13em] text-[#6d736e]">years · administration</p></div>
            </div>
          </div>
        </section>

        <section id="approach" className="scroll-mt-24 py-24 sm:py-32" data-testid="section-approach">
          <div className="section-shell grid gap-14 lg:grid-cols-[.8fr_1.2fr] lg:gap-24">
            <Reveal>
              <p className="eyebrow mb-5">01 / Teaching approach</p>
              <h2 className="font-display text-5xl leading-[1.02] tracking-[-.04em] text-[#23384b] sm:text-6xl">Clarity is not<br /><em className="text-[#6e2338]">simplification.</em></h2>
              <div className="mt-10 border-l-2 border-[#d9a441] pl-5">
                <p className="font-display text-2xl italic leading-snug text-[#6e2338]">“My role is to make a difficult idea feel possible — without pretending it is easy.”</p>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <p className="max-w-[650px] text-[18px] leading-8 text-[#5e676b]">Mathematics rewards attention. In my classroom, advanced ideas are not hidden behind intimidating language; they are opened carefully, connected to familiar patterns, and tested through questions.</p>
              <div className="mt-10 grid gap-3">
                {principles.map((principle, index) => (
                  <button key={principle.title} onClick={() => setSelectedPrinciple(index)} className={`principle-card flex w-full items-start justify-between gap-5 border-b border-[#d2c7b9] py-5 text-left ${selectedPrinciple === index ? 'selected' : ''}`} data-testid={`button-principle-${index + 1}`}>
                    <span className="flex items-start gap-5"><span className="font-mono-ui pt-1 text-[10px] text-[#b28a34]">0{index + 1}</span><span><span className="block text-[17px] font-semibold text-[#23384b]">{principle.title}</span>{selectedPrinciple === index && <span className="mt-2 block max-w-[500px] text-sm leading-6 text-[#6d736e]">{principle.detail}</span>}</span></span>
                    <ChevronDown size={18} className={`mt-1 shrink-0 text-[#6e2338] transition-transform ${selectedPrinciple === index ? 'rotate-180' : ''}`} />
                  </button>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        <section id="expertise" className="scroll-mt-24 bg-[#23384b] py-24 text-[#f7f3ed] sm:py-32" data-testid="section-expertise">
          <div className="section-shell">
            <Reveal>
              <div className="flex flex-col justify-between gap-7 sm:flex-row sm:items-end">
                <div><p className="eyebrow mb-5 text-[#d9a441]">02 / Areas of expertise</p><h2 className="max-w-[650px] font-display text-5xl leading-[1.02] tracking-[-.04em] text-[#f7f3ed] sm:text-6xl">Tools for seeing<br /><em className="text-[#d9a441]">what is really there.</em></h2></div>
                <p className="max-w-[280px] text-sm leading-6 text-[#b8c5ca]">The subject changes. The habit remains: observe closely, reason honestly, communicate clearly.</p>
              </div>
            </Reveal>
            <div className="mt-16 grid gap-px overflow-hidden border border-[#5d6e79] bg-[#5d6e79] sm:grid-cols-2">
              {expertise.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Reveal key={item.title} delay={index * 70} className="h-full">
                    <article className="group h-full bg-[#23384b] p-7 transition-colors duration-300 hover:bg-[#2d4659] sm:p-10" data-testid={`card-expertise-${index + 1}`}>
                      <div className="flex items-start justify-between"><span className={`flex h-11 w-11 items-center justify-center rounded-full ${item.tone === 'burgundy' ? 'bg-[#6e2338]' : item.tone === 'teal' ? 'bg-[#4e7c78]' : item.tone === 'ochre' ? 'bg-[#d9a441] text-[#23384b]' : 'bg-[#496177]'} transition-transform duration-300 group-hover:rotate-6`}><Icon size={20} strokeWidth={1.5} /></span><span className="font-mono-ui text-[10px] text-[#9eb0b6]">{item.number}</span></div>
                      <h3 className="mt-14 font-display text-3xl italic text-[#f3e5c2]">{item.title}</h3>
                      <p className="mt-4 max-w-[390px] text-sm leading-6 text-[#b8c5ca]">{item.description}</p>
                      <div className="mt-8 h-px w-0 bg-[#d9a441] transition-all duration-500 group-hover:w-14" />
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <section id="journey" className="scroll-mt-24 py-24 sm:py-32" data-testid="section-journey">
          <div className="section-shell grid gap-16 lg:grid-cols-[.7fr_1.3fr] lg:gap-24">
            <Reveal>
              <p className="eyebrow mb-5">03 / The journey</p>
              <h2 className="font-display text-5xl leading-[1.02] tracking-[-.04em] text-[#23384b] sm:text-6xl">A long view<br />of <em className="text-[#6e2338]">learning.</em></h2>
              <p className="mt-7 max-w-[360px] text-[16px] leading-7 text-[#6d736e]">A career built across classrooms, colleges, and one important belief: experience should make a teacher more curious, not less.</p>
              <div className="mt-10 hidden rounded-2xl bg-[#efe8dc] p-6 lg:block"><GraduationCap size={22} className="text-[#6e2338]" /><p className="mt-8 font-display text-2xl leading-tight text-[#23384b]">“Every class is a chance to leave the next question better than you found it.”</p></div>
            </Reveal>
            <Reveal delay={130}>
              <div className="relative ml-1 border-l border-[#d2c7b9] pl-8 sm:pl-12">
                <div className="timeline-line absolute -left-[2px] top-0 h-[86%] w-[3px]" />
                <article className="relative pb-12" data-testid="timeline-item-1">
                  <span className="absolute -left-[42px] top-1 flex h-4 w-4 items-center justify-center rounded-full border-4 border-[#f7f3ed] bg-[#6e2338] sm:-left-[58px]" />
                  <p className="font-mono-ui text-[10px] uppercase tracking-[.15em] text-[#b28a34]">Present · Faisalabad</p>
                  <h3 className="mt-3 font-display text-3xl text-[#23384b]">Mathematics Lecturer</h3>
                  <p className="mt-3 max-w-[560px] text-sm leading-6 text-[#6d736e]">Continuing to help students work confidently with advanced mathematics, statistics, modeling, and problem-solving.</p>
                </article>
                <article className="relative border-t border-[#d2c7b9] py-12" data-testid="timeline-item-2">
                  <span className="absolute -left-[42px] top-[49px] flex h-4 w-4 items-center justify-center rounded-full border-4 border-[#f7f3ed] bg-[#d9a441] sm:-left-[58px]" />
                  <p className="font-mono-ui text-[10px] uppercase tracking-[.15em] text-[#b28a34]">4 years · Superior College Khurrianwala</p>
                  <h3 className="mt-3 font-display text-3xl text-[#23384b]">A newer chapter in teaching</h3>
                  <p className="mt-3 max-w-[560px] text-sm leading-6 text-[#6d736e]">Four years of guiding learners through mathematics with the same patience, structure, and belief in steady progress.</p>
                </article>
                <article className="relative border-t border-[#d2c7b9] py-12" data-testid="timeline-item-3">
                  <span className="absolute -left-[42px] top-[49px] flex h-4 w-4 items-center justify-center rounded-full border-4 border-[#f7f3ed] bg-[#4e7c78] sm:-left-[58px]" />
                  <p className="font-mono-ui text-[10px] uppercase tracking-[.15em] text-[#b28a34]">7 years · Punjab College Faisalabad</p>
                  <h3 className="mt-3 font-display text-3xl text-[#23384b]">Teaching with range</h3>
                  <p className="mt-3 max-w-[560px] text-sm leading-6 text-[#6d736e]">A substantial chapter spent meeting learners where they were, then giving them the tools to go further.</p>
                </article>
                <article className="relative border-t border-[#d2c7b9] py-12" data-testid="timeline-item-4">
                  <span className="absolute -left-[42px] top-[49px] flex h-4 w-4 items-center justify-center rounded-full border-4 border-[#f7f3ed] bg-[#d9a441] sm:-left-[58px]" />
                  <p className="font-mono-ui text-[10px] uppercase tracking-[.15em] text-[#b28a34]">2 years · University of Central Punjab</p>
                  <h3 className="mt-3 font-display text-3xl text-[#23384b]">Higher education, close up</h3>
                  <p className="mt-3 max-w-[560px] text-sm leading-6 text-[#6d736e]">Two years at UCP Faisalabad, supporting a more independent and analytical style of learning.</p>
                </article>
                <article className="relative border-t border-[#d2c7b9] pt-12" data-testid="timeline-item-5">
                  <span className="absolute -left-[42px] top-[49px] flex h-4 w-4 items-center justify-center rounded-full border-4 border-[#f7f3ed] bg-[#23384b] sm:-left-[58px]" />
                  <p className="font-mono-ui text-[10px] uppercase tracking-[.15em] text-[#b28a34]">2 years · Edinburgh Education Centre, Lahore</p>
                  <h3 className="mt-3 font-display text-3xl text-[#23384b]">The administrator’s lens</h3>
                  <p className="mt-3 max-w-[560px] text-sm leading-6 text-[#6d736e]">A practical chapter in administration that sharpened the wider view of how educational spaces work.</p>
                </article>
              </div>
            </Reveal>
          </div>
        </section>

        <section id="notes" className="scroll-mt-24 border-y border-[#d2c7b9] bg-[#efe8dc] py-24 sm:py-32" data-testid="section-notes">
          <div className="section-shell">
            <Reveal>
              <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end"><div><p className="eyebrow mb-5">04 / Accessible mathematics</p><h2 className="font-display text-5xl leading-[1.02] tracking-[-.04em] text-[#23384b] sm:text-6xl">One small question.<br /><em className="text-[#6e2338]">A better model.</em></h2></div><p className="max-w-[280px] text-sm leading-6 text-[#6d736e]">Short notes for people who enjoy noticing how an idea works.</p></div>
            </Reveal>
            <div className="mt-14 grid gap-8 lg:grid-cols-[1.15fr_.85fr]">
              <Reveal delay={100}>
                <article className="note-card relative overflow-hidden rounded-[1.8rem] border border-[#d2c7b9] bg-[#f7f3ed] p-7 sm:p-10" data-testid="card-featured-note">
                  <div className="absolute right-0 top-0 h-48 w-48 rounded-bl-[100%] bg-[#d9a441]/20" />
                  <div className="relative flex items-center justify-between"><span className="font-mono-ui text-[10px] uppercase tracking-[.16em] text-[#6e2338]">Field note · 01</span><MessageCircle size={18} className="text-[#6e2338]" /></div>
                  <h3 className="relative mt-14 max-w-[520px] font-display text-4xl leading-tight text-[#23384b] sm:text-5xl">Why does the average sometimes lie?</h3>
                  <p className="relative mt-5 max-w-[490px] text-[15px] leading-7 text-[#6d736e]">The mean is useful, but it is never the whole story. Start with the shape of the data, ask who is represented, and notice what one number leaves out.</p>
                  {noteOpen && <div className="relative mt-5 border-t border-[#d2c7b9] pt-5 text-sm leading-7 text-[#23384b]"><strong className="font-semibold text-[#6e2338]">Try this:</strong> compare the mean and median of {`{2, 3, 3, 4, 18}`}. The outlier changes the mean’s story, while the median keeps its footing.</div>}
                  <button onClick={() => setNoteOpen(!noteOpen)} className="button-quiet relative mt-8" data-testid="button-read-note">{noteOpen ? 'Close note' : 'Read the note'} <ArrowUpRight size={16} /></button>
                </article>
              </Reveal>
              <Reveal delay={180}>
                <aside className="relative overflow-hidden rounded-[1.8rem] bg-[#6e2338] p-7 text-[#f7f3ed] sm:p-9" data-testid="card-math-quote">
                  <Quote size={28} className="text-[#d9a441]" />
                  <p className="mt-14 font-display text-3xl italic leading-tight text-[#f3e5c2]">“The elegance of mathematics is not in being difficult. It is in making a complicated thing honest.”</p>
                  <div className="mt-12 flex items-center justify-between border-t border-[#f7f3ed]/20 pt-5"><span className="font-mono-ui text-[10px] uppercase tracking-[.15em] text-[#e1c8a0]">A note from class</span><span className="font-display text-2xl italic text-[#d9a441]">M.H.</span></div>
                  <div className="absolute -bottom-12 -right-10 h-36 w-36 rounded-full border border-[#d9a441]/40" />
                </aside>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="py-24 sm:py-32" data-testid="section-education">
          <div className="section-shell grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-24">
            <Reveal>
              <p className="eyebrow mb-5">05 / Foundations</p>
              <h2 className="font-display text-5xl leading-[1.02] tracking-[-.04em] text-[#23384b] sm:text-6xl">The discipline<br />behind the <em className="text-[#6e2338]">craft.</em></h2>
            </Reveal>
            <Reveal delay={120}>
              <div className="divide-y divide-[#d2c7b9] border-y border-[#d2c7b9]">
                <div className="flex gap-5 py-6" data-testid="education-msc"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#efe8dc] text-[#6e2338]"><GraduationCap size={19} /></span><div><p className="font-display text-2xl text-[#23384b]">M.Sc Mathematics</p><p className="mt-1 font-mono-ui text-[10px] uppercase tracking-[.12em] text-[#6d736e]">Punjab University Lahore · 1992</p></div></div>
                <div className="flex gap-5 py-6" data-testid="education-bsc"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#efe8dc] text-[#4e7c78]"><GraduationCap size={19} /></span><div><p className="font-display text-2xl text-[#23384b]">B.Sc Mathematics &amp; Statistics</p><p className="mt-1 font-mono-ui text-[10px] uppercase tracking-[.12em] text-[#6d736e]">Govt Islamia College Gujranwala · 1989</p></div></div>
                <div className="flex gap-5 py-6" data-testid="education-diplomas"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#efe8dc] text-[#b28a34]"><Sparkles size={18} /></span><div><p className="font-display text-2xl text-[#23384b]">Computer applications &amp; MS Word</p><p className="mt-1 font-mono-ui text-[10px] uppercase tracking-[.12em] text-[#6d736e]">Additional diplomas · practical fluency</p></div></div>
              </div>
            </Reveal>
          </div>
        </section>

        <section id="contact" className="scroll-mt-24 bg-[#4e7c78] py-24 text-[#f7f3ed] sm:py-32" data-testid="section-contact">
          <div className="section-shell grid gap-14 lg:grid-cols-[1.1fr_.9fr] lg:items-end lg:gap-24">
            <Reveal>
              <p className="eyebrow mb-5 text-[#e5d7ad]">06 / Let’s talk</p>
              <h2 className="max-w-[700px] font-display text-5xl leading-[1.02] tracking-[-.04em] sm:text-7xl">Have a question<br />worth <em className="text-[#f3e5c2]">working through?</em></h2>
              <p className="mt-7 max-w-[530px] text-[16px] leading-7 text-[#d4e0dc]">For institutions, students, and curious minds in Faisalabad and beyond — I would be glad to hear what you are thinking about.</p>
              <a href="/m-hafeez-cv.pdf" target="_blank" rel="noopener noreferrer" className="mt-9 inline-flex items-center gap-2 border-b border-[#f3e5c2] pb-2 text-sm font-semibold text-[#f3e5c2] transition-colors hover:text-white" data-testid="link-download-cv-contact"><Download size={16} /> Download CV PDF</a>
            </Reveal>
            <Reveal delay={140}>
              <div className="space-y-3">
                <a href="mailto:m.hafeez2397@gmail.com" className="group flex items-center justify-between border-t border-[#d4e0dc]/30 py-5" data-testid="link-email"><span className="flex items-center gap-4"><Mail size={19} className="text-[#f3e5c2]" /><span><span className="block font-mono-ui text-[9px] uppercase tracking-[.14em] text-[#b9d0c9]">Email</span><span className="mt-1 block text-sm font-semibold">m.hafeez2397@gmail.com</span></span></span><ArrowUpRight size={18} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></a>
                <a href="tel:033006667075" className="group flex items-center justify-between border-t border-[#d4e0dc]/30 py-5" data-testid="link-phone-primary"><span className="flex items-center gap-4"><Phone size={19} className="text-[#f3e5c2]" /><span><span className="block font-mono-ui text-[9px] uppercase tracking-[.14em] text-[#b9d0c9]">Phone</span><span className="mt-1 block text-sm font-semibold">033006667075</span></span></span><ArrowUpRight size={18} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></a>
                <a href="tel:03157087689" className="group flex items-center justify-between border-y border-[#d4e0dc]/30 py-5" data-testid="link-phone-secondary"><span className="flex items-center gap-4"><Phone size={19} className="text-[#f3e5c2]" /><span><span className="block font-mono-ui text-[9px] uppercase tracking-[.14em] text-[#b9d0c9]">Also reachable on</span><span className="mt-1 block text-sm font-semibold">03157087689</span></span></span><ArrowUpRight size={18} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></a>
                <div className="flex items-center gap-4 py-5 text-[#d4e0dc]" data-testid="text-location"><MapPin size={19} className="text-[#f3e5c2]" /><span><span className="block font-mono-ui text-[9px] uppercase tracking-[.14em] text-[#b9d0c9]">Based in</span><span className="mt-1 block text-sm font-semibold text-[#f7f3ed]">Faisalabad, Punjab, Pakistan</span></span></div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="bg-[#23384b] py-8 text-[#b8c5ca]">
        <div className="section-shell flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#d9a441] font-display text-lg italic text-[#23384b]">M</span><span className="font-mono-ui text-[10px] uppercase tracking-[.14em]">M. Hafeez · Mathematics Lecturer</span></div>
          <p className="font-mono-ui text-[9px] uppercase tracking-[.12em] text-[#8da1ab]">Teach the idea. Trust the learner.</p>
          <button onClick={() => handleNavigation('top')} className="flex items-center gap-2 self-start font-mono-ui text-[9px] uppercase tracking-[.12em] text-[#f3e5c2] sm:self-auto" data-testid="button-back-to-top">Back to top <ArrowUpRight size={14} /></button>
        </div>
      </footer>
    </div>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;