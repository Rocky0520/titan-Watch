import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { User } from '../models/User.js';

const USERS_FILE = path.join(process.cwd(), 'server', 'data', 'users.json');

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123') as any;

      if (mongoose.connection.readyState === 1) {
        req.user = await User.findById(decoded.id).select('-password');
      } else {
        if (fs.existsSync(USERS_FILE)) {
          const localUsers = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8') || '[]');
          const localUser = localUsers.find((u: any) => u._id === decoded.id);
          if (localUser) {
            const { password, ...userWithoutPassword } = localUser;
            req.user = userWithoutPassword;
          }
        }
      }
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};
