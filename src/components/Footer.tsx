import { Instagram, Facebook, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-luxury-charcoal text-white pt-24 pb-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-8 mb-20">
          <div className="md:col-span-2">
            <h2 className="font-serif text-3xl uppercase tracking-[0.2em] mb-8 font-light">
              Titan<span className="text-luxury-gold italic">Watch</span>
            </h2>
            <p className="max-w-sm text-luxury-text-muted text-sm font-light leading-relaxed mb-8 tracking-wide">
              Since 1895, we have been dedicated to the pursuit of horological excellence. 
              Our timepieces are more than just instruments; they are legacies passed through generations.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-luxury-text-muted hover:text-luxury-gold transition-colors">
                <Instagram size={18} strokeWidth={1.5} />
              </a>
              <a href="#" className="text-luxury-text-muted hover:text-luxury-gold transition-colors">
                <Facebook size={18} strokeWidth={1.5} />
              </a>
              <a href="#" className="text-luxury-text-muted hover:text-luxury-gold transition-colors">
                <Linkedin size={18} strokeWidth={1.5} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-[12px] uppercase tracking-[0.3em] font-bold mb-8 text-white">Quick Links</h4>
            <ul className="flex flex-col gap-4 text-luxury-text-muted text-sm font-light">
              {['New Arrivals', 'Collections', 'Mens Watches', 'Womens Watches', 'Accessories'].map((link) => (
                <li key={link}><a href="#" className="hover:text-white transition-colors tracking-wide">{link}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[12px] uppercase tracking-[0.3em] font-bold mb-8 text-white">Boutique Services</h4>
            <ul className="flex flex-col gap-4 text-luxury-text-muted text-sm font-light">
              {['Find a Boutique', 'Book an Appointment', 'Warranty & Repair', 'Track Your Order', 'Contact Us'].map((link) => (
                <li key={link}><a href="#" className="hover:text-white transition-colors tracking-wide">{link}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[9px] uppercase tracking-[0.2em] text-neutral-600 font-medium italic font-serif">
            Est. 1895 — Precision Crafted in Switzerland
          </p>
          <div className="flex gap-8 text-[10px] uppercase tracking-[0.2em] text-luxury-text-muted">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
