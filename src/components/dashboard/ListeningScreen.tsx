import React from "react";
interface ListeningScreenProps {
  isListening?: boolean;
  title?: string;
  subtitle?: string;
}
const ListeningScreen = ({
  isListening = true,
  title = "Brief-me is listening",
  subtitle = "Analyzing your updates and creating your brief..."
}: ListeningScreenProps) => {
  return <div className="flex flex-col items-center justify-center min-h-[200px] sm:min-h-[300px] px-2 py-1 sm:px-6 sm:py-8">
      {/* Animated Gradient Circle */}
      <div className="relative mb-1 sm:mb-6 px-0 py-[30px] my-0 mx-0">
        {/* Main gradient circle with rotating background */}
        <div className="relative w-32 h-32 sm:w-48 sm:h-48 rounded-full flex items-center justify-center" style={{
        animation: isListening ? 'soft-pulse 3s ease-in-out infinite' : 'none'
      }}>
          {/* Rotating gradient background */}
          <div className="absolute inset-0 rounded-full animate-spin" style={{
          background: `conic-gradient(from 0deg, rgba(46, 226, 173, 0.8) 0%, rgba(72, 145, 116, 0.6) 120%, rgba(46, 226, 173, 0.4) 240%, rgba(46, 226, 173, 0.8) 360%)`,
          animationDuration: '8s'
        }} />
          
          {/* Inner circle with waves */}
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden">
            {/* Base gradient */}
            <div className="absolute inset-0 rounded-full" style={{
            background: `linear-gradient(135deg, rgba(46, 226, 173, 0.9) 0%, rgba(72, 145, 116, 0.8) 50%, rgba(46, 226, 173, 0.7) 100%)`
          }} />
            
            {/* Animated waves */}
            {isListening && <>
                <div className="absolute inset-0 rounded-full animate-pulse" style={{
              background: `radial-gradient(ellipse 80% 40% at 50% 60%, rgba(255,255,255,0.6) 0%, transparent 50%)`,
              clipPath: 'ellipse(70% 30% at 50% 70%)',
              animationDuration: '3s',
              transform: 'rotate(0deg)'
            }} />
                <div className="absolute inset-0 rounded-full animate-pulse" style={{
              background: `radial-gradient(ellipse 60% 35% at 50% 40%, rgba(255,255,255,0.4) 0%, transparent 50%)`,
              clipPath: 'ellipse(60% 25% at 50% 50%)',
              animationDuration: '4s',
              animationDelay: '0.5s',
              transform: 'rotate(15deg)'
            }} />
                <div className="absolute inset-0 rounded-full animate-pulse" style={{
              background: `radial-gradient(ellipse 70% 25% at 50% 30%, rgba(255,255,255,0.3) 0%, transparent 50%)`,
              clipPath: 'ellipse(50% 20% at 50% 30%)',
              animationDuration: '5s',
              animationDelay: '1s',
              transform: 'rotate(-10deg)'
            }} />
              </>}
          </div>
        </div>
      </div>

      {/* Text content */}
      <div className="text-center space-y-1 sm:space-y-2">
        <h2 className="text-white text-sm sm:text-base font-normal tracking-wide">
          {title}
        </h2>
        {subtitle}
      </div>

      <style>{`
        @keyframes soft-pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.9;
          }
          50% {
            transform: scale(1.05);
            opacity: 1;
          }
        }
      `}</style>
    </div>;
};
export default ListeningScreen;