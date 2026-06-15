import { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  Minus,
  Plus,
  Search,
  ShieldCheck,
  ShoppingCart,
  Star,
  Trash2,
  Truck,
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const currencyFormatter = new Intl.NumberFormat('fr-MA', {
  style: 'currency',
  currency: 'MAD',
  maximumFractionDigits: 0,
});

const fallbackProducts = [
  {
    id: 'kp-whey-vanilla',
    name: 'Whey Protein Vanille',
    category: 'Proteines',
    price: 349,
    oldPrice: 399,
    rating: 4.8,
    stock: 28,
    badge: 'Best seller',
    flavor: 'Vanille',
    weight: '2 kg',
    protein: '24 g / dose',
    image: 'WHEY',
    description: 'Whey premium pour la prise de muscle, facile a melanger et ideale apres l entrainement.',
  },
  {
    id: 'kp-isolate',
    name: 'Isolate Zero Sugar',
    category: 'Proteines',
    price: 499,
    oldPrice: 549,
    rating: 4.9,
    stock: 14,
    badge: 'Premium',
    flavor: 'Cookies',
    weight: '1.8 kg',
    protein: '27 g / dose',
    image: 'ISO',
    description: 'Isolat de whey faible en lactose et sans sucre ajoute, concu pour les sportifs exigeants.',
  },
  {
    id: 'kp-creatine',
    name: 'Creatine Monohydrate',
    category: 'Performance',
    price: 179,
    oldPrice: 219,
    rating: 4.8,
    stock: 42,
    badge: 'Essentiel',
    flavor: 'Neutre',
    weight: '300 g',
    protein: '5 g / dose',
    image: 'CREA',
    description: 'Creatine micronisee pour ameliorer la force, la puissance et les performances explosives.',
  },
];

function formatPrice(value) {
  return currencyFormatter.format(value);
}

function ProductCard({ product, onAdd }) {
  return (
    <article className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-2xl">
      <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-900 p-6 text-white">
        <span className="rounded-full bg-emerald-400 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-slate-950">
          {product.badge}
        </span>
        <div className="mt-8 flex h-36 items-center justify-center rounded-3xl border border-white/10 bg-white/10 text-4xl font-black tracking-tight">
          {product.image}
        </div>
      </div>

      <div className="space-y-4 p-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">{product.category}</p>
          <h3 className="mt-2 text-xl font-black text-slate-950">{product.name}</h3>
          <p className="mt-2 min-h-12 text-sm leading-6 text-slate-600">{product.description}</p>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center text-sm">
          <div className="rounded-2xl bg-slate-50 p-3">
            <p className="font-bold text-slate-950">{product.weight}</p>
            <p className="text-xs text-slate-500">Format</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-3">
            <p className="font-bold text-slate-950">{product.protein}</p>
            <p className="text-xs text-slate-500">Dose</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-3">
            <p className="font-bold text-slate-950">{product.flavor}</p>
            <p className="text-xs text-slate-500">Gout</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-amber-500">
              <Star className="h-4 w-4 fill-current" />
              <span className="text-sm font-bold text-slate-700">{product.rating}</span>
            </div>
            <p className="text-xs text-slate-500">{product.stock} en stock</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-slate-950">{formatPrice(product.price)}</p>
            <p className="text-sm text-slate-400 line-through">{formatPrice(product.oldPrice)}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onAdd(product)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-4 font-bold text-white transition hover:bg-emerald-600"
        >
          <ShoppingCart className="h-5 w-5" />
          Ajouter au panier
        </button>
      </div>
    </article>
  );
}

function CartLine({ item, onIncrement, onDecrement, onRemove }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-bold text-slate-950">{item.name}</p>
          <p className="text-sm text-slate-500">{formatPrice(item.price)} / unite</p>
        </div>
        <button type="button" onClick={() => onRemove(item.id)} className="rounded-full p-2 text-slate-400 hover:bg-red-50 hover:text-red-500">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center rounded-full border border-slate-200">
          <button type="button" onClick={() => onDecrement(item.id)} className="p-2 text-slate-600 hover:text-slate-950">
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-10 text-center font-bold">{item.quantity}</span>
          <button type="button" onClick={() => onIncrement(item.id)} className="p-2 text-slate-600 hover:text-slate-950">
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <p className="font-black text-slate-950">{formatPrice(item.price * item.quantity)}</p>
      </div>
    </div>
  );
}

export default function App() {
  const [products, setProducts] = useState(fallbackProducts);
  const [categories, setCategories] = useState(['Tous', 'Proteines', 'Performance', 'Accessoires']);
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState({ name: '', phone: '', city: '', address: '' });
  const [orderStatus, setOrderStatus] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');

  useEffect(() => {
    const params = new URLSearchParams();
    if (activeCategory !== 'Tous') params.set('category', activeCategory);
    if (search) params.set('search', search);

    fetch(`${API_URL}/api/products?${params.toString()}`)
      .then((response) => {
        if (!response.ok) throw new Error('API indisponible');
        return response.json();
      })
      .then((data) => {
        setProducts(data.products || []);
        setCategories(data.categories || categories);
      })
      .catch(() => {
        const normalizedSearch = search.trim().toLowerCase();
        setProducts(
          fallbackProducts.filter((product) => {
            const matchCategory = activeCategory === 'Tous' || product.category === activeCategory;
            const matchSearch =
              !normalizedSearch ||
              [product.name, product.category, product.flavor, product.description]
                .join(' ')
                .toLowerCase()
                .includes(normalizedSearch);
            return matchCategory && matchSearch;
          })
        );
      });
  }, [activeCategory, search]);

  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);
  const shipping = subtotal === 0 || subtotal >= 500 ? 0 : 35;
  const total = subtotal + shipping;

  function addToCart(product) {
    setOrderStatus(null);
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.id === product.id ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) } : item
        );
      }
      return [...current, { id: product.id, name: product.name, price: product.price, quantity: 1 }];
    });
  }

  function updateQuantity(productId, delta) {
    setCart((current) =>
      current
        .map((item) => (item.id === productId ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0)
    );
  }

  function submitOrder(event) {
    event.preventDefault();
    setOrderStatus({ type: 'loading', message: 'Validation de la commande...' });

    fetch(`${API_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer,
        items: cart.map((item) => ({ productId: item.id, quantity: item.quantity })),
      }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Commande impossible');
        return data;
      })
      .then((data) => {
        setOrderStatus({
          type: 'success',
          message: `Commande ${data.order.reference} confirmee. Total: ${formatPrice(data.order.total)}.`,
        });
        setCart([]);
        setCustomer({ name: '', phone: '', city: '', address: '' });
      })
      .catch((error) => {
        setOrderStatus({ type: 'error', message: error.message });
      });
  }

  function subscribeNewsletter(event) {
    event.preventDefault();
    fetch(`${API_URL}/api/newsletter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: newsletterEmail }),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Email invalide');
        setNewsletterEmail('');
        setOrderStatus({ type: 'success', message: 'Inscription newsletter confirmee.' });
      })
      .catch((error) => setOrderStatus({ type: 'error', message: error.message }));
  }

  return (
    <div className="min-h-screen bg-[#f7f3ea] text-slate-950">
      <header className="sticky top-0 z-40 border-b border-white/30 bg-[#f7f3ea]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a href="#accueil" className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-lg font-black text-emerald-300">
              KP
            </span>
            <span>
              <span className="block text-xl font-black tracking-tight">Kalil Protein</span>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">Shop fitness</span>
            </span>
          </a>
          <nav className="hidden items-center gap-8 text-sm font-bold text-slate-700 md:flex">
            <a href="#produits" className="hover:text-emerald-700">Produits</a>
            <a href="#avantages" className="hover:text-emerald-700">Avantages</a>
            <a href="#commande" className="hover:text-emerald-700">Commande</a>
          </nav>
          <a href="#panier" className="flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white">
            <ShoppingCart className="h-4 w-4" />
            {cart.reduce((sum, item) => sum + item.quantity, 0)}
          </a>
        </div>
      </header>

      <main>
        <section id="accueil" className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.25),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(15,23,42,0.18),_transparent_35%)]" />
          <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-28">
            <div className="flex flex-col justify-center">
              <p className="w-fit rounded-full bg-white px-4 py-2 text-sm font-bold uppercase tracking-[0.25em] text-emerald-700 shadow-sm">
                Proteines - performance - accessoires
              </p>
              <h1 className="mt-8 max-w-4xl text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
                La boutique nutrition qui pousse tes objectifs plus loin.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
                Kalil Protein vend des produits sportifs selectionnes pour la prise de masse, la recuperation,
                la force et le quotidien des athletes.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <a href="#produits" className="rounded-full bg-emerald-500 px-8 py-4 text-center font-black text-slate-950 shadow-xl shadow-emerald-500/20 transition hover:bg-emerald-400">
                  Voir la boutique
                </a>
                <a href="#commande" className="rounded-full border border-slate-300 bg-white px-8 py-4 text-center font-black text-slate-950 transition hover:border-slate-950">
                  Commander maintenant
                </a>
              </div>
            </div>

            <div className="rounded-[2.5rem] bg-slate-950 p-6 text-white shadow-2xl">
              <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-emerald-500/25 to-white/5 p-8">
                <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-300">Pack champion</p>
                <div className="mt-8 flex h-72 items-center justify-center rounded-[2rem] bg-white/10 text-6xl font-black tracking-tight">
                  KP
                </div>
                <div className="mt-8 grid grid-cols-3 gap-3">
                  {['Whey', 'Creatine', 'BCAA'].map((label) => (
                    <div key={label} className="rounded-2xl bg-white/10 p-4 text-center">
                      <p className="font-black">{label}</p>
                      <p className="text-xs text-slate-300">Disponible</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="avantages" className="mx-auto grid max-w-7xl gap-4 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
          {[
            { icon: Truck, title: 'Livraison rapide', text: 'Expedition a Casablanca et partout au Maroc.' },
            { icon: ShieldCheck, title: 'Produits verifies', text: 'Selection orientee qualite, gout et performance.' },
            { icon: CheckCircle2, title: 'Commande simple', text: 'Panier, formulaire, confirmation et suivi client.' },
          ].map((feature) => (
            <div key={feature.title} className="rounded-3xl bg-white p-6 shadow-sm">
              <feature.icon className="h-8 w-8 text-emerald-600" />
              <h2 className="mt-4 text-xl font-black">{feature.title}</h2>
              <p className="mt-2 text-slate-600">{feature.text}</p>
            </div>
          ))}
        </section>

        <section id="produits" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="font-bold uppercase tracking-[0.25em] text-emerald-700">Catalogue</p>
              <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Nos produits</h2>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="flex min-w-72 items-center gap-3 rounded-full border border-slate-200 bg-white px-5 py-3 shadow-sm">
                <Search className="h-5 w-5 text-slate-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Rechercher un produit"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </label>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-5 py-3 text-sm font-bold transition ${
                  activeCategory === category
                    ? 'bg-slate-950 text-white'
                    : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-950'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onAdd={addToCart} />
            ))}
          </div>
        </section>

        <section id="commande" className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <aside id="panier" className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-300">Panier</p>
                <h2 className="mt-2 text-3xl font-black">Ta commande</h2>
              </div>
              <ShoppingCart className="h-8 w-8 text-emerald-300" />
            </div>

            <div className="mt-6 space-y-4 text-slate-950">
              {cart.length === 0 ? (
                <div className="rounded-2xl bg-white/10 p-6 text-center text-white">
                  <p className="font-bold">Ton panier est vide.</p>
                  <p className="mt-2 text-sm text-slate-300">Ajoute un produit pour commencer.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <CartLine
                    key={item.id}
                    item={item}
                    onIncrement={(id) => updateQuantity(id, 1)}
                    onDecrement={(id) => updateQuantity(id, -1)}
                    onRemove={(id) => setCart((current) => current.filter((line) => line.id !== id))}
                  />
                ))
              )}
            </div>

            <div className="mt-6 space-y-3 rounded-3xl bg-white/10 p-5">
              <div className="flex justify-between text-slate-200">
                <span>Sous-total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-200">
                <span>Livraison</span>
                <span>{shipping === 0 ? 'Gratuite' : formatPrice(shipping)}</span>
              </div>
              <div className="border-t border-white/10 pt-3">
                <div className="flex justify-between text-2xl font-black">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <p className="mt-2 text-sm text-emerald-300">Livraison gratuite a partir de 500 MAD.</p>
              </div>
            </div>
          </aside>

          <div className="rounded-[2rem] bg-white p-6 shadow-sm">
            <p className="font-bold uppercase tracking-[0.25em] text-emerald-700">Informations client</p>
            <h2 className="mt-3 text-3xl font-black">Finaliser la commande</h2>
            <form onSubmit={submitOrder} className="mt-6 grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  required
                  value={customer.name}
                  onChange={(event) => setCustomer({ ...customer, name: event.target.value })}
                  placeholder="Nom complet"
                  className="rounded-2xl border border-slate-200 px-4 py-4 outline-none focus:border-emerald-500"
                />
                <input
                  required
                  value={customer.phone}
                  onChange={(event) => setCustomer({ ...customer, phone: event.target.value })}
                  placeholder="Telephone"
                  className="rounded-2xl border border-slate-200 px-4 py-4 outline-none focus:border-emerald-500"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  required
                  value={customer.city}
                  onChange={(event) => setCustomer({ ...customer, city: event.target.value })}
                  placeholder="Ville"
                  className="rounded-2xl border border-slate-200 px-4 py-4 outline-none focus:border-emerald-500"
                />
                <input
                  value={customer.address}
                  onChange={(event) => setCustomer({ ...customer, address: event.target.value })}
                  placeholder="Adresse de livraison"
                  className="rounded-2xl border border-slate-200 px-4 py-4 outline-none focus:border-emerald-500"
                />
              </div>
              <button
                type="submit"
                disabled={cart.length === 0 || orderStatus?.type === 'loading'}
                className="rounded-2xl bg-emerald-500 px-6 py-4 font-black text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
              >
                Confirmer la commande
              </button>
            </form>

            {orderStatus && (
              <div
                className={`mt-5 rounded-2xl p-4 font-semibold ${
                  orderStatus.type === 'error'
                    ? 'bg-red-50 text-red-700'
                    : orderStatus.type === 'success'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-slate-50 text-slate-700'
                }`}
              >
                {orderStatus.message}
              </div>
            )}

            <form onSubmit={subscribeNewsletter} className="mt-8 rounded-3xl bg-slate-50 p-5">
              <h3 className="text-xl font-black">Offres et promos</h3>
              <p className="mt-2 text-sm text-slate-600">Recois les packs, remises et nouveaux produits Kalil Protein.</p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(event) => setNewsletterEmail(event.target.value)}
                  placeholder="email@example.com"
                  className="min-w-0 flex-1 rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
                />
                <button type="submit" className="rounded-2xl bg-slate-950 px-6 py-3 font-bold text-white">
                  S inscrire
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-sm text-slate-600 sm:px-6 lg:px-8">
          <p className="font-black text-slate-950">Kalil Protein</p>
          <p>Projet e-commerce de vente de proteines, complements sportifs et accessoires fitness.</p>
        </div>
      </footer>
    </div>
  );
}