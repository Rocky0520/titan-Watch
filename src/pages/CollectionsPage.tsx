import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, Search, SlidersHorizontal } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/api';
import { Product } from '../types';

interface CollectionsPageProps {
  addToCart: (product: Product) => void;
  onViewDetails?: (product: Product) => void;
}

export default function CollectionsPage({ addToCart, onViewDetails }: CollectionsPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCollection, setSelectedCollection] = useState<string>('All');
  
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

  // Get unique collection names for filtering tabs
  const collections = ['All', ...Array.from(new Set(products.map(p => p.collection)))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(search) || 
      product.collection.toLowerCase().includes(search) || 
      product.description.toLowerCase().includes(search);
    
    const matchesCollection = selectedCollection === 'All' || product.collection === selectedCollection;
    
    return matchesSearch && matchesCollection;
  });

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-luxury-charcoal">
        <div className="w-12 h-12 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#040404] text-luxury-text pt-32 pb-24 relative select-none">
      
      {/* Background ambient light */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-luxury-gold/[0.02] blur-[150px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
          <div>
            <Link 
              to="/" 
              className="flex items-center gap-2 group mb-6 text-luxury-text-muted hover:text-white transition-colors w-fit"
            >
              <ArrowLeft size={14} className="text-luxury-gold group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Return Home</span>
            </Link>
            <span className="text-luxury-gold text-[10px] uppercase tracking-[0.5em] font-bold mb-4 block">Selection</span>
            <h1 className="font-serif text-4xl md:text-6xl text-white">
              Curated <span className="italic font-light">Excellence</span>
            </h1>
            <p className="text-luxury-text-muted text-xs md:text-sm max-w-md mt-4 leading-relaxed font-light tracking-wide">
              Explore the complete directory of handcrafted chronometers, engineered with Swiss heritage and astronomical precision.
            </p>
          </div>

          {/* Search bar widget */}
          <div className="relative w-full md:w-80 flex items-center bg-white/5 border border-white/10 rounded-full px-5 py-3 focus-within:border-luxury-gold transition-colors">
            <Search size={16} className="text-luxury-gold mr-3" />
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="SEARCH THE VAULT..."
              className="bg-transparent border-none text-[10px] tracking-[0.2em] text-white placeholder:text-white/25 focus:outline-none w-full uppercase"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-3 mb-16 border-b border-white/5 pb-8">
          <div className="flex items-center gap-2 text-luxury-gold text-[10px] uppercase tracking-[0.3em] font-bold mr-4">
            <SlidersHorizontal size={12} />
            Collections:
          </div>
          {collections.map(col => (
            <button
              key={col}
              onClick={() => setSelectedCollection(col)}
              className={`px-6 py-2.5 rounded-full text-[9px] uppercase tracking-widest font-bold transition-all ${
                selectedCollection === col
                  ? 'bg-luxury-gold text-black shadow-lg shadow-luxury-gold/10'
                  : 'bg-white/5 text-luxury-text-muted hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              {col}
            </button>
          ))}
        </div>

        {/* Product Grid */}
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
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <ProductCard 
                key={product.id}
                product={product} 
                onAddToCart={addToCart} 
                index={index}
                onViewDetails={onViewDetails}
              />
            ))
          ) : (
            <div className="col-span-full py-24 text-center border border-white/5 bg-luxury-dark/20 backdrop-blur-md">
              <p className="text-luxury-gold text-xs uppercase tracking-[0.3em] font-bold mb-3">No models found</p>
              <p className="text-luxury-text-muted text-sm font-light max-w-sm mx-auto leading-relaxed">
                We found no watch matching your search queries or filter selections. Please adjust criteria.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
