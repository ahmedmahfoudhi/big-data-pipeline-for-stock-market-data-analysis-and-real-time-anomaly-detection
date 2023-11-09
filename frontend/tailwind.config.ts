import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-bkg': 'var(--gradient-bkg)'  
      },
      colors: {
        'bkg-color': 'var(--color-bkg)',
        'color-content': 'var(--color-content)',
        'card-bkg': 'var(--card-bkg)',
        'card-border': 'var(--card-border)',
        'card-text': 'var(--card-text)',
        'bar-color': 'var(--bar-color)',
        'footer-bkg': 'var(--footer-bkg)',
        'graph-line-2': 'var(--graph-line-2)',
        'graph-line-1': 'var(--graph-line-1)',
        'footer-text': 'var(--footer-text)',
        'pie-1': 'var(--pie-1)',
        'pie-2': 'var(--pie-2)',
        'table-bkg': 'var(--table-bkg)',
        'table-header': 'var(--table-header)',
        'anomaly-color': 'var(--color-anomaly)'
      },
      fontFamily: {
        'system': ['system-ui', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
export default config
