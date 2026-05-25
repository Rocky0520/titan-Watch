import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Sparkles, Send, ShieldCheck } from 'lucide-react';
import boutiqueGeneva from '../boutique_geneva.png';

interface Boutique {
  city: string;
  country: string;
  address: string;
  image: string;
  perks: string[];
  hours: string;
  vaultId: string;
}

const boutiques: Boutique[] = [
  {
    city: 'Geneva',
    country: 'Switzerland',
    address: 'Rue du Rhône 45, 1204 Geneva',
    image: boutiqueGeneva,
    perks: ['Master Watchmaker Lounge', 'Vault Viewing Gallery', 'Bespoke Engraving Studio'],
    hours: 'Mon - Sat: 10:00 AM - 6:30 PM',
    vaultId: 'GEN-VAULT-45'
  },
  {
    city: 'New York',
    country: 'United States',
    address: '743 Fifth Avenue, New York, NY 10022',
    image: 'https://images.unsplash.com/photo-1546412414-8035e1776c9a?auto=format&fit=crop&q=80&w=1000',
    perks: ['Rooftop Collectors Deck', 'Limited Collection Vault', 'Private Concierge Salon'],
    hours: 'Mon - Sat: 10:00 AM - 7:00 PM',
    vaultId: 'NYC-VAULT-743'
  },
  {
    city: 'Tokyo',
    country: 'Japan',
    address: '5-15-1 Ginza, Chuo-ku, Tokyo 104-0061',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=1000',
    perks: ['Tradition & Tech Atelier', 'Sake Tasting Vault', 'Continuous Calibration Station'],
    hours: 'Daily: 11:00 AM - 8:00 PM',
    vaultId: 'TYO-VAULT-515'
  },
  {
    city: 'Dubai',
    country: 'United Arab Emirates',
    address: 'The Dubai Mall, Fashion Avenue, Ground Level',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=1000',
    perks: ['Gold-Leaf Private Vault', 'Chauffeur Courier Service', 'Heritage Gallery'],
    hours: 'Daily: 10:00 AM - Midnight',
    vaultId: 'DXB-VAULT-Fashion'
  }
];

export default function BoutiquesSection() {
  const [activeBoutique, setActiveBoutique] = useState<Boutique>(boutiques[0]);
  
  // Booking reservation states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [service, setService] = useState('Private Lounge Vault Preview');
  
  const [isBooking, setIsBooking] = useState(false);
  const [booked, setBooked] = useState(false);

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !date || !time) return;

    setIsBooking(true);
    setTimeout(() => {
      setIsBooking(false);
      setBooked(true);
    }, 1800);
  };

  return (
    <section id="boutiques" className="relative py-32 bg-luxury-charcoal overflow-hidden border-b border-white/5 select-none">
      
      {/* Background radial highlight */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(197,160,89,0.02),transparent_40%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col items-center text-center mb-20">
          <span className="text-luxury-gold text-[10px] uppercase tracking-[0.5em] font-bold mb-4 block">
            Presence
          </span>
          <h2 className="font-serif text-4xl md:text-6xl text-white">
            Global Flagship <span className="italic font-light">Salons</span>
          </h2>
          <div className="w-16 h-[1px] bg-luxury-gold mt-6" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* LEFT COLUMN: 3D Interactive City Selector & Boutique Display */}
          <div className="lg:col-span-7 space-y-12">
            
            {/* 3D horizontal City selector tabs */}
            <div className="grid grid-cols-4 gap-2 md:gap-4 p-1.5 rounded-xl border border-white/5 bg-luxury-dark/40 backdrop-blur-md">
              {boutiques.map((b) => (
                <button
                  key={b.city}
                  onClick={() => {
                    setActiveBoutique(b);
                    setBooked(false); // Reset booking confirmation card on boutique switch
                  }}
                  className={`py-3 md:py-4 px-1 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] rounded-lg transition-all duration-500 relative overflow-hidden ${
                    activeBoutique.city === b.city
                      ? 'bg-luxury-gold text-black shadow-lg shadow-luxury-gold/10'
                      : 'text-luxury-text-muted hover:text-white hover:bg-white/5'
                  }`}
                >
                  {b.city}
                </button>
              ))}
            </div>

            {/* Flagship Salon Info Card with 3D Depth */}
            <div className="perspective-3d">
              <motion.div
                key={activeBoutique.city}
                initial={{ opacity: 0, rotateY: 10, translateZ: -20 }}
                animate={{ opacity: 1, rotateY: 0, translateZ: 0 }}
                transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
                style={{ transformStyle: 'preserve-3d' }}
                className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-white/10 group shadow-luxury preserve-3d"
              >
                {/* Backplate Boutique Photo */}
                <img
                  src={activeBoutique.image}
                  alt={`${activeBoutique.city} Flagship`}
                  className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-[2000ms] pointer-events-none"
                />
                
                {/* Vignette mask */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />

                {/* Left Floating Salon Details */}
                <div 
                  className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 z-20 pointer-events-none"
                  style={{ transform: 'translateZ(30px)' }}
                >
                  <div className="space-y-2 text-left">
                    <span className="text-[8px] uppercase tracking-[0.3em] font-mono text-luxury-gold block font-bold">
                      Flagship Hub {activeBoutique.vaultId}
                    </span>
                    <h3 className="font-serif text-2xl md:text-3xl text-white">
                      Salon {activeBoutique.city}
                    </h3>
                    <p className="text-[10px] text-white/50 tracking-wider flex items-center gap-1.5 font-light">
                      <MapPin size={10} className="text-luxury-gold" />
                      {activeBoutique.address}
                    </p>
                  </div>

                  <div className="bg-black/60 backdrop-blur border border-white/10 p-4 rounded-xl text-left min-w-[200px]">
                    <span className="text-[8px] uppercase tracking-widest text-luxury-gold block mb-2 font-bold font-mono">
                      VAULT HOURS
                    </span>
                    <p className="text-[10px] font-mono text-white tracking-widest uppercase">
                      {activeBoutique.hours}
                    </p>
                  </div>
                </div>

                {/* Vault Glow overlay */}
                <div 
                  className="absolute top-6 right-6 bg-luxury-gold/10 border border-luxury-gold/30 rounded-full px-4 py-1.5 text-[8px] uppercase tracking-[0.25em] font-bold font-mono text-luxury-gold"
                  style={{ transform: 'translateZ(20px)' }}
                >
                  Vault Secured
                </div>
              </motion.div>
            </div>

            {/* Exclusive Salon Perks list */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activeBoutique.perks.map((perk, i) => (
                <div
                  key={i}
                  className="p-5 border border-white/5 bg-luxury-dark/30 rounded-xl space-y-2 text-left hover:border-luxury-gold/20 transition-all duration-500"
                >
                  <div className="w-6 h-6 rounded-full bg-luxury-gold/15 flex items-center justify-center">
                    <Sparkles size={10} className="text-luxury-gold" />
                  </div>
                  <h4 className="text-[10px] uppercase tracking-widest font-bold text-white leading-tight">
                    {perk}
                  </h4>
                  <p className="text-[9px] text-luxury-text-muted font-light leading-relaxed">
                    Exclusive appointment-only privileges for collective vault cardholders.
                  </p>
                </div>
              ))}
            </div>

          </div>

          {/* RIGHT COLUMN: Interactive VIP Reservation Concierge Form */}
          <div className="lg:col-span-5 relative">
            <AnimatePresence mode="wait">
              
              {/* STATE 1: Registration Form */}
              {!booked ? (
                <motion.div
                  key="booking-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-luxury-dark/80 border border-white/10 p-6 md:p-8 rounded-2xl shadow-luxury space-y-6 text-left"
                >
                  <div>
                    <span className="text-luxury-gold text-[8px] uppercase tracking-[0.35em] font-bold mb-2 block font-mono">
                      VIP Salon Access
                    </span>
                    <h3 className="font-serif text-2xl text-white">
                      Request Consultation
                    </h3>
                    <p className="text-[10px] text-luxury-text-muted font-light leading-relaxed mt-2 tracking-wide">
                      Secure private access to flagship vaults. Our concierge will verify eligibility and issue a golden pass block.
                    </p>
                  </div>

                  <form onSubmit={handleBooking} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[8px] uppercase tracking-widest text-luxury-text-muted font-bold block font-mono">
                        Guest Name
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="ENTER YOUR FULL NAME"
                        className="w-full bg-transparent border border-white/15 px-4 py-3.5 text-[9px] tracking-widest uppercase text-white placeholder:text-white/20 focus:outline-none focus:border-luxury-gold focus:bg-white/[0.02] transition-all rounded-lg"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[8px] uppercase tracking-widest text-luxury-text-muted font-bold block font-mono">
                        Vault Registry Email
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ENTER REGISTERED EMAIL"
                        className="w-full bg-transparent border border-white/15 px-4 py-3.5 text-[9px] tracking-widest uppercase text-white placeholder:text-white/20 focus:outline-none focus:border-luxury-gold focus:bg-white/[0.02] transition-all rounded-lg"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[8px] uppercase tracking-widest text-luxury-text-muted font-bold block font-mono">
                          Preferred Date
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            required
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full bg-transparent border border-white/15 px-4 py-3.5 text-[9px] tracking-widest uppercase text-white focus:outline-none focus:border-luxury-gold transition-all rounded-lg"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[8px] uppercase tracking-widest text-luxury-text-muted font-bold block font-mono">
                          Lounge Slot
                        </label>
                        <input
                          type="time"
                          required
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          className="w-full bg-transparent border border-white/15 px-4 py-3.5 text-[9px] tracking-widest uppercase text-white focus:outline-none focus:border-luxury-gold transition-all rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[8px] uppercase tracking-widest text-luxury-text-muted font-bold block font-mono">
                        Curated Experience
                      </label>
                      <select
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        className="w-full bg-[#050505] border border-white/15 px-4 py-3.5 text-[9px] tracking-widest uppercase text-white focus:outline-none focus:border-luxury-gold transition-all rounded-lg cursor-pointer"
                      >
                        <option>Private Lounge Vault Preview</option>
                        <option>Bespoke Engraving Consultation</option>
                        <option>Master Watchmaker Audit</option>
                        <option>Portfolio Expansion Panel</option>
                      </select>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      type="submit"
                      disabled={isBooking}
                      className="w-full py-4 text-[9px] uppercase tracking-[0.25em] font-bold rounded-lg bg-luxury-gold text-black hover:bg-[#D4B578] shadow-2xl transition-all duration-500 flex items-center justify-center gap-2 mt-4"
                    >
                      {isBooking ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                          Verifying Credentials...
                        </>
                      ) : (
                        <>
                          <Send size={12} />
                          Secure Vault Access
                        </>
                      )}
                    </motion.button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="booking-pass"
                  initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 100 }}
                  className="glass-luxury-gold p-8 rounded-2xl text-center space-y-6 shadow-2xl relative overflow-hidden"
                >
                  {/* Decorative pass outline */}
                  <div className="absolute inset-4 border border-luxury-gold/20 rounded-xl pointer-events-none" />

                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-luxury-gold/15 flex items-center justify-center mb-2">
                      <ShieldCheck size={24} className="text-luxury-gold animate-bounce" />
                    </div>
                    <span className="text-luxury-gold text-[8px] uppercase tracking-[0.4em] font-mono font-bold">
                      HERITAGE VAULT PASS SECURED
                    </span>
                    <h3 className="font-serif text-3xl text-white">
                      Invitation Confirmed
                    </h3>
                  </div>

                  <div className="h-[1px] bg-luxury-gold/20 w-full" />

                  <div className="space-y-4 text-left font-mono text-[10px] tracking-wider uppercase text-white/90">
                    <div className="flex justify-between">
                      <span className="text-white/40">GUEST REGISTRY:</span>
                      <span className="font-bold">{name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">FLAGSHIP HUB:</span>
                      <span className="font-bold text-luxury-gold">SALON {activeBoutique.city}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">ALLOCATION VENUE:</span>
                      <span className="font-bold">{activeBoutique.vaultId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">DATE & SLOT:</span>
                      <span className="font-bold">{date} @ {time}</span>
                    </div>
                    <div className="flex justify-between border-t border-luxury-gold/10 pt-4 mt-2">
                      <span className="text-white/40">EXPERIENCE BLOCK:</span>
                      <span className="font-bold text-luxury-gold">{service}</span>
                    </div>
                  </div>

                  <div className="h-[1px] bg-luxury-gold/20 w-full" />

                  <div className="text-[8px] font-mono text-luxury-gold/70 italic leading-relaxed">
                    * Present this secure digital golden block in your vault wallet upon arriving at the Rue du Rhône/Fifth Ave checkpost.
                  </div>

                  <button
                    onClick={() => {
                      setBooked(false);
                      setName('');
                      setEmail('');
                      setDate('');
                      setTime('');
                    }}
                    className="w-full py-3.5 border border-white/10 hover:border-luxury-gold/30 text-[9px] uppercase tracking-widest text-white hover:text-luxury-gold transition-all duration-500 rounded-lg font-mono"
                  >
                    ← REQUEST ANOTHER INVITE
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
