import express from 'express';
import { randomUUID } from 'crypto';
import { categories, productCatalog } from '../data/catalog.js';

const router = express.Router();
const orders = [];
const newsletterSubscribers = [];

function formatProduct(product) {
  return {
    ...product,
    currency: 'MAD',
    availability: product.stock > 0 ? 'in_stock' : 'out_of_stock',
  };
}

function findProduct(productId) {
  return productCatalog.find((product) => product.id === productId);
}

function calculateOrder(items) {
  return items.map((item) => {
    const product = findProduct(item.productId);
    const quantity = Number.parseInt(item.quantity, 10);

    if (!product) {
      const error = new Error(`Produit introuvable: ${item.productId}`);
      error.statusCode = 400;
      throw error;
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      const error = new Error(`Quantite invalide pour ${product.name}`);
      error.statusCode = 400;
      throw error;
    }

    if (quantity > product.stock) {
      const error = new Error(`Stock insuffisant pour ${product.name}`);
      error.statusCode = 409;
      throw error;
    }

    return {
      productId: product.id,
      name: product.name,
      quantity,
      unitPrice: product.price,
      total: product.price * quantity,
    };
  });
}

router.get('/products', (req, res) => {
  const search = String(req.query.search || '').trim().toLowerCase();
  const category = String(req.query.category || 'Tous');

  const products = productCatalog
    .filter((product) => category === 'Tous' || product.category === category)
    .filter((product) => {
      if (!search) return true;
      return [product.name, product.category, product.flavor, product.description]
        .join(' ')
        .toLowerCase()
        .includes(search);
    })
    .map(formatProduct);

  res.json({ products, categories });
});

router.get('/products/:id', (req, res) => {
  const product = findProduct(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Produit introuvable' });
  }

  return res.json(formatProduct(product));
});

router.post('/orders', (req, res) => {
  try {
    const { customer = {}, items = [] } = req.body || {};

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Le panier est vide' });
    }

    if (!customer.name || !customer.phone || !customer.city) {
      return res.status(400).json({
        error: 'Nom, telephone et ville sont obligatoires',
      });
    }

    const lines = calculateOrder(items);
    const subtotal = lines.reduce((sum, line) => sum + line.total, 0);
    const shipping = subtotal >= 500 ? 0 : 35;
    const total = subtotal + shipping;

    const order = {
      id: randomUUID(),
      reference: `KP-${Date.now().toString(36).toUpperCase()}`,
      status: 'confirmed',
      customer: {
        name: String(customer.name).trim(),
        phone: String(customer.phone).trim(),
        city: String(customer.city).trim(),
        address: String(customer.address || '').trim(),
      },
      items: lines,
      subtotal,
      shipping,
      total,
      currency: 'MAD',
      createdAt: new Date().toISOString(),
    };

    orders.unshift(order);

    return res.status(201).json({
      order,
      message: 'Commande confirmee. Kalil Protein te contactera pour la livraison.',
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
});

router.get('/orders', (req, res) => {
  res.json({ orders });
});

router.post('/newsletter', (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Email invalide' });
  }

  if (!newsletterSubscribers.includes(email)) {
    newsletterSubscribers.push(email);
  }

  return res.status(201).json({
    email,
    message: 'Inscription newsletter confirmee',
  });
});

export default router;
