import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    
    setLoading(true);
    setError('');
    
    try {
      await register(formData.name, formData.email, formData.password);
      navigate('/');
    } catch (err: any) {
      console.error(err);
      let errMsg = 'Membership request failed.';
      if (err.code) {
        // Handle Firebase specific auth errors
        switch(err.code) {
          case 'auth/email-already-in-use':
            errMsg = 'This email address is already in use by another member.';
            break;
          case 'auth/invalid-email':
            errMsg = 'Please enter a valid email address.';
            break;
          case 'auth/weak-password':
            errMsg = 'Access key must be stronger (at least 6 characters).';
            break;
          default:
            errMsg = err.message;
        }
      } else if (err.response?.data?.message) {
        errMsg = err.response.data.message;
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-12 flex items-center justify-center px-6">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-luxury-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-luxury-gold/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-luxury-dark/40 backdrop-blur-xl border border-white/5 p-12 shadow-2xl">
          <div className="text-center mb-12">
            <span className="text-luxury-gold text-[10px] uppercase tracking-[0.5em] font-bold mb-4 block">New Heritage</span>
            <h2 className="font-serif text-4xl text-white italic font-light">Join the Elite</h2>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs tracking-wider uppercase text-center"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-luxury-text-muted font-bold ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-0 top-1/2 -translate-y-1/2 text-luxury-gold/40" size={16} />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-transparent border-b border-white/10 py-4 pl-8 text-sm text-white focus:outline-none focus:border-luxury-gold transition-colors placeholder:text-white/10"
                  placeholder="Your Full Name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-luxury-text-muted font-bold ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-luxury-gold/40" size={16} />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-transparent border-b border-white/10 py-4 pl-8 text-sm text-white focus:outline-none focus:border-luxury-gold transition-colors placeholder:text-white/10"
                  placeholder="name@titanwatch.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-luxury-text-muted font-bold ml-1">Create Access Key</label>
              <div className="relative">
                <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-luxury-gold/40" size={16} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-transparent border-b border-white/10 py-4 pl-8 pr-10 text-sm text-white focus:outline-none focus:border-luxury-gold transition-colors placeholder:text-white/10"
                  placeholder="Min. 8 Characters"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-luxury-text-muted font-bold ml-1">Confirm Access Key</label>
              <div className="relative">
                <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-luxury-gold/40" size={16} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full bg-transparent border-b border-white/10 py-4 pl-8 text-sm text-white focus:outline-none focus:border-luxury-gold transition-colors placeholder:text-white/10"
                  placeholder="Repeat Entry Key"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-luxury-text-muted hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-3 py-4">
              <input type="checkbox" required className="mt-1" />
              <p className="text-[9px] uppercase tracking-widest text-luxury-text-muted leading-relaxed">
                I agree to the <span className="text-white hover:text-luxury-gold underline cursor-pointer">Terms of Service</span> and <span className="text-white hover:text-luxury-gold underline cursor-pointer">Privacy Policy</span> of Titan Watch.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-luxury-gold text-black py-5 uppercase tracking-[0.3em] text-[10px] font-bold hover:bg-[#D4B578] transition-all duration-500 relative overflow-hidden group"
            >
              <span className={loading ? 'opacity-0' : 'opacity-100'}>Register Now</span>
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </button>
          </form>

          <div className="mt-12 text-center pt-8 border-t border-white/5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-luxury-text-muted mb-4">Already a member?</p>
            <Link 
              to="/login" 
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-white hover:text-luxury-gold transition-colors group"
            >
              Secure Entry
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
