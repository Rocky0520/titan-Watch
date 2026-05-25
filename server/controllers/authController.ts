import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';

const USERS_FILE = path.join(process.cwd(), 'server', 'data', 'users.json');

// Helper to read local users
const readLocalUsers = () => {
  try {
    const dir = path.dirname(USERS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(USERS_FILE)) {
      fs.writeFileSync(USERS_FILE, JSON.stringify([]));
      return [];
    }
    const data = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (err) {
    console.error('Error reading users file:', err);
    return [];
  }
};

// Helper to write local users
const writeLocalUsers = (users) => {
  try {
    const dir = path.dirname(USERS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (err) {
    console.error('Error writing users file:', err);
  }
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user;

    if (mongoose.connection.readyState === 1) {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }
      user = await User.create({
        name,
        email,
        password
      });
    } else {
      const localUsers = readLocalUsers();
      const userExists = localUsers.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user = {
        _id: 'local_' + Math.random().toString(36).substring(2, 11),
        name,
        email,
        password: hashedPassword,
        role: 'user',
        createdAt: new Date()
      };
      localUsers.push(user);
      writeLocalUsers(localUsers);
    }

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || 'user',
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user;
    let isMatch = false;

    if (mongoose.connection.readyState === 1) {
      const dbUser = await User.findOne({ email });
      if (dbUser) {
        user = dbUser;
        isMatch = await dbUser.matchPassword(password);
      }
    } else {
      const localUsers = readLocalUsers();
      const localUser = localUsers.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
      if (localUser) {
        user = localUser;
        isMatch = await bcrypt.compare(password, localUser.password);
      }
    }

    if (user && isMatch) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || 'user',
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    let user;

    if (mongoose.connection.readyState === 1) {
      user = await User.findById(req.user._id);
    } else {
      const localUsers = readLocalUsers();
      user = localUsers.find((u: any) => u._id === req.user._id);
    }

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || 'user'
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: '30d'
  });
};
