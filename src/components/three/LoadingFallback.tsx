'use client';

export function LoadingFallback() {
  return (
    <div className="loading-fallback" aria-hidden="true">
      <div className="loading-fallback__pulse" />
      <style jsx>{`
        .loading-fallback {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-void);
        }

        .loading-fallback__pulse {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 2px solid var(--color-accent-glow);
          animation: pulse-ring 1.2s var(--ease-out) infinite;
        }

        @keyframes pulse-ring {
          0% {
            transform: scale(0.8);
            opacity: 1;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
