// Loader.tsx
import React from 'react';

const Loader: React.FC = () => {
  const loaderStyle: React.CSSProperties = {
    color: '#fff',
    fontSize: '10px',
    width: '1em',
    height: '1em',
    borderRadius: '50%',
    position: 'relative',
    textIndent: '-9999em',
    animation: 'mulShdSpin 1.3s infinite linear',
    transform: 'translateZ(0)',
  };

  return (
    <>
        <div className='flex w-full justify-center items-center'>
      <span style={loaderStyle}>Loading...</span>
            
        </div>
      <style>
        {`
          @keyframes mulShdSpin {
            0%, 100% {
              box-shadow: 0 -3em 0 0.2em, 2em -2em 0 0em, 3em 0 0 -1em,
                          2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 -1em,
                          -3em 0 0 -1em, -2em -2em 0 0;
            }
            12.5% {
              box-shadow: 0 -3em 0 0, 2em -2em 0 0.2em, 3em 0 0 0,
                          2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 -1em,
                          -3em 0 0 -1em, -2em -2em 0 -1em;
            }
            25% {
              box-shadow: 0 -3em 0 -0.5em, 2em -2em 0 0, 3em 0 0 0.2em,
                          2em 2em 0 0, 0 3em 0 -1em, -2em 2em 0 -1em,
                          -3em 0 0 -1em, -2em -2em 0 -1em;
            }
            37.5% {
              box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0em 0 0,
                          2em 2em 0 0.2em, 0 3em 0 0em, -2em 2em 0 -1em,
                          -3em 0em 0 -1em, -2em -2em 0 -1em;
            }
            50% {
              box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0 0 -1em,
                          2em 2em 0 0em, 0 3em 0 0.2em, -2em 2em 0 0,
                          -3em 0em 0 -1em, -2em -2em 0 -1em;
            }
            62.5% {
              box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0 0 -1em,
                          2em 2em 0 -1em, 0 3em 0 0, -2em 2em 0 0.2em,
                          -3em 0 0 0, -2em -2em 0 -1em;
            }
            75% {
              box-shadow: 0em -3em 0 -1em, 2em -2em 0 -1em, 3em 0em 0 -1em,
                          2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 0,
                          -3em 0em 0 0.2em, -2em -2em 0 0;
            }
            87.5% {
              box-shadow: 0em -3em 0 0, 2em -2em 0 -1em, 3em 0 0 -1em,
                          2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 0,
                          -3em 0em 0 0, -2em -2em 0 0.2em;
            }
          }
        `}
      </style>
    </>
  );
};

export default Loader;
