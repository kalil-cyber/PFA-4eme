import { useState } from 'react';
import { ExternalLink, Video } from 'lucide-react';

export default function WebcamPlayer({ name, streamUrl, provider }) {
  const [iframeError, setIframeError] = useState(false);

  if (!streamUrl) {
    return (
      <div className="aspect-video flex items-center justify-center bg-slate-900 text-slate-400 text-sm">
        Flux indisponible
      </div>
    );
  }

  return (
    <div className="relative aspect-video bg-slate-900 overflow-hidden">
      {!iframeError ? (
        <iframe
          title={name}
          src={streamUrl}
          className="absolute inset-0 h-full w-full border-0"
          allow="autoplay; encrypted-media"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          onError={() => setIframeError(true)}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 text-center">
          <Video className="h-10 w-10 text-slate-500" />
          <p className="text-sm text-slate-300">Ouvrir le flux sur le site {provider}</p>
          <a
            href={streamUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-tariki-600 px-4 py-2 text-sm font-medium text-white hover:bg-tariki-700"
          >
            Voir la webcam
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      )}
      <div className="absolute top-2 left-2 flex items-center gap-1.5 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white">
        <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
        LIVE
      </div>
    </div>
  );
}
