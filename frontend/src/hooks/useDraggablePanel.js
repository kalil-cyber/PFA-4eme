import { useCallback, useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'tariki_chat_position';

function loadPosition() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw);
    if (typeof p?.x === 'number' && typeof p?.y === 'number') return p;
  } catch {
    /* ignore */
  }
  return null;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Panneau flottant déplaçable (FAB + fenêtre chat partagent la même position).
 */
export function useDraggablePanel({ panelWidth = 420, panelHeight = 540, fabHeight = 56 }) {
  const [position, setPosition] = useState(loadPosition);
  const draggingRef = useRef(false);
  const movedRef = useRef(false);
  const offsetRef = useRef({ x: 0, y: 0 });
  const isOpenRef = useRef(false);

  const getDefaultPosition = useCallback(
    (isOpen) => {
      const w = isOpen ? panelWidth : 280;
      const h = isOpen ? panelHeight : fabHeight;
      return {
        x: Math.max(8, window.innerWidth - w - 24),
        y: Math.max(8, window.innerHeight - h - 24),
      };
    },
    [panelWidth, panelHeight, fabHeight]
  );

  const clampPosition = useCallback((x, y, isOpen) => {
    const w = isOpen ? panelWidth : 300;
    const h = isOpen ? panelHeight : fabHeight;
    return {
      x: clamp(x, 8, window.innerWidth - w - 8),
      y: clamp(y, 8, window.innerHeight - h - 8),
    };
  }, [panelWidth, panelHeight, fabHeight]);

  const startDrag = useCallback(
    (e, isOpen) => {
      if (e.button !== 0) return;
      e.preventDefault();
      isOpenRef.current = isOpen;
      const current = position ?? getDefaultPosition(isOpen);
      if (!position) setPosition(current);
      draggingRef.current = true;
      movedRef.current = false;
      offsetRef.current = { x: e.clientX - current.x, y: e.clientY - current.y };
      e.currentTarget.setPointerCapture?.(e.pointerId);
    },
    [position, getDefaultPosition, panelWidth, panelHeight, fabHeight]
  );

  useEffect(() => {
    const onMove = (e) => {
      if (!draggingRef.current) return;
      movedRef.current = true;
      const next = clampPosition(
        e.clientX - offsetRef.current.x,
        e.clientY - offsetRef.current.y,
        isOpenRef.current
      );
      setPosition(next);
    };

    const onUp = () => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      setPosition((p) => {
        if (p) localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
        return p;
      });
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [clampPosition, fabHeight]);

  const getStyle = useCallback(
    (isOpen) => {
      const pos = position ?? getDefaultPosition(isOpen);
      return { left: pos.x, top: pos.y };
    },
    [position, getDefaultPosition]
  );

  const resetPosition = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setPosition(null);
  }, []);

  const consumeDrag = useCallback(() => {
    const was = movedRef.current;
    movedRef.current = false;
    return was;
  }, []);

  return {
    getStyle,
    startDrag,
    resetPosition,
    consumeDrag,
    isDragging: () => draggingRef.current,
  };
}
