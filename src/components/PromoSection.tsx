import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

export default function PromoSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Magnetic hover coordinates for CTA button
  const [btnCoords, setBtnCoords] = useState({ x: 0, y: 0 });

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    hours: 24,
    minutes: 48,
    seconds: 59,
  });

  // Track mouse parallax coordinates for background elements
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Ticking countdown
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 24, minutes: 0, seconds: 0 }; // Loop back for demo
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 35; // Parallax translation range
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 35;
    setMousePos({ x, y });

    // Magnetic CTA Button Calculation
    if (buttonRef.current) {
      const btnRect = buttonRef.current.getBoundingClientRect();
      const btnCenterX = btnRect.left + btnRect.width / 2;
      const btnCenterY = btnRect.top + btnRect.height / 2;
      
      const distanceX = e.clientX - btnCenterX;
      const distanceY = e.clientY - btnCenterY;
      const distance = Math.hypot(distanceX, distanceY);

      if (distance < 120) {
        // Attract button coordinates towards cursor (magnetic suction)
        setBtnCoords({ x: distanceX * 0.35, y: distanceY * 0.35 });
      } else {
        setBtnCoords({ x: 0, y: 0 });
      }
    }
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
    setBtnCoords({ x: 0, y: 0 });
  };

  // Letter by letter animations for header
  const titleText = "TEMPORAL ACCESS";
  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    })
  };

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative py-32 bg-[#040404] overflow-hidden border-b border-white/5 select-none"
    >
      
      {/* Background slowly floating light streaks */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-45">
        <motion.div 
          className="absolute top-1/4 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-luxury-gold/25 to-transparent"
          animate={{ 
            y: [-mousePos.y * 0.3 - 15, mousePos.y * 0.3 + 15],
            x: [-10, 10]
          }}
          transition={{ duration: 8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-1/3 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{ 
            y: [mousePos.y * 0.2 + 20, -mousePos.y * 0.2 - 20],
            x: [15, -15]
          }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* LEFT SIDE: Promotional Details and Magnetic CTA */}
          <div className="lg:col-span-7 space-y-10 text-left">
            
            {/* Pulsing access badge with countdown timer */}
            <div className="flex flex-wrap items-center gap-4">
              <motion.div
                className="bg-luxury-gold/10 border border-luxury-gold/40 rounded-full px-5 py-2 text-luxury-gold text-[9px] uppercase tracking-[0.25em] font-bold font-mono flex items-center gap-2"
                animate={{ 
                  boxShadow: [
                    "0 0 0 0 rgba(197, 160, 89, 0)",
                    "0 0 20px 4px rgba(197, 160, 89, 0.25)",
                    "0 0 0 0 rgba(197, 160, 89, 0)"
                  ] 
                }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles size={10} className="animate-spin" />
                Active Allocation Window
              </motion.div>
              
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-4 py-2 font-mono text-[10px] text-white/80">
                <Clock size={11} className="text-luxury-gold" />
                <span>{timeLeft.hours.toString().padStart(2, '0')}H</span> :
                <span>{timeLeft.minutes.toString().padStart(2, '0')}M</span> :
                <span className="text-luxury-gold font-bold">{timeLeft.seconds.toString().padStart(2, '0')}S</span>
              </div>
            </div>

            {/* Letter-by-letter Header Title */}
            <div>
              <span className="text-luxury-gold text-[10px] uppercase tracking-[0.5em] font-bold mb-4 block">
                Exclusive Reward
              </span>
              
              <motion.h2 
                className="font-serif text-4xl md:text-6xl text-white leading-tight flex flex-wrap"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {titleText.split("").map((char, index) => (
                  <motion.span
                    key={index}
                    custom={index}
                    variants={letterVariants}
                    className="inline-block"
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </motion.h2>
              <div className="w-20 h-[1.5px] bg-luxury-gold mt-6" />
            </div>

            {/* Glassmorphic Offer Banner Sliding from Left with Blur Reduction */}
            <motion.div
              initial={{ x: -120, opacity: 0, filter: "blur(15px)" }}
              whileInView={{ x: 0, opacity: 1, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="p-6 md:p-8 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md relative overflow-hidden shadow-luxury"
            >
              {/* Glass sheen highlight */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.01] via-white/[0.04] to-transparent pointer-events-none" />
              
              <div className="space-y-4">
                <span className="bg-luxury-gold/15 text-luxury-gold border border-luxury-gold/30 px-3 py-1 rounded text-[8px] uppercase tracking-widest font-mono font-bold">
                  Allocation Benefit
                </span>
                <h3 className="font-serif text-xl md:text-2xl text-white italic font-light">
                  "Private Circle Privilege"
                </h3>
                <p className="text-xs text-luxury-text-muted leading-relaxed font-light tracking-wide max-w-lg">
                  Secure your slot in our temporal registry today to automatically receive a private <span className="text-white font-bold">15% allocation credit</span> and priority complimentary global transport on the upcoming <span className="text-luxury-gold">Atelier Series VII</span> launch.
                </p>
              </div>
            </motion.div>

            {/* Magnetic CTA Button */}
            <div className="pt-2">
              <motion.button
                ref={buttonRef}
                style={{ x: btnCoords.x, y: btnCoords.y }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 350, damping: 10 }}
                className="bg-luxury-gold text-black px-10 py-5 uppercase tracking-[0.25em] text-[10px] font-bold shadow-2xl hover:bg-[#E6C687] transition-all duration-300 flex items-center gap-3 cursor-pointer rounded-lg relative overflow-hidden"
              >
                <span>Access Private Vault</span>
                <ArrowRight size={12} className="text-black" />
              </motion.button>
            </div>

          </div>

          {/* RIGHT SIDE: Smooth reveal Collection Image & Floating Glass Elements */}
          <div className="lg:col-span-5 relative flex items-center justify-center min-h-[460px]">
            
            {/* Parallax Depth container */}
            <motion.div 
              style={{
                x: mousePos.x * 0.4,
                y: mousePos.y * 0.4,
              }}
              className="relative w-80 h-[380px] preserve-3d"
            >
              
              {/* Premium image reveal wrapper */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden border border-white/10 bg-luxury-dark shadow-luxury z-10 group">
                
                {/* Diagonal Reveal Curtain */}
                <motion.div
                  initial={{ skewX: -15, x: "-10%" }}
                  whileInView={{ x: "120%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
                  className="absolute inset-y-0 -left-1/4 w-[150%] bg-[#C5A059] z-20 origin-left"
                />

                {/* Backplate photography watch image */}
                <img
                  src="https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=1000"
                  alt="Zenith Tourbillon Showcase"
                  className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[2000ms]"
                />
                
                {/* Vignette mask */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#040404] via-[#040404]/30 to-transparent pointer-events-none" />

                {/* Label floating over the image */}
                <div className="absolute bottom-6 left-6 text-left space-y-1">
                  <span className="text-[8px] font-mono tracking-widest text-luxury-gold uppercase block">Hand-Assembled</span>
                  <h4 className="font-serif text-lg text-white font-medium">Grand Atelier Tourbillon</h4>
                </div>
              </div>

              {/* Floating Glassmorphism Element 1 (Floating highly in Z depth) */}
              <motion.div
                style={{
                  transform: 'translateZ(45px)',
                  x: mousePos.x * 0.3 - 25,
                  y: mousePos.y * 0.3 - 35,
                }}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -left-10 bg-black/40 backdrop-blur-md border border-white/15 p-4 rounded-xl shadow-2xl z-20 text-left min-w-[150px]"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <ShieldCheck size={12} className="text-luxury-gold" />
                  <span className="text-[8px] uppercase tracking-widest text-white/50 font-bold font-mono">Registry ID</span>
                </div>
                <p className="text-[10px] font-mono text-white tracking-widest">PATENT: CH-90X</p>
              </motion.div>

              {/* Floating Glassmorphism Element 2 */}
              <motion.div
                style={{
                  transform: 'translateZ(30px)',
                  x: -mousePos.x * 0.2 + 35,
                  y: -mousePos.y * 0.2 + 35,
                }}
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -right-10 bg-black/40 backdrop-blur-md border border-white/15 p-4 rounded-xl shadow-2xl z-20 text-left min-w-[140px]"
              >
                <span className="text-[7px] uppercase tracking-[0.2em] text-luxury-gold block mb-1.5 font-bold font-mono">Caliber sweep</span>
                <p className="text-[10px] text-white tracking-widest font-mono uppercase font-bold">28,800 VPH</p>
              </motion.div>

            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
