import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Sun, 
  Moon, 
  Sparkles, 
  Video, 
  Sliders, 
  Eye, 
  Clock, 
  ShoppingBag, 
  Info,
  Maximize2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import titanClockImg from '../titan_wall_clock.png';

interface ShowcaseProps {
  addToCart: (product: Product) => void;
}

// A mock Product object representing the Aurelius Wall Clock
const clockProduct: Product = {
  id: '7',
  name: 'Aurelius Wall Clock',
  collection: 'Grand Atelier',
  price: 24500,
  image: '/src/titan_wall_clock.png',
  description: 'An architectural centerpiece for modern estates. Gold sweeping hands dance in absolute synchronization against a textured backdrop, bathed in soft studio lighting.',
  features: ['Double-Domed Sapphire', 'Caliber Cal-T90 Continuous Sweep', '24k Gold Hands', 'Showcase Mode']
};

export default function Showcase({ addToCart }: ShowcaseProps) {
  // Navigation & Control states
  const [cameraView, setCameraView] = useState<'room' | 'macro' | 'bezel'>('room');
  const [lightingMode, setLightingMode] = useState<'studio' | 'golden' | 'midnight'>('studio');
  const [speedMode, setSpeedMode] = useState<'realtime' | 'timelapse' | 'slowmo'>('realtime');
  const [depthOfField, setDepthOfField] = useState<number>(4); // px blur when macro is on
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);

  // Time tracking states
  const [time, setTime] = useState(new Date());
  const [customAngle, setCustomAngle] = useState(0); // Used for Time-Lapse fast rotation
  
  // Mouse reflection tracking
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle system clock tick / Time-lapse / Slow-mo
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    if (speedMode === 'realtime') {
      intervalId = setInterval(() => {
        setTime(new Date());
      }, 100);
    } else if (speedMode === 'slowmo') {
      // Sweeps extremely slowly (10x slower)
      intervalId = setInterval(() => {
        setTime(prev => new Date(prev.getTime() + 10)); // tiny increment
      }, 100);
    } else if (speedMode === 'timelapse') {
      // Hands rotate rapidly in time-lapse mode
      intervalId = setInterval(() => {
        setCustomAngle(prev => (prev + 3) % 360);
        setTime(prev => new Date(prev.getTime() + 15000)); // adds 15s per tick
      }, 20);
    }

    return () => clearInterval(intervalId);
  }, [speedMode]);

  // Handle reflection movement on mouse hover
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  // Convert time to hands rotational angles (in degrees)
  const getHandAngles = () => {
    if (speedMode === 'timelapse') {
      // In timelapse, we drive rotation continuously via customAngle state
      return {
        second: customAngle * 6,
        minute: customAngle * 0.5,
        hour: customAngle * 0.04
      };
    }

    const hrs = time.getHours();
    const mins = time.getMinutes();
    const secs = time.getSeconds();
    const ms = time.getMilliseconds();

    // Continuous smooth sweeping second hand
    const secondAngle = (secs * 6) + (ms * 0.006);
    // Smooth minute hand
    const minuteAngle = (mins * 6) + (secs * 0.1);
    // Smooth hour hand
    const hourAngle = ((hrs % 12) * 30) + (mins * 0.5);

    return {
      second: secondAngle,
      minute: minuteAngle,
      hour: hourAngle
    };
  };

  const { second: secAngle, minute: minAngle, hour: hrAngle } = getHandAngles();

  // Manage hotspots detail data
  const hotspots = [
    {
      id: 'hands',
      label: '24k Gold Hands',
      description: 'Intricately counter-balanced solid gold hour, minute, and second hands, designed for ultra-smooth continuous sweep synchronization.',
      top: '51%',
      left: '52%',
      view: 'macro'
    },
    {
      id: 'bezel',
      label: 'Polished Rose-Gold Rim',
      description: 'A marine-grade brushed steel bezel featuring a hand-applied 24-karat gold finish for an elegant metallic glow.',
      top: '20%',
      left: '65%',
      view: 'bezel'
    },
    {
      id: 'crystal',
      label: 'Sapphire Crystal Dome',
      description: 'Double-domed sapphire face with 7 layers of anti-reflective coating, ensuring flawless legibility under warm studio lighting.',
      top: '38%',
      left: '32%',
      view: 'macro'
    },
    {
      id: 'movement',
      label: 'Caliber Cal-T90',
      description: 'A revolutionary bespoke continuous sweep electric-mechanical hybrid movement. Made in Switzerland, tuned to ±1s precision.',
      top: '58%',
      left: '46%',
      view: 'macro'
    }
  ];

  // Camera views transformation styles
  const getCameraStyles = () => {
    switch(cameraView) {
      case 'macro':
        return {
          scale: 2.1,
          x: '5%',
          y: '8%',
          filter: `blur(0px)` // Clock is always sharp
        };
      case 'bezel':
        return {
          scale: 1.5,
          x: '-12%',
          y: '-8%',
          filter: `blur(0px)`
        };
      case 'room':
      default:
        return {
          scale: 1.0,
          x: '0%',
          y: '0%',
          filter: 'blur(0px)'
        };
    }
  };

  // Handle Add to Cart action with feedback
  const handleReserve = () => {
    setIsAdding(true);
    setTimeout(() => {
      addToCart(clockProduct);
      setIsAdding(false);
      setAdded(true);
      setTimeout(() => setAdded(false), 3000);
    }, 1200);
  };

  // Dynamic Ambient Lights Colors base on active lighting mode
  const getLightingStyles = () => {
    switch (lightingMode) {
      case 'golden':
        return {
          gradient: 'from-amber-500/20 via-orange-600/10 to-transparent',
          glow: 'rgba(245, 158, 11, 0.18)',
          overlayColor: 'bg-amber-900/10',
          highlights: 'radial-gradient(circle at 10% 20%, rgba(251, 191, 36, 0.4) 0%, transparent 60%)'
        };
      case 'midnight':
        return {
          gradient: 'from-indigo-900/30 via-purple-900/15 to-transparent',
          glow: 'rgba(99, 102, 241, 0.15)',
          overlayColor: 'bg-indigo-950/20',
          highlights: 'radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)'
        };
      case 'studio':
      default:
        return {
          gradient: 'from-yellow-500/15 via-transparent to-transparent',
          glow: 'rgba(212, 175, 55, 0.1)',
          overlayColor: 'bg-transparent',
          highlights: 'radial-gradient(circle at 40% 30%, rgba(212, 175, 55, 0.25) 0%, transparent 40%)'
        };
    }
  };

  const lights = getLightingStyles();

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full overflow-hidden bg-luxury-charcoal flex flex-col justify-between pt-24 font-sans select-none"
    >
      {/* Background Room Canvas Layer with Dynamic Camera Pan & Shallow DoF blur */}
      <motion.div
        animate={getCameraStyles()}
        transition={{ duration: 1.8, ease: [0.25, 1, 0.5, 1] }}
        className="absolute inset-0 w-full h-full z-0"
      >
        {/* Underlay Image: Realistic minimalist luxury concrete wall background */}
        <motion.div
          animate={{
            filter: cameraView !== 'room' ? `blur(${depthOfField}px)` : 'blur(0px)'
          }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 w-full h-full"
        >
          <img 
            src={titanClockImg} 
            alt="Luxury Minimalist Room" 
            className="w-full h-full object-cover opacity-60 scale-105"
          />
          {/* Ambient Lighting Gradients overlay */}
          <div className={`absolute inset-0 bg-gradient-to-tr ${lights.gradient} transition-all duration-1000`} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
          <div className={`absolute inset-0 ${lights.overlayColor} transition-colors duration-1000 pointer-events-none mix-blend-color-burn`} />
        </motion.div>

        {/* High-Fidelity SVG Interactive Clock Overlay - Positioned perfectly over the wall center */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, delay: 0.2 }}
            className="relative w-[340px] h-[340px] md:w-[460px] md:h-[460px] flex items-center justify-center"
            style={{
              filter: `drop-shadow(0 25px 50px rgba(0, 0, 0, 0.85))`
            }}
          >
            {/* The SVG Clock Dial */}
            <svg 
              viewBox="0 0 500 500" 
              className="w-full h-full"
            >
              <defs>
                {/* 3D Gold Frame Gradient */}
                <linearGradient id="goldBezel" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8A6623" />
                  <stop offset="30%" stopColor="#E6C687" />
                  <stop offset="50%" stopColor="#B89047" />
                  <stop offset="70%" stopColor="#F7E2B4" />
                  <stop offset="100%" stopColor="#8A6623" />
                </linearGradient>
                
                {/* Brushed Dial Face Radial Gradient */}
                <radialGradient id="dialFace" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#1C1C1C" />
                  <stop offset="70%" stopColor="#0F0F0F" />
                  <stop offset="100%" stopColor="#050505" />
                </radialGradient>
                
                {/* Metallic Gold Hands Gradient */}
                <linearGradient id="goldHand" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#B38A38" />
                  <stop offset="50%" stopColor="#F9DF95" />
                  <stop offset="100%" stopColor="#9C7323" />
                </linearGradient>

                {/* Drop shadow for 3D depth of hands */}
                <filter id="handShadow" x="-10%" y="-10%" width="130%" height="130%">
                  <feDropShadow dx="3" dy="5" stdDeviation="4" floodColor="#000" floodOpacity="0.85" />
                </filter>
                
                {/* Subtle outer glow for modern night aesthetics */}
                <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="15" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Luminous Outer Aura (glowing behind the bezel) */}
              <circle 
                cx="250" 
                cy="250" 
                r="242" 
                fill="none" 
                stroke={lightingMode === 'midnight' ? '#818CF8' : '#C5A059'}
                strokeWidth="4"
                opacity="0.12"
                filter="url(#neonGlow)"
                className="transition-colors duration-1000"
              />

              {/* Polished Bezel Outer Ring */}
              <circle 
                cx="250" 
                cy="250" 
                r="240" 
                fill="none" 
                stroke="url(#goldBezel)" 
                strokeWidth="16" 
              />
              
              {/* Bezel Inner Accent Ring */}
              <circle 
                cx="250" 
                cy="250" 
                r="231" 
                fill="none" 
                stroke="#1A1A1A" 
                strokeWidth="2" 
              />

              {/* Clock Face Dial */}
              <circle 
                cx="250" 
                cy="250" 
                r="230" 
                fill="url(#dialFace)" 
              />

              {/* Micro mechanical gears visualization (visible in skeletonized center ring) */}
              <g opacity="0.15" transform="translate(250, 250)">
                {/* Center Outer gear */}
                <motion.path 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 45, ease: "linear" }}
                  d="M0,0 M-50,0 A50,50 0 1,1 50,0 A50,50 0 1,1 -50,0" 
                  fill="none" 
                  stroke="url(#goldHand)" 
                  strokeWidth="3" 
                  strokeDasharray="4 6"
                />
                {/* Rotating Core Gear wheel */}
                <motion.g
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                >
                  <circle cx="0" cy="0" r="30" fill="none" stroke="#C5A059" strokeWidth="1" />
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                    <line 
                      key={angle} 
                      x1="0" 
                      y1="0" 
                      x2={30 * Math.cos(angle * Math.PI / 180)} 
                      y2={30 * Math.sin(angle * Math.PI / 180)} 
                      stroke="#C5A059" 
                      strokeWidth="1" 
                    />
                  ))}
                  <circle cx="0" cy="0" r="8" fill="#121212" stroke="#C5A059" strokeWidth="2" />
                </motion.g>
              </g>

              {/* Hour & Minute Ticks Around the Bezel */}
              {[...Array(60)].map((_, i) => {
                const angle = (i * 6) * Math.PI / 180;
                const isHour = i % 5 === 0;
                const r1 = isHour ? 208 : 220;
                const r2 = 226;
                return (
                  <line
                    key={i}
                    x1={250 + r1 * Math.cos(angle)}
                    y1={250 + r1 * Math.sin(angle)}
                    x2={250 + r2 * Math.cos(angle)}
                    y2={250 + r2 * Math.sin(angle)}
                    stroke={isHour ? "url(#goldHand)" : "#4B5563"}
                    strokeWidth={isHour ? 2.5 : 1}
                    opacity={isHour ? 0.9 : 0.4}
                  />
                );
              })}

              {/* Elegant Classic Roman Numerals in Serif style */}
              <g fontFamily="var(--font-serif)" fontSize="26" fill="url(#goldHand)" textAnchor="middle" dominantBaseline="middle" opacity="0.9" letterSpacing="2">
                <text x="250" y="70">XII</text>
                <text x="430" y="250">III</text>
                <text x="250" y="430">VI</text>
                <text x="70" y="250">IX</text>
              </g>

              {/* SUBTLE BRAND TEXT */}
              <text 
                x="250" 
                y="155" 
                fontFamily="var(--font-sans)" 
                fontSize="9" 
                fill="#C5A059" 
                textAnchor="middle" 
                letterSpacing="5" 
                fontWeight="700" 
                opacity="0.8"
              >
                TITAN
              </text>
              <text 
                x="250" 
                y="350" 
                fontFamily="var(--font-serif)" 
                fontSize="12" 
                fill="#A3A3A3" 
                textAnchor="middle" 
                letterSpacing="2" 
                fontStyle="italic"
              >
                Atelier Geneve
              </text>

              {/* ================= CLOCK HANDS (SHADOW + VECTOR ROTATION) ================= */}
              
              {/* Hour Hand */}
              <g transform={`rotate(${hrAngle}, 250, 250)`} filter="url(#handShadow)">
                {/* Sleek classic spade/spear shape */}
                <path 
                  d="M247,250 L248,150 L250,132 L252,150 L253,250 Z" 
                  fill="url(#goldHand)" 
                />
                <circle cx="250" cy="165" r="4" fill="url(#goldHand)" />
              </g>

              {/* Minute Hand */}
              <g transform={`rotate(${minAngle}, 250, 250)`} filter="url(#handShadow)">
                {/* Ultra thin elegant minute hand */}
                <path 
                  d="M248.5,250 L249,85 L250,60 L251,85 L251.5,250 Z" 
                  fill="url(#goldHand)" 
                />
                <circle cx="250" cy="95" r="3" fill="url(#goldHand)" />
              </g>

              {/* Center Hub Housing */}
              <circle cx="250" cy="250" r="10" fill="url(#goldBezel)" filter="url(#handShadow)" />

              {/* Second Hand - Sleek continuous sweep needle */}
              <g transform={`rotate(${secAngle}, 250, 250)`} filter="url(#handShadow)">
                <line 
                  x1="250" 
                  y1="310" 
                  x2="250" 
                  y2="50" 
                  stroke={lightingMode === 'midnight' ? '#C5A059' : '#D97706'} 
                  strokeWidth="1.2" 
                />
                {/* Counterweight detail */}
                <circle 
                  cx="250" 
                  cy="295" 
                  r="5" 
                  fill="none" 
                  stroke={lightingMode === 'midnight' ? '#C5A059' : '#D97706'} 
                  strokeWidth="1.5" 
                />
                {/* Micro center pin */}
                <circle cx="250" cy="250" r="3" fill="#121212" />
              </g>
            </svg>

            {/* Glowing Mouse reflection dome overlay */}
            <div 
              className="absolute inset-4 rounded-full pointer-events-none transition-opacity duration-500"
              style={{
                background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0) 60%)`,
                boxShadow: `inset 0 10px 40px rgba(255, 255, 255, 0.05), inset 0 -10px 40px rgba(0,0,0,0.8)`
              }}
            />
          </motion.div>
        </div>

        {/* Pulsing Interactive Hotspots - Hidden when in Timelapse to avoid clutter */}
        <AnimatePresence>
          {speedMode !== 'timelapse' && hotspots.map((spot) => {
            // Determine visibility based on active camera view matching the spot view
            const isVisible = cameraView === spot.view || cameraView === 'room';
            if (!isVisible) return null;

            return (
              <motion.div
                key={spot.id}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.5 }}
                className="absolute z-20 pointer-events-auto"
                style={{ top: spot.top, left: spot.left }}
              >
                <div className="relative flex items-center justify-center">
                  {/* Expanding ring */}
                  <div className="absolute w-6 h-6 rounded-full border border-luxury-gold/60 animate-ping opacity-75" />
                  
                  {/* Inner interactive dot */}
                  <button 
                    onClick={() => setActiveHotspot(activeHotspot === spot.id ? null : spot.id)}
                    className="w-4 h-4 rounded-full bg-luxury-gold flex items-center justify-center shadow-lg border border-black focus:outline-none transition-transform hover:scale-125"
                  >
                    <Info size={8} className="text-black font-bold" />
                  </button>

                  {/* Hotspot Card Overlay */}
                  <AnimatePresence>
                    {activeHotspot === spot.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute bottom-6 left-1/2 -translate-x-1/2 w-64 p-4 rounded-lg bg-black/85 backdrop-blur-md border border-white/10 text-left z-30 shadow-2xl pointer-events-auto"
                      >
                        <h4 className="font-serif text-sm text-white font-medium mb-1 tracking-wider uppercase">{spot.label}</h4>
                        <p className="text-[11px] text-luxury-text-muted leading-relaxed font-light">{spot.description}</p>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setActiveHotspot(null); }}
                          className="absolute top-2 right-2 text-white/40 hover:text-white text-[10px]"
                        >
                          ✕
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Atmospheric dynamic highlights overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-10 opacity-30 mix-blend-screen transition-all duration-1000"
        style={{ background: lights.highlights }}
      />

      {/* HEADER: Retro Navigation & Title */}
      <div className="relative z-30 px-6 md:px-12 flex justify-between items-start pointer-events-auto">
        <Link 
          to="/"
          className="flex items-center gap-2 group bg-black/35 backdrop-blur-md px-5 py-3 border border-white/5 hover:border-luxury-gold/30 rounded-full transition-all"
        >
          <ArrowLeft size={14} className="text-luxury-gold group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-luxury-text-muted group-hover:text-white transition-colors">
            Exit Atelier
          </span>
        </Link>

        <div className="text-right bg-black/25 backdrop-blur-sm p-4 rounded-lg border border-white/5 hidden md:block">
          <div className="flex items-center justify-end gap-2 text-luxury-gold text-[10px] uppercase tracking-[0.3em] font-bold mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Virtual Showcase Active
          </div>
          <span className="text-white/60 font-mono text-xs uppercase tracking-widest">
            {speedMode === 'timelapse' ? '⚡ Time-Lapse Mode' : speedMode === 'slowmo' ? '⏳ Slow Motion' : '🕒 Real-Time System Sync'}
          </span>
        </div>
      </div>

      {/* FLOATING CONTROLS DASHBOARD (Left Side Glass Card) */}
      <div className="relative z-30 px-6 md:px-12 pb-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end pointer-events-none">
        
        {/* Controls Console */}
        <div className="lg:col-span-4 bg-black/45 backdrop-blur-2xl border border-white/10 p-6 md:p-8 rounded-2xl shadow-luxury space-y-8 pointer-events-auto max-w-md w-full">
          <div>
            <span className="text-luxury-gold text-[9px] uppercase tracking-[0.4em] font-bold mb-2 block">Titan Atelier</span>
            <h2 className="font-serif text-3xl md:text-4xl text-white tracking-wide">
              Aurelius <span className="italic font-light text-white/80">4K</span>
            </h2>
            <div className="h-[1px] bg-white/10 mt-4 w-full" />
          </div>

          {/* SECTION 1: Camera Preset Pan & Zoom */}
          <div className="space-y-3">
            <span className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-luxury-text-muted font-semibold">
              <Video size={12} className="text-luxury-gold" /> Camera Directors
            </span>
            <div className="grid grid-cols-3 gap-2 bg-white/5 p-1 rounded-lg border border-white/5">
              {[
                { id: 'room', label: 'Room Pan' },
                { id: 'macro', label: 'Macro Hands' },
                { id: 'bezel', label: 'Detail Rim' }
              ].map((view) => (
                <button
                  key={view.id}
                  onClick={() => setCameraView(view.id as any)}
                  className={`py-2 px-1 text-[10px] uppercase tracking-wider rounded font-medium transition-all ${
                    cameraView === view.id 
                      ? 'bg-luxury-gold text-black font-bold shadow' 
                      : 'text-luxury-text-muted hover:text-white hover:bg-white/5'
                  }`}
                >
                  {view.label}
                </button>
              ))}
            </div>
          </div>

          {/* SECTION 2: Studio Lights Switcher */}
          <div className="space-y-3">
            <span className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-luxury-text-muted font-semibold">
              <Sun size={12} className="text-luxury-gold" /> Studio Light Fields
            </span>
            <div className="grid grid-cols-3 gap-2 bg-white/5 p-1 rounded-lg border border-white/5">
              {[
                { id: 'studio', label: 'Warm Studio', icon: <Sparkles size={10} /> },
                { id: 'golden', label: 'Golden Hour', icon: <Sun size={10} /> },
                { id: 'midnight', label: 'Midnight', icon: <Moon size={10} /> }
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setLightingMode(mode.id as any)}
                  className={`py-2 px-1 text-[10px] uppercase tracking-wider rounded font-medium flex items-center justify-center gap-1.5 transition-all ${
                    lightingMode === mode.id 
                      ? 'bg-luxury-gold text-black font-bold shadow' 
                      : 'text-luxury-text-muted hover:text-white hover:bg-white/5'
                  }`}
                >
                  {mode.icon}
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          {/* SECTION 3: Dynamic Sweeping Speed Profiles */}
          <div className="space-y-3">
            <span className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-luxury-text-muted font-semibold">
              <Clock size={12} className="text-luxury-gold" /> Mechanical Speed
            </span>
            <div className="grid grid-cols-3 gap-2 bg-white/5 p-1 rounded-lg border border-white/5">
              {[
                { id: 'realtime', label: 'Real-Time' },
                { id: 'slowmo', label: 'Slow Sweep' },
                { id: 'timelapse', label: 'Time-Lapse' }
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => {
                    setSpeedMode(mode.id as any);
                    if (mode.id !== 'timelapse') setCustomAngle(0);
                  }}
                  className={`py-2 px-1 text-[10px] uppercase tracking-wider rounded font-medium transition-all ${
                    speedMode === mode.id 
                      ? 'bg-luxury-gold text-black font-bold shadow' 
                      : 'text-luxury-text-muted hover:text-white hover:bg-white/5'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          {/* SECTION 4: Depth of field blur slider (Interactive shallow depth adjustment) */}
          {cameraView !== 'room' && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3"
            >
              <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-luxury-text-muted font-semibold">
                <span className="flex items-center gap-2">
                  <Sliders size={12} className="text-luxury-gold" /> Depth of Field
                </span>
                <span className="text-luxury-gold font-mono">{depthOfField}px Blur</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="8" 
                value={depthOfField} 
                onChange={(e) => setDepthOfField(parseInt(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-luxury-gold"
              />
              <p className="text-[9px] text-white/40 leading-relaxed italic">Adjust blurred background intensity to mimic high-aperture lenses.</p>
            </motion.div>
          )}
        </div>

        {/* Filler column for center space */}
        <div className="lg:col-span-4 hidden lg:block" />

        {/* RIGHT SIDE: Masterpiece Details & Purchase reserving Action */}
        <div className="lg:col-span-4 bg-black/45 backdrop-blur-2xl border border-white/10 p-6 md:p-8 rounded-2xl shadow-luxury space-y-6 pointer-events-auto max-w-md w-full ml-auto">
          <div className="flex justify-between items-start">
            <div>
              <span className="bg-luxury-gold/15 text-luxury-gold border border-luxury-gold/30 px-3 py-1 rounded text-[8px] uppercase tracking-[0.2em] font-bold">
                Limited Masterpiece
              </span>
              <h3 className="font-serif text-2xl text-white mt-3">Grand Atelier VII</h3>
            </div>
            <div className="text-right">
              <span className="text-2xl text-white font-serif tracking-wide">$24,500</span>
              <p className="text-[8px] text-luxury-text-muted uppercase tracking-widest mt-1">Excl. Shipping</p>
            </div>
          </div>

          <p className="text-[12px] text-luxury-text-muted leading-relaxed font-light tracking-wide">
            An architectural marvel for your residency. Double-domed sapphire, continuous silent caliber, and hand-applied 24k gold leaf bezel accents. Handcrafted in our Geneva workshop.
          </p>

          <ul className="space-y-2 border-t border-white/10 pt-4 text-[10px] text-white/70">
            <li className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold"></span>
              240 individual high-grade parts in synchronization
            </li>
            <li className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold"></span>
              Double-domed sapphire face with anti-reflective coating
            </li>
            <li className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold"></span>
              Bespoke Caliber Cal-T90 Continuous Silent Sweep
            </li>
          </ul>

          <div className="pt-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleReserve}
              disabled={isAdding}
              className={`w-full py-4 text-center text-[10px] uppercase tracking-[0.3em] font-bold rounded-lg transition-all duration-500 shadow-2xl flex items-center justify-center gap-2 ${
                added 
                  ? 'bg-emerald-600 text-white hover:bg-emerald-500' 
                  : 'bg-luxury-gold text-black hover:bg-[#D4B578]'
              }`}
            >
              {isAdding ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Securing Allocation...
                </>
              ) : added ? (
                <>
                  ✓ Added to Vault
                </>
              ) : (
                <>
                  <ShoppingBag size={13} strokeWidth={2} />
                  Reserve Masterpiece
                </>
              )}
            </motion.button>
            <p className="text-[8px] text-center text-white/35 mt-2.5 tracking-wider uppercase">
              100% Insured Priority Transport. Hand-delivered via secure courier.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
