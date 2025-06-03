
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
    <div className="flex flex-col items-center justify-center min-h-[400px] px-6 py-8">
      {/* Animated Gradient Circle */}
      <div className="relative mb-8">
        {/* Main gradient circle */}
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full flex items-center justify-center">
          {/* Gradient background */}
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, rgba(46, 226, 173, 0.8) 0%, rgba(46, 226, 173, 0.4) 40%, rgba(46, 226, 173, 0.1) 70%, transparent 100%)`
            }}
          />
          
          {/* Animated ripple rings */}
          {isListening && (
            <>
              <div 
                className="absolute inset-0 rounded-full animate-ping"
                style={{
                  background: `radial-gradient(circle, transparent 60%, rgba(46, 226, 173, 0.3) 70%, transparent 80%)`,
                  animationDuration: '2s',
                  animationDelay: '0s'
                }}
              />
              <div 
                className="absolute inset-0 rounded-full animate-ping"
                style={{
                  background: `radial-gradient(circle, transparent 40%, rgba(46, 226, 173, 0.2) 50%, transparent 60%)`,
                  animationDuration: '2s',
                  animationDelay: '0.5s'
                }}
              />
              <div 
                className="absolute inset-0 rounded-full animate-ping"
                style={{
                  background: `radial-gradient(circle, transparent 20%, rgba(46, 226, 173, 0.1) 30%, transparent 40%)`,
                  animationDuration: '2s',
                  animationDelay: '1s'
                }}
              />
            </>
          )}

          {/* Flowing wave effect */}
          <div className="relative w-32 h-32 sm:w-40 sm:h-40">
            <div 
              className="absolute inset-0 rounded-full animate-pulse"
              style={{
                background: `linear-gradient(45deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.3) 100%)`,
                clipPath: 'ellipse(70% 60% at 50% 40%)',
                animationDuration: '3s'
              }}
            />
            <div 
              className="absolute inset-0 rounded-full animate-pulse"
              style={{
                background: `linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.2) 100%)`,
                clipPath: 'ellipse(60% 50% at 50% 60%)',
                animationDuration: '4s',
                animationDelay: '0.5s'
              }}
            />
          </div>
        </div>
      </div>

      {/* Text content */}
      <div className="text-center space-y-2">
        <h2 className="text-white text-lg font-normal tracking-wide">
          {title}
        </h2>
        {subtitle && (
          <p className="text-light-gray-text text-sm max-w-xs mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {/* Optional loading dots */}
      {isListening && (
        <div className="flex space-x-1 mt-6">
          <div className="w-2 h-2 bg-primary-teal rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-primary-teal rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-primary-teal rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      )}
    </div>
  );
};

export default ListeningScreen;
