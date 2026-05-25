import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err: any) {
      console.error(err);
      let errMsg = 'Login failed. Please check your credentials.';
      if (err.code) {
        // Handle Firebase specific auth errors
        switch(err.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
            errMsg = 'Invalid email or access key.';
            break;
          case 'auth/invalid-email':
            errMsg = 'Please provide a valid email address.';
            break;
          case 'auth/user-disabled':
            errMsg = 'This membership account has been deactivated.';
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
            <span className="text-luxury-gold text-[10px] uppercase tracking-[0.5em] font-bold mb-4 block">Welcome Back</span>
            <h2 className="font-serif text-4xl text-white italic font-light">The Elite Circle</h2>
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

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-luxury-text-muted font-bold ml-1">Member Email</label>
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
              <label className="text-[10px] uppercase tracking-[0.2em] text-luxury-text-muted font-bold ml-1">Access Key</label>
              <div className="relative">
                <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-luxury-gold/40" size={16} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-transparent border-b border-white/10 py-4 pl-8 pr-10 text-sm text-white focus:outline-none focus:border-luxury-gold transition-colors placeholder:text-white/10"
                  placeholder="••••••••"
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

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="hidden" />
                <div className="w-4 h-4 border border-white/20 flex items-center justify-center group-hover:border-luxury-gold transition-colors">
                  <div className="w-2 h-2 bg-luxury-gold scale-0 transition-transform" />
                </div>
                <span className="text-[10px] uppercase tracking-widest text-luxury-text-muted">Stay Signed</span>
              </label>
              <a href="#" className="text-[10px] uppercase tracking-widest text-luxury-gold hover:text-white transition-colors underline underline-offset-4">Forgot Entry?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-luxury-gold text-black py-5 uppercase tracking-[0.3em] text-[10px] font-bold hover:bg-[#D4B578] transition-all duration-500 relative overflow-hidden group"
            >
              <span className={loading ? 'opacity-0' : 'opacity-100'}>Secure Login</span>
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </button>
          </form>

          <div className="mt-12 text-center pt-8 border-t border-white/5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-luxury-text-muted mb-4">New to the heritage?</p>
            <Link 
              to="/register" 
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-white hover:text-luxury-gold transition-colors group"
            >
              Request Membership
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
