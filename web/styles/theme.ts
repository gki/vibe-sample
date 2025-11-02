import { createTheme } from '@vanilla-extract/css';

export const theme = createTheme({
  color: {
    primary: '#0070f3',
    secondary: '#7928ca',
    success: '#17c964',
    warning: '#f5a623',
    error: '#e00',
    background: '#ffffff',
    foreground: '#171717',
    border: '#eaeaea',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
  },
  typography: {
    fontFamily: {
      sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    },
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '30px',
    },
  },
});

