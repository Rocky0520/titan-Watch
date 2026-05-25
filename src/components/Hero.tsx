import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const slides = [
  {
    id: 1,
    title: "The Stellaris",
    subtitle: "Carbon Obsidian",
    description: "Forged from compressed carbon-matte alloys and finished with glowing electric-blue hour pillars, the Obsidian represents the vanguard of tactical horology.",
    image: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&q=90&w=2000",
    watchImage: "/vanguard_stealth.png",
    tag: "Carbon Innovation",
    price: "$9,200"
  },
  {
    id: 2,
    title: "GrandMaster",
    subtitle: "Chrono Tourbillon",
    description: "A tribute to the absolute pioneers of timekeeping. Witness the intricate mechanical heartbeat of a gold flying tourbillon, hand-polished to a flawless mirror finish.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=90&w=2000",
    watchImage: "/zenith_tourbillon.png",
    tag: "Grand Masterpiece",
    price: "$18,500"
  },
  {
    id: 3,
    title: "Aurelius VII",
    subtitle: "Atelier Centerpiece",
    description: "Our signature architectural centerpiece. Gold sweeping hands dance in absolute synchronization against a textured dial, bathed in warm studio lights.",
    image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=90&w=2000",
    watchImage: "/titan_wall_clock.png",
    tag: "Swiss Heritage",
    price: "$24,500"
  }
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  // Springs for extra-smooth organic cursor 3D parallax
  const rotateX = useSpring(0, { stiffness: 60, damping: 20 });
  const rotateY = useSpring(0, { stiffness: 60, damping: 20 });
  const mouseX = useSpring(0, { stiffness: 40, damping: 15 });
  const mouseY = useSpring(0, { stiffness: 40, damping: 15 });

  // Autoplay with Pause-On-Hover
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 9000);
    return () => clearInterval(timer);
  }, [isPaused]);

  // Reduced motion media query check
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    // Normalized values: -0.5 to 0.5
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    // Smoothly set rotations
    rotateX.set(y * -20); // vertical tilt
    rotateY.set(x * 20);  // horizontal tilt
    
    // Parallax pixel shifts
    mouseX.set(x * 40);
    mouseY.set(y * 40);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    mouseX.set(0);
    mouseY.set(0);
  };

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  // Swipe support for mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX.current - touchEndX;

    if (diffX > 60) {
      nextSlide();
    } else if (diffX < -60) {
      prevSlide();
    }
    touchStartX.current = null;
  };

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        handleMouseLeave();
        setIsPaused(false);
      }}
      onMouseEnter={() => setIsPaused(true)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative h-screen w-full overflow-hidden bg-[#040404] select-none"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: 60, filter: 'blur(10px)' }}
          animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, x: 0, filter: 'blur(0px)' }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -60, filter: 'blur(10px)' }}
          transition={prefersReducedMotion ? { duration: 0.3 } : { duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 w-full h-full"
        >
          {/* BACKGROUND LAYER: Slow Zoom + Parallax Shift */}
          <motion.div 
            style={{
              x: useTransform(mouseX, (v) => -v * 0.4),
              y: useTransform(mouseY, (v) => -v * 0.4),
            }}
            className="absolute inset-0 z-0 scale-105 pointer-events-none"
          >
            <motion.img 
              src={slides[current].image} 
              alt="" 
              initial={{ scale: 1.15, opacity: 0 }}
              animate={{ scale: 1.05, opacity: 0.35 }}
              transition={{ duration: 9, ease: "easeOut" }}
              className="w-full h-full object-cover"
            />
            {/* Deep luxury vignettes and gradients */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#040404] via-[#040404]/55 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#040404]" />
          </motion.div>

          {/* DUAL 3D CONTENT SPACE */}
          <div className="relative z-10 h-full max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-24">
            
            {/* LEFT SIDE: Typographic details (floats slightly) */}
            <motion.div
              style={{
                x: useTransform(mouseX, (v) => v * 0.15),
                y: useTransform(mouseY, (v) => v * 0.15),
              }}
              className="lg:col-span-6 text-left"
            >
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                className="flex items-center gap-3 mb-6"
              >
                <div className="w-12 h-[1.5px] bg-luxury-gold animate-pulse"></div>
                <span className="text-luxury-gold text-[10px] uppercase tracking-[0.4em] font-bold font-mono">
                  {slides[current].tag}
                </span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 35 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
                className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[1.05] tracking-tight mb-8 text-white"
              >
                <span className="italic font-light block text-white/90">{slides[current].title}</span>
                {slides[current].subtitle}
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
                className="max-w-md text-luxury-text-muted text-xs md:text-sm font-light leading-relaxed mb-10 tracking-wide"
              >
                {slides[current].description}
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.65 }}
                className="flex flex-col sm:flex-row gap-5"
              >
                <a href="/collections" target="_blank" rel="noopener noreferrer" className="block w-full sm:w-auto">
                  <motion.button
                    whileHover={{ 
                      scale: 1.05, 
                      boxShadow: "0 0 25px rgba(197, 160, 89, 0.5)",
                      backgroundColor: "#E6C687"
                    }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    className="bg-luxury-gold text-black px-10 py-5 uppercase tracking-[0.25em] text-[10px] font-bold shadow-2xl transition-all duration-300 w-full cursor-pointer"
                  >
                    Discover Vault
                  </motion.button>
                </a>
                <a href="/showcase" target="_blank" rel="noopener noreferrer" className="block w-full sm:w-auto">
                  <motion.button
                    whileHover={{ 
                      scale: 1.05, 
                      boxShadow: "0 0 25px rgba(255, 255, 255, 0.15)",
                      backgroundColor: "rgba(255, 255, 255, 0.08)",
                      borderColor: "#C5A059" 
                    }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    className="px-10 py-5 border border-white/15 text-white uppercase tracking-[0.25em] text-[10px] font-bold transition-all duration-300 w-full text-center cursor-pointer"
                  >
                    Virtual Atelier
                  </motion.button>
                </a>
              </motion.div>
            </motion.div>

            {/* RIGHT SIDE: Breathtaking 3D floating watch display case */}
            <div className="lg:col-span-6 flex items-center justify-center relative perspective-3d w-full h-[360px] md:h-[450px] preserve-3d">
              
              {/* Soft glowing backlight behind the watch */}
              <motion.div
                className="absolute w-80 h-80 rounded-full pointer-events-none z-0"
                style={{
                  background: 'radial-gradient(circle, rgba(197, 160, 89, 0.12) 0%, transparent 70%)',
                  filter: 'blur(40px)',
                  x: useTransform(mouseX, (v) => -v * 0.1),
                  y: useTransform(mouseY, (v) => -v * 0.1),
                }}
                animate={{
                  scale: [0.9, 1.1, 0.9],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Outer 3D mechanical glass capsule frame */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                style={{
                  rotateX,
                  rotateY,
                  transformStyle: 'preserve-3d',
                }}
                className="relative w-72 h-72 md:w-96 md:h-96 flex items-center justify-center preserve-3d z-10"
              >
                {/* 3D Glass backplate border */}
                <div 
                  className="absolute inset-4 rounded-full border-2 border-white/5 bg-luxury-dark/45 backdrop-blur-md opacity-70 shadow-2xl"
                  style={{ transform: 'translateZ(-40px)' }}
                />

                {/* Concentric micro brass ticks */}
                <div 
                  className="absolute inset-8 rounded-full border border-dashed border-luxury-gold/15 animate-mechanical-spin"
                  style={{ transform: 'translateZ(-20px)' }}
                />

                <div 
                  className="absolute inset-14 rounded-full border border-white/5 animate-mechanical-spin-reverse"
                  style={{ transform: 'translateZ(-10px)' }}
                />

                {/* Floating & Rotating Watch Model Cutout (Floats high with translateZ) */}
                <motion.div 
                  className="absolute inset-0 w-full h-full flex items-center justify-center p-6 drop-shadow-[0_30px_60px_rgba(0,0,0,0.9)]"
                  style={{ 
                    transform: 'translateZ(65px)',
                    transformStyle: 'preserve-3d'
                  }}
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 1.2, -1.2, 0]
                  }}
                  transition={{ 
                    duration: 7, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                >
                  <img
                    src={slides[current].watchImage}
                    alt={slides[current].title}
                    className="w-[85%] h-[85%] object-contain select-none pointer-events-none drop-shadow-[0_20px_50px_rgba(197,160,89,0.15)]"
                  />
                  
                  {/* Luxury Metallic Shine Sweep Overlay */}
                  <div 
                    className="absolute inset-8 rounded-full overflow-hidden pointer-events-none mix-blend-overlay"
                    style={{ transform: 'translateZ(10px)' }}
                  >
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent -skew-x-12"
                      animate={{ x: ['-150%', '250%'] }}
                      transition={{ 
                        duration: 3.5, 
                        repeat: Infinity, 
                        repeatDelay: 4.5,
                        ease: "easeInOut" 
                      }}
                    />
                  </div>
                </motion.div>

                {/* Ambient Specular Glass Sheen Overlay */}
                <div 
                  className="absolute inset-4 rounded-full pointer-events-none mix-blend-screen"
                  style={{
                    background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.08) 0%, transparent 60%)',
                    transform: 'translateZ(90px)'
                  }}
                />
              </motion.div>
            </div>

          </div>
        </motion.div>
      </AnimatePresence>
      {/* Navigation Controls */}
      <div className="absolute bottom-12 left-6 md:left-12 z-20 flex items-center gap-8">
        <div className="flex gap-4">
          <button 
            onClick={prevSlide}
            className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-luxury-gold hover:text-black hover:scale-105 active:scale-95 transition-all duration-500"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={nextSlide}
            className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-luxury-gold hover:text-black hover:scale-105 active:scale-95 transition-all duration-500"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        
        {/* Progress Ticks */}
        <div className="flex gap-3">
          {slides.map((_, i) => {
            const isActive = i === current;
            return (
              <button 
                key={i}
                onClick={() => setCurrent(i)}
                className="relative h-[2px] w-12 bg-white/10 overflow-hidden cursor-pointer rounded-full"
                title={`Go to slide ${i + 1}`}
              >
                {isActive && (
                  <motion.div 
                    initial={{ x: '-100%' }}
                    animate={isPaused ? { x: '-100%' } : { x: '0%' }}
                    transition={isPaused ? { duration: 0 } : { duration: 9, ease: "linear" }}
                    className="absolute inset-0 bg-luxury-gold origin-left"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Flagship Price Tag */}
      <div className="absolute bottom-12 right-6 md:right-12 z-20 text-right font-serif">
        <motion.div
          key={`price-${current}`}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-0.5"
        >
          <span className="text-3xl text-white tracking-widest">{slides[current].price}</span>
          <span className="text-[9px] text-luxury-gold uppercase tracking-[0.25em] font-mono font-bold">Secured Allocation</span>
        </motion.div>
      </div>
    </section>
  );
}
