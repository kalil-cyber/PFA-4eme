import { useEffect, useState } from 'react';
import { CASA_PRESENTATION_IMAGES } from '../../constants/casaPresentationMedia';

const SLIDE_MS = 10000;

export default function CasablancaPresentationBackground({ className = '' }) {
  const [slide, setSlide] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    setReduceMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    CASA_PRESENTATION_IMAGES.slice(0, 2).forEach((img) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = img.src;
      document.head.appendChild(link);
    });
  }, []);

  useEffect(() => {
    if (reduceMotion) return undefined;
    const t = setInterval(() => {
      setSlide((s) => (s + 1) % CASA_PRESENTATION_IMAGES.length);
    }, SLIDE_MS);
    return () => clearInterval(t);
  }, [reduceMotion]);

  return (
    <div className={`absolute inset-0 overflow-hidden bg-slate-950 ${className}`} aria-hidden>
      {CASA_PRESENTATION_IMAGES.map((img, i) => (
        <img
          key={img.id}
          src={img.src}
          srcSet={img.srcSet}
          sizes="100vw"
          alt=""
          decoding="async"
          fetchPriority={i === 0 ? 'high' : 'low'}
          className={`absolute inset-0 h-full w-full object-cover brightness-[0.68] contrast-[1.12] saturate-[0.9] transition-opacity duration-[2500ms] ease-in-out ${
            reduceMotion || i === slide ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/95 via-slate-900/82 to-slate-100/98 dark:to-slate-950" />
      <div className="absolute inset-0 bg-black/40" aria-hidden />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(15,23,42,0.55),rgba(15,23,42,0.92))]"
        aria-hidden
      />
    </div>
  );
}
