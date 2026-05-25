import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import ProductReviewModal from './components/ProductReviewModal';
import AIConciergeWidget from './components/AIConciergeWidget';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import Showcase from './pages/Showcase';
import CollectionsPage from './pages/CollectionsPage';
import CraftsmanshipPage from './pages/CraftsmanshipPage';
import BoutiquesPage from './pages/BoutiquesPage';
import StoryWidget from './components/StoryWidget';
import MechanicalBackground from './components/MechanicalBackground';
import CraftsmanshipSection from './components/CraftsmanshipSection';
import BoutiquesSection from './components/BoutiquesSection';
import PromoSection from './components/PromoSection';
import { getProducts } from './services/api';
import { Product, CartItem } from './types';
import { AuthProvider, useAuth } from './context/AuthContext';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token, loading } = useAuth();
  if (loading) return null;
  return token ? <>{children}</> : <Navigate to="/login" />;
}

function HomePage({ addToCart, onViewDetails }: { addToCart: (product: Product) => void; onViewDetails?: (product: Product) => void }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search')?.toLowerCase() || '';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error('API returned non-array data:', data);
          setProducts([]);
          if (data && data.message) setError(data.message);
        }
      } catch (err: any) {
        console.error('Failed to fetch products:', err);
        setError('Connection to heritage vault interrupted. Please check your credentials.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-luxury-charcoal">
        <div className="w-12 h-12 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Hero />
      
      {/* Trust Badges / Stats Section */}
      <section className="py-20 border-b border-white/5 bg-luxury-dark/60 backdrop-blur-md relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            { label: 'Established', value: '1895' },
            { label: 'Swiss Made', value: 'Hand-Crafted' },
            { label: 'Global Boutiques', value: '450+' },
            { label: 'Warranty', value: 'Lifetime' },
          ].map((stat, i) => (
            <div 
              key={stat.label}
              className="text-center"
            >
              <h4 className="font-serif text-2xl md:text-3xl mb-1 text-white">{stat.value}</h4>
              <p className="text-[10px] uppercase tracking-[0.3em] text-luxury-gold font-bold">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Collections Section */}
      <section id="collections" className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-xl">
              <span className="text-luxury-gold text-[10px] uppercase tracking-[0.5em] font-bold mb-4 block">Selection</span>
              <h2 className="font-serif text-4xl md:text-6xl leading-tight text-white">
                Curated <span className="italic font-light">Excellence</span> <br />
                for the Modern Connoisseur
              </h2>
            </div>
            <p className="text-luxury-text-muted text-sm max-w-xs leading-relaxed tracking-wide">
              Each piece serves as a testament to our unwavering commitment to precision and aesthetic perfection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
            {error ? (
              <div className="col-span-full py-20 text-center border border-white/5 bg-luxury-dark/40 backdrop-blur-md">
                <p className="text-luxury-gold text-xs uppercase tracking-[0.3em] font-bold mb-4">Registry Error</p>
                <h3 className="font-serif text-2xl text-white mb-6 italic">{error}</h3>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-8 py-3 border border-luxury-gold text-luxury-gold text-[10px] uppercase tracking-widest font-bold hover:bg-luxury-gold hover:text-black transition-all"
                >
                  Retry Connection
                </button>
              </div>
            ) : (() => {
              const filteredProducts = products.filter(product => 
                product.name.toLowerCase().includes(search) || 
                product.collection.toLowerCase().includes(search) || 
                product.description.toLowerCase().includes(search)
              );
              
              if (filteredProducts.length > 0) {
                return filteredProducts.map((product, index) => (
                  <ProductCard 
                    key={product.id}
                    product={product} 
                    onAddToCart={addToCart} 
                    index={index}
                    onViewDetails={onViewDetails}
                  />
                ));
              } else if (search) {
                return (
                  <div className="col-span-full py-24 text-center border border-white/5 bg-luxury-dark/20 backdrop-blur-md">
                    <p className="text-luxury-gold text-xs uppercase tracking-[0.3em] font-bold mb-3">No models found</p>
                    <p className="text-luxury-text-muted text-sm font-light max-w-sm mx-auto leading-relaxed">
                      We found no watch matching "{search}" in our curated collection. Please try a different query.
                    </p>
                  </div>
                );
              } else {
                return (
                  <div className="col-span-full py-20 text-center border border-white/5 bg-luxury-dark/40">
                    <p className="text-luxury-text-muted text-[10px] uppercase tracking-widest">The vault is currently empty.</p>
                  </div>
                );
              }
            })()}
          </div>
        </div>
      </section>

      {/* Heritage Promo Offer Section */}
      <div className="relative z-10">
        <PromoSection />
      </div>

      {/* Craftsmanship Exploded Mechanism Section */}
      <div className="relative z-10">
        <CraftsmanshipSection />
      </div>

      {/* Global Flagships Boutiques Section */}
      <div className="relative z-10">
        <BoutiquesSection />
      </div>

      {/* Newsletter */}
      <section className="py-24 bg-luxury-charcoal/40 backdrop-blur-md relative z-10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div>
            <span className="text-luxury-gold text-[10px] uppercase tracking-[0.5em] font-bold mb-8 block">Member Circle</span>
            <h2 className="font-serif text-4xl md:text-5xl text-white mb-8 tracking-wide italic font-light">
              Join the Elite Collective
            </h2>
            <p className="text-luxury-text-muted text-sm mb-12 tracking-widest uppercase">
              Receive exclusive access to limited private editions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input 
                type="email" 
                placeholder="YOUR EMAIL" 
                className="flex-1 bg-transparent border border-white/20 px-6 py-4 text-[10px] tracking-[0.2em] uppercase text-white placeholder:text-white/20 focus:outline-none focus:border-luxury-gold transition-colors"
              />
              <button className="bg-luxury-gold text-black px-8 py-4 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-[#D4B578] transition-all duration-500">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedReviewProduct, setSelectedReviewProduct] = useState<Product | null>(null);

  const addToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <AuthProvider>
      <Router>
        <div className="relative min-h-screen bg-[#040404] text-luxury-text overflow-x-hidden">
          <MechanicalBackground />
          <Navbar cartItemsCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)} onCartToggle={() => setIsCartOpen(true)} />
          
          <Routes>
            <Route path="/" element={<HomePage addToCart={addToCart} onViewDetails={setSelectedReviewProduct} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/showcase" element={<Showcase addToCart={addToCart} />} />
            <Route path="/collections" element={<CollectionsPage addToCart={addToCart} onViewDetails={setSelectedReviewProduct} />} />
            <Route path="/craftsmanship" element={<CraftsmanshipPage />} />
            <Route path="/boutiques" element={<BoutiquesPage />} />
            {/* Example Protected Route */}
            {/* <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} /> */}
          </Routes>

          <Footer />

          <CartDrawer 
            isOpen={isCartOpen} 
            onClose={() => setIsCartOpen(false)} 
            items={cartItems}
            onUpdateQuantity={updateQuantity}
            onRemove={removeFromCart}
          />

          <ProductReviewModal 
            product={selectedReviewProduct} 
            onClose={() => setSelectedReviewProduct(null)} 
          />

          <StoryWidget addToCart={addToCart} />
          <AIConciergeWidget />
        </div>
      </Router>
    </AuthProvider>
  );
}


