import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth } from '../firebase';
import { loginUser as apiLoginUser, registerUser as apiRegisterUser } from '../services/api';

interface AuthContextType {
  user: any;
  token: string | null;
  loading: boolean;
  login: (email: string, password: any) => Promise<any>;
  register: (name: string, email: string, password: any) => Promise<any>;
  logout: () => Promise<void>;
  isFirebaseMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to determine if Firebase is configured with real credentials
const isFirebaseConfigured = () => {
  return (
    auth.app.options.apiKey && 
    auth.app.options.apiKey !== "placeholder-api-key-replace-me"
  );
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const isFirebaseMode = isFirebaseConfigured();

  useEffect(() => {
    if (isFirebaseMode) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          const idToken = await firebaseUser.getIdToken();
          setUser({
            _id: firebaseUser.uid,
            name: firebaseUser.displayName || 'Member',
            email: firebaseUser.email,
            role: 'user',
            token: idToken
          });
          setToken(idToken);
          localStorage.setItem('token', idToken);
        } else {
          setUser(null);
          setToken(null);
          localStorage.removeItem('token');
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      // Fallback: Local custom backend API authentication
      const fetchProfile = async () => {
        if (token) {
          try {
            const config = {
              headers: { Authorization: `Bearer ${token}` }
            };
            const { data } = await axios.get('/api/auth/profile', config);
            setUser(data);
          } catch (error) {
            localStorage.removeItem('token');
            setToken(null);
          }
        }
        setLoading(false);
      };
      fetchProfile();
    }
  }, [token, isFirebaseMode]);

  const login = async (email: string, password: any) => {
    if (isFirebaseMode) {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      const idToken = await firebaseUser.getIdToken();
      const userData = {
        _id: firebaseUser.uid,
        name: firebaseUser.displayName || 'Member',
        email: firebaseUser.email,
        role: 'user',
        token: idToken
      };
      setUser(userData);
      setToken(idToken);
      localStorage.setItem('token', idToken);
      return userData;
    } else {
      // Fallback to Express backend API
      const data = await apiLoginUser({ email, password });
      setUser(data);
      setToken(data.token);
      localStorage.setItem('token', data.token);
      return data;
    }
  };

  const register = async (name: string, email: string, password: any) => {
    if (isFirebaseMode) {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Update display name in Firebase
      await updateProfile(firebaseUser, { displayName: name });
      
      const idToken = await firebaseUser.getIdToken();
      const userData = {
        _id: firebaseUser.uid,
        name: name,
        email: firebaseUser.email,
        role: 'user',
        token: idToken
      };
      setUser(userData);
      setToken(idToken);
      localStorage.setItem('token', idToken);
      return userData;
    } else {
      // Fallback to Express backend API
      const data = await apiRegisterUser({ name, email, password });
      setUser(data);
      setToken(data.token);
      localStorage.setItem('token', data.token);
      return data;
    }
  };

  const logout = async () => {
    if (isFirebaseMode) {
      await firebaseSignOut(auth);
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isFirebaseMode }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
