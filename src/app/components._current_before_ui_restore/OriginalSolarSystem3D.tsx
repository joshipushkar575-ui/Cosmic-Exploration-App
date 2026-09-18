import { useEffect, useRef } from 'react';

export function OriginalSolarSystem3D() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      // Keep the original demo completely isolated from the main React app.
      iframe.style.opacity = '1';
    };

    iframe.addEventListener('load', handleLoad);

    return () => {
      iframe.removeEventListener('load', handleLoad);
    };
  }, []);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        minHeight: '600px',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <iframe
        ref={iframeRef}
        src="/solar-system/index.html"
        title="3D Solar System"
        style={{
          width: '100%',
          height: '100%',
          minHeight: '600px',
          border: 'none',
          display: 'block',
          opacity: 0,
          transition: 'opacity 0.2s ease',
        }}
      />
    </div>
  );
}
