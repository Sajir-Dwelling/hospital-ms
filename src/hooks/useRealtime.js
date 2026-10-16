import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

// Usage: useRealtime({ 'appointment:updated': () => reload(), 'invoice:updated': () => reload() });
// Connects with the logged-in user's token and calls the handlers when the server pushes events.
export default function useRealtime(handlers) {
  const ref = useRef(handlers);
  ref.current = handlers;

  useEffect(() => {
    let token = '';
    try { token = JSON.parse(localStorage.getItem('hms_user') || '{}')?.token || ''; } catch { /* ignore */ }
    if (!token) return undefined;

    const base = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');
    const socket = io(base, { auth: { token }, transports: ['websocket', 'polling'] });

    Object.keys(ref.current).forEach((event) => {
      socket.on(event, (payload) => ref.current[event]?.(payload));
    });

    // After a reconnect (e.g. Render waking up) catch up on anything missed
    socket.io.on('reconnect', () => ref.current['reconnect']?.());

    return () => { socket.disconnect(); };
  }, []);
}
