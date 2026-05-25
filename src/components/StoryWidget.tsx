import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Volume2, 
  VolumeX, 
  Share2, 
  ShoppingBag, 
  ArrowRight, 
  Eye, 
  Play, 
  Pause 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

interface StoryWidgetProps {
  addToCart: (product: Product) => void;
}

// DeepSea Voyager product details (matching Titan Zerohour professional diver)
const diverProduct: Product = {
  id: '4',
  name: 'DeepSea Voyager',
  collection: 'Marine Professional',
  price: 1800,
  image: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&q=80&w=1000',
  description: 'Built for the abyss. Features a 30 ATM water resistance, unidirectional rotating ceramic bezel, and high-intensity Swiss Super-LumiNova markers for ultimate undersea exploration.',
  features: ['30 ATM Resistance', 'Swiss Super-LumiNova', 'Ceramic Bezel', 'Helium Escape Valve']
};

// Resilient list of direct MP4 video sources (scuba diver man, oceans, gears, and fallbacks)
const VIDEO_SOURCES = [
  "https://vjs.zencdn.net/v/oceans.mp4", // Scuba Diver underwater (VideoJS Open CDN)
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", // Blazing gold / mechanical energy (Google Storage CDN)
  "https://www.w3schools.com/html/movie.mp4", // Metallic precision clip (W3Schools CDN)
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4" // Movement exploration loop (Google Storage CDN)
];

export default function StoryWidget({ addToCart }: StoryWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [shared, setShared] = useState(false);
  const [added, setAdded] = useState(false);
  
  // Resilient video source index state
  const [videoIndex, setVideoIndex] = useState(0);

  // Dedicated separate refs for minimized and expanded video elements (prevents ref conflicts in React unmounting)
  const minimizedVideoRef = useRef<HTMLVideoElement>(null);
  const expandedVideoRef = useRef<HTMLVideoElement>(null);

  const currentVideoUrl = VIDEO_SOURCES[videoIndex];

  // Automatic error recovery fallback chain
  const handleVideoError = () => {
    console.warn(`Video URL failed to load: ${VIDEO_SOURCES[videoIndex]}. Trying fallback source...`);
    if (videoIndex < VIDEO_SOURCES.length - 1) {
      setVideoIndex(prev => prev + 1);
    }
  };

  // Synchronize programmatic autoplay across unmounting/mounting states
  useEffect(() => {
    const triggerPlayback = async () => {
      try {
        if (isOpen && expandedVideoRef.current) {
          expandedVideoRef.current.muted = isMuted;
          if (isPlaying) {
            await expandedVideoRef.current.play();
          } else {
            expandedVideoRef.current.pause();
          }
        } else if (!isOpen && minimizedVideoRef.current) {
          minimizedVideoRef.current.muted = true;
          await minimizedVideoRef.current.play();
          setIsPlaying(true); // Always starts playing when minimized
        }
      } catch (err) {
        console.log("Programmatic playback failed, waiting for user gesture:", err);
      }
    };

    triggerPlayback();
  }, [isOpen, isMuted, isPlaying, videoIndex]);

  // Toggle video playing state manually
  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    const activeVideo = isOpen ? expandedVideoRef.current : minimizedVideoRef.current;
    if (!activeVideo) return;

    if (isPlaying) {
      activeVideo.pause();
    } else {
      activeVideo.play().catch(err => console.log("Playback failed:", err));
    }
    setIsPlaying(!isPlaying);
  };

  // Toggle audio muting manually
  const handleMuteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!expandedVideoRef.current) return;
    expandedVideoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Perform a simulated link sharing copy
  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(window.location.origin + "/showcase");
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  // Add the diver watch to the shopping cart drawer
  const handleReserve = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(diverProduct);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] pointer-events-none">
      <AnimatePresence mode="wait">
        
        {/* ================= STATE 1: MINIMIZED PREVIEW CARD (VERTICAL STORY REEL) ================= */}
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setIsOpen(true)}
            className="w-36 h-56 rounded-2xl overflow-hidden border border-white/20 shadow-2xl relative cursor-pointer group bg-black pointer-events-auto select-none"
          >
            {/* Minimized loop video with explicit onError recovery */}
            <video
              ref={minimizedVideoRef}
              src={currentVideoUrl}
              autoPlay
              muted
              loop
              playsInline
              onError={handleVideoError}
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300 bg-neutral-900"
            />

            {/* Dark gradient mask */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

            {/* Top Bar: LIVE views indicator */}
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-full">
              <Eye size={10} className="text-luxury-gold animate-pulse" />
              <span className="text-[8px] text-white tracking-widest font-semibold font-mono">26.4K</span>
            </div>

            {/* Top Bar: Close (X) minimized widget */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsVisible(false);
              }}
              className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-black/60 hover:bg-black/85 flex items-center justify-center border border-white/10 text-white/70 hover:text-white transition-colors"
            >
              <X size={10} />
            </button>

            {/* Bottom Bar Details */}
            <div className="absolute bottom-2.5 left-2.5 right-2.5 text-left">
              <span className="text-[7px] text-luxury-gold uppercase tracking-[0.2em] font-bold block mb-0.5">Showcase Live</span>
              <p className="text-[9px] text-white font-medium tracking-wide truncate">DeepSea Voyager (Zerohour)</p>
              <div className="h-[2px] bg-luxury-gold/50 rounded-full mt-2 w-0 group-hover:w-full transition-all duration-700 ease-out" />
            </div>

            {/* Minimized Volume indicator indicator */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/65 w-8 h-8 rounded-full flex items-center justify-center border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Play size={12} className="text-luxury-gold" />
            </div>
          </motion.div>
        )}

        {/* ================= STATE 2: EXPANDED FULL STORY REEL PLAYER ================= */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 100 }}
            className="w-[280px] h-[460px] md:w-[320px] md:h-[500px] rounded-2xl overflow-hidden border border-white/10 shadow-luxury relative bg-[#080808] pointer-events-auto flex flex-col"
          >
            {/* The Active Reel Video */}
            <div className="relative flex-1 bg-black overflow-hidden" onClick={handlePlayPause}>
              <video
                ref={expandedVideoRef}
                src={currentVideoUrl}
                autoPlay
                muted={isMuted}
                loop
                playsInline
                onError={handleVideoError}
                className="w-full h-full object-cover bg-neutral-950"
              />

              {/* Gradients masks */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/60 pointer-events-none" />

              {/* TOP HEADER CONTROLS */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-20">
                {/* Views Counter */}
                <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                  <span className="text-[9px] text-white tracking-widest font-bold font-mono">26,482 WATCHING</span>
                </div>

                {/* Close modal */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                  }}
                  className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 flex items-center justify-center border border-white/10 text-white transition-all hover:scale-105"
                  title="Close Showcase Reel"
                >
                  <X size={14} />
                </button>
              </div>

              {/* SIDE QUICK BAR CONTROLS (Floating right side) */}
              <div className="absolute right-4 bottom-24 flex flex-col gap-4 z-20">
                {/* Play/Pause indicator */}
                <button 
                  onClick={handlePlayPause}
                  className="w-9 h-9 rounded-full bg-black/55 hover:bg-black/85 flex items-center justify-center border border-white/10 text-white transition-all hover:scale-110"
                >
                  {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                </button>

                {/* Audio toggle */}
                <button 
                  onClick={handleMuteToggle}
                  className="w-9 h-9 rounded-full bg-black/55 hover:bg-black/85 flex items-center justify-center border border-white/10 text-white transition-all hover:scale-110"
                >
                  {isMuted ? <VolumeX size={14} className="text-luxury-gold" /> : <Volume2 size={14} className="text-emerald-400" />}
                </button>

                {/* Simulated sharing */}
                <div className="relative">
                  <button 
                    onClick={handleShare}
                    className="w-9 h-9 rounded-full bg-black/55 hover:bg-black/85 flex items-center justify-center border border-white/10 text-white transition-all hover:scale-110"
                  >
                    <Share2 size={14} />
                  </button>
                  <AnimatePresence>
                    {shared && (
                      <motion.span 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: -65 }}
                        exit={{ opacity: 0 }}
                        className="absolute top-2 text-[8px] bg-luxury-gold text-black font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow"
                      >
                        Copied!
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* BOTTOM NARRATIVE METADATA AND DETAILS */}
              <div className="absolute bottom-4 left-4 right-16 text-left space-y-2.5 z-20 pointer-events-none">
                <div>
                  <span className="text-[9px] text-luxury-gold uppercase tracking-[0.3em] font-bold block mb-1">
                    Professional Diving
                  </span>
                  <h4 className="font-serif text-lg text-white font-medium tracking-wide">
                    DeepSea Voyager VII
                  </h4>
                </div>

                <p className="text-[10px] text-luxury-text-muted leading-relaxed font-light tracking-wide">
                  Built for extreme depths. Features a solid ceramic rotating bezel and glowing luminescent dial indices for undersea explorers.
                </p>

                {/* Technical highlights bullet cards */}
                <div className="flex gap-2 text-[8px] text-white/90">
                  <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">30 ATM Rated</span>
                  <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">Super-LumiNova</span>
                </div>
              </div>
            </div>

            {/* EXPANDED ACTION CONTROL FOOTER */}
            <div className="bg-luxury-accent-dark p-4 border-t border-white/5 space-y-3 z-20">
              <div className="flex justify-between items-center text-xs">
                <span className="text-white/60 font-serif font-light italic">DeepSea Voyager VII</span>
                <span className="text-luxury-gold font-bold tracking-wide">$1,800</span>
              </div>

              <div className="grid grid-cols-12 gap-2">
                {/* Add to Cart reserve Button */}
                <button
                  onClick={handleReserve}
                  className={`col-span-8 py-3 text-center text-[9px] uppercase tracking-[0.2em] font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-1.5 shadow ${
                    added 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-luxury-gold text-black hover:bg-[#D4B578]'
                  }`}
                >
                  <ShoppingBag size={11} />
                  {added ? 'Secured' : 'Reserve Model'}
                </button>

                {/* Explore Virtual Atelier full page */}
                <Link 
                  to="/showcase" 
                  onClick={() => setIsOpen(false)}
                  className="col-span-4 bg-white/5 border border-white/10 hover:border-luxury-gold/30 hover:bg-white/10 rounded-lg flex items-center justify-center text-white transition-all"
                  title="Explore Atelier"
                >
                  <span className="text-[9px] uppercase tracking-widest font-bold flex items-center gap-1">
                    Atelier <ArrowRight size={10} className="text-luxury-gold" />
                  </span>
                </Link>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
