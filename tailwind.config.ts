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
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				// Neumorphic UI colors based on design spec
				'surface': '#F7F8F9',       // Primary background
				'surface-raised': '#FFFFFF', // Cards / modules
				'shadow-light': 'rgba(255, 255, 255, 0.85)', // Top-left inner shadow
				'shadow-dark': 'rgba(0, 0, 0, 0.07)',  // Bottom-right outer shadow
				'accent-primary': '#FF7847', // Interactive highlights, progress bar
				'text-primary': '#333333',   // Main copy
				'text-secondary': '#6B6B6B', // Subcopy / meta
				'text-muted': '#9E9E9E',     // Placeholder hints
				'slider-track': '#E7E7E7',   // Slider track color
                'slate-grey': '#aaadb0',     // Added for dark mode theme toggle
                'white-40': 'rgba(255, 255, 255, 0.4)', // Added for light mode theme toggle
                'white-60': 'rgba(255, 255, 255, 0.6)', // Added for hover state

				// Keep existing shadcn colors for compatibility
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
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Keep legacy colors but modify them to match new design system
				"indigo": "#6B6B6B",
				"neutral-gray": "#9E9E9E",
				"teal-blue": "#FF7847",
				"purple-light": "#F7F8F9",
				"soft-gray": "#F7F8F9",
                "glass-blue": "#49a5ac", // Added for theme toggle text
                "deep-teal": "#333333", // Added for theme toggle text
			},
			boxShadow: {
				// Neumorphic shadows
				'neu-raised': '2px 2px 12px rgba(0, 0, 0, 0.07), -2px -2px 12px rgba(255, 255, 255, 0.85)',
				'neu-pressed': 'inset 2px 2px 5px rgba(0, 0, 0, 0.07), inset -2px -2px 5px rgba(255, 255, 255, 0.85)',
				'neu-hover': '4px 4px 15px rgba(0, 0, 0, 0.1), -4px -4px 15px rgba(255, 255, 255, 0.9)',
				'card': '2px 2px 12px rgba(0, 0, 0, 0.07)',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				xl: '20px', // Standard card radius per design spec
			},
			transitionDuration: {
				'150': '150ms', // Standard micro-interaction time
			},
			fontFamily: {
				sans: ['Inter', 'SF Pro Display', 'Manrope', 'system-ui', 'sans-serif'],
			},
			letterSpacing: {
				'tighter': '-0.25px', // Tighter headlines per design spec
			},
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
			boxShadow: {
				'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
				'elevated': '0 10px 30px rgba(0, 0, 0, 0.08)',
				'neo': '0 10px 30px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 224, 213, 0.1)',
				'neon': '0 0 15px rgba(0, 224, 213, 0.4)',
				'subtle': '0 2px 10px rgba(0, 0, 0, 0.2)',
				'light-neo': '0 10px 30px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 209, 198, 0.1)',
				'light-neon': '0 0 15px rgba(0, 209, 198, 0.3)',
				'light-subtle': '0 2px 10px rgba(0, 0, 0, 0.1)'
			},
			backgroundImage: {
				'gradient-primary': 'linear-gradient(90deg, #3B83F5, #9b87f5)',
				'gradient-neon': 'linear-gradient(90deg, #00E0D5, #FF4F6D)',
				'gradient-dark': 'radial-gradient(circle at center, #3D0B46 0%, #6E0039 40%, #0E0E10 80%)',
				'gradient-light': 'radial-gradient(circle at center, #E8D9F0 0%, #FFE4EB 40%, #F8F9FC 80%)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
