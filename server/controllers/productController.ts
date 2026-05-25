import mongoose from 'mongoose';
import { ProductModel } from '../models/Product.js';

// Hardcoded luxury watches list for catalog fallback if database is offline
const MOCK_PRODUCTS = [
  {
    _id: '1',
    id: '1',
    name: 'Edge Ultra-Slim',
    collection: 'Minimalist Elite',
    price: 850,
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=1000',
    description: 'Defying gravity with a profile thinner than a coin.',
    features: ['7mm Profile', 'Genuine Italian Leather', 'Rose Gold Accents']
  },
  {
    _id: '2',
    id: '2',
    name: 'The Grandmaster Chrono',
    collection: 'Masterpiece Series',
    price: 1250,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000',
    description: 'A fusion of classic watchmaking and modern aesthetics.',
    features: ['Sapphire Crystal', '10 ATM Water Resistance', 'Automatic Movement']
  },
  {
    _id: '3',
    id: '3',
    name: 'Nebula Skeleton',
    collection: 'Stellar Collection',
    price: 2400,
    image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=1000',
    description: 'Witness the heartbeat of time.',
    features: ['Skeleton Dial', 'Titanium Case', 'Self-winding']
  },
  {
    _id: '4',
    id: '4',
    name: 'DeepSea Voyager',
    collection: 'Marine Professional',
    price: 1800,
    image: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&q=80&w=1000',
    description: 'Built for the abyss.',
    features: ['30 ATM Water Resistance', 'Luminescent Hands', 'Ceramic Bezel']
  },
  {
    _id: '5',
    id: '5',
    name: 'Heritage Moonphase',
    collection: 'Vintage Luxe',
    price: 3200,
    image: 'https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?auto=format&fit=crop&q=80&w=1000',
    description: 'Trace the celestial dance.',
    features: ['Moonphase Indicator', 'Day-Date Display', '18k Gold Plating']
  },
  {
    _id: '6',
    id: '6',
    name: 'Titanium X-Racer',
    collection: 'Sport Precision',
    price: 1550,
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=1000',
    description: 'Precision in high gear.',
    features: ['Tachymeter', 'Anti-reflective Coating', 'Chronograph']
  },
  {
    _id: '7',
    id: '7',
    name: 'Aurelius Wall Clock',
    collection: 'Grand Atelier',
    price: 24500,
    image: '/titan_wall_clock.png',
    description: 'An architectural centerpiece for modern estates. Gold sweeping hands dance in absolute synchronization against a textured backdrop, bathed in soft studio lighting.',
    features: ['Double-Domed Sapphire', 'Caliber Cal-T90 Continuous Sweep', '24k Gold Hands', 'Showcase Mode']
  },
  {
    _id: '8',
    id: '8',
    name: 'Zenith Chrono Tourbillon',
    collection: 'Grand Atelier',
    price: 18500,
    image: '/zenith_tourbillon.png',
    description: 'An exquisite hand-assembled masterpiece featuring an exposed flying tourbillon and gold sweeping gears.',
    features: ['Flying Tourbillon', 'Manual Skeletonized Movement', '18k Rose Gold Case', 'Custom Engraving']
  },
  {
    _id: '9',
    id: '9',
    name: 'Vanguard Carbon Stealth',
    collection: 'Minimalist Elite',
    price: 9200,
    image: '/vanguard_stealth.png',
    description: 'A futuristic tactical timepiece forged from compressed carbon-matte alloy with electric blue highlights.',
    features: ['Forged Carbon Case', 'Electric Blue Lume', 'Double-Domed Sapphire', '300m Depth Rated']
  }
];

/**
 * @desc    Fetch all watch products
 * @route   GET /api/products
 * @access  Public
 */
export const getProducts = async (req: any, res: any) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const dbProducts = await ProductModel.find({});
      if (dbProducts && dbProducts.length > 0) {
        // Map database products to include both id and _id explicitly in JSON format
        const mappedProducts = dbProducts.map(p => {
          const obj = p.toObject();
          return { ...obj, id: p._id.toString() };
        });
        return res.json(mappedProducts);
      }
    }
    return res.json(MOCK_PRODUCTS);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Fetch a single watch product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
export const getProductById = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      const product = await ProductModel.findById(id);
      if (product) {
        return res.json({ ...product.toObject(), id: product._id.toString() });
      }
    } else {
      const product = MOCK_PRODUCTS.find(p => p._id === id || p.id === id);
      if (product) {
        return res.json(product);
      }
    }

    res.status(404).json({ message: 'Watch model not found' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Create a new watch product (Admin only)
 * @route   POST /api/products
 * @access  Private/Admin
 */
export const createProduct = async (req: any, res: any) => {
  try {
    const { name, collection, price, image, description, features } = req.body;

    if (mongoose.connection.readyState === 1) {
      const product = await ProductModel.create({
        name,
        collection,
        price,
        image,
        description,
        features
      });
      res.status(201).json({ ...product.toObject(), id: product._id.toString() });
    } else {
      const newId = 'local_prod_' + Math.random().toString(36).substring(2, 11);
      const newProduct = {
        _id: newId,
        id: newId,
        name,
        collection,
        price,
        image,
        description,
        features
      };
      MOCK_PRODUCTS.push(newProduct);
      res.status(201).json(newProduct);
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
