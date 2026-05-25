import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useSpring } from 'motion/react';
import { X, Minus, Plus, ShoppingBag, CreditCard, Lock, ShieldCheck, Check, Truck, AlertCircle } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}

type CheckoutStep = 'tray' | 'shipping_payment' | 'loading' | 'success';
type PaymentMethod = 'card' | 'upi' | 'cod';

export default function CartDrawer({ isOpen, onClose, items, onUpdateQuantity, onRemove }: CartDrawerProps) {
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Flow State
  const [step, setStep] = useState<CheckoutStep>('tray');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [purchasedItems, setPurchasedItems] = useState<CartItem[]>([]);
  const [orderHash, setOrderHash] = useState('');

  // Address Inputs
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');

  // Card Inputs
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // UPI Inputs
  const [upiId, setUpiId] = useState('');
  const [upiVerified, setUpiVerified] = useState(false);
  const [upiVerifying, setUpiVerifying] = useState(false);

  // Security Handshake Loading State
  const [loadingText, setLoadingText] = useState('Initializing TLS Gateway...');

  // Reset checkout state when drawer closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep('tray');
        setPaymentMethod('card');
        setAddress('');
        setCity('');
        setZipCode('');
        setCardNumber('');
        setCardName('');
        setCardExpiry('');
        setCardCvv('');
        setUpiId('');
        setUpiVerified(false);
      }, 500);
    }
  }, [isOpen]);

  // Card details formatter helpers
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').substring(0, 16);
    const formatted = val.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').substring(0, 4);
    const formatted = val.length >= 2 ? `${val.substring(0, 2)}/${val.substring(2, 4)}` : val;
    setCardExpiry(formatted);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').substring(0, 3);
    setCardCvv(val);
  };

  // UPI verification simulation
  const verifyUpi = () => {
    if (!upiId.includes('@')) return;
    setUpiVerifying(true);
    setTimeout(() => {
      setUpiVerifying(false);
      setUpiVerified(true);
    }, 1200);
  };

  // Checkout process simulation
  const handleSecureCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('loading');

    // Simulate cryptographic secure steps
    const logs = [
      'Establishing Secure AES-256 Vault Tunnel...',
      'Validating PCI-DSS Security Tokens...',
      'Authenticating Payment Credentials...',
      'Securing Timepiece Serials Block Allocation...',
      'Generating Secure Golden pass ledger block...'
    ];

    logs.forEach((txt, idx) => {
      setTimeout(() => {
        setLoadingText(txt);
      }, (idx + 1) * 800);
    });

    setTimeout(() => {
      const generatedHash = Math.random().toString(16).substring(2, 10).toUpperCase();
      setOrderHash(generatedHash);
      setPurchasedItems([...items]);
      setStep('success');
      // Empty the cart globally
      items.forEach((item) => onRemove(item.id));
    }, (logs.length + 1) * 800);
  };

  // Luxury Print-ready blank-window Certificate Renderer
  const downloadCertificate = (itemsList: CartItem[], hash: string) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const watchNames = itemsList.map(item => item.name).join(', ');
    const watchPrices = itemsList.map(item => `$${item.price.toLocaleString()}`).join(', ');
    const date = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

    printWindow.document.write(`
      <html>
        <head>
          <title>Certificat d'Origine - Horology Elite</title>
          <style>
            body {
              background: #fff;
              color: #000;
              font-family: 'Georgia', serif;
              padding: 40px;
              text-align: center;
            }
            .certificate-container {
              border: 15px double #C5A059;
              padding: 50px;
              position: relative;
              max-width: 800px;
              margin: 0 auto;
            }
            .guilloche-seal {
              width: 100px;
              height: 100px;
              border: 3px solid #C5A059;
              border-radius: 50%;
              margin: 30px auto;
              position: relative;
              display: flex;
              align-items: center;
              justify-content: center;
              font-family: 'Helvetica', sans-serif;
              font-size: 8px;
              font-weight: bold;
              letter-spacing: 2px;
              color: #C5A059;
            }
            h1 {
              font-size: 28px;
              text-transform: uppercase;
              letter-spacing: 4px;
              color: #111;
              margin-bottom: 5px;
            }
            h2 {
              font-size: 14px;
              text-transform: uppercase;
              letter-spacing: 3px;
              color: #C5A059;
              margin-top: 0;
              margin-bottom: 40px;
            }
            p {
              font-size: 16px;
              line-height: 1.8;
              color: #333;
              margin: 20px 0;
            }
            .details {
              font-family: 'Courier New', monospace;
              background: #f9f9f9;
              border: 1px solid #eee;
              padding: 20px;
              margin: 30px auto;
              max-width: 500px;
              text-align: left;
              font-size: 12px;
            }
            .signatures {
              margin-top: 60px;
              display: flex;
              justify-content: space-around;
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .sig-line {
              border-top: 1px solid #999;
              width: 200px;
              margin-top: 50px;
              padding-top: 5px;
            }
          </style>
        </head>
        <body>
          <div class="certificate-container">
            <h1>Certificat d'Origine</h1>
            <h2>et de Garantie Internationale</h2>
            <p>This document certifies the authenticity and official allocation registry of the master horological timepiece(s):</p>
            <p style="font-size: 20px; font-weight: bold; font-style: italic; color: #111;">${watchNames}</p>
            <p>Hand-assembled, calibrated, and polished under rigorous chronometric quality protocols in Geneva, Switzerland.</p>
            
            <div class="details">
              <strong>ALLOCATION HASH:</strong> #${hash}<br>
              <strong>REGISTERED DATE:</strong> ${date}<br>
              <strong>STATUS:</strong> SWISS HERITAGE APPROVED<br>
              <strong>VALUATION:</strong> ${watchPrices}
            </div>
            
            <div class="guilloche-seal">
              OFFICIAL SEAL
            </div>
            
            <div class="signatures">
              <div>
                <div class="sig-line">Master Watchmaker</div>
                Geneva Atelier
              </div>
              <div>
                <div class="sig-line">Registrar General</div>
                Horology Elite
              </div>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Card 3D hover springs
  const rotateX = useSpring(0, { stiffness: 100, damping: 15 });
  const rotateY = useSpring(0, { stiffness: 100, damping: 15 });

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    rotateX.set(y * -15);
    rotateY.set(x * 15);
  };

  const handleCardMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[70]"
          />

          {/* Drawer container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-luxury-charcoal shadow-2xl z-[80] flex flex-col border-l border-white/5 overflow-hidden"
          >
            {/* Header */}
            <div className="p-8 flex justify-between items-center border-b border-white/5">
              <div>
                <h2 className="font-serif text-2xl uppercase tracking-widest text-white">
                  {step === 'tray' && 'Your Collection'}
                  {step === 'shipping_payment' && 'Secure Checkout'}
                  {step === 'loading' && 'TLS Encryption'}
                  {step === 'success' && 'Order Secured'}
                </h2>
                {step === 'shipping_payment' && (
                  <span className="text-[9px] uppercase tracking-widest text-luxury-gold font-mono flex items-center gap-1 mt-1">
                    <Lock size={9} /> AES-256 Secure Pipeline
                  </span>
                )}
              </div>
              <button 
                onClick={onClose} 
                className="p-2 hover:bg-white/5 text-luxury-text rounded-full transition-colors cursor-pointer"
                title="Close Tray"
              >
                <X size={20} />
              </button>
            </div>

            {/* STEP 1: Tray view */}
            {step === 'tray' && (
              <>
                <div className="flex-1 overflow-y-auto p-8">
                  {items.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center gap-4 text-luxury-text-muted">
                      <ShoppingBag size={48} strokeWidth={1} />
                      <p className="font-serif italic font-light tracking-widest uppercase text-xs">Your tray is empty.</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-8">
                      {items.map((item) => (
                        <div key={item.id} className="flex gap-4 group">
                          <div className="w-24 h-24 bg-luxury-dark overflow-hidden border border-white/5 flex items-center justify-center">
                            <img src={item.image} alt={item.name} className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-serif text-lg leading-tight text-white">{item.name}</h3>
                            <p className="text-[11px] uppercase tracking-wider text-luxury-text-muted mb-2">
                              {item.collection}
                            </p>
                            <div className="flex justify-between items-end">
                              <div className="flex items-center gap-3 border border-white/10 px-2 py-1">
                                <button 
                                  onClick={() => onUpdateQuantity(item.id, -1)}
                                  className="hover:text-luxury-gold text-luxury-text transition-colors cursor-pointer"
                                >
                                  <Minus size={12} />
                                </button>
                                <span className="text-xs font-medium w-4 text-center text-white">{item.quantity}</span>
                                <button 
                                  onClick={() => onUpdateQuantity(item.id, 1)}
                                  className="hover:text-luxury-gold text-luxury-text transition-colors cursor-pointer"
                                >
                                  <Plus size={12} />
                                </button>
                              </div>
                              <p className="font-medium text-luxury-gold tracking-tight">${(item.price * item.quantity).toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-8 bg-luxury-dark border-t border-white/5">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-sm uppercase tracking-widest font-semibold text-luxury-text-muted">Subtotal</span>
                    <span className="text-2xl font-serif font-medium text-white">${total.toLocaleString()}</span>
                  </div>
                  <button 
                    onClick={() => setStep('shipping_payment')}
                    className="w-full bg-luxury-gold text-black py-4 uppercase tracking-[0.3em] text-xs font-bold hover:bg-[#D4B578] transition-all duration-500 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" 
                    disabled={items.length === 0}
                  >
                    Proceed to Checkout
                  </button>
                  <p className="text-center text-[10px] uppercase tracking-widest text-luxury-text-muted mt-4 font-light">
                    Complimentary tracked shipping on all orders.
                  </p>
                </div>
              </>
            )}

            {/* STEP 2: Shipping & Payment */}
            {step === 'shipping_payment' && (
              <form onSubmit={handleSecureCheckout} className="flex-1 flex flex-col justify-between overflow-y-auto">
                <div className="p-8 space-y-8 flex-1 overflow-y-auto">
                  
                  {/* Shipping Section */}
                  <div className="space-y-4">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-luxury-gold font-bold font-mono block">1. Shipping Address</span>
                    <div className="space-y-3">
                      <input 
                        type="text" 
                        required 
                        value={address} 
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="DELIVERY ADDRESS"
                        className="w-full bg-transparent border border-white/10 px-4 py-3 text-[10px] uppercase tracking-widest text-white focus:outline-none focus:border-luxury-gold transition-colors"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <input 
                          type="text" 
                          required 
                          value={city} 
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="CITY"
                          className="bg-transparent border border-white/10 px-4 py-3 text-[10px] uppercase tracking-widest text-white focus:outline-none focus:border-luxury-gold transition-colors"
                        />
                        <input 
                          type="text" 
                          required 
                          value={zipCode} 
                          onChange={(e) => setZipCode(e.target.value)}
                          placeholder="ZIP CODE"
                          className="bg-transparent border border-white/10 px-4 py-3 text-[10px] uppercase tracking-widest text-white focus:outline-none focus:border-luxury-gold transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Selection tabs */}
                  <div className="space-y-4">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-luxury-gold font-bold font-mono block">2. Payment Method</span>
                    <div className="grid grid-cols-3 gap-2 p-1 border border-white/5 bg-black/40 rounded-xl">
                      {[
                        { id: 'card', name: 'Card' },
                        { id: 'upi', name: 'UPI ID' },
                        { id: 'cod', name: 'COD' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setPaymentMethod(item.id as any)}
                          className={`py-3 rounded-lg text-[9px] uppercase tracking-[0.2em] font-bold transition-all cursor-pointer ${
                            paymentMethod === item.id 
                              ? 'bg-luxury-gold text-black shadow-lg' 
                              : 'text-luxury-text-muted hover:text-white'
                          }`}
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Form fields based on selected Payment Method */}
                  <div className="space-y-4">
                    
                    {/* Method A: CARD PAYMENT */}
                    {paymentMethod === 'card' && (
                      <div className="space-y-6">
                        
                        {/* Real-time 3D Golden Credit Card Vector Preview */}
                        <div className="perspective-3d">
                          <motion.div
                            onMouseMove={handleCardMouseMove}
                            onMouseLeave={handleCardMouseLeave}
                            style={{
                              rotateX,
                              rotateY,
                              transformStyle: 'preserve-3d',
                            }}
                            className="w-full aspect-[1.58/1] rounded-2xl bg-gradient-to-tr from-[#161616] via-[#2A2315] to-[#121212] border border-luxury-gold/30 p-6 flex flex-col justify-between text-left shadow-2xl relative overflow-hidden preserve-3d"
                          >
                            {/* Shiny reflective gold layer */}
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(197,160,89,0.06)_0%,transparent_60%)] pointer-events-none" />

                            <div className="flex justify-between items-start" style={{ transform: 'translateZ(30px)' }}>
                              <div>
                                <span className="text-[7px] font-mono tracking-[0.3em] text-luxury-gold font-bold">HOROLOGY VAULT CARD</span>
                                <div className="w-10 h-7 rounded-md bg-gradient-to-r from-amber-300 via-amber-500 to-amber-200 mt-2 opacity-85 shadow" />
                              </div>
                              <CreditCard className="text-luxury-gold" size={24} strokeWidth={1} />
                            </div>

                            <div className="space-y-4" style={{ transform: 'translateZ(40px)' }}>
                              <p className="font-mono text-sm tracking-[0.25em] text-white">
                                {cardNumber || '•••• •••• •••• ••••'}
                              </p>
                              <div className="flex justify-between items-end">
                                <div>
                                  <span className="text-[6px] tracking-wider text-white/30 uppercase block">Cardholder</span>
                                  <p className="font-mono text-[9px] uppercase tracking-widest text-white/95">
                                    {cardName || 'YOUR FULL NAME'}
                                  </p>
                                </div>
                                <div className="flex gap-4">
                                  <div>
                                    <span className="text-[6px] tracking-wider text-white/30 uppercase block">Expires</span>
                                    <p className="font-mono text-[9px] text-white">
                                      {cardExpiry || 'MM/YY'}
                                    </p>
                                  </div>
                                  <div>
                                    <span className="text-[6px] tracking-wider text-white/30 uppercase block">CVV</span>
                                    <p className="font-mono text-[9px] text-white">
                                      {cardCvv || '•••'}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        </div>

                        {/* Card input forms */}
                        <div className="space-y-3">
                          <input 
                            type="text" 
                            required 
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value.toUpperCase())}
                            placeholder="CARDHOLDER NAME"
                            className="w-full bg-transparent border border-white/10 px-4 py-3 text-[10px] uppercase tracking-widest text-white focus:outline-none focus:border-luxury-gold transition-colors"
                          />
                          <input 
                            type="text" 
                            required 
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                            placeholder="CARD NUMBER (16 DIGITS)"
                            className="w-full bg-transparent border border-white/10 px-4 py-3 text-[10px] uppercase tracking-widest text-white focus:outline-none focus:border-luxury-gold transition-colors"
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <input 
                              type="text" 
                              required 
                              value={cardExpiry}
                              onChange={handleExpiryChange}
                              placeholder="EXPIRY DATE (MM/YY)"
                              className="bg-transparent border border-white/10 px-4 py-3 text-[10px] uppercase tracking-widest text-white focus:outline-none focus:border-luxury-gold transition-colors"
                            />
                            <input 
                              type="password" 
                              required 
                              value={cardCvv}
                              onChange={handleCvvChange}
                              placeholder="CVV (3 DIGITS)"
                              className="bg-transparent border border-white/10 px-4 py-3 text-[10px] uppercase tracking-widest text-white focus:outline-none focus:border-luxury-gold transition-colors"
                            />
                          </div>
                        </div>

                      </div>
                    )}

                    {/* Method B: UPI PAYMENT */}
                    {paymentMethod === 'upi' && (
                      <div className="space-y-4">
                        <div className="relative flex items-center">
                          <input 
                            type="text" 
                            required 
                            value={upiId}
                            onChange={(e) => {
                              setUpiId(e.target.value);
                              setUpiVerified(false);
                            }}
                            placeholder="ENTER UPI ID (E.G., MEMBER@OKAXIS)"
                            className="w-full bg-transparent border border-white/10 pl-4 pr-24 py-3.5 text-[10px] tracking-widest uppercase text-white focus:outline-none focus:border-luxury-gold transition-colors"
                          />
                          <button
                            type="button"
                            onClick={verifyUpi}
                            disabled={!upiId.includes('@') || upiVerifying || upiVerified}
                            className="absolute right-2 px-4 py-2 text-[8px] tracking-widest uppercase font-bold rounded bg-white/5 border border-white/10 text-white hover:border-luxury-gold hover:text-luxury-gold transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                          >
                            {upiVerifying ? 'VERIFYING...' : upiVerified ? 'VERIFIED' : 'VERIFY'}
                          </button>
                        </div>
                        
                        <AnimatePresence>
                          {upiVerified && (
                            <motion.p
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-[9px] font-mono text-emerald-500 uppercase tracking-widest flex items-center gap-1.5"
                            >
                              <Check size={11} /> UPI ID Authenticated & Secured
                            </motion.p>
                          )}
                        </AnimatePresence>
                        
                        <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl text-left space-y-2">
                          <span className="text-[8px] font-mono tracking-widest text-luxury-gold uppercase block font-bold">UPI Security Notice</span>
                          <p className="text-[9px] text-luxury-text-muted leading-relaxed font-light">
                            Enter your registered ID above. Upon proceeding, you will receive a secure pop-up authorization block inside your UPI app (GPay/BHIM/PhonePe). Verify your invoice total before confirming credentials.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Method C: CASH ON DELIVERY */}
                    {paymentMethod === 'cod' && (
                      <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl text-left space-y-4">
                        <div className="w-8 h-8 rounded-full bg-luxury-gold/10 flex items-center justify-center">
                          <Truck size={14} className="text-luxury-gold" />
                        </div>
                        <div className="space-y-2">
                          <span className="text-[9px] font-mono tracking-widest text-luxury-gold uppercase block font-bold">Verified Courier Hand-Over</span>
                          <p className="text-[10px] text-white/90 leading-relaxed font-light">
                            Complimentary Priority Courier Delivery is active.
                          </p>
                          <p className="text-[9px] text-luxury-text-muted leading-relaxed font-light">
                            Our secure courier agents will coordinate a hand-over window at your location checkpost. A biometric golden code verification block will be generated via SMS to authorize final delivery.
                          </p>
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Security Compliance Panel */}
                  <div className="pt-4 border-t border-white/5 grid grid-cols-2 gap-4">
                    <div className="flex items-start gap-2.5">
                      <ShieldCheck size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[8px] uppercase tracking-widest text-white font-bold font-mono block">PCI Compliant</span>
                        <span className="text-[7px] text-luxury-text-muted block">AES-256 End-to-End Encryption</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Lock size={14} className="text-luxury-gold shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[8px] uppercase tracking-widest text-white font-bold font-mono block">Secured Vault</span>
                        <span className="text-[7px] text-luxury-text-muted block">TLS v1.3 Verified Gateway</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Secure Payment subtotal / pay buttons */}
                <div className="p-8 bg-luxury-dark border-t border-white/5">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-sm uppercase tracking-widest font-semibold text-luxury-text-muted">Total Invoice</span>
                    <span className="text-2xl font-serif font-medium text-white">${total.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex gap-4">
                    <button 
                      type="button"
                      onClick={() => setStep('tray')}
                      className="px-6 py-4 border border-white/10 hover:border-white/20 text-white uppercase tracking-widest text-[10px] font-bold transition-all cursor-pointer"
                    >
                      Back
                    </button>
                    <button 
                      type="submit"
                      disabled={paymentMethod === 'upi' && !upiVerified}
                      className="flex-1 bg-luxury-gold text-black py-4 uppercase tracking-[0.25em] text-xs font-bold hover:bg-[#D4B578] transition-all duration-300 shadow-2xl disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Lock size={12} />
                      Pay Securely
                    </button>
                  </div>
                  
                  {paymentMethod === 'upi' && !upiVerified && (
                    <p className="text-center text-[8px] uppercase tracking-widest text-amber-500 mt-3 font-mono">
                      * Please verify your UPI ID above first.
                    </p>
                  )}
                </div>
              </form>
            )}

            {/* STEP 3: Secure Handshake Loading Screen */}
            {step === 'loading' && (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-8 bg-luxury-dark">
                
                {/* Luxurious Circular Gold Spinner */}
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border border-white/5" />
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-2 border-luxury-gold border-t-transparent"
                  />
                  <Lock size={20} className="text-luxury-gold animate-pulse" />
                </div>

                <div className="space-y-3">
                  <span className="text-luxury-gold text-[8px] uppercase tracking-[0.4em] font-bold font-mono">CRYPTOGRAPHIC TUNNEL ACTIVE</span>
                  <h3 className="font-serif text-xl text-white italic font-light">{loadingText}</h3>
                  <p className="text-[9px] text-luxury-text-muted leading-relaxed font-mono uppercase tracking-widest max-w-xs mx-auto">
                    Vault assets are being locked and allocated to your temporal ledger.
                  </p>
                </div>

              </div>
            )}

            {/* STEP 4: Checkout Success Pass Ticket */}
            {step === 'success' && (
              <div className="flex-1 flex flex-col justify-between overflow-y-auto bg-luxury-dark p-8 text-center">
                
                <div className="my-auto space-y-8">
                  
                  {/* Pass outline card */}
                  <div className="glass-luxury-gold p-8 rounded-2xl relative overflow-hidden shadow-2xl border border-luxury-gold/20">
                    <div className="absolute inset-3 border border-luxury-gold/15 rounded-xl pointer-events-none" />
                    
                    <div className="flex flex-col items-center space-y-2 mb-6">
                      <div className="w-12 h-12 rounded-full bg-luxury-gold/15 flex items-center justify-center mb-2">
                        <Check size={24} className="text-luxury-gold" />
                      </div>
                      <span className="text-luxury-gold text-[8px] uppercase tracking-[0.4em] font-mono font-bold">SECURE BLOCK ALLOCATED</span>
                      <h3 className="font-serif text-2xl text-white">Tray Secured</h3>
                    </div>

                    <div className="h-[1px] bg-luxury-gold/20 w-full mb-6" />

                    <div className="space-y-4 text-left font-mono text-[9px] tracking-wider uppercase text-white/90">
                      <div className="flex justify-between">
                        <span className="text-white/30">TRANSACTION BLOCK:</span>
                        <span className="font-bold text-luxury-gold">#{orderHash}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/30">ALLOCATION ADDR:</span>
                        <span className="font-bold text-ellipsis overflow-hidden w-40 text-right">{address || 'SHIPPED TO REGISTRY'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/30">PAYMENT TYPE:</span>
                        <span className="font-bold">{paymentMethod.toUpperCase()} SECURED</span>
                      </div>
                      <div className="flex justify-between border-t border-luxury-gold/10 pt-4 mt-2">
                        <span className="text-white/30">TOTAL DEBIT:</span>
                        <span className="font-bold text-luxury-gold">PAID</span>
                      </div>
                    </div>

                    {/* Certificat Guilloche block preview trigger */}
                    <div className="mt-6 border border-[#C5A059]/40 bg-[#16130B]/40 p-4 rounded-xl space-y-3 relative">
                      <div className="absolute inset-1.5 border border-[#C5A059]/15 rounded-lg pointer-events-none" />
                      <span className="text-[#C5A059] text-[8px] uppercase tracking-[0.3em] font-mono font-bold block">Certificat d'Origine</span>
                      <p className="text-[9px] text-white/70 font-sans tracking-wide leading-relaxed">
                        An official ownership title has been allocated to: <br/>
                        <strong className="text-white italic">{purchasedItems.map(item => item.name).join(', ') || 'Timepiece'}</strong>
                      </p>
                      <button
                        type="button"
                        onClick={() => downloadCertificate(purchasedItems, orderHash)}
                        className="px-4 py-2.5 bg-luxury-gold text-black rounded-lg text-[8px] uppercase tracking-[0.2em] font-mono font-bold hover:bg-[#D4B578] hover:scale-105 active:scale-95 transition-all w-full cursor-pointer"
                      >
                        Print Certified Document
                      </button>
                    </div>

                    <div className="h-[1px] bg-luxury-gold/20 w-full my-6" />

                    <div className="text-[8px] font-mono text-luxury-gold/70 italic leading-relaxed">
                      * A secure invitation link has been registered to your email. Check your spam-vault if registry authentication delay occurs.
                    </div>
                  </div>

                </div>

                <div className="space-y-4">
                  <button
                    onClick={onClose}
                    className="w-full bg-luxury-gold text-black py-4 uppercase tracking-[0.25em] text-xs font-bold hover:bg-[#D4B578] transition-all duration-300 cursor-pointer shadow-lg"
                  >
                    Finish Allocation
                  </button>
                </div>

              </div>
            )}

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
