import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);
function resolveWsUrl() {
  if (import.meta.env.VITE_WS_URL) return import.meta.env.VITE_WS_URL;
  if (import.meta.env.PROD && typeof window !== 'undefined') return window.location.origin;
  return 'http://localhost:4000';
}

const WS_URL = resolveWsUrl();

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [lastPrediction, setLastPrediction] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const s = io(WS_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 8,
      timeout: 20000,
    });

    s.on('connect', () => setConnected(true));
    s.on('disconnect', () => setConnected(false));
    s.on('traffic:update', (data) => setLastUpdate(data));
    s.on('prediction:update', (data) => setLastPrediction(data));
    s.on('incident:new', (inc) =>
      setLastUpdate((prev) => ({
        ...prev,
        incidents: [inc, ...(prev?.incidents || [])],
        type: 'incident:new',
        timestamp: new Date().toISOString(),
      }))
    );
    s.on('incident:updated', (inc) =>
      setLastUpdate((prev) => ({
        ...prev,
        incidents: (prev?.incidents || []).map((i) => (i.id === inc.id ? inc : i)),
        type: 'incident:updated',
      }))
    );

    setSocket(s);
    return () => s.disconnect();
  }, []);

  return (
    <SocketContext.Provider
      value={{ socket, connected, lastUpdate, lastPrediction, setLastUpdate, setLastPrediction }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
