'use client'

export function BackgroundAnimation() {
  return (
    <>
      <div 
        className="fixed pointer-events-none z-[-1] w-[400px] h-[400px] top-[10%] right-[5%] 
                   bg-gradient-to-br from-blue-500 to-purple-600 rounded-[20px] 
                   rotate-[15deg] blur-[50px] opacity-20 animate-float1"
        style={{
          animation: 'float1 12s ease-in-out infinite'
        }}
      />
      <div 
        className="fixed pointer-events-none z-[-1] w-[350px] h-[350px] top-[60%] left-[3%] 
                   bg-gradient-to-br from-amber-500 to-orange-500 rounded-[20px] 
                   rotate-[-25deg] blur-[45px] opacity-20 animate-float2"
        style={{
          animation: 'float2 15s ease-in-out infinite'
        }}
      />
    </>
  )
}