import React from 'react';

export default function Loading() {
  return (
    <div
      style={{
        backgroundColor: 'var(--bg-main, #FDFBF7)',
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 24px',
      }}
    >
      <div
        style={{
          width: '36px',
          height: '36px',
          border: '2px solid var(--color-border, #E8E4DC)',
          borderTopColor: 'var(--color-espresso, #1A1A1A)',
          borderRadius: '50%',
          animation: 'mkSpin 0.8s linear infinite',
          marginBottom: '16px',
        }}
      />
      <span
        style={{
          fontSize: '0.75rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--color-muted-text, #888888)',
          fontWeight: 500,
        }}
      >
        Loading Fine Silver...
      </span>
      <style>{`
        @keyframes mkSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
