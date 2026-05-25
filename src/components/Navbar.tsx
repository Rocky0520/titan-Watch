import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Menu, X, Search, User, LogOut } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  cartItemsCount: number;
  onCartToggle: () => void;
}

export default function Navbar({ cartItemsCount, onCartToggle }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSearchOpen, setIsSearchOpen] = useState(!!searchParams.get('search'));
  const { user, logout } = useAuth();

  const searchQuery = searchParams.get('search') || '';

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      setSearchParams({ search: value });
    } else {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('search');
      setSearchParams(newParams);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  interface NavLinkItem {
    name: string;
    href: string;
    isAtelier?: boolean;
  }

  const navLinks: NavLinkItem[] = [
    { name: 'Collections', href: '/collections' },
    { name: 'Virtual Atelier', href: '/showcase', isAtelier: true },
    { name: 'Craftsmanship', href: '/craftsmanship' },
    { name: 'Boutiques', href: '/boutiques' },
  ];

  const handleScrollLink = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      // If not on homepage, redirect to homepage with hash
      if (window.location.pathname !== '/') {
        window.location.href = '/' + href;
        return;
      }

      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-[#040404]/90 backdrop-blur-md border-b border-white/5 py-4 shadow-luxury' 
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-luxury-text"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex gap-8 items-center">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-[11px] uppercase tracking-[0.2em] font-medium transition-colors ${
                  link.isAtelier 
                    ? 'text-luxury-gold hover:text-white animate-pulse' 
                    : 'text-luxury-text-muted hover:text-white'
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Logo */}
          <div className="absolute left-1/2 -translate-x-1/2 text-center mt-12 md:mt-14">
            <Link to="/" className="pointer-events-auto">
              <h1 className="font-serif text-2xl md:text-3xl tracking-[0.2em] uppercase font-light text-white drop-shadow-md">
                Titan<span className="text-luxury-gold italic">Watch</span>
              </h1>
            </Link>
          </div>

          {/* Actions */}
          <div className="flex gap-4 md:gap-6 items-center">
            {/* Elegant Expandable Search Box */}
            <div className="relative flex items-center">
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.input
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 140, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search watch..."
                    className="bg-white/5 border border-white/10 rounded-full px-3 py-1 text-[11px] text-white placeholder:text-white/20 focus:outline-none focus:border-luxury-gold focus:bg-white/10 transition-colors mr-2 w-32 sm:w-40"
                    autoFocus
                    onBlur={() => {
                      if (!searchQuery) setIsSearchOpen(false);
                    }}
                  />
                )}
              </AnimatePresence>
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="text-luxury-text-muted hover:text-white transition-colors p-1"
                title="Toggle Watch Search"
              >
                <Search size={20} strokeWidth={1.5} />
              </button>
            </div>
            
            {user ? (
              <div className="flex items-center gap-4">
                <span className="hidden lg:block text-[10px] uppercase tracking-widest text-luxury-gold font-bold">
                  {user.name?.split(' ')[0] || 'Member'}
                </span>
                <button 
                  onClick={logout}
                  className="text-luxury-text-muted hover:text-red-400 transition-colors"
                  title="Secure Logout"
                >
                  <LogOut size={18} strokeWidth={1.5} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="text-luxury-text-muted hover:text-white transition-colors">
                <User size={20} strokeWidth={1.5} />
              </Link>
            )}

            <button 
              className="relative text-luxury-text-muted hover:text-white transition-colors"
              onClick={onCartToggle}
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-luxury-gold text-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-luxury-charcoal p-8 flex flex-col text-luxury-text"
          >
            <div className="flex justify-between items-center mb-16">
              <h2 className="font-serif text-xl uppercase tracking-widest">Menu</h2>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="flex flex-col gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-3xl font-serif font-light transition-colors ${
                    link.isAtelier ? 'text-luxury-gold hover:text-white' : 'hover:text-luxury-gold text-white'
                  }`}
                >
                  {link.name}
                </a>
              ))}
            </div>
            <div className="mt-auto pt-8 border-t border-white/5 flex gap-6">
              <Search size={20} />
              <User size={20} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
