import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  CreditCard,
  Dumbbell,
  Gift,
  Headphones,
  Lock,
  Minus,
  Phone,
  Plus,
  Save,
  Search,
  ShieldCheck,
  ShoppingCart,
  Star,
  Trash2,
  Truck,
  Zap,
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const WHATSAPP_PHONE = '224625911265';
const DISPLAY_PHONE = '+224 625 911 265';

const currencyFormatter = new Intl.NumberFormat('fr-GN', {
  maximumFractionDigits: 0,
});

const fallbackProducts = [
  {
    id: 'serious-mass-272',
    name: 'Serious Mass',
    category: 'Gainers',
    price: 1100000,
    oldPrice: 1250000,
    rating: 4.8,
    stock: 28,
    badge: 'Prise de masse',
    flavor: 'Chocolat',
    weight: '2,72 kg',
    protein: '50 g proteines',
    image: 'MASS',
    accent: 'green',
    description: 'Gainer Serious Mass pour prise de masse, calories elevees et construction musculaire.',
  },
  {
    id: 'serious-mass-54',
    name: 'Serious Mass',
    category: 'Gainers',
    price: 2000000,
    oldPrice: 2200000,
    rating: 4.7,
    stock: 19,
    badge: 'Grand format',
    flavor: 'Chocolat',
    weight: '5,4 kg',
    protein: '50 g proteines',
    image: 'MASS',
    accent: 'green',
    description: 'Grand sac Serious Mass pour cycles prise de masse avec shaker gratuit.',
  },
  {
    id: 'gold-whey-907',
    name: 'Gold Standard Whey',
    category: 'Proteines',
    price: 750000,
    oldPrice: 850000,
    rating: 4.9,
    stock: 14,
    badge: 'Whey premium',
    flavor: 'Double riche chocolat',
    weight: '907 g',
    protein: '24 g proteines',
    image: 'WHEY',
    accent: 'red',
    description: 'Whey Gold Standard pour recuperation rapide, force et performance.',
  },
  {
    id: 'gold-whey-158',
    name: 'Gold Standard Whey',
    category: 'Proteines',
    price: 1350000,
    oldPrice: 1500000,
    rating: 4.8,
    stock: 42,
    badge: 'Format XL',
    flavor: 'Double riche chocolat',
    weight: '1,58 kg',
    protein: '24 g proteines',
    image: 'WHEY',
    accent: 'red',
    description: 'Format superieur Gold Standard Whey, ideal musculation et recuperation.',
  },
  {
    id: 'nitro-tech-907',
    name: 'Nitro Tech Whey',
    category: 'Proteines',
    price: 800000,
    oldPrice: 900000,
    rating: 4.6,
    stock: 31,
    badge: 'Performance',
    flavor: 'Strawberry shortcake',
    weight: '907 g',
    protein: '24 g proteines',
    image: 'NITRO',
    accent: 'red',
    description: 'Whey MuscleTech Nitro Tech pour force, performance et construction musculaire.',
  },
  {
    id: 'cell-tech-creatine',
    name: 'Cell Tech Creatine',
    category: 'Creatine',
    price: 750000,
    oldPrice: 850000,
    rating: 4.5,
    stock: 24,
    badge: 'Force',
    flavor: 'Fruit punch',
    weight: '1,36 kg',
    protein: '10 g creatine',
    image: 'CELL',
    accent: 'blue',
    description: 'Creatine Cell Tech pour puissance, force et seances explosives.',
  },
  {
    id: 'creatine-orgain',
    name: 'Creatine Orgain',
    category: 'Creatine',
    price: 500000,
    oldPrice: 600000,
    rating: 4.6,
    stock: 35,
    badge: '100% original',
    flavor: 'Non aromatise',
    weight: '317 g',
    protein: '5 g creatine',
    image: 'CREATINE',
    accent: 'blue',
    description: 'Creatine monohydrate pour ameliorer la force et la progression musculaire.',
  },
  {
    id: 'pack-prise-masse',
    name: 'Pack Prise de Masse',
    category: 'Packs',
    price: 1400000,
    oldPrice: 1600000,
    rating: 4.9,
    stock: 12,
    badge: 'Pack promo',
    flavor: 'Serious Mass + Creatine',
    weight: 'Pack complet',
    protein: 'Shaker inclus',
    image: 'PACK MASS',
    accent: 'yellow',
    description: 'Serious Mass 2,72 kg + Creatine Orgain 317 g + shaker gratuit.',
  },
  {
    id: 'pack-musculation',
    name: 'Pack Musculation',
    category: 'Packs',
    price: 1600000,
    oldPrice: 1800000,
    rating: 4.9,
    stock: 10,
    badge: 'Pack premium',
    flavor: 'Whey + Creatine',
    weight: 'Pack complet',
    protein: 'Shaker inclus',
    image: 'PACK WHEY',
    accent: 'yellow',
    description: 'Gold Standard Whey 907 g + Creatine Orgain 317 g + shaker gratuit.',
  },
];

const defaultPromotions = {
  discountPercent: 0,
  freeShakerEnabled: true,
  freeShakerThreshold: 0,
  headline: 'Shaker gratuit avec chaque achat',
  shakerLabel: 'Shaker Kalil Nutrition gratuit',
};

function formatPrice(value) {
  return `${currencyFormatter.format(Number(value) || 0)} GNF`;
}

function BrandLogo({ compact = false }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-16 w-14 items-center justify-center bg-[#ffcc15] text-black shadow-[0_0_24px_rgba(255,204,21,0.35)] clip-shield">
        <div className="absolute inset-[3px] bg-black clip-shield" />
        <div className="relative text-center leading-none">
          <Dumbbell className="mx-auto h-6 w-6 text-white" />
          <span className="block text-[10px] font-black text-white">KALIL</span>
          <span className="block text-[9px] font-black text-[#ffcc15]">NUTRITION</span>
        </div>
      </div>
      {!compact && (
        <div className="leading-none">
          <p className="text-2xl font-black uppercase tracking-tight text-white">Kalil</p>
          <p className="-mt-1 text-xl font-black uppercase italic text-[#ffcc15]">Nutrition</p>
        </div>
      )}
    </div>
  );
}

function ProductVisual({ product }) {
  const accentClass = {
    green: 'from-[#1c8b30] to-[#9cff5a]',
    red: 'from-[#b80012] to-[#ff3838]',
    blue: 'from-[#003d99] to-[#1d8cff]',
    yellow: 'from-[#ffb400] to-[#fff06a]',
  }[product.accent || 'red'];

  return (
    <div className="relative mx-auto flex h-48 w-36 items-end justify-center">
      <div className="absolute top-0 h-5 w-24 rounded-t-full bg-zinc-950 ring-2 ring-zinc-700" />
      <div className="h-44 w-32 overflow-hidden rounded-[1.8rem] border border-zinc-700 bg-gradient-to-b from-zinc-950 via-zinc-900 to-black shadow-2xl">
        <div className={`h-16 bg-gradient-to-r ${accentClass} opacity-90`} />
        <div className="px-3 py-3 text-center">
          <p className="text-[10px] font-black uppercase text-zinc-300">Kalil Nutrition</p>
          <p className="mt-1 text-2xl font-black uppercase leading-none text-white">{product.image}</p>
          <p className="mt-2 text-[11px] font-black uppercase text-[#ffcc15]">{product.weight}</p>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product, onAdd, promotions }) {
  const discountPercent = product.discountPercent ?? promotions.discountPercent ?? 0;
  const basePrice = product.basePrice || product.oldPrice || product.price;

  return (
    <article className="group overflow-hidden rounded-2xl border border-[#ffcc15]/45 bg-[#070707] shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_18px_45px_rgba(0,0,0,0.65)] transition hover:-translate-y-1 hover:border-[#ffcc15]">
      <div className="relative border-b border-[#ffcc15]/30 bg-[radial-gradient(circle_at_top,rgba(255,204,21,0.20),transparent_40%),linear-gradient(135deg,#121212,#000)] p-4">
        <div className="flex items-start justify-between gap-3">
          <span className={`paint-stroke paint-${product.accent || 'red'} px-4 py-2 text-xs font-black uppercase text-white`}>
            {product.name}
          </span>
          {discountPercent > 0 && (
            <span className="rounded-full bg-[#e60012] px-3 py-1 text-xs font-black text-white">-{discountPercent}%</span>
          )}
        </div>
        <ProductVisual product={product} />
        <div className="absolute bottom-3 left-3 rounded-full bg-[#ffcc15] px-3 py-1 text-xs font-black uppercase text-black">
          Shaker gratuit
        </div>
      </div>

      <div className="space-y-4 p-4">
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="rounded-xl border border-white/10 bg-white/5 p-2">
            <p className="font-black text-white">{product.weight}</p>
            <p className="text-zinc-500">Format</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-2">
            <p className="font-black text-white">{product.protein}</p>
            <p className="text-zinc-500">Dose</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-2">
            <p className="font-black text-white">{product.flavor}</p>
            <p className="text-zinc-500">Gout</p>
          </div>
        </div>

        <p className="min-h-12 text-sm leading-6 text-zinc-300">{product.description}</p>

        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1 text-[#ffcc15]">
              <Star className="h-4 w-4 fill-current" />
              <span className="text-sm font-black">{product.rating}</span>
            </div>
            <p className="text-xs font-bold uppercase text-emerald-400">{product.stock} en stock</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-[#ffcc15]">{formatPrice(product.price)}</p>
            {basePrice > product.price && <p className="text-sm text-red-400 line-through">{formatPrice(basePrice)}</p>}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onAdd(product)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#e60012] px-5 py-4 font-black uppercase text-white shadow-[0_10px_30px_rgba(230,0,18,0.35)] transition hover:bg-[#ffcc15] hover:text-black"
        >
          <ShoppingCart className="h-5 w-5" />
          Acheter en ligne
        </button>
      </div>
    </article>
  );
}

function CartLine({ item, onIncrement, onDecrement, onRemove }) {
  return (
    <div className="rounded-xl border border-[#ffcc15]/30 bg-black/60 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-black text-white">{item.name}</p>
          <p className="text-sm text-zinc-400">{formatPrice(item.price)} / unite</p>
        </div>
        <button type="button" onClick={() => onRemove(item.id)} className="rounded-full p-2 text-zinc-500 hover:bg-red-500/20 hover:text-red-300">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center rounded-full border border-white/15">
          <button type="button" onClick={() => onDecrement(item.id)} className="p-2 text-zinc-300 hover:text-[#ffcc15]">
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-10 text-center font-black text-white">{item.quantity}</span>
          <button type="button" onClick={() => onIncrement(item.id)} className="p-2 text-zinc-300 hover:text-[#ffcc15]">
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <p className="font-black text-[#ffcc15]">{formatPrice(item.price * item.quantity)}</p>
      </div>
    </div>
  );
}

function AdminPanel() {
  const [adminCode, setAdminCode] = useState('');
  const [settings, setSettings] = useState(defaultPromotions);
  const [status, setStatus] = useState(null);
  const [isUnlocked, setIsUnlocked] = useState(false);

  function loadPromotions(code) {
    setStatus({ type: 'loading', message: 'Chargement des promotions...' });
    fetch(`${API_URL}/api/admin/promotions`, { headers: { 'x-admin-code': code } })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Code admin invalide');
        return data;
      })
      .then((data) => {
        setSettings(data.promotions || defaultPromotions);
        setIsUnlocked(true);
        setStatus({ type: 'success', message: 'Admin ouvert. Tu peux modifier les offres.' });
      })
      .catch((error) => setStatus({ type: 'error', message: error.message }));
  }

  function savePromotions(event) {
    event.preventDefault();
    setStatus({ type: 'loading', message: 'Sauvegarde en cours...' });
    fetch(`${API_URL}/api/admin/promotions`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-admin-code': adminCode },
      body: JSON.stringify(settings),
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Sauvegarde impossible');
        return data;
      })
      .then((data) => {
        setSettings(data.promotions);
        setStatus({ type: 'success', message: 'Promotions sauvegardees.' });
      })
      .catch((error) => setStatus({ type: 'error', message: error.message }));
  }

  return (
    <div className="min-h-screen bg-black px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <a href="/" className="inline-flex items-center gap-2 rounded-full border border-[#ffcc15]/40 bg-[#ffcc15]/10 px-4 py-2 text-sm font-black text-[#ffcc15]">
          <ArrowLeft className="h-4 w-4" />
          Retour boutique
        </a>

        <div className="mt-8 rounded-3xl border border-[#ffcc15]/40 bg-[#0b0b0b] p-6 shadow-[0_0_60px_rgba(255,204,21,0.12)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-[#ffcc15]">Admin Kalil Nutrition</p>
              <h1 className="mt-2 text-4xl font-black uppercase italic">Promotions boutique</h1>
              <p className="mt-3 max-w-2xl text-zinc-300">
                Modifie les reductions, le shaker gratuit et le texte affiche aux clients.
              </p>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e60012] text-white">
              <Lock className="h-8 w-8" />
            </div>
          </div>

          {!isUnlocked ? (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                loadPromotions(adminCode);
              }}
              className="mt-8 grid gap-4 rounded-2xl border border-white/10 bg-black p-5"
            >
              <label className="text-sm font-black text-zinc-200">Code admin</label>
              <input
                type="password"
                value={adminCode}
                onChange={(event) => setAdminCode(event.target.value)}
                placeholder="Ex: 0000"
                className="rounded-xl border border-[#ffcc15]/40 bg-white px-4 py-4 text-black outline-none focus:border-[#ffcc15]"
              />
              <button type="submit" className="rounded-xl bg-[#ffcc15] px-6 py-4 font-black uppercase text-black">
                Entrer dans admin
              </button>
            </form>
          ) : (
            <form onSubmit={savePromotions} className="mt-8 grid gap-5 rounded-2xl border border-white/10 bg-black p-5">
              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-black text-zinc-200">Reduction globale (%)</span>
                  <input
                    type="number"
                    min="0"
                    max="80"
                    value={settings.discountPercent}
                    onChange={(event) => setSettings({ ...settings, discountPercent: event.target.value })}
                    className="rounded-xl border border-[#ffcc15]/40 bg-white px-4 py-4 text-black outline-none"
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-black text-zinc-200">Seuil shaker gratuit (GNF)</span>
                  <input
                    type="number"
                    min="0"
                    value={settings.freeShakerThreshold}
                    onChange={(event) => setSettings({ ...settings, freeShakerThreshold: event.target.value })}
                    className="rounded-xl border border-[#ffcc15]/40 bg-white px-4 py-4 text-black outline-none"
                  />
                </label>
              </div>

              <label className="flex items-center gap-3 rounded-xl border border-[#ffcc15]/30 bg-[#ffcc15]/10 p-4">
                <input
                  type="checkbox"
                  checked={settings.freeShakerEnabled}
                  onChange={(event) => setSettings({ ...settings, freeShakerEnabled: event.target.checked })}
                  className="h-5 w-5 accent-[#ffcc15]"
                />
                <span className="font-black">Activer le shaker gratuit</span>
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-black text-zinc-200">Texte du bandeau</span>
                <input
                  value={settings.headline}
                  onChange={(event) => setSettings({ ...settings, headline: event.target.value })}
                  className="rounded-xl border border-[#ffcc15]/40 bg-white px-4 py-4 text-black outline-none"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-black text-zinc-200">Nom du cadeau</span>
                <input
                  value={settings.shakerLabel}
                  onChange={(event) => setSettings({ ...settings, shakerLabel: event.target.value })}
                  className="rounded-xl border border-[#ffcc15]/40 bg-white px-4 py-4 text-black outline-none"
                />
              </label>

              <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#e60012] px-6 py-4 font-black uppercase text-white">
                <Save className="h-5 w-5" />
                Sauvegarder
              </button>
            </form>
          )}

          {status && (
            <div className={`mt-5 rounded-xl p-4 font-bold ${status.type === 'error' ? 'bg-red-500/20 text-red-200' : 'bg-[#ffcc15]/10 text-[#ffcc15]'}`}>
              {status.message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const isAdminPage = window.location.pathname === '/admin';
  const [products, setProducts] = useState(fallbackProducts);
  const [categories, setCategories] = useState(['Tous', 'Gainers', 'Proteines', 'Creatine', 'Packs', 'Accessoires']);
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState({ name: '', phone: '', city: '', address: '' });
  const [orderStatus, setOrderStatus] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [promotions, setPromotions] = useState(defaultPromotions);

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

  useEffect(() => {
    fetch(`${API_URL}/api/promotions`)
      .then((response) => {
        if (!response.ok) throw new Error('Promotions indisponibles');
        return response.json();
      })
      .then((data) => setPromotions(data.promotions || defaultPromotions))
      .catch(() => setPromotions(defaultPromotions));
  }, []);

  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);
  const baseSubtotal = useMemo(
    () => cart.reduce((sum, item) => sum + (item.basePrice || item.price) * item.quantity, 0),
    [cart]
  );
  const discountAmount = Math.max(0, baseSubtotal - subtotal);
  const shipping = 0;
  const freeShakerIncluded = Boolean(promotions.freeShakerEnabled && subtotal >= Number(promotions.freeShakerThreshold || 0) && cart.length > 0);
  const total = subtotal + shipping;

  if (isAdminPage) {
    return <AdminPanel />;
  }

  function addToCart(product) {
    setOrderStatus(null);
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.id === product.id ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) } : item
        );
      }
      return [
        ...current,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          basePrice: product.basePrice || product.oldPrice || product.price,
          quantity: 1,
        },
      ];
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
        const text = encodeURIComponent(
          `Bonjour Kalil Nutrition, je viens de commander ${data.order.reference} pour ${formatPrice(data.order.total)}. Nom: ${data.order.customer.name}, ville: ${data.order.customer.city}.`
        );
        setOrderStatus({
          type: 'success',
          message: `Commande ${data.order.reference} confirmee. Cliquez WhatsApp pour finaliser.`,
          whatsapp: `https://wa.me/${WHATSAPP_PHONE}?text=${text}`,
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
        setOrderStatus({ type: 'success', message: 'Inscription aux offres confirmee.' });
      })
      .catch((error) => setOrderStatus({ type: 'error', message: error.message }));
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-50 border-b border-[#ffcc15]/20 bg-black/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <a href="#accueil" className="flex items-center gap-3">
            <BrandLogo />
          </a>
          <nav className="hidden items-center gap-7 text-sm font-black uppercase text-zinc-200 md:flex">
            <a href="#produits" className="hover:text-[#ffcc15]">Produits</a>
            <a href="#packs" className="hover:text-[#ffcc15]">Packs</a>
            <a href="#commande" className="hover:text-[#ffcc15]">Commande</a>
            <a href="/admin" className="hover:text-[#ffcc15]">Admin</a>
          </nav>
          <a href="#panier" className="flex items-center gap-2 rounded-full bg-[#e60012] px-5 py-3 text-sm font-black text-white">
            <ShoppingCart className="h-4 w-4" />
            {cart.reduce((sum, item) => sum + item.quantity, 0)}
          </a>
        </div>
      </header>

      <main>
        <section id="accueil" className="relative overflow-hidden border-b border-[#ffcc15]/20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(230,0,18,0.28),transparent_32%),radial-gradient(circle_at_85%_15%,rgba(255,204,21,0.22),transparent_32%),linear-gradient(135deg,#090909,#000)]" />
          <div className="absolute inset-0 opacity-[0.08] poster-grid" />

          <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
            <div>
              <div className="inline-flex rounded-full border border-[#ffcc15]/40 bg-[#ffcc15]/10 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-[#ffcc15]">
                Prise de masse - construction musculaire - performance
              </div>
              <h1 className="mt-6 text-6xl font-black uppercase italic leading-[0.85] tracking-tight text-white sm:text-7xl lg:text-8xl">
                Kalil
                <span className="block text-[#ffcc15]">Nutrition</span>
              </h1>
              <div className="mt-5 w-fit -skew-x-12 bg-[#e60012] px-6 py-3 shadow-[0_12px_35px_rgba(230,0,18,0.35)]">
                <p className="skew-x-12 text-lg font-black uppercase text-white">Booste ton corps, realise tes objectifs !</p>
              </div>

              <div className="mt-6 rounded-2xl border border-[#ffcc15]/50 bg-black/70 p-4 shadow-[0_0_40px_rgba(255,204,21,0.12)]">
                <div className="flex flex-wrap items-center gap-3">
                  <Gift className="h-6 w-6 text-[#ffcc15]" />
                  <p className="text-xl font-black uppercase text-[#ffcc15]">{promotions.headline}</p>
                  <span className="rounded-full bg-[#e60012] px-3 py-1 text-xs font-black uppercase text-white">Vente en ligne</span>
                </div>
                <p className="mt-2 text-sm font-bold uppercase text-zinc-300">
                  Livraison partout en Guinee - Paiement securise Orange Money / Wave
                </p>
              </div>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <a href="#produits" className="rounded-xl bg-[#ffcc15] px-8 py-4 text-center font-black uppercase text-black shadow-[0_15px_35px_rgba(255,204,21,0.25)]">
                  Acheter maintenant
                </a>
                <a href={`https://wa.me/${WHATSAPP_PHONE}`} className="rounded-xl border border-[#ffcc15]/50 bg-black px-8 py-4 text-center font-black uppercase text-[#ffcc15]">
                  WhatsApp {DISPLAY_PHONE}
                </a>
              </div>
            </div>

            <div className="relative rounded-[2rem] border border-[#ffcc15]/45 bg-[#070707] p-5 shadow-[0_0_80px_rgba(255,204,21,0.12)]">
              <div className="absolute -right-5 -top-5 flex h-36 w-36 rotate-12 items-center justify-center rounded-full border-4 border-[#e60012] bg-[#e60012] text-center text-xl font-black uppercase leading-none text-white shadow-2xl">
                Shaker
                <br />
                Gratuit
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-[linear-gradient(135deg,#151515,#000)] p-6">
                <p className="font-black uppercase tracking-[0.25em] text-[#ffcc15]">Pack Champion</p>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <ProductVisual product={{ image: 'MASS', weight: '2,72 KG', accent: 'green' }} />
                  <ProductVisual product={{ image: 'WHEY', weight: '907 G', accent: 'red' }} />
                </div>
                <div className="mt-6 grid grid-cols-4 gap-2 text-center text-xs font-black uppercase">
                  {[
                    ['Masse', Dumbbell],
                    ['Muscle', ShieldCheck],
                    ['Force', Zap],
                    ['Recup', Star],
                  ].map(([label, Icon]) => (
                    <div key={label} className="rounded-xl border border-[#ffcc15]/25 bg-[#ffcc15]/10 p-3">
                      <Icon className="mx-auto h-5 w-5 text-[#ffcc15]" />
                      <p className="mt-2 text-white">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-4 px-4 py-8 sm:px-6 md:grid-cols-4 lg:px-8">
          {[
            { icon: Truck, title: 'Livraison partout en Guinee', text: 'Expedition rapide apres confirmation.' },
            { icon: CreditCard, title: 'Paiement securise', text: 'Orange Money, Wave et paiement a la livraison.' },
            { icon: Headphones, title: 'Service client 7j/7', text: `Infos et commandes: ${DISPLAY_PHONE}.` },
            { icon: ShieldCheck, title: '100% originaux', text: 'Produits premium et resultats garantis.' },
          ].map((feature) => (
            <div key={feature.title} className="rounded-2xl border border-[#ffcc15]/25 bg-[#0b0b0b] p-5">
              <feature.icon className="h-8 w-8 text-[#ffcc15]" />
              <h2 className="mt-4 font-black uppercase text-white">{feature.title}</h2>
              <p className="mt-2 text-sm text-zinc-400">{feature.text}</p>
            </div>
          ))}
        </section>

        <section id="produits" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="font-black uppercase tracking-[0.3em] text-[#ffcc15]">Catalogue en ligne</p>
              <h2 className="mt-3 text-5xl font-black uppercase italic tracking-tight text-white">Produits disponibles</h2>
            </div>
            <label className="flex min-w-72 items-center gap-3 rounded-xl border border-[#ffcc15]/35 bg-white px-5 py-3 text-black shadow-sm">
              <Search className="h-5 w-5 text-zinc-500" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Rechercher un produit"
                className="w-full bg-transparent text-sm font-bold outline-none"
              />
            </label>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-5 py-3 text-sm font-black uppercase transition ${
                  activeCategory === category
                    ? 'bg-[#ffcc15] text-black'
                    : 'border border-[#ffcc15]/35 bg-black text-[#ffcc15] hover:border-[#ffcc15]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onAdd={addToCart} promotions={promotions} />
            ))}
          </div>
        </section>

        <section id="packs" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-[#ffcc15]/35 bg-[linear-gradient(135deg,#111,#030303)] p-6">
            <p className="font-black uppercase tracking-[0.3em] text-[#ffcc15]">Packs rapides</p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {products
                .filter((product) => product.category === 'Packs')
                .map((pack) => (
                  <button
                    key={pack.id}
                    type="button"
                    onClick={() => addToCart(pack)}
                    className="rounded-2xl border border-[#ffcc15]/40 bg-black p-5 text-left transition hover:border-[#ffcc15]"
                  >
                    <p className="text-2xl font-black uppercase text-white">{pack.name}</p>
                    <p className="mt-2 text-sm font-bold text-zinc-400">{pack.description}</p>
                    <p className="mt-4 text-3xl font-black text-[#ffcc15]">{formatPrice(pack.price)}</p>
                  </button>
                ))}
            </div>
          </div>
        </section>

        <section id="commande" className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <aside id="panier" className="rounded-3xl border border-[#ffcc15]/40 bg-[#070707] p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.25em] text-[#ffcc15]">Panier</p>
                <h2 className="mt-2 text-3xl font-black uppercase text-white">Commande en ligne</h2>
              </div>
              <ShoppingCart className="h-8 w-8 text-[#ffcc15]" />
            </div>

            <div className="mt-6 space-y-4">
              {cart.length === 0 ? (
                <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center">
                  <p className="font-black text-white">Ton panier est vide.</p>
                  <p className="mt-2 text-sm text-zinc-400">Ajoute un produit pour commencer.</p>
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

            <div className="mt-6 space-y-3 rounded-2xl border border-white/10 bg-black p-5">
              {discountAmount > 0 && (
                <>
                  <div className="flex justify-between text-zinc-400">
                    <span>Avant reduction</span>
                    <span className="line-through">{formatPrice(baseSubtotal)}</span>
                  </div>
                  <div className="flex justify-between font-black text-[#ffcc15]">
                    <span>Reduction -{promotions.discountPercent}%</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between text-zinc-200">
                <span>Sous-total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {promotions.freeShakerEnabled && (
                <div className={`rounded-xl p-3 text-sm font-black uppercase ${freeShakerIncluded ? 'bg-[#ffcc15] text-black' : 'bg-white/10 text-zinc-200'}`}>
                  {freeShakerIncluded
                    ? `${promotions.shakerLabel} ajoute`
                    : `Encore ${formatPrice(Math.max(0, Number(promotions.freeShakerThreshold || 0) - subtotal))} pour le shaker gratuit`}
                </div>
              )}
              <div className="flex justify-between text-zinc-200">
                <span>Livraison</span>
                <span>A confirmer</span>
              </div>
              <div className="border-t border-white/10 pt-3">
                <div className="flex justify-between text-2xl font-black text-white">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <p className="mt-2 text-sm font-bold text-[#ffcc15]">Commande sans inscription client.</p>
              </div>
            </div>
          </aside>

          <div className="rounded-3xl border border-[#ffcc15]/40 bg-[#0b0b0b] p-6">
            <p className="font-black uppercase tracking-[0.25em] text-[#ffcc15]">Commandes & infos</p>
            <h2 className="mt-3 text-4xl font-black uppercase italic text-white">{DISPLAY_PHONE}</h2>
            <p className="mt-2 text-sm font-bold uppercase text-zinc-400">
              Vente en ligne - livraison partout en Guinee - paiement securise.
            </p>

            <form onSubmit={submitOrder} className="mt-6 grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  required
                  value={customer.name}
                  onChange={(event) => setCustomer({ ...customer, name: event.target.value })}
                  placeholder="Nom complet"
                  className="rounded-xl border border-[#ffcc15]/30 bg-white px-4 py-4 font-bold text-black outline-none"
                />
                <input
                  required
                  value={customer.phone}
                  onChange={(event) => setCustomer({ ...customer, phone: event.target.value })}
                  placeholder="Telephone"
                  className="rounded-xl border border-[#ffcc15]/30 bg-white px-4 py-4 font-bold text-black outline-none"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  required
                  value={customer.city}
                  onChange={(event) => setCustomer({ ...customer, city: event.target.value })}
                  placeholder="Ville"
                  className="rounded-xl border border-[#ffcc15]/30 bg-white px-4 py-4 font-bold text-black outline-none"
                />
                <input
                  value={customer.address}
                  onChange={(event) => setCustomer({ ...customer, address: event.target.value })}
                  placeholder="Adresse / quartier"
                  className="rounded-xl border border-[#ffcc15]/30 bg-white px-4 py-4 font-bold text-black outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={cart.length === 0 || orderStatus?.type === 'loading'}
                className="rounded-xl bg-[#e60012] px-6 py-4 font-black uppercase text-white shadow-[0_14px_30px_rgba(230,0,18,0.35)] transition hover:bg-[#ffcc15] hover:text-black disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
              >
                Confirmer la commande
              </button>
            </form>

            {orderStatus && (
              <div className={`mt-5 rounded-xl p-4 font-bold ${orderStatus.type === 'error' ? 'bg-red-500/15 text-red-200' : 'bg-[#ffcc15]/10 text-[#ffcc15]'}`}>
                {orderStatus.message}
                {orderStatus.whatsapp && (
                  <a href={orderStatus.whatsapp} className="mt-3 flex w-fit items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 font-black uppercase text-white">
                    <Phone className="h-5 w-5" />
                    Finaliser sur WhatsApp
                  </a>
                )}
              </div>
            )}

            <form onSubmit={subscribeNewsletter} className="mt-8 rounded-2xl border border-white/10 bg-black p-5">
              <h3 className="text-xl font-black uppercase text-white">Recevoir les offres</h3>
              <p className="mt-2 text-sm text-zinc-400">Promos, arrivages et packs Kalil Nutrition.</p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(event) => setNewsletterEmail(event.target.value)}
                  placeholder="email@example.com"
                  className="min-w-0 flex-1 rounded-xl border border-[#ffcc15]/30 bg-white px-4 py-3 font-bold text-black outline-none"
                />
                <button type="submit" className="rounded-xl bg-[#ffcc15] px-6 py-3 font-black uppercase text-black">
                  S inscrire
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#ffcc15]/20 bg-black">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-sm text-zinc-400 sm:px-6 lg:px-8">
          <BrandLogo />
          <p>Produits 100% originaux - qualite premium - resultats garantis.</p>
        </div>
      </footer>
    </div>
  );
}
