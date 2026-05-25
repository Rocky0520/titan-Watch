import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Sparkles, User, ShieldCheck, Check } from 'lucide-react';
import axios from 'axios';

interface Message {
  sender: 'concierge' | 'user';
  text: string;
  timestamp: string;
}

// Highly sophisticated client-side rules engine fallback for refined luxury advice
const LUXURY_FALLBACK_RESPONSES = [
  {
    keywords: ['slim', 'edge', 'thin', 'profile'],
    response: "Ah, the Edge Ultra-Slim is a mechanical marvel of micro-horology. Tracing just a 7mm profile, it is hand-crafted in 18k rose gold with a double-domed sapphire face. It represents the absolute zenith of gravity-defying wearability."
  },
  {
    keywords: ['royal', 'chronometer', 'accuracy'],
    response: "The Royal Chronometer is engineered for absolute chronometric stability. Forged in brushed titanium with hand-burnished bezels, its automatic movement holds a majestic 72-hour reserve. A reliable companion for international voyagers."
  },
  {
    keywords: ['skeleton', 'heartbeat', 'tourbillon'],
    response: "You speak of the Skeleton Heartbeat. It features our signature flying tourbillon suspended in a grade 5 titanium chassis, revolving once every 60 seconds to negate gravity. An architectural exhibition of micro-gears."
  },
  {
    keywords: ['diver', 'mariner', 'water', 'deep'],
    response: "The Deep Mariner is rated to a majestic 300 meters depth. It features a solid ceramic unidirectional rotating bezel and high-intensity Swiss Super-LumiNova indexes, providing perfect low-light readability during deep explorations."
  },
  {
    keywords: ['moonphase', 'celestia', 'astronomy'],
    response: "The Celestia Moonphase represents astronomical precision. Encased in solid yellow gold, its complications track the poetic cycle of the moon with a deviation of only one day every 122 years. Absolute mechanical poetry."
  },
  {
    keywords: ['price', 'cost', 'expensive', 'cheap'],
    response: "Our timepieces represent legacy investments. The curated collection begins at $15,500 for the Deep Mariner, up to the astronomical Tourbillon Grand Master allocated at $125,000. Each allocation is cataloged securely in our registry."
  },
  {
    keywords: ['maintenance', 'care', 'winding', 'service'],
    response: "To preserve your chronometer's heritage value, we recommend manual winding every 48 hours for our manual calibers, and a specialized workshop inspection every five years at our flagposts in Geneva or Zurich."
  },
  {
    keywords: ['geneva', 'boutique', 'salon', 'zurich'],
    response: "Our historic salons on Rue du Rhône in Geneva and Bahnhofstrasse in Zurich welcome connoisseurs daily. I would be honored to pre-register a VIP private view session for you with our Master Watchmaker."
  }
];

const DEFAULT_CONCIERGE_FALLBACK = "An excellent inquiry, Connoisseur. Every timepiece in our heritage vault is hand-assembled in Switzerland, utilizing astronomical calibers and grade 5 titanium. How may I guide your next private collection allocation?";

export default function AIConciergeWidget() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'concierge',
      text: "Greetings, Connoisseur. I am your Horology Elite Advisory Concierge. I am honored to assist you today with heritage timepieces advice, caliber inquiries, or private boutique allocations. What is your desire?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue;
    setInputValue('');

    const userMessage: Message = {
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    // Call API with elegant luxury fallback safety
    try {
      const response = await axios.post('/api/concierge', {
        message: userText,
        chatHistory: messages.map(m => ({
          role: m.sender === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }]
        }))
      });

      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            sender: 'concierge',
            text: response.data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }, 800);

    } catch (error) {
      console.warn("Express Concierge API connection offline. Activating High-Fidelity Refined Local Advisor.");
      
      // Sophisticated rules engine matching
      const cleanText = userText.toLowerCase();
      let matchedResponse = '';

      for (const rule of LUXURY_FALLBACK_RESPONSES) {
        if (rule.keywords.some(keyword => cleanText.includes(keyword))) {
          matchedResponse = rule.response;
          break;
        }
      }

      if (!matchedResponse) {
        matchedResponse = DEFAULT_CONCIERGE_FALLBACK;
      }

      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            sender: 'concierge',
            text: matchedResponse,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }, 1200);
    }
  };

  const handleSuggestionClick = (text: string) => {
    setInputValue(text);
  };

  return (
    <div className="fixed bottom-6 left-6 z-[9999] pointer-events-none select-none">
      <AnimatePresence>
        
        {/* ================= STATE 1: FLOATING CONCIERGE BUTTON ================= */}
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 bg-luxury-gold text-black rounded-full shadow-2xl flex items-center justify-center border border-[#D4B578]/40 hover:bg-[#D4B578] pointer-events-auto cursor-pointer relative group"
            title="Chat with Advisory Concierge"
          >
            {/* Ambient pulsing golden ring */}
            <span className="absolute inset-0 rounded-full border border-luxury-gold/50 animate-ping opacity-60 pointer-events-none" />
            <MessageSquare size={22} className="relative z-10" />
            
            {/* Micro tooltip */}
            <div className="absolute left-16 bg-black/90 text-luxury-gold border border-white/10 text-[8px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-2xl">
              Heritage Concierge
            </div>
          </motion.button>
        )}

        {/* ================= STATE 2: THE LUXURY CHATBOX PANEL ================= */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 100 }}
            className="w-[300px] h-[460px] md:w-[340px] md:h-[500px] bg-luxury-charcoal/95 border border-white/10 rounded-2xl shadow-luxury pointer-events-auto flex flex-col overflow-hidden"
          >
            {/* Glassmorphic Header */}
            <div className="p-4 bg-black/45 border-b border-white/5 flex justify-between items-center relative">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-luxury-gold/10 border border-luxury-gold/25 flex items-center justify-center text-luxury-gold">
                  <Sparkles size={14} className="animate-pulse" />
                </div>
                <div className="text-left">
                  <h4 className="text-[10px] font-mono tracking-[0.25em] text-luxury-gold uppercase font-bold">Heritage Advisor</h4>
                  <span className="text-[7px] font-mono text-emerald-400 uppercase font-bold flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    VIP SECURE LEDGER PORTAL
                  </span>
                </div>
              </div>
              
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:border-luxury-gold transition-colors cursor-pointer"
                title="Close Chat"
              >
                <X size={12} />
              </button>
            </div>

            {/* Scrollable Message List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/25">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-xl text-left space-y-1 ${
                      msg.sender === 'user'
                        ? 'bg-luxury-gold text-black rounded-tr-none font-sans font-medium'
                        : 'bg-white/[0.03] border border-white/5 text-luxury-text rounded-tl-none font-serif font-light'
                    }`}
                  >
                    <div className="flex justify-between items-center gap-3 text-[7px] opacity-60 font-mono">
                      <span className="flex items-center gap-1 font-bold">
                        {msg.sender === 'user' ? (
                          <>User Credentials</>
                        ) : (
                          <span className="text-luxury-gold flex items-center gap-1"><ShieldCheck size={9} /> Verified Advisor</span>
                        )}
                      </span>
                      <span>{msg.timestamp}</span>
                    </div>
                    <p className="text-[10px] leading-relaxed tracking-wide font-sans">{msg.text}</p>
                  </div>
                </div>
              ))}

              {/* Gemini Pulse Loader */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="p-3 bg-white/[0.03] border border-white/5 rounded-xl rounded-tl-none space-x-1 flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions Cards */}
            <div className="px-4 py-2 border-t border-white/5 bg-black/40 overflow-x-auto flex gap-2 no-scrollbar whitespace-nowrap">
              {[
                "Tell me about the Skeleton Heartbeat",
                "What is your thinnest manual watch?",
                "Which model has the highest water resistance?",
                "How do I book a private view in Geneva?"
              ].map((sug, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestionClick(sug)}
                  className="px-3 py-1.5 bg-white/[0.02] border border-white/10 hover:border-luxury-gold/30 hover:bg-white/5 rounded text-[8px] text-white/70 uppercase tracking-widest font-mono font-bold transition-all cursor-pointer inline-block"
                >
                  {sug}
                </button>
              ))}
            </div>

            {/* Input Action Form */}
            <form onSubmit={handleSendMessage} className="p-3 bg-black/60 border-t border-white/5 flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="INQUIRE VINTAGE OR PRIVATE EDITIONS..."
                className="flex-1 bg-transparent border border-white/10 px-4 py-3 text-[9px] tracking-wider uppercase text-white placeholder:text-white/20 focus:outline-none focus:border-luxury-gold transition-colors rounded-lg font-sans"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="w-10 h-10 rounded-lg bg-luxury-gold text-black hover:bg-[#D4B578] disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center cursor-pointer"
                title="Send Message"
              >
                <Send size={12} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
