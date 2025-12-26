/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/react-app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark Mode Premium - Fundos
        dark: {
          bg: '#000000',
          card: '#0a0a0a',
          hover: '#111111',
          elevated: '#141414',
        },
        // Bordas
        border: {
          dark: '#1f2937',
          subtle: '#27272a',
        },
        // Gradiente Accent (Roxo → Azul)
        accent: {
          purple: {
            DEFAULT: '#8b5cf6',
            light: '#a855f7',
            dark: '#7c3aed',
          },
          blue: {
            DEFAULT: '#3b82f6',
            light: '#6366f1',
            dark: '#2563eb',
          },
        },
        // Texto
        text: {
          primary: '#ffffff',
          secondary: '#a1a1aa',
          muted: '#71717a',
          subtle: '#52525b',
        },
      },
      backgroundImage: {
        // Gradientes principais
        'gradient-accent': 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
        'gradient-accent-hover': 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)',
        'gradient-purple-blue': 'linear-gradient(to right, #8b5cf6, #3b82f6)',
        'gradient-radial': 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
        // Grid pattern para background
        'grid-pattern': `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231f2937' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      },
      boxShadow: {
        'glow-purple': '0 0 20px rgba(139, 92, 246, 0.3)',
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.3)',
        'glow-accent': '0 0 30px rgba(139, 92, 246, 0.2), 0 0 60px rgba(59, 130, 246, 0.1)',
        'card-dark': '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -2px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 3s ease infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(139, 92, 246, 0.5), 0 0 40px rgba(59, 130, 246, 0.3)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
