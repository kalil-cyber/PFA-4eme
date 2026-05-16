import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import { SocketProvider } from './context/SocketContext';
import { ToastProvider } from './context/ToastContext';
import { ChatProvider } from './context/ChatContext';
import TrafficChatbot from './components/chat/TrafficChatbot';
import ErrorBoundary from './components/ErrorBoundary';
import { migrateLegacyStorage } from './utils/storage';

migrateLegacyStorage();
import 'leaflet/dist/leaflet.css';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <SocketProvider>
          <ChatProvider>
            <ErrorBoundary>
              <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '') || undefined}>
                <App />
                <TrafficChatbot />
              </BrowserRouter>
            </ErrorBoundary>
          </ChatProvider>
        </SocketProvider>
      </ToastProvider>
    </ThemeProvider>
  </React.StrictMode>
);
