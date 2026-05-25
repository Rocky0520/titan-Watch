import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { Order } from '../models/Order.js';

const ORDERS_FILE = path.join(process.cwd(), 'server', 'data', 'orders.json');

// Helper to read local orders
const readLocalOrders = () => {
  try {
    const dir = path.dirname(ORDERS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(ORDERS_FILE)) {
      fs.writeFileSync(ORDERS_FILE, JSON.stringify([]));
      return [];
    }
    const data = fs.readFileSync(ORDERS_FILE, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (err) {
    console.error('Error reading orders file:', err);
    return [];
  }
};

// Helper to write local orders
const writeLocalOrders = (orders: any[]) => {
  try {
    const dir = path.dirname(ORDERS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
  } catch (err) {
    console.error('Error writing orders file:', err);
  }
};

/**
 * @desc    Create new e-commerce order
 * @route   POST /api/orders
 * @access  Private
 */
export const addOrderItems = async (req: any, res: any) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No watch items in this order' });
    }

    if (mongoose.connection.readyState === 1) {
      const order = new Order({
        user: req.user._id,
        orderItems,
        shippingAddress,
        paymentMethod,
        taxPrice,
        shippingPrice,
        totalPrice
      });
      const createdOrder = await order.save();
      res.status(201).json(createdOrder);
    } else {
      const localOrders = readLocalOrders();
      const newOrder = {
        _id: 'order_' + Math.random().toString(36).substring(2, 11),
        user: req.user._id,
        orderItems,
        shippingAddress,
        paymentMethod,
        taxPrice,
        shippingPrice,
        totalPrice,
        isPaid: false,
        isDelivered: false,
        createdAt: new Date().toISOString()
      };
      localOrders.push(newOrder);
      writeLocalOrders(localOrders);
      res.status(201).json(newOrder);
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get order by ID
 * @route   GET /api/orders/:id
 * @access  Private
 */
export const getOrderById = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      const order = await Order.findById(id).populate('user', 'name email');
      if (order) {
        return res.json(order);
      }
    } else {
      const localOrders = readLocalOrders();
      const order = localOrders.find(o => o._id === id);
      if (order) {
        return res.json(order);
      }
    }

    res.status(404).json({ message: 'Order details not found' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get logged in user orders history
 * @route   GET /api/orders/myorders
 * @access  Private
 */
export const getMyOrders = async (req: any, res: any) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const orders = await Order.find({ user: req.user._id });
      res.json(orders);
    } else {
      const localOrders = readLocalOrders();
      const myOrders = localOrders.filter(o => o.user === req.user._id);
      res.json(myOrders);
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
