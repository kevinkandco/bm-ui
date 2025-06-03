import React from "react";

interface ListeningScreenProps {
  isListening?: boolean;
  title?: string;
  subtitle?: string;
}

const ListeningScreen = ({ 
  isListening = true, 
  title = "Podia is listening",
  subtitle = "Analyzing your updates and creating your brief..."
}: ListeningScreenProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[150px] sm:min-h-[300px] px-4 py-2 sm:px-6 sm:py-8">
      {/* Animated Gradient Circle */}
      <div className="relative mb-2 sm:mb-6">
        {/* Main gradient circle with rotating background */}
        <div 
          className="relative w-20 h-20 sm:w-48 sm:h-48 rounded-full flex items-center justify-center"
          style={{
            animation: isListening ? 'soft-pulse 3s ease-in-out infinite' : 'none'
          }}
        >
          {/* Rotating gradient background */}
          <div 
            className="absolute inset-0 rounded-full animate-spin"
            style={{
              background: `conic-gradient(from 0deg, rgba(46, 226, 173, 0.8) 0%, rgba(72, 145, 116, 0.6) 120%, rgba(46, 226, 173, 0.4) 240%, rgba(46, 226, 173, 0.8) 360%)`,
              animationDuration: '8s'
            }}
          />
          
          {/* Inner circle with waves */}
          <div className="relative w-16 h-16 sm:w-36 sm:h-36 rounded-full overflow-hidden">
            {/* Base gradient */}
            <div 
              className="absolute inset-0 rounded-full"
              style={{
                background: `linear-gradient(135deg, rgba(46, 226, 173, 0.9) 0%, rgba(72, 145, 116, 0.8) 50%, rgba(46, 226, 173, 0.7) 100%)`
              }}
            />
            
            {/* Animated waves */}
            {isListening && (
              <>
                <div 
                  className="absolute inset-0 rounded-full animate-pulse"
                  style={{
                    background: `radial-gradient(ellipse 80% 40% at 50% 60%, rgba(255,255,255,0.6) 0%, transparent 50%)`,
                    clipPath: 'ellipse(70% 30% at 50% 70%)',
                    animationDuration: '3s',
                    transform: 'rotate(0deg)'
                  }}
                />
                <div 
                  className="absolute inset-0 rounded-full animate-pulse"
                  style={{
                    background: `radial-gradient(ellipse 60% 35% at 50% 40%, rgba(255,255,255,0.4) 0%, transparent 50%)`,
                    clipPath: 'ellipse(60% 25% at 50% 50%)',
                    animationDuration: '4s',
                    animationDelay: '0.5s',
                    transform: 'rotate(15deg)'
                  }}
                />
                <div 
                  className="absolute inset-0 rounded-full animate-pulse"
                  style={{
                    background: `radial-gradient(ellipse 70% 25% at 50% 30%, rgba(255,255,255,0.3) 0%, transparent 50%)`,
                    clipPath: 'ellipse(50% 20% at 50% 30%)',
                    animationDuration: '5s',
                    animationDelay: '1s',
                    transform: 'rotate(-10deg)'
                  }}
                />
              </>
            )}
          </div>

          {/* Outer rotating glow rings */}
          {isListening && (
            <>
              <div 
                className="absolute inset-0 rounded-full animate-spin"
                style={{
                  background: `conic-gradient(from 90deg, transparent 0%, rgba(46, 226, 173, 0.3) 25%, transparent 50%, rgba(46, 226, 173, 0.2) 75%, transparent 100%)`,
                  animationDuration: '6s',
                  transform: 'scale(1.1)'
                }}
              />
              <div 
                className="absolute inset-0 rounded-full animate-spin"
                style={{
                  background: `conic-gradient(from 180deg, transparent 0%, rgba(72, 145, 116, 0.2) 25%, transparent 50%, rgba(46, 226, 173, 0.1) 75%, transparent 100%)`,
                  animationDuration: '10s',
                  animationDirection: 'reverse',
                  transform: 'scale(1.2)'
                }}
              />
            </>
          )}
        </div>
      </div>

      {/* Text content */}
      <div className="text-center space-y-1 sm:space-y-2">
        <h2 className="text-white text-sm sm:text-base font-normal tracking-wide">
          {title}
        </h2>
        {subtitle && (
          <p className="text-light-gray-text text-xs sm:text-sm max-w-xs mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {/* Optional loading dots */}
      {isListening && (
        <div className="flex space-x-1 mt-2 sm:mt-4">
          <div className="w-1.5 h-1.5 bg-primary-teal rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-1.5 h-1.5 bg-primary-teal rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-1.5 h-1.5 bg-primary-teal rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      )}
    </div>
  );
};

export default ListeningScreen;
