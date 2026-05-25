import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, Cpu, HardDrive, Compass, ChevronRight } from 'lucide-react';

interface MechanismPart {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: React.ReactNode;
  specs: { label: string; value: string }[];
  material: string;
  rotationSpeed: number;
}

const mechanismParts: MechanismPart[] = [
  {
    id: 'escapement',
    name: 'Coaxial Escapement',
    category: 'Regulating Mechanism',
    description: 'A revolutionary mechanism that eliminates sliding friction, ensuring perfect chronometric stability over a lifetime of continuous sweeps. The heartbeat of our mechanical calibers.',
    icon: <Cpu className="text-luxury-gold" size={18} />,
    specs: [
      { label: 'Precision Rating', value: '±1s / day' },
      { label: 'Frictional Coefficient', value: '0.003 (Near-Zero)' },
      { label: 'Vibration Rate', value: '28,800 vph (4Hz)' }
    ],
    material: 'Silicon Coated Diamond (DLC)',
    rotationSpeed: 8
  },
  {
    id: 'balance',
    name: 'Glucydur Balance Wheel',
    category: 'Timekeeping Hub',
    description: 'Crafted from temperature-resistant beryllium alloy with solid gold regulating screws, oscillating in micro-synchronized frequency to counter magnetic perturbations.',
    icon: <Compass className="text-luxury-gold" size={18} />,
    specs: [
      { label: 'Thermal Resistance', value: '-20°C to +60°C' },
      { label: 'Gold Balance Weight', value: '24k Micro-screws' },
      { label: 'Anti-Magnetic Limit', value: '4,800 A/m' }
    ],
    material: 'Beryllium-Copper Alloy',
    rotationSpeed: 3
  },
  {
    id: 'mainspring',
    name: 'Liquid-Metal Mainspring',
    category: 'Power Reservoir',
    description: 'An advanced energy vault utilizing compressed Titanium-X alloy. Hand-wound to store kinetic force, releasing energy with absolute linearity over a 72-hour cycle.',
    icon: <HardDrive className="text-luxury-gold" size={18} />,
    specs: [
      { label: 'Power Reserve Limit', value: '72 Hours Solid' },
      { label: 'Spring Thickness', value: '0.12mm Micro-foil' },
      { label: 'Winding Efficiency', value: '98.5% Autoload' }
    ],
    material: 'Titanium-Cobalt Superalloy',
    rotationSpeed: 0.5
  },
  {
    id: 'tourbillon',
    name: '3D Flying Tourbillon',
    category: 'Gravity Defier',
    description: 'An architectural cage weighing less than 0.3 grams. Constantly rotates on three axes to negate the effects of gravity on the escapement assembly.',
    icon: <Settings className="text-luxury-gold" size={18} />,
    specs: [
      { label: 'Total Cage Weight', value: '0.28 grams' },
      { label: 'Axis Revolution', value: '60s Continuous' },
      { label: 'Assembly Time', value: '45 Expert Hours' }
    ],
    material: 'Grade 5 Satin-Polished Titanium',
    rotationSpeed: 15
  }
];

export default function CraftsmanshipSection() {
  const [activePart, setActivePart] = useState<MechanismPart>(mechanismParts[0]);
  const [isRotating, setIsRotating] = useState(true);

  return (
    <section id="craftsmanship" className="relative bg-luxury-dark py-32 overflow-hidden border-y border-white/5 select-none">
      
      {/* Background Decorative Mesh grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(197,160,89,0.025),transparent_50%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          
          {/* LEFT SIDE: Exploded 3D Vector Mechanism Cage */}
          <div className="lg:col-span-6 relative flex items-center justify-center min-h-[420px] md:min-h-[500px]">
            
            {/* Ambient Backlight Ring */}
            <div className="absolute w-72 h-72 rounded-full border border-luxury-gold/5 bg-luxury-gold/[0.01] blur-xl" />

            {/* Expands layers in 3D exploded viewport */}
            <div className="perspective-3d relative w-80 h-80 md:w-96 md:h-96 flex items-center justify-center preserve-3d">
              
              {/* Layer 1: Titanium Baseplate (Backmost) */}
              <motion.div
                animate={{ rotate: isRotating ? 360 : 0 }}
                transition={{ repeat: Infinity, duration: 80, ease: "linear" }}
                className="absolute inset-0 w-full h-full border-2 border-dashed border-white/5 rounded-full flex items-center justify-center transition-all duration-700"
                style={{
                  transform: 'translateZ(-50px)',
                  opacity: activePart.id === 'mainspring' ? 0.8 : 0.2
                }}
              >
                {/* Micro tech ticks */}
                <div className="absolute w-[80%] h-[80%] rounded-full border border-white/5 border-spacing-2" />
                <div className="absolute w-3 h-24 bg-white/10 rounded-full" />
                <div className="absolute h-3 w-24 bg-white/10 rounded-full" />
              </motion.div>

              {/* Layer 2: Mainspring Gear Assembly */}
              <motion.svg
                viewBox="0 0 200 200"
                animate={{ rotate: isRotating ? 360 : 0 }}
                transition={{ repeat: Infinity, duration: 40 / activePart.rotationSpeed, ease: "linear" }}
                className="absolute w-[70%] h-[70%] text-white/10 fill-none transition-all duration-1000"
                style={{
                  transform: 'translateZ(-20px)',
                  opacity: activePart.id === 'mainspring' || activePart.id === 'balance' ? 0.9 : 0.35,
                  stroke: activePart.id === 'mainspring' ? '#C5A059' : 'currentColor'
                }}
              >
                <circle cx="100" cy="100" r="80" strokeWidth="1" strokeDasharray="3 3" />
                <circle cx="100" cy="100" r="60" strokeWidth="1.5" />
                {[...Array(12)].map((_, i) => (
                  <line
                    key={i}
                    x1="100"
                    y1="100"
                    x2={100 + 60 * Math.cos((i * Math.PI) / 6)}
                    y2={100 + 60 * Math.sin((i * Math.PI) / 6)}
                    strokeWidth="1.5"
                  />
                ))}
              </motion.svg>

              {/* Layer 3: Dynamic Regulating Balance Assembly (Centerpiece) */}
              <motion.svg
                viewBox="0 0 200 200"
                animate={
                  activePart.id === 'balance'
                    ? { rotate: [0, 45, -45, 45, 0] }
                    : { rotate: isRotating ? 360 : 0 }
                }
                transition={
                  activePart.id === 'balance'
                    ? { repeat: Infinity, duration: 1.8, ease: "easeInOut" }
                    : { repeat: Infinity, duration: 25 / activePart.rotationSpeed, ease: "linear" }
                }
                className="absolute w-[50%] h-[50%] transition-all duration-1000 fill-none"
                style={{
                  transform: 'translateZ(20px)',
                  opacity: activePart.id === 'balance' || activePart.id === 'escapement' ? 1 : 0.4,
                  stroke: activePart.id === 'balance' ? '#C5A059' : '#fff',
                  filter: activePart.id === 'balance' ? 'drop-shadow(0 0 10px rgba(197,160,89,0.3))' : 'none'
                }}
              >
                {/* 3-spoke high-precision Balance Wheel */}
                <circle cx="100" cy="100" r="45" strokeWidth="2.5" />
                <circle cx="100" cy="100" r="10" strokeWidth="2" />
                {[0, 120, 240].map((deg) => {
                  const rad = (deg * Math.PI) / 180;
                  return (
                    <g key={deg}>
                      <line
                        x1="100"
                        y1="100"
                        x2={100 + 45 * Math.cos(rad)}
                        y2={100 + 45 * Math.sin(rad)}
                        strokeWidth="2.5"
                      />
                      {/* Regulator screws */}
                      <circle
                        cx={100 + 45 * Math.cos(rad)}
                        cy={100 + 45 * Math.sin(rad)}
                        r="3"
                        fill="#C5A059"
                        stroke="none"
                      />
                    </g>
                  );
                })}
              </motion.svg>

              {/* Layer 4: Escapement Cage & Tourbillon Frame (Frontmost) */}
              <motion.div
                animate={{ rotate: isRotating ? -360 : 0 }}
                transition={{ repeat: Infinity, duration: 15 / activePart.rotationSpeed, ease: "linear" }}
                className="absolute w-[35%] h-[35%] rounded-full border border-luxury-gold/30 flex items-center justify-center shadow-lg transition-all duration-1000"
                style={{
                  transform: 'translateZ(50px)',
                  backgroundColor: 'rgba(5, 5, 5, 0.85)',
                  boxShadow: activePart.id === 'tourbillon' || activePart.id === 'escapement' ? '0 0 25px rgba(197, 160, 89, 0.35)' : 'none',
                  borderColor: activePart.id === 'tourbillon' ? '#C5A059' : 'rgba(255,255,255,0.1)'
                }}
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="absolute w-[80%] h-[80%] rounded-full border-2 border-dotted border-luxury-gold/20" />
                  {/* Coaxial Escapement Fork representation */}
                  <motion.div
                    animate={
                      activePart.id === 'escapement' || activePart.id === 'tourbillon'
                        ? { rotate: [-10, 10, -10] }
                        : { rotate: 0 }
                    }
                    transition={{ repeat: Infinity, duration: 0.45, ease: "easeInOut" }}
                    className="w-1 h-10 bg-luxury-gold rounded-full origin-bottom"
                    style={{ transformOrigin: '50% 80%' }}
                  />
                  <div className="absolute w-2.5 h-2.5 rounded-full bg-red-600 border border-black shadow" />
                </div>
              </motion.div>

              {/* Float-Indicator line linking details */}
              <div className="absolute inset-0 pointer-events-none border border-white/5 rounded-full rotate-45 scale-105" />
            </div>

            {/* Depth label */}
            <div className="absolute bottom-4 text-center font-mono text-[9px] uppercase tracking-[0.3em] text-white/30">
              Interactive 3D Engine Skeleton View / Level {activePart.id === 'tourbillon' ? '+50px' : activePart.id === 'balance' ? '+20px' : '-20px'}
            </div>
          </div>

          {/* RIGHT SIDE: Interactive Engine Selector & Blueprint Stats */}
          <div className="lg:col-span-6 flex flex-col gap-10">
            <div>
              <span className="text-luxury-gold text-[10px] uppercase tracking-[0.45em] font-bold mb-4 block">
                Atelier Engineering
              </span>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight text-white">
                Inside the <br />
                <span className="italic font-light">Mechanical</span> Heart
              </h2>
              <div className="h-[1px] bg-white/10 mt-8 w-full" />
            </div>

            {/* Selection Grid buttons */}
            <div className="grid grid-cols-2 gap-4">
              {mechanismParts.map((part) => (
                <button
                  key={part.id}
                  onClick={() => setActivePart(part)}
                  className={`p-4 text-left border rounded-xl flex items-center gap-4 transition-all duration-500 relative ${
                    activePart.id === part.id
                      ? 'border-luxury-gold bg-luxury-gold/5 shadow-[0_4px_20px_rgba(197,160,89,0.05)]'
                      : 'border-white/5 bg-transparent hover:border-white/15'
                  }`}
                >
                  <div className={`p-2.5 rounded-lg transition-colors ${
                    activePart.id === part.id ? 'bg-luxury-gold/15' : 'bg-white/5'
                  }`}>
                    {part.icon}
                  </div>
                  <div>
                    <span className="text-[8px] uppercase tracking-widest text-luxury-gold block font-mono">
                      {part.category}
                    </span>
                    <span className="text-xs uppercase tracking-wider text-white font-medium">
                      {part.name}
                    </span>
                  </div>
                  {activePart.id === part.id && (
                    <div className="absolute right-4 text-luxury-gold">
                      <ChevronRight size={14} className="animate-pulse" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Spec Details Card */}
            <div className="glass-luxury-gold p-6 md:p-8 rounded-2xl relative overflow-hidden">
              {/* Grid Background Effect */}
              <div className="absolute inset-0 bg-[radial-gradient(rgba(197,160,89,0.1)_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={activePart.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className="bg-luxury-gold/15 text-luxury-gold border border-luxury-gold/30 px-3 py-1 rounded text-[8px] uppercase tracking-[0.2em] font-mono">
                        {activePart.material}
                      </span>
                      <h4 className="font-serif text-2xl text-white mt-3">{activePart.name}</h4>
                    </div>
                    <button 
                      onClick={() => setIsRotating(!isRotating)}
                      className="px-3 py-1 border border-white/15 text-[8px] tracking-widest text-white/50 uppercase rounded hover:border-luxury-gold hover:text-white transition-all font-mono"
                    >
                      {isRotating ? '⏸ STOP MOTION' : '▶ SYNC DRIVE'}
                    </button>
                  </div>

                  <p className="text-xs md:text-sm text-luxury-text-muted leading-relaxed font-light tracking-wide">
                    {activePart.description}
                  </p>

                  <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/5">
                    {activePart.specs.map((spec, i) => (
                      <div key={i} className="space-y-1">
                        <span className="text-[8px] uppercase tracking-widest text-luxury-gold/80 block font-mono">
                          {spec.label}
                        </span>
                        <span className="text-[11px] md:text-xs text-white font-bold font-mono uppercase">
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
