import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '1.5rem', // 24px
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        
        // New Bloomberg terminal meets macOS design tokens
        'base': '#0F0F0F',
        'surface': '#1A1A1A',
        'card': '#2B2B2B',
        'accent-blue': '#2EA7FF',
        'divider': '#262626',
        'text': {
          'headline': 'rgba(255, 255, 255, 0.9)',
          'body': 'rgba(255, 255, 255, 0.75)',
          'secondary': 'rgba(255, 255, 255, 0.5)',
        },
        'icon': {
          DEFAULT: 'rgba(255, 255, 255, 0.7)',
        },
        'shadow': 'rgba(0, 0, 0, 0.15)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        'card': '12px',
      },
      transitionDuration: {
        '200': '200ms',
      },
      spacing: {
        'shell': '24px',
        'card-gap': '20px',
        'card-padding': '16px',
        'row-gap': '12px',
      },
      fontFamily: {
        'sans': ['Inter', 'SF Pro', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'heading-lg': ['24px', { lineHeight: '1.2', letterSpacing: '-0.25px', fontWeight: '600' }],
        'heading-md': ['18px', { lineHeight: '1.3', letterSpacing: '-0.25px', fontWeight: '500' }],
        'heading-sm': ['14px', { lineHeight: '1.4', letterSpacing: '-0.25px', fontWeight: '500' }],
        'body': ['14px', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '400' }],
        'meta': ['12px', { lineHeight: '1.4', letterSpacing: '0.5px', fontWeight: '400', textTransform: 'uppercase' }],
      },
      boxShadow: {
        'card': '0 4px 4px rgba(0, 0, 0, 0.15)',
        'elevated': '0 8px 8px rgba(0, 0, 0, 0.25)',
      },
      // Keep existing animations
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        },
        'fade-in': {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        'slide-in': {
          '0%': {
            opacity: '0',
            transform: 'translateX(20px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)'
          }
        },
        'bounce-light': {
          '0%, 100%': {
            transform: 'translateY(0)'
          },
          '50%': {
            transform: 'translateY(-5px)'
          }
        },
        'shake': {
          '0%, 100%': {
            transform: 'translateX(0)'
          },
          '20%, 60%': {
            transform: 'translateX(-5px)'
          },
          '40%, 80%': {
            transform: 'translateX(5px)'
          }
        },
        'confetti': {
          '0%': {
            transform: 'translateY(0) rotate(0)',
            opacity: '1'
          },
          '100%': {
            transform: 'translateY(-500px) rotate(720deg)',
            opacity: '0'
          }
        },
        'pulse': {
          '0%, 100%': {
            opacity: '0.7',
            transform: 'scale(1)'
          },
          '50%': {
            opacity: '0.9',
            transform: 'scale(1.05)'
          }
        },
        'float': {
          '0%, 100%': {
            transform: 'translateY(0px)'
          },
          '50%': {
            transform: 'translateY(-10px)'
          }
        },
        'glow': {
          '0%, 100%': {
            filter: 'brightness(1) blur(3px)'
          },
          '50%': {
            filter: 'brightness(1.2) blur(4px)'
          }
        },
        'float-delay': {
          '0%, 100%': {
            transform: 'translateY(0px) translateX(0px)',
          },
          '50%': {
            transform: 'translateY(-8px) translateX(5px)',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-in': 'slide-in 0.3s ease-out',
        'bounce-light': 'bounce-light 1s infinite',
        'shake': 'shake 0.5s ease-in-out',
        'confetti': 'confetti 2s ease-out forwards',
        'pulse': 'pulse 8s infinite ease-in-out',
        'float': 'float 6s infinite ease-in-out',
        'glow': 'glow 3s infinite ease-in-out',
        'float-delay': 'float-delay 8s infinite ease-in-out 1s',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(90deg, #2B88FF, #6BA5FF)',
        'gradient-neon': 'linear-gradient(90deg, #2B88FF, #6BA5FF)',
        'gradient-dark': 'radial-gradient(circle at center, #232326 0%, #1A1A1C 100%)',
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
