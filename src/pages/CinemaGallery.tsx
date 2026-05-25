import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Search, Film, Play, Eye, ShoppingBag, Volume2, VolumeX, Sparkles, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

interface CinemaVideo {
  id: number;
  title: string;
  category: 'Chronometry' | 'Diving' | 'Metallurgy' | 'Blueprints' | 'Astronomy' | 'VIP Atelier';
  watchId: string;
  watchName: string;
  price: number;
  videoUrl: string;
  views: string;
  duration: string;
  calibre: string;
  description: string;
}

// Direct high-fidelity, hotlink-safe and CORS-enabled public video loops
const VIDEO_TEMPLATES = [
  "https://vjs.zencdn.net/v/oceans.mp4", // Scuba Diver underwater (VideoJS Open CDN)
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", // Blazing gold / mechanical energy (Google Storage CDN)
  "https://www.w3schools.com/html/movie.mp4", // Metallic precision clip (W3Schools CDN)
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", // Movement exploration loop (Google Storage CDN)
  "https://www.w3schools.com/html/mov_bbb.mp4" // Escapement balance loop (W3Schools CDN)
];

const WATCH_SEEDS = [
  { id: '1', name: 'Edge Ultra-Slim', price: 18500, collection: 'Minimalist Elite' },
  { id: '2', name: 'Royal Chronometer', price: 24000, collection: 'Masterpiece Series' },
  { id: '3', name: 'Skeleton Heartbeat', price: 32000, collection: 'Stellar Collection' },
  { id: '4', name: 'DeepSea Voyager', price: 1800, collection: 'Marine Professional' },
  { id: '5', name: 'Celestia Moonphase', price: 42000, collection: 'Vintage Luxe' },
  { id: '6', name: 'Aero Chrono', price: 28500, collection: 'Sport Precision' },
  { id: '7', name: 'Aurelius Wall Clock', price: 24500, collection: 'Grand Atelier' },
  { id: '8', name: 'Tourbillon Grand Master', price: 125000, collection: 'Grand Atelier' },
  { id: '9', name: 'Carbon Tactical', price: 19500, collection: 'Minimalist Elite' }
];

const CATEGORY_BULKS = [
  { name: 'Chronometry', verb: 'Sweep Calibration', spec: 'Balancing escapement at 28,800 beats per hour' },
  { name: 'Diving', verb: 'Depth Pressure Test', spec: 'Assuring seals durability up to 30 ATM depth' },
  { name: 'Metallurgy', verb: 'Case Forging', spec: 'Tempering aerospace grade 5 titanium case components' },
  { name: 'Blueprints', verb: 'Micro Mechanical Layout', spec: 'Aligning astronomical moonphase sweep wheels' },
  { name: 'Astronomy', verb: 'Stellar Complication Cycle', spec: 'Poetic synchronicity tracking lunar phases' },
  { name: 'VIP Atelier', verb: 'Hand Assembly Masterclass', spec: 'Hand finishing high luxury tourbillon cages' }
];

// Programmatic Generator for 1,200 High-Fidelity Horology Cinematic Videos
const generate1200Videos = (): CinemaVideo[] => {
  const list: CinemaVideo[] = [];
  
  for (let i = 1; i <= 1200; i++) {
    const templateIndex = (i - 1) % VIDEO_TEMPLATES.length;
    const watchSeed = WATCH_SEEDS[(i - 1) % WATCH_SEEDS.length];
    const catSeed = CATEGORY_BULKS[(i - 1) % CATEGORY_BULKS.length];
    
    const viewsCount = ((i * 17) % 85 + 10).toFixed(1);
    const durationSec = ((i * 3) % 40 + 15);
    
    list.push({
      id: i,
      title: `${watchSeed.name} - ${catSeed.verb} Block #${1895 + i}`,
      category: catSeed.name as any,
      watchId: watchSeed.id,
      watchName: watchSeed.name,
      price: watchSeed.price,
      videoUrl: VIDEO_TEMPLATES[templateIndex],
      views: `${viewsCount}K`,
      duration: `0:${durationSec}`,
      calibre: `CAL-H${100 + (i % 89)}`,
      description: `A meticulous high-definition cinematic recording demonstrating the ${catSeed.verb.toLowerCase()} process. Highlights ${catSeed.spec.toLowerCase()} under master horological supervision.`
    });
  }
  
  return list;
};

// Singleton instance to prevent recreation delays on render
const MASTER_CINEMA_DATABASE = generate1200Videos();

interface CinemaGalleryProps {
  addToCart: (product: Product) => void;
}

export default function CinemaGallery({ addToCart }: CinemaGalleryProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [visibleCount, setVisibleCount] = useState<number>(24);
  const [selectedVideo, setSelectedVideo] = useState<CinemaVideo | null>(null);
  const [isTheaterMuted, setIsTheaterMuted] = useState<boolean>(true);
  const [hoveredCardId, setHoveredCardId] = useState<number | null>(null);

  const theaterVideoRef = useRef<HTMLVideoElement>(null);

  // Filters logic
  const filteredVideos = MASTER_CINEMA_DATABASE.filter(video => {
    const matchesSearch = 
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.watchName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.calibre.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || video.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Infinite Scroll Trigger
  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + 24, filteredVideos.length));
  };

  const handleCardMouseEnter = (id: number) => {
    setHoveredCardId(id);
  };

  const handleCardMouseLeave = () => {
    setHoveredCardId(null);
  };

  const handleTheaterMuteToggle = () => {
    if (theaterVideoRef.current) {
      theaterVideoRef.current.muted = !isTheaterMuted;
      setIsTheaterMuted(!isTheaterMuted);
    }
  };

  const handleReserveFromCinema = (vid: CinemaVideo) => {
    const prod: Product = {
      id: vid.watchId,
      name: vid.watchName,
      price: vid.price,
      collection: vid.category === 'Diving' ? 'Marine Professional' : 'Grand Atelier',
      image: `/titan_wall_clock.png`, // Fallback visual
      description: vid.description,
      features: [vid.calibre, 'Virtual Atelier Edition']
    };
    addToCart(prod);
  };

  return (
    <div className="min-h-screen bg-[#030303] text-luxury-text pt-32 pb-24 relative select-none">
      
      {/* Cinematic grid ambient background lights */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full bg-luxury-gold/[0.015] blur-[180px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] rounded-full bg-luxury-gold/[0.01] blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div>
            <Link 
              to="/" 
              className="flex items-center gap-2 group mb-6 text-luxury-text-muted hover:text-white transition-colors w-fit"
            >
              <ArrowLeft size={14} className="text-luxury-gold group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Return Home</span>
            </Link>
            <div className="flex items-center gap-2 mb-3">
              <Film size={18} className="text-luxury-gold" />
              <span className="text-luxury-gold text-[9px] uppercase tracking-[0.4em] font-bold font-mono">Virtual Atelier Cinematique</span>
            </div>
            <h1 className="font-serif text-4xl md:text-6xl text-white">
              Cinematic <span className="italic font-light">Library</span>
            </h1>
            <p className="text-luxury-text-muted text-xs md:text-sm max-w-xl mt-4 leading-relaxed font-light tracking-wide">
              An infinite catalog of **1,200 High-Definition watchmaking loops**. Explore precision sweeps, metallurgical tempers, diver trials, and flying tourbillon assembly reels.
            </p>
          </div>

          {/* Search bar widget */}
          <div className="relative w-full md:w-80 flex items-center bg-white/5 border border-white/10 rounded-full px-5 py-3 focus-within:border-luxury-gold transition-colors">
            <Search size={16} className="text-luxury-gold mr-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SEARCH 1,200 CINEMATICS..."
              className="bg-transparent border-none text-[10px] tracking-[0.2em] text-white placeholder:text-white/20 focus:outline-none w-full uppercase"
            />
          </div>
        </div>

        {/* Categories filters tabs */}
        <div className="flex flex-wrap gap-2.5 mb-12 border-b border-white/5 pb-8">
          {['All', 'Chronometry', 'Diving', 'Metallurgy', 'Blueprints', 'Astronomy', 'VIP Atelier'].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setVisibleCount(24);
              }}
              className={`px-5 py-2 rounded text-[8px] uppercase tracking-widest font-mono font-bold transition-all border cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-luxury-gold text-black border-luxury-gold shadow-lg shadow-luxury-gold/15'
                  : 'bg-white/[0.02] border-white/5 text-luxury-text-muted hover:text-white hover:bg-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Video Grid list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredVideos.slice(0, visibleCount).map((vid) => {
            const isHovered = hoveredCardId === vid.id;
            
            return (
              <motion.div
                key={vid.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                onMouseEnter={() => handleCardMouseEnter(vid.id)}
                onMouseLeave={handleCardMouseLeave}
                onClick={() => setSelectedVideo(vid)}
                className="group relative bg-[#090909] border border-white/5 rounded-xl overflow-hidden shadow-2xl cursor-pointer hover:border-luxury-gold/30 hover:shadow-[0_0_25px_rgba(197,160,89,0.08)] transition-all duration-500 text-left flex flex-col justify-between"
              >
                
                {/* Media Screen Container */}
                <div className="relative aspect-video w-full bg-black overflow-hidden">
                  
                  {/* Dynamic Hover Autoplay Video Loop */}
                  {isHovered ? (
                    <video
                      src={vid.videoUrl}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-luxury-dark border-b border-white/5">
                      <Play size={16} className="text-luxury-gold group-hover:scale-125 transition-transform duration-300" />
                    </div>
                  )}

                  {/* Top indicators */}
                  <div className="absolute top-3 left-3 right-3 flex justify-between items-center pointer-events-none z-10">
                    <span className="text-[7px] uppercase font-bold tracking-widest px-2 py-0.5 bg-black/60 border border-white/10 rounded font-mono text-luxury-gold">
                      {vid.category}
                    </span>
                    <span className="text-[7px] text-white/80 font-mono bg-black/60 px-1.5 py-0.5 rounded font-bold">
                      {vid.duration}
                    </span>
                  </div>

                  {/* Play sweep mask layer */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Listing metadata card details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-[10px] font-mono tracking-widest text-white/90 group-hover:text-luxury-gold transition-colors font-bold truncate">
                      {vid.title}
                    </h3>
                    <p className="text-[8px] uppercase tracking-wider text-luxury-text-muted mt-1 font-mono">
                      Allocation: {vid.watchName} ({vid.calibre})
                    </p>
                  </div>

                  <div className="flex justify-between items-center border-t border-white/5 pt-3 text-[8px] font-mono text-white/50">
                    <span className="flex items-center gap-1">
                      <Eye size={10} className="text-luxury-gold" />
                      {vid.views} AUDITED
                    </span>
                    <span className="text-luxury-gold font-bold">${vid.price.toLocaleString()}</span>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>

        {/* Load More pagination button */}
        {visibleCount < filteredVideos.length && (
          <div className="mt-16 text-center">
            <button
              onClick={handleLoadMore}
              className="px-10 py-4 border border-luxury-gold text-luxury-gold text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-luxury-gold hover:text-black transition-all cursor-pointer shadow-lg active:scale-95"
            >
              Expose More Loop Blocks ({filteredVideos.length - visibleCount} remaining)
            </button>
          </div>
        )}

      </div>

      {/* ================= IMMERSIVE THEATER MODAL PROJECTION SCREEN ================= */}
      <AnimatePresence>
        {selectedVideo && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            
            {/* Dark glass screen overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedVideo(null)}
              className="fixed inset-0 bg-black/90 backdrop-blur-md"
            />

            {/* Immersive Cinema panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="relative w-full max-w-4xl bg-luxury-charcoal/95 border border-white/10 rounded-2xl shadow-luxury overflow-hidden grid grid-cols-1 lg:grid-cols-12 max-h-[85vh] z-10"
            >
              {/* Close theater */}
              <button 
                onClick={() => setSelectedVideo(null)}
                className="absolute top-4 right-4 p-2 bg-black/45 border border-white/10 text-white rounded-full hover:border-luxury-gold transition-colors z-20 cursor-pointer"
                title="Close Cinema"
              >
                <X size={16} />
              </button>

              {/* Theater projection block */}
              <div className="lg:col-span-8 bg-black relative flex items-center justify-center min-h-[40vh] lg:min-h-[60vh]">
                <video
                  ref={theaterVideoRef}
                  src={selectedVideo.videoUrl}
                  autoPlay
                  muted={isTheaterMuted}
                  loop
                  playsInline
                  className="w-full h-full object-contain"
                />

                {/* Theater controls overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center z-10 pointer-events-auto">
                  <span className="text-[8px] font-mono tracking-widest bg-black/60 border border-white/10 px-3 py-1.5 text-luxury-gold uppercase font-bold">
                    ATELIER PROJECTION #00{selectedVideo.id}
                  </span>
                  
                  <button
                    onClick={handleTheaterMuteToggle}
                    className="w-8 h-8 rounded-full bg-black/60 border border-white/10 text-white flex items-center justify-center hover:border-luxury-gold transition-colors cursor-pointer"
                  >
                    {isTheaterMuted ? <VolumeX size={14} className="text-luxury-gold" /> : <Volume2 size={14} className="text-emerald-400" />}
                  </button>
                </div>
              </div>

              {/* Film specs sidebar panel */}
              <div className="lg:col-span-4 p-8 flex flex-col justify-between text-left overflow-y-auto max-h-[40vh] lg:max-h-[60vh] border-t lg:border-t-0 lg:border-l border-white/5">
                
                <div className="space-y-6">
                  <div>
                    <span className="text-[7px] uppercase tracking-[0.3em] font-mono text-luxury-gold block font-bold mb-1">
                      {selectedVideo.category} Cinematic Loop
                    </span>
                    <h2 className="font-serif text-2xl text-white leading-tight">{selectedVideo.title}</h2>
                    <div className="w-10 h-[1px] bg-luxury-gold mt-3" />
                  </div>

                  <p className="text-[11px] text-luxury-text-muted leading-relaxed font-light">
                    {selectedVideo.description}
                  </p>

                  <div className="space-y-3 bg-white/[0.01] border border-white/5 p-4 rounded-xl font-mono text-[9px] tracking-wide uppercase text-white/90">
                    <div className="flex justify-between">
                      <span className="text-white/30">Calibre code:</span>
                      <span className="font-bold text-luxury-gold">{selectedVideo.calibre}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/30">Target watch:</span>
                      <span className="font-bold">{selectedVideo.watchName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/30">Allocation price:</span>
                      <span className="font-bold text-luxury-gold">${selectedVideo.price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 space-y-3 mt-6">
                  <button
                    onClick={() => {
                      handleReserveFromCinema(selectedVideo);
                      setSelectedVideo(null);
                    }}
                    className="w-full bg-luxury-gold text-black py-3 rounded-lg text-[9px] uppercase tracking-[0.2em] font-mono font-bold hover:bg-[#D4B578] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg"
                  >
                    <ShoppingBag size={11} /> Reserve Timepiece
                  </button>
                  <p className="text-center text-[7px] uppercase tracking-widest text-luxury-text-muted font-mono font-bold">
                    <Sparkles size={8} className="inline mr-1 text-luxury-gold" /> ALLOCATION SUBJECT TO HERITAGE VAULT APPROVAL
                  </p>
                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
