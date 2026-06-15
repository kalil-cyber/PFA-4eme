import express from 'express';
import { randomUUID } from 'crypto';
import { categories, productCatalog } from '../data/catalog.js';

const router = express.Router();
const orders = [];
const newsletterSubscribers = [];
const promotions = {
  discountPercent: 20,
  freeShakerEnabled: true,
  freeShakerThreshold: 500,
  headline: 'Offre lancement: -20% sur la boutique',
  shakerLabel: 'Shaker Kalil Protein offert',
  updatedAt: new Date().toISOString(),
};

function adminCode() {
  return process.env.ADMIN_ACCESS_CODE || '0000';
}

function requireAdmin(req, res, next) {
  const providedCode = String(req.get('x-admin-code') || req.body?.adminCode || '');
  if (providedCode !== adminCode()) {
    return res.status(401).json({ error: 'Code admin invalide' });
  }
  return next();
}

function normalizePromotionSettings(input = {}) {
  const discountPercent = Number.parseInt(input.discountPercent, 10);
  const freeShakerThreshold = Number.parseInt(input.freeShakerThreshold, 10);

  return {
    discountPercent: Number.isFinite(discountPercent) ? Math.min(Math.max(discountPercent, 0), 80) : promotions.discountPercent,
    freeShakerEnabled:
      typeof input.freeShakerEnabled === 'boolean' ? input.freeShakerEnabled : promotions.freeShakerEnabled,
    freeShakerThreshold: Number.isFinite(freeShakerThreshold)
      ? Math.max(freeShakerThreshold, 0)
      : promotions.freeShakerThreshold,
    headline: String(input.headline || promotions.headline).trim().slice(0, 120),
    shakerLabel: String(input.shakerLabel || promotions.shakerLabel).trim().slice(0, 80),
  };
}

function discountPrice(price) {
  if (!promotions.discountPercent) return price;
  return Math.max(0, Math.round(price * (100 - promotions.discountPercent) / 100));
}

function formatProduct(product) {
  const salePrice = discountPrice(product.price);
  return {
    ...product,
    basePrice: product.price,
    price: salePrice,
    discountPercent: promotions.discountPercent,
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
      unitPrice: discountPrice(product.price),
      baseUnitPrice: product.price,
      discountPercent: promotions.discountPercent,
      total: discountPrice(product.price) * quantity,
    };
  });
}

function getFreeShaker(subtotal) {
  if (!promotions.freeShakerEnabled || subtotal < promotions.freeShakerThreshold) return null;
  const shaker = findProduct('kp-shaker');
  if (!shaker) return null;
  return {
    productId: shaker.id,
    name: promotions.shakerLabel,
    quantity: 1,
    unitPrice: 0,
    baseUnitPrice: shaker.price,
    total: 0,
    gift: true,
  };
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

router.get('/promotions', (req, res) => {
  res.json({ promotions });
});

router.get('/admin/promotions', requireAdmin, (req, res) => {
  res.json({ promotions });
});

router.put('/admin/promotions', requireAdmin, (req, res) => {
  Object.assign(promotions, normalizePromotionSettings(req.body), {
    updatedAt: new Date().toISOString(),
  });

  res.json({
    promotions,
    message: 'Promotions mises a jour',
  });
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
    const freeShaker = getFreeShaker(subtotal);
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
      items: freeShaker ? [...lines, freeShaker] : lines,
      subtotal,
      shipping,
      total,
      discountPercent: promotions.discountPercent,
      freeShakerIncluded: Boolean(freeShaker),
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

router.get('/orders', requireAdmin, (req, res) => {
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
