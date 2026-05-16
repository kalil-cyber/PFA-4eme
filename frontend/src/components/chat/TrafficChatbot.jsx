import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, Volume2, VolumeX, X, Sparkles, GripVertical, RotateCcw } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { api } from '../../lib/api';
import { AUTH_PATH } from '../../config/auth';
import { useTarikiSpeech } from '../../hooks/useTarikiSpeech';
import { useDraggablePanel } from '../../hooks/useDraggablePanel';
import TarikiRobot from '../robot/TarikiRobot';

const PANEL_W = 420;
const PANEL_H = 540;

const SUGGESTIONS = [
  'Résumé trafic + météo',
  'Quelle route éviter ?',
  'Comment m’inscrire ?',
  'Prévision +30 min',
];

function formatReply(text) {
  const clean = text.replace(/_\(([^)]+)\)_/g, '($1)').replace(/_/g, '');
  return clean.split('\n').map((line, i) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return (
      <span key={i}>
        {i > 0 && <br />}
        {parts.map((part, j) =>
          part.startsWith('**') && part.endsWith('**') ? (
            <strong key={j}>{part.slice(2, -2)}</strong>
          ) : (
            <span key={j}>{part}</span>
          )
        )}
      </span>
    );
  });
}

function shouldSpeakReply(text, userMessage) {
  const q = (userMessage || '').toLowerCase();
  if (/parle|voix|dis moi|lis|oral/.test(q)) return true;
  const plain = text.replace(/\*\*/g, '');
  return plain.length > 0 && plain.length <= 550;
}

export default function TrafficChatbot() {
  const { open, toggle, closeChat } = useChat();
  const { getStyle, startDrag, resetPosition, consumeDrag } = useDraggablePanel({
    panelWidth: PANEL_W,
    panelHeight: PANEL_H,
  });

  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Bonjour ! Je suis Tariki, votre assistant intelligent à Casablanca. Posez des questions simples ou combinées (ex. « météo et congestion vers Maarif »). **Glissez l’en-tête** pour déplacer la fenêtre.',
    },
  ]);
  const msgId = useRef(1);
  const nextId = () => {
    msgId.current += 1;
    return `msg-${msgId.current}`;
  };
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('smart');
  const [voiceOn, setVoiceOn] = useState(true);
  const [robotState, setRobotState] = useState('moving');
  const listRef = useRef(null);
  const lastSpokenRef = useRef('');

  const { speak, stop, supported } = useTarikiSpeech(voiceOn);

  useEffect(() => {
    if (loading) {
      setRobotState('thinking');
      stop();
      return;
    }
    const last = messages[messages.length - 1];
    if (last?.role === 'assistant' && open) {
      setRobotState('speaking');
      if (voiceOn && supported && last.content && last.id !== lastSpokenRef.current) {
        if (shouldSpeakReply(last.content, messages[messages.length - 2]?.content)) {
          lastSpokenRef.current = last.id;
          speak(last.content);
        }
      }
      const t = setTimeout(() => setRobotState('moving'), 4500);
      return () => clearTimeout(t);
    }
    setRobotState('moving');
  }, [loading, messages, open, voiceOn, supported, speak, stop]);

  useEffect(() => {
    if (!open) stop();
  }, [open, stop]);

  useEffect(() => {
    api.getChatStatus?.().then((s) => setMode(s.mode)).catch(() => {});
  }, []);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, open]);

  const send = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;

    setInput('');
    stop();
    const userMsg = { id: nextId(), role: 'user', content: msg };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const history = [...messages, userMsg].filter((m) => m.role === 'user' || m.role === 'assistant');
      const { reply, mode: replyMode } = await api.sendChatMessage(msg, history);
      setMode(replyMode);
      setMessages((prev) => [...prev, { id: nextId(), role: 'assistant', content: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: 'assistant',
          content: `Erreur : ${err.message}. Vérifiez que le backend tourne sur le port 4000.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fabRobotState = open ? robotState : 'moving';
  const posStyle = getStyle(open);

  const handleFabPointerUp = () => {
    if (!consumeDrag()) toggle();
  };

  return (
    <div className="fixed z-[90] touch-none" style={posStyle}>
      {!open && (
        <button
          type="button"
          onPointerDown={(e) => startDrag(e, false)}
          onPointerUp={handleFabPointerUp}
          className="flex items-center gap-3 rounded-full bg-tariki-700 pl-2 pr-5 py-2 text-white border-2 border-white/90 shadow-[0_6px_28px_rgba(0,0,0,0.45)] hover:bg-tariki-800 transition-colors select-none cursor-grab active:cursor-grabbing"
          aria-label="Ouvrir l'assistant trafic (maintenir pour déplacer)"
        >
          <TarikiRobot state={fabRobotState} size="md" />
          <span className="font-semibold text-base hidden sm:inline pointer-events-none">
            Assistant Tariki
          </span>
        </button>
      )}

      {open && (
        <div
          className="flex w-[min(100vw-2rem,420px)] flex-col overflow-hidden rounded-2xl border-2 border-slate-300 bg-white shadow-[0_8px_40px_rgba(0,0,0,0.35)] dark:border-slate-600 dark:bg-slate-900"
          style={{ height: 'min(540px, calc(100vh - 6rem))' }}
        >
          <header className="flex items-stretch bg-gradient-to-r from-tariki-600 to-tariki-700 text-white shrink-0">
            <div
              className="flex flex-1 items-center gap-2 min-w-0 px-3 py-3 cursor-grab active:cursor-grabbing select-none touch-none"
              onPointerDown={(e) => startDrag(e, true)}
              title="Glisser pour déplacer"
            >
              <GripVertical className="h-5 w-5 shrink-0 opacity-70" aria-hidden />
              <TarikiRobot state={robotState} size="lg" />
              <div className="min-w-0 flex-1 pointer-events-none">
                <p className="font-semibold text-base leading-tight">Assistant Tariki</p>
                <p className="text-sm text-white flex items-center gap-1 mt-0.5">
                  <Sparkles className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">
                    {mode === 'openai' ? 'GPT avancé' : 'IA intelligente'} · Glisser-déposer
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-0.5 pr-2 shrink-0">
              <button
                type="button"
                onClick={resetPosition}
                className="rounded-lg p-2 hover:bg-white/20"
                title="Repositionner en bas à droite"
                aria-label="Réinitialiser la position"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              {supported && (
                <button
                  type="button"
                  onClick={() => {
                    setVoiceOn((v) => {
                      if (v) stop();
                      return !v;
                    });
                  }}
                  className={`rounded-lg p-2 hover:bg-white/20 ${voiceOn ? 'text-white' : 'text-white/50'}`}
                  aria-label={voiceOn ? 'Couper la voix' : 'Activer la voix'}
                >
                  {voiceOn ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                </button>
              )}
              <button
                type="button"
                onClick={closeChat}
                className="rounded-lg px-2 py-2 hover:bg-white/20"
                aria-label="Fermer le chat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </header>

          <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
            {messages.map((m) => (
              <div
                key={m.id || m.content.slice(0, 20)}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-4 py-3 text-base leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-tariki-600 text-white rounded-br-md'
                      : 'bg-slate-100 text-slate-900 border border-slate-200 dark:bg-slate-800 dark:text-slate-50 dark:border-slate-600 rounded-bl-md'
                  }`}
                >
                  {m.role === 'user' ? m.content : formatReply(m.content)}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                <TarikiRobot state="thinking" size="md" />
                <span className="animate-pulse font-medium">Analyse intelligente…</span>
              </div>
            )}
          </div>

          <div className="border-t border-slate-200 p-3 dark:border-slate-700 shrink-0">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
              <Link to={AUTH_PATH} className="text-tariki-600 font-semibold hover:underline">
                Inscription / connexion
              </Link>
              {' · '}
              Déplacez via l’en-tête ⋮⋮
            </p>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  disabled={loading}
                  className="text-xs sm:text-sm rounded-full border border-slate-300 bg-white px-3 py-1.5 text-slate-800 hover:bg-tariki-50 hover:border-tariki-400 dark:border-slate-500 dark:bg-slate-800 dark:text-slate-100"
                >
                  {s}
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="flex gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ex. météo et trafic vers Maarif…"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base text-slate-900 placeholder:text-slate-500 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-50 focus:ring-2 focus:ring-tariki-500 flex-1"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="rounded-lg bg-tariki-600 text-white font-semibold hover:bg-tariki-700 p-2.5 disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
