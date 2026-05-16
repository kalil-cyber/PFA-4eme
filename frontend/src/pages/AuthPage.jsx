import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun, Shield, UserCircle, UserCog, LogIn, UserPlus } from 'lucide-react';
import TarikiLogo from '../components/brand/TarikiLogo';
import { DashboardNavLink } from '../components/ui/ReturnToDashboard';
import { isTokenValid, setSession, postLoginPath, getSessionRole } from '../lib/auth';
import { adminPath } from '../config/admin';
import { DEMO_CREDENTIALS } from '../constants/demoCredentials';

const isDev = import.meta.env.DEV;

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState(isDev ? DEMO_CREDENTIALS.adminEmail : '');
  const [password, setPassword] = useState(isDev ? DEMO_CREDENTIALS.password : '');
  const [accessCode, setAccessCode] = useState(isDev ? DEMO_CREDENTIALS.adminAccessCode : '');
  const [role, setRole] = useState('user');
  const [accessCodeRequired, setAccessCodeRequired] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { dark, toggle } = useTheme();

  useEffect(() => {
    if (isTokenValid()) {
      const path = getSessionRole() === 'admin' ? adminPath() : postLoginPath('user');
      navigate(path, { replace: true });
      return;
    }
    api
      .getPortalConfig()
      .then((cfg) => setAccessCodeRequired(Boolean(cfg.accessCodeRequired)))
      .catch(() => setAccessCodeRequired(false));
  }, [navigate]);

  const needsAdminCode = role === 'admin' && accessCodeRequired;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (mode === 'register') {
        const { token, user } = await api.register({
          name,
          email,
          password,
          role,
          accessCode: accessCode || undefined,
        });
        setSession(token, user);
        navigate(postLoginPath(user.role), { replace: true });
      } else {
        const { token, user } = await api.login(email, password, accessCode || undefined);
        setSession(token, user);
        navigate(postLoginPath(user.role), { replace: true });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-tariki-900 to-slate-900 p-4">
      <button
        type="button"
        onClick={toggle}
        className="absolute top-4 right-4 rounded-lg p-2.5 text-sm font-medium text-slate-300 hover:bg-white/10"
      >
        {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>

      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 p-8 shadow-2xl">
        <div className="text-center mb-6">
          <div className="mx-auto mb-4 flex justify-center">
            <TarikiLogo size="2xl" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Compte unique</h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg mt-1">
            Inscription et connexion pour conducteurs et administrateurs
          </p>
        </div>

        <div className="flex rounded-lg bg-slate-100 dark:bg-slate-800 p-1 mb-6">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-md py-2 text-sm font-medium transition-colors ${
              mode === 'login'
                ? 'bg-white shadow dark:bg-slate-700 text-tariki-700 dark:text-tariki-300'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <LogIn className="h-4 w-4" />
            Connexion
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-md py-2 text-sm font-medium transition-colors ${
              mode === 'register'
                ? 'bg-white shadow dark:bg-slate-700 text-tariki-700 dark:text-tariki-300'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <UserPlus className="h-4 w-4" />
            Inscription
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg border border-red-300 bg-red-50 text-red-900 text-base px-4 py-3 dark:border-red-800 dark:bg-red-950/40 dark:text-red-200">
              {error}
            </div>
          )}

          {mode === 'register' && (
            <label className="block">
              <span className="text-base font-medium text-slate-800 dark:text-slate-200">Nom complet</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base text-slate-900 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-50 focus:ring-2 focus:ring-tariki-500 mt-1"
              />
            </label>
          )}

          <label className="block">
              <span className="text-base font-medium text-slate-800 dark:text-slate-200">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base text-slate-900 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-50 focus:ring-2 focus:ring-tariki-500 mt-1"
            />
          </label>

          <label className="block">
              <span className="text-base font-medium text-slate-800 dark:text-slate-200">Mot de passe</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={4}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base text-slate-900 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-50 focus:ring-2 focus:ring-tariki-500 mt-1"
            />
          </label>

          {mode === 'register' && (
            <fieldset className="space-y-2">
              <legend className="text-base font-medium text-slate-800 dark:text-slate-200">Type de compte</legend>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('user')}
                  className={`flex flex-col items-center gap-1 rounded-lg border p-3 text-sm transition-colors ${
                    role === 'user'
                      ? 'border-tariki-500 bg-tariki-50 dark:bg-tariki-950/50'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <UserCircle className="h-6 w-6 text-tariki-600" />
                  <span className="font-medium">Conducteur</span>
                  <span className="text-[10px] text-slate-500">Itinéraires & carte</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`flex flex-col items-center gap-1 rounded-lg border p-3 text-sm transition-colors ${
                    role === 'admin'
                      ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/40'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <UserCog className="h-6 w-6 text-violet-600" />
                  <span className="font-medium">Administrateur</span>
                  <span className="text-[10px] text-slate-500">Dashboard & incidents</span>
                </button>
              </div>
            </fieldset>
          )}

          {(needsAdminCode || (mode === 'login' && accessCodeRequired)) && (
            <label className="block">
              <span className="text-sm font-medium flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-zinc-500" />
                Code d&apos;accès administrateur
              </span>
              <input
                type="password"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                autoComplete="off"
                required={needsAdminCode}
                placeholder="Requis pour les comptes admin"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base text-slate-900 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-50 focus:ring-2 focus:ring-tariki-500 mt-1"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                {mode === 'login'
                  ? 'Obligatoire uniquement si vous vous connectez en tant qu’admin.'
                  : 'Obligatoire pour créer un compte administrateur.'}
              </p>
            </label>
          )}

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-tariki-600 text-white font-semibold hover:bg-tariki-700 w-full py-3 disabled:opacity-50"
          >
            {loading
              ? '…'
              : mode === 'login'
                ? 'Se connecter'
                : 'Créer mon compte'}
          </button>
        </form>

        <div className="mt-6 rounded-lg border border-tariki-200 bg-tariki-50/80 px-4 py-3 text-xs text-slate-700 dark:border-tariki-800 dark:bg-tariki-950/40 dark:text-slate-300">
          <p className="font-semibold text-tariki-800 dark:text-tariki-300 mb-1.5">
            Accès équipe (démo)
          </p>
          <ul className="space-y-1 font-mono text-[11px] sm:text-xs">
            <li>
              Admin : {DEMO_CREDENTIALS.adminEmail} / {DEMO_CREDENTIALS.password}
            </li>
            <li>
              Conducteur : {DEMO_CREDENTIALS.userEmail} / {DEMO_CREDENTIALS.password}
            </li>
            <li>Code admin : {DEMO_CREDENTIALS.adminAccessCode}</li>
          </ul>
          <p className="mt-2 text-[10px] text-slate-500 font-sans">
            Dans <code className="text-tariki-700">backend/.env</code> :{' '}
            <code>ADMIN_ACCESS_CODE={DEMO_CREDENTIALS.adminAccessCode}</code>
          </p>
        </div>

        <div className="mt-5 flex flex-col items-center gap-3">
          <DashboardNavLink showAlways className="w-full justify-center sm:w-auto" />
          <p className="text-center text-xs text-slate-500">
            <Link to="/" className="text-tariki-600 hover:underline">
              Accueil
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
