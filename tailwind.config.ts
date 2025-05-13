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
				// Updated dark theme colors based on the image
				'canvas-black': '#0E0E10',
				'deep-plum': '#3D0B46',
				'cranberry': '#6E0039',
				'electric-teal': '#2FBECF',  // Updated to match image
				'hot-coral': '#FF7A5A',      // Updated to match image
				'ice-grey': '#E0E4EA',
				'cool-slate': '#B0B3BE',
				// Light theme colors
				'canvas-light': '#F8F9FC',
				'soft-plum': '#E8D9F0',
				'light-rose': '#FFE4EB',
				'bright-teal': '#2FBECF',    // Updated to match image
				'warm-coral': '#FF7A5A',     // Updated to match image
				'deep-navy': '#1A1A2E',
				'slate-grey': '#696E79',
				// New colors for the landing page - updated based on image
				'forest-green': '#143D4D',    // Darker teal from image
				'lake-blue': '#2FBECF',       // Brighter teal from image
				'peach': '#FF7A5A',           // Orange/coral from image
				'off-white': '#F5F5F2',
				'neon-mint': '#30D8E8',       // Brighter blue from image
				// Additional colors from the image
				'deep-teal': '#143D4D',       // Deep teal background color
				'bright-orange': '#FF5F37',   // Bright orange/coral from bottom of image
				'glass-blue': '#30D8E8',      // Glass-like blue highlight
				// Explicitly define white with alpha support
				'white': {
					DEFAULT: '#FFFFFF',
					10: 'rgba(255, 255, 255, 0.1)',
					14: 'rgba(255, 255, 255, 0.14)',
					20: 'rgba(255, 255, 255, 0.2)',
					25: 'rgba(255, 255, 255, 0.25)',
					30: 'rgba(255, 255, 255, 0.3)',
					40: 'rgba(255, 255, 255, 0.4)',
					50: 'rgba(255, 255, 255, 0.5)',
					60: 'rgba(255, 255, 255, 0.6)',
					70: 'rgba(255, 255, 255, 0.7)',
					80: 'rgba(255, 255, 255, 0.8)',
					90: 'rgba(255, 255, 255, 0.9)',
				},
				// Keep legacy colors
				"indigo": "#3B3BFF",
				"neutral-gray": "#8E9196",
				"teal-blue": "#3B83F5",
				"purple-light": "#9b87f5",
				"soft-gray": "#F1F0FB",
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				xl: '16px',
			},
			transitionDuration: {
				'400': '400ms',
				'160': '160ms',
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
