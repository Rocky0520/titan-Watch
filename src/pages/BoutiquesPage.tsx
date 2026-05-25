import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import BoutiquesSection from '../components/BoutiquesSection';

export default function BoutiquesPage() {
  return (
    <div className="min-h-screen bg-[#040404] text-luxury-text pt-32 pb-24 relative select-none">
      
      {/* Dynamic background highlight */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full bg-luxury-gold/[0.015] blur-[150px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Navigation & Header */}
        <div className="mb-12 text-left">
          <Link 
            to="/" 
            className="flex items-center gap-2 group mb-6 text-luxury-text-muted hover:text-white transition-colors w-fit"
          >
            <ArrowLeft size={14} className="text-luxury-gold group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Return Home</span>
          </Link>
          <span className="text-luxury-gold text-[10px] uppercase tracking-[0.5em] font-bold mb-4 block">Our Salons</span>
          <h1 className="font-serif text-4xl md:text-6xl text-white">
            Global Flagship <span className="italic font-light">Presence</span>
          </h1>
          <p className="text-luxury-text-muted text-xs md:text-sm max-w-2xl mt-4 leading-relaxed font-light tracking-wide">
            Access our private vaults across Geneva, New York, Tokyo, and Dubai. Secure your allocation, schedule private viewings, or consult with master watchmakers by requesting private pass-blocks below.
          </p>
        </div>

        {/* Embedded Core Boutiques Section */}
        <div className="border border-white/5 rounded-3xl overflow-hidden bg-luxury-dark/40 backdrop-blur-md">
          <BoutiquesSection />
        </div>

        {/* Security / Verification Badge */}
        <div className="mt-16 text-center">
          <p className="text-[10px] font-mono tracking-[0.25em] text-white/20 uppercase">
            All boutiques require gold wallet ID validation at entry checkpoints.
          </p>
        </div>

      </div>
    </div>
  );
}
