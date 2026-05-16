import { useEffect, useRef } from 'react';
import { useSocket } from '../context/SocketContext';
import { useToast } from '../context/ToastContext';

export function useTrafficNotifications(enabled = true) {
  const { lastUpdate } = useSocket();
  const { toast } = useToast();
  const prevRef = useRef(null);

  useEffect(() => {
    if (!enabled || !lastUpdate) return;

    if (lastUpdate.type === 'incident:new') {
      toast('Nouvel incident signalé sur le réseau', 'warning', 'Incident');
      return;
    }

    const seg = lastUpdate.segment;
    if (!seg || lastUpdate.initial) {
      prevRef.current = seg;
      return;
    }

    const prev = prevRef.current;
    prevRef.current = seg;

    if (seg.congestion_level >= 65) {
      toast(
        `${seg.segmentName || seg.segmentId} : ${seg.previousLevel}% → ${seg.congestion_level}%`,
        'warning',
        'Congestion élevée'
      );
    } else if (prev && seg.congestion_level < prev.congestion_level - 8) {
      toast(
        `Trafic en amélioration sur ${seg.segmentName || seg.segmentId}`,
        'success',
        'Décongestion'
      );
    }
  }, [lastUpdate, enabled, toast]);
}
