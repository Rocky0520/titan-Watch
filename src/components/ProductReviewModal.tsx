import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, ShieldCheck, Lock, Send, User, MessageSquare, Check } from 'lucide-react';
import { Product } from '../types';

interface ProductReviewModalProps {
  product: Product | null;
  onClose: () => void;
}

interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
  verified: boolean;
}

// Pre-populated specific reviews per product catalog
const MOCK_REVIEWS_DATABASE: Record<string, Review[]> = {
  '1': [
    { id: '1a', name: 'Maximilian V.', rating: 5, text: 'Defies gravity. The 7mm profile is unbelievably thin—I forget it is even on my wrist. The genuine Italian leather is exceptionally soft.', date: 'May 12, 2026', verified: true },
    { id: '1b', name: 'Sophia R.', rating: 4, text: 'Clean, elegant, and minimal. Received countless compliments. Only wish the rose gold accents were slightly brighter.', date: 'Apr 28, 2026', verified: true }
  ],
  '2': [
    { id: '2a', name: 'Julian K.', rating: 5, text: 'Absolute chronometric stability. The automatic movement has a fantastic reserve, and the brushed finish is flawless.', date: 'May 18, 2026', verified: true },
    { id: '2b', name: 'Arthur D.', rating: 5, text: 'A perfect marriage of traditional watchmaking and futuristic dial geometry. An absolute centerpiece.', date: 'May 04, 2026', verified: true }
  ],
  '3': [
    { id: '3a', name: 'Leo G.', rating: 5, text: 'Mesmerizing. Watching the mechanical skeleton heartbeat is therapeutic. The skeletonized dial is a true marvel.', date: 'May 20, 2026', verified: true },
    { id: '3b', name: 'Marcus W.', rating: 5, text: 'Grade 5 titanium feels incredibly light yet indestructible. Chronometric sweep is perfectly aligned.', date: 'May 10, 2026', verified: true }
  ],
  '4': [
    { id: '4a', name: 'Captain Lucas', rating: 5, text: 'Took it diving to 150m, depth rated performance is flawless. Bezel rotations feel highly solid and premium.', date: 'May 15, 2026', verified: true },
    { id: '4b', name: 'Elena B.', rating: 4, text: 'Rugged aesthetic. The luminescent hands are extremely bright in dark environments. A solid watch.', date: 'Apr 19, 2026', verified: true }
  ],
  '5': [
    { id: '5a', name: 'Charlotte H.', rating: 5, text: 'Elegant, sophisticated, and perfectly suited for formal collective dinners. Tracing the moonphases is beautifully poetic.', date: 'May 11, 2026', verified: true },
    { id: '5b', name: 'Viktor P.', rating: 5, text: '18k gold plating is extremely high quality. Double domed sapphire shows no glare. Stunning.', date: 'May 01, 2026', verified: true }
  ],
  '6': [
    { id: '6a', name: 'Nico S.', rating: 5, text: 'Precise racing tachymeter. Lightweight matte titanium fits comfortably during active races. Extremely accurate.', date: 'May 14, 2026', verified: true },
    { id: '6b', name: 'Christian M.', rating: 4, text: 'Sporty yet holds high heritage values. The chronograph sweeps seamlessly.', date: 'May 02, 2026', verified: true }
  ],
  '7': [
    { id: '7a', name: 'Lord Sterling', rating: 5, text: 'An architectural marvel inside my residency. Guests are completely wowed by the sweeping gold hands.', date: 'May 23, 2026', verified: true },
    { id: '7b', name: 'Amelie L.', rating: 5, text: 'The continuous sweep caliber is dead silent. Mirror gold backdrop is bathed beautifully in studio lights. A true masterpiece.', date: 'May 08, 2026', verified: true }
  ],
  '8': [
    { id: '8a', name: 'Francois T.', rating: 5, text: 'Absolute mechanical poetry. The flying tourbillon rotates flawlessly. The rose gold detailing represents ultimate high luxury.', date: 'May 22, 2026', verified: true },
    { id: '8b', name: 'Alastair G.', rating: 5, text: 'Exquisite hand-assembled details. Worth every dollar for collectors of fine astronomical calibers.', date: 'May 16, 2026', verified: true }
  ],
  '9': [
    { id: '9a', name: 'Commander K.', rating: 5, text: 'Forged carbon matte look is tactical and stunning. The electric blue lume glows with incredible intensity.', date: 'May 24, 2026', verified: true },
    { id: '9b', name: 'Sven O.', rating: 5, text: 'Lightweight tactical beast. Completely scratch resistant. Excellent depth ratings.', date: 'May 17, 2026', verified: true }
  ]
};

// General website/service reviews
const WEBSITE_TESTIMONIALS = [
  { name: 'Xavier B.', text: 'Secure checkout took less than 30 seconds. PCI AES-256 compliance made me feel completely secure.', rating: 5 },
  { name: 'Dr. Evelyn H.', text: 'Registry golden pass at the Geneva flag post was seamless. First-class customer VIP support.', rating: 5 },
  { name: 'Katarina S.', text: 'Insured priority transport was incredibly fast. Hand-delivered via secure courier in pristine condition.', rating: 5 }
];

export default function ProductReviewModal({ product, onClose }: ProductReviewModalProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState<number>(5);
  const [name, setName] = useState<string>('');
  const [reviewText, setReviewText] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const [isTickingActive, setIsTickingActive] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const tickIntervalRef = useRef<any>(null);

  // Play a single high-fidelity synthesized watch tick click
  const playWatchTick = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
        audioCtxRef.current = new AudioContextClass();
      }

      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const bufferSize = ctx.sampleRate * 0.04;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noiseNode = ctx.createBufferSource();
      noiseNode.buffer = buffer;

      const filterNode = ctx.createBiquadFilter();
      filterNode.type = 'bandpass';
      filterNode.frequency.value = 6800;
      filterNode.Q.value = 4.0;

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.04, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.025);

      noiseNode.connect(filterNode);
      filterNode.connect(gainNode);
      gainNode.connect(ctx.destination);

      noiseNode.start();
    } catch (err) {
      console.warn("AudioContext tick blocked or unsupported:", err);
    }
  };

  useEffect(() => {
    if (isTickingActive) {
      tickIntervalRef.current = setInterval(() => {
        playWatchTick();
      }, 250);
    } else {
      if (tickIntervalRef.current) {
        clearInterval(tickIntervalRef.current);
      }
    }

    return () => {
      if (tickIntervalRef.current) {
        clearInterval(tickIntervalRef.current);
      }
    };
  }, [isTickingActive]);

  useEffect(() => {
    setIsTickingActive(false);
  }, [product]);

  // Load specific reviews when active product changes
  useEffect(() => {
    if (product) {
      const productReviews = MOCK_REVIEWS_DATABASE[product.id] || [
        { id: 'default1', name: 'Collector Vault', rating: 5, text: 'Exceptional build quality and outstanding precision alignment.', date: 'May 20, 2026', verified: true }
      ];
      setReviews(productReviews);
      setSuccess(false);
      setName('');
      setReviewText('');
      setRating(5);
    }
  }, [product]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !reviewText) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newReview: Review = {
        id: Math.random().toString(36).substring(2, 9),
        name,
        rating,
        text: reviewText,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        verified: false // Simulated user reviews default to false until validated
      };

      setReviews((prev) => [newReview, ...prev]);
      setIsSubmitting(false);
      setSuccess(true);
      setReviewText('');
      setName('');
      setTimeout(() => setSuccess(false), 3000);
    }, 1200);
  };

  if (!product) return null;

  // Calculate rating stats
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 overflow-y-auto select-none">
        
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-md"
        />

        {/* Modal content glass panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full max-w-4xl bg-luxury-charcoal/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 max-h-[85vh] z-10"
        >
          {/* Close button */}
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-2 bg-black/45 border border-white/10 text-white rounded-full hover:border-luxury-gold transition-colors z-20 cursor-pointer"
            title="Close details"
          >
            <X size={16} />
          </button>

          {/* LEFT PANEL: Product details spotlight */}
          <div className="lg:col-span-5 bg-black/45 border-r border-white/5 p-8 flex flex-col justify-between items-center text-center overflow-y-auto max-h-[40vh] lg:max-h-[85vh]">
            
            <div className="space-y-4 w-full">
              <span className="text-[8px] uppercase tracking-[0.3em] font-mono text-luxury-gold block font-bold">
                {product.collection} Series
              </span>
              <h2 className="font-serif text-3xl text-white">{product.name}</h2>
              <div className="w-12 h-[1px] bg-luxury-gold mx-auto mt-2" />
            </div>

            {/* Centered Watch Image */}
            <div className="w-56 h-56 flex items-center justify-center my-6 drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)] animate-float-slow">
              <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain" />
            </div>

            <div className="space-y-6 w-full text-left">
              <div className="flex justify-between items-baseline">
                <span className="text-[9px] uppercase tracking-widest text-luxury-text-muted font-bold font-mono">Vault Allocation</span>
                <span className="text-2xl font-serif font-medium text-luxury-gold">${product.price.toLocaleString()}</span>
              </div>
              <p className="text-xs text-luxury-text-muted leading-relaxed font-light tracking-wide">
                {product.description}
              </p>

              {/* Optional Mechanical Auditory escapement soundboard */}
              <div className="border-t border-white/5 pt-4 flex justify-between items-center bg-white/[0.01] border border-white/5 p-3 rounded-lg w-full">
                <div className="text-left">
                  <span className="text-[7px] font-mono tracking-widest text-luxury-gold uppercase font-bold block">Caliber Escapement</span>
                  <span className="text-[8px] text-white/60 font-sans tracking-wide">Listen to the mechanical 4Hz balance heartbeat</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsTickingActive(!isTickingActive)}
                  className={`px-3 py-1.5 rounded text-[8px] uppercase tracking-widest font-mono font-bold transition-all border cursor-pointer ${
                    isTickingActive
                      ? 'bg-luxury-gold text-black border-luxury-gold shadow-lg shadow-luxury-gold/15'
                      : 'bg-white/5 border-white/10 text-white/70 hover:text-white'
                  }`}
                >
                  {isTickingActive ? '🔉 Ticking' : '🔇 Mute'}
                </button>
              </div>
              
              {/* Micro specs */}
              {product.features && product.features.length > 0 && (
                <div className="space-y-2 border-t border-white/5 pt-4">
                  <span className="text-[7px] uppercase tracking-widest text-white/40 font-bold font-mono block">Technical Specifications</span>
                  <div className="flex flex-wrap gap-1.5">
                    {product.features.map((feat, i) => (
                      <span key={i} className="text-[8px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-white/70 uppercase font-mono">
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* RIGHT PANEL: Reviews listing and submission */}
          <div className="lg:col-span-7 p-8 flex flex-col justify-between overflow-y-auto max-h-[45vh] lg:max-h-[85vh]">
            <div className="space-y-8">
              
              {/* Header metrics */}
              <div className="flex flex-wrap justify-between items-center gap-6 border-b border-white/5 pb-6">
                <div>
                  <h3 className="font-serif text-xl text-white">Client Opinions</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex text-luxury-gold">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={11} fill={i < Math.round(parseFloat(averageRating)) ? '#C5A059' : 'none'} strokeWidth={1.5} />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono text-white/80 font-bold">{averageRating} / 5.0 Rating</span>
                    <span className="text-[9px] text-luxury-text-muted">({reviews.length} Verified Reviews)</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-4.5 py-1.5 text-[8px] uppercase tracking-widest text-emerald-500 font-mono font-bold">
                  <ShieldCheck size={11} /> 100% Verified Owners
                </div>
              </div>

              {/* Review list */}
              <div className="space-y-6 max-h-[300px] overflow-y-auto pr-2">
                <AnimatePresence initial={false}>
                  {reviews.map((rev) => (
                    <motion.div
                      key={rev.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      className="p-5 bg-white/[0.02] border border-white/5 rounded-xl space-y-3 text-left relative overflow-hidden"
                    >
                      {/* Top rating header */}
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs uppercase font-bold text-white tracking-wider flex items-center gap-1.5">
                              <User size={10} className="text-luxury-gold" />
                              {rev.name}
                            </span>
                            {rev.verified && (
                              <span className="text-[7px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 px-1.5 py-0.5 rounded font-mono font-bold">VERIFIED OWNER</span>
                            )}
                          </div>
                          <span className="text-[8px] text-luxury-text-muted block mt-1 font-mono">{rev.date}</span>
                        </div>
                        
                        <div className="flex text-luxury-gold">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={10} fill={i < rev.rating ? '#C5A059' : 'none'} strokeWidth={1} />
                          ))}
                        </div>
                      </div>

                      <p className="text-[11px] text-luxury-text-muted leading-relaxed font-light font-sans tracking-wide">
                        "{rev.text}"
                      </p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Website Service Testimonials Section */}
              <div className="border-t border-white/5 pt-6 space-y-3 text-left">
                <span className="text-[7px] uppercase tracking-widest text-luxury-gold font-bold font-mono block">Global Service Testimonials</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {WEBSITE_TESTIMONIALS.map((test, i) => (
                    <div key={i} className="p-3 bg-white/[0.01] border border-white/5 rounded-lg space-y-1">
                      <div className="flex justify-between items-center text-[7px] font-mono text-white/50">
                        <span className="font-bold">{test.name}</span>
                        <span className="text-luxury-gold font-bold">5.0 ★</span>
                      </div>
                      <p className="text-[9px] text-luxury-text-muted font-light leading-relaxed tracking-wide">
                        "{test.text}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Interactive Submit Review Form */}
            <form onSubmit={handleSubmitReview} className="border-t border-white/5 pt-6 mt-8 text-left space-y-4">
              <div>
                <span className="text-[9px] font-mono tracking-widest text-luxury-gold uppercase block font-bold mb-1">Share Your Experience</span>
                <p className="text-[9px] text-luxury-text-muted font-light">Your review will update dynamically on our digital allocation ledger.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[7px] font-mono tracking-widest text-white/40 uppercase font-bold block">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="ENTER YOUR FULL NAME"
                    className="w-full bg-transparent border border-white/10 px-4 py-3 text-[9px] tracking-widest uppercase text-white focus:outline-none focus:border-luxury-gold transition-colors rounded-lg"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[7px] font-mono tracking-widest text-white/40 uppercase font-bold block">Rating Score</label>
                  <div className="flex gap-1.5 py-2.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="text-luxury-gold hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                        title={`Rate ${star} Stars`}
                      >
                        <Star size={16} fill={star <= rating ? '#C5A059' : 'none'} strokeWidth={1.5} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[7px] font-mono tracking-widest text-white/40 uppercase font-bold block">Your Feedback</label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    required
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="WRITE YOUR TIMEPIECE AUDIT..."
                    className="w-full bg-transparent border border-white/10 pl-4 pr-16 py-3.5 text-[9px] tracking-widest uppercase text-white focus:outline-none focus:border-luxury-gold transition-colors rounded-lg"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting || success}
                    className="absolute right-2 p-2 rounded bg-luxury-gold text-black hover:bg-[#D4B578] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                    title="Submit Secure Review"
                  >
                    {isSubmitting ? (
                      <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : success ? (
                      <Check size={14} />
                    ) : (
                      <Send size={14} />
                    )}
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {success && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-[9px] font-mono text-emerald-500 uppercase tracking-widest flex items-center gap-1.5"
                  >
                    <Check size={11} /> Review Ledger Allocations Complete!
                  </motion.p>
                )}
              </AnimatePresence>

            </form>

          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
