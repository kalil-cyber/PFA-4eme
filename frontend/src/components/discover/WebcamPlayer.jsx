import { useState } from 'react';
import { ExternalLink, MapPin, Video } from 'lucide-react';

export default function WebcamPlayer({ name, streamUrl, provider, description, live, category }) {
  const [iframeError, setIframeError] = useState(false);
  const canEmbed = live && streamUrl && streamUrl.includes('cameras');

  if (!streamUrl || !canEmbed) {
    return (
      <div className="aspect-video flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-slate-800 to-slate-900 p-6 text-center">
        <Video className="h-10 w-10 text-tariki-400" />
        <p className="text-sm font-medium text-white">{name}</p>
        <p className="text-xs text-slate-400 max-w-xs">
          {description || `Point ${category || 'surveillance'} — dataset Tariki (pas de flux embarqué).`}
        </p>
        {streamUrl && (
          <a
            href={streamUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-tariki-600 px-4 py-2 text-sm font-medium text-white hover:bg-tariki-700"
          >
            Voir sur {provider || 'source'}
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
        <p className="text-[10px] text-slate-500 flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          Position sur la carte ci-dessus
        </p>
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
          <a
            href={streamUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-tariki-600 px-4 py-2 text-sm font-medium text-white"
          >
            Ouvrir le flux
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      )}
      {live && (
        <div className="absolute top-2 left-2 flex items-center gap-1.5 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
          LIVE
        </div>
      )}
    </div>
  );
}
