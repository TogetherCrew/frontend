import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#804EE1',
    },
  },
  typography: {
    fontFamily: 'inherit',
    fontWeightBold: '500',
    fontWeightExtraBold: '700',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '4px',
          color: '#804EE1',

          '&.Mui-disabled': {
            opacity: 0.7,
          },
          '@media (max-width:1023px)': {
            width: '100%',
          },
        },
        contained: {
          background: '#804EE1 !important',
          color: 'white',
          '&.Mui-disabled': {
            color: 'white',
          },
        },
        outlined: {
          background: 'transparent',
          border: '1px solid #222222',
          color: '#222222',
          '&:hover': {
            background: '#F5F5F5',
            border: '1px solid #222222',
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          padding: '0 9px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          minWidth: '25rem',
          '& label.Mui-focused': {
            color: '#804EE1',
          },
          '@media (max-width:1023px)': {
            minWidth: '100%',
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          padding: '15px 20px',
          borderRadius: '6px',
          backgroundColor: '#222222',
          '& .MuiTooltip-arrow': {
            color: '#222222',
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: '0px',
          position: 'sticky',
          top: '0',
          zIndex: '999',
        },
        filledWarning: {
          background: '#FF8022',
          '@media (max-width: 600px)': {
            padding: '6px 2rem 6px 2rem',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          borderBottom: 'none',
          textTransform: 'none',
        },
        indicator: {
          backgroundColor: 'transparent',
          borderBottom: 'none',
        },
      },
    },
    MuiTab: {
      styleOverrides: {},
    },
  },
});
declare module '@mui/material/styles/createTypography' {
  interface TypographyOptions {
    fontWeightExtraBold?: string;
  }

  interface Typography {
    fontWeightExtraBold: string;
  }
}
declare module '@mui/material/styles' {
  interface Palette {
    neutral: Palette['primary'];
  }

  // allow configuration using `createTheme`
  interface PaletteOptions {
    neutral?: PaletteOptions['primary'];
  }
}

// Update the Button's color prop options
declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    primary: true;
  }
}
