"use client"

export function AnimatedBackground() {
  return (
    <>
      <div
        className="fixed pointer-events-none"
        style={{
          position: 'fixed',
          width: '400px',
          height: '400px',
          background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
          top: '10%',
          right: '5%',
          borderRadius: '20px',
          transform: 'rotate(15deg)',
          filter: 'blur(50px)',
          zIndex: 1,
          opacity: 0.15,
          animation: 'float1 12s ease-in-out infinite',
          willChange: 'transform',
          pointerEvents: 'none'
        }}
      />
      <div
        className="fixed pointer-events-none"
        style={{
          position: 'fixed',
          width: '350px',
          height: '350px',
          background: 'linear-gradient(45deg, #f59e0b, #ec4899)',
          top: '60%',
          left: '3%',
          borderRadius: '20px',
          transform: 'rotate(-25deg)',
          filter: 'blur(45px)',
          zIndex: 1,
          opacity: 0.15,
          animation: 'float2 15s ease-in-out infinite',
          willChange: 'transform',
          pointerEvents: 'none'
        }}
      />
    </>
  )
}