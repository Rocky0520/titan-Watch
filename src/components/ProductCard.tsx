import React, { useState, useRef } from 'react';
import { motion, useSpring, useTransform } from 'motion/react';
import { Plus, Maximize2 } from 'lucide-react';
import { Product } from '../types';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  index: number;
  key?: string | number;
  onViewDetails?: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart, index, onViewDetails }: ProductCardProps) {
  const isEdgeUltraSlim = product.name === 'Edge Ultra-Slim';
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Tracking coordinates for 3D Tilt
  const [hovered, setHovered] = useState(false);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });

  // Spring physics for extra organic tilt movement
  const rotateX = useSpring(0, { stiffness: 120, damping: 20 });
  const rotateY = useSpring(0, { stiffness: 120, damping: 20 });
  const scale = useSpring(1, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    
    // Normalize coordinates relative to card center (-0.5 to 0.5)
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    // Tilt calculations (max tilt 16 degrees)
    const rx = (y - 0.5) * -16;
    const ry = (x - 0.5) * 16;
    
    rotateX.set(rx);
    rotateY.set(ry);

    // Glare coordinates
    setGlarePos({ x: x * 100, y: y * 100 });
  };

  const handleMouseEnter = () => {
    setHovered(true);
    scale.set(1.02);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 1.2, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group relative select-none"
    >
      {/* Outer 3D perspective wrapper */}
      <div className="perspective-3d w-full">
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={() => onViewDetails?.(product)}
          style={{
            rotateX,
            rotateY,
            scale,
            transformStyle: 'preserve-3d',
          }}
          className={`relative aspect-[4/5] bg-[#090909] overflow-hidden mb-6 border border-white/5 transition-all duration-700 group-hover:border-luxury-gold/30 group-hover:shadow-[0_0_35px_rgba(197,160,89,0.12)] cursor-pointer ${
            isEdgeUltraSlim ? 'shadow-[0_0_40px_rgba(197,160,89,0.04)]' : ''
          }`}
        >
          {/* Sleek Golden Image Reveal Mask */}
          <motion.div 
            initial={{ scaleX: 1 }}
            whileInView={{ scaleX: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: index * 0.08 + 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 bg-[#C5A059] origin-left z-20 pointer-events-none"
          />

          {/* Watch image layer - Floating slightly inside the card + subtle rotation */}
          <div 
            className="absolute inset-0 w-full h-full p-6 flex items-center justify-center transition-transform duration-1000"
            style={{ 
              transform: hovered ? 'translateZ(45px) rotate(2deg)' : 'translateZ(0px) rotate(0deg)',
              transformStyle: 'preserve-3d',
              transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <motion.img 
              src={product.image} 
              alt={product.name}
              animate={isEdgeUltraSlim ? {
                y: [0, -8, 0],
              } : {}}
              transition={isEdgeUltraSlim ? {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              } : {}}
              className="w-full h-full object-contain opacity-85 group-hover:opacity-100 transition-opacity duration-500 drop-shadow-[0_25px_50px_rgba(0,0,0,0.9)]" 
            />
          </div>
          
          {/* Ambient Backdrop Glow */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none"
            style={{
              background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(197, 160, 89, 0.15) 0%, transparent 60%)`,
              transform: 'translateZ(-10px)'
            }}
          />

          {/* Glossy Sapphire Dome Glare Sheet */}
          <div 
            className="absolute inset-0 pointer-events-none transition-opacity duration-500 opacity-0 group-hover:opacity-100 mix-blend-screen"
            style={{
              background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.02) 40%, transparent 70%)`,
              transform: 'translateZ(60px)'
            }}
          />

          {/* Quick Reserve/Add Action Trigger */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="absolute bottom-6 right-6 bg-luxury-gold text-black w-12 h-12 flex items-center justify-center rounded-full shadow-2xl translate-y-16 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 hover:scale-110 active:scale-95 transition-all duration-500 hover:bg-[#D4B578] z-30 cursor-pointer"
            title="Reserve Masterpiece"
          >
            <Plus size={20} strokeWidth={2.5} />
          </button>

          {/* Showcase Link Shortcut */}
          {product.id === '7' && (
            <Link
              to="/showcase"
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-6 left-6 bg-black/60 backdrop-blur border border-white/10 text-luxury-gold w-12 h-12 flex items-center justify-center rounded-full shadow-2xl translate-y-16 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 hover:scale-110 active:scale-95 transition-all duration-500 hover:border-luxury-gold hover:text-white z-30"
              title="Enter Virtual Atelier"
            >
              <Maximize2 size={16} />
            </Link>
          )}

          {/* Collection Tag - Floats highly in 3D */}
          <div 
            className="absolute top-6 left-6"
            style={{ 
              transform: hovered ? 'translateZ(45px)' : 'translateZ(0px)',
              transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)'
            }}
          >
            <span className="text-[9px] uppercase tracking-[0.25em] bg-black/85 backdrop-blur-md px-3.5 py-1.5 font-bold text-luxury-gold shadow-2xl border border-white/10">
              {product.collection}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Watch Labels - Fade upward stagger */}
      <div className="flex justify-between items-start pt-2 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: index * 0.08 + 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <h3 className="font-serif text-xl mb-1 tracking-wide text-white group-hover:text-luxury-gold transition-colors duration-500">
            {product.name}
          </h3>
          <p className="text-[9px] uppercase tracking-[0.25em] text-luxury-text-muted font-bold tracking-widest flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold/50 animate-pulse"></span>
            Switzerland Heritage
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: index * 0.08 + 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="text-right"
        >
          <p className="font-serif text-lg font-medium tracking-tight text-luxury-gold">
            ${product.price.toLocaleString()}
          </p>
        </motion.div>
      </div>
      
      {/* Decorative Interactive Bottom Line */}
      <div className="mt-6 w-full h-[1px] bg-luxury-gold/10 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
    </motion.div>
  );
}
