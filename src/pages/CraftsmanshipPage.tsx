import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import CraftsmanshipSection from '../components/CraftsmanshipSection';

export default function CraftsmanshipPage() {
  return (
    <div className="min-h-screen bg-[#040404] text-luxury-text pt-32 pb-24 relative select-none">
      
      {/* Background gear grid effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(197,160,89,0.03),transparent_70%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Navigation & Page Intro */}
        <div className="mb-12 text-left">
          <Link 
            to="/" 
            className="flex items-center gap-2 group mb-6 text-luxury-text-muted hover:text-white transition-colors w-fit"
          >
            <ArrowLeft size={14} className="text-luxury-gold group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Return Home</span>
          </Link>
          <span className="text-luxury-gold text-[10px] uppercase tracking-[0.5em] font-bold mb-4 block">Metrology & Art</span>
          <h1 className="font-serif text-4xl md:text-6xl text-white">
            Mechanical <span className="italic font-light">Heritage</span>
          </h1>
          <p className="text-luxury-text-muted text-xs md:text-sm max-w-2xl mt-4 leading-relaxed font-light tracking-wide">
            Delve deep into the micro-engineered heartbeat of our calibers. Witness the perfect synchronization of flying tourbillons, Glucydur balances, and near-zero friction escapements.
          </p>
        </div>

        {/* Embedded Core Craftsmanship Section */}
        <div className="border border-white/5 rounded-3xl overflow-hidden bg-luxury-dark/40 backdrop-blur-md">
          <CraftsmanshipSection />
        </div>

        {/* Dynamic Blueprint footer note */}
        <div className="mt-16 text-center">
          <p className="text-[10px] font-mono tracking-[0.25em] text-white/20 uppercase">
            All designs are proprietary and protected under Swiss horological patents.
          </p>
        </div>

      </div>
    </div>
  );
}
