import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface TypographyVariants {
    test: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    test?: React.CSSProperties;
  }
}

// Update the Typography's variant prop options
declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    test: true;
  }
}

const theme = createTheme({
  palette: {
    mode: "dark",
  },
  typography: {
    body1: {},
    body2: {
      opacity: 0.75,
    },
    h1: {
      fontSize: "5rem",
      fontWeight: 800,
    },
    h2: {
      fontSize: "3.75rem",
      fontWeight: 600,
    },
    h3: {
      fontSize: "3rem",
      fontWeight: 600,
    },
    h4: {
      fontSize: "2.125rem",
      fontWeight: 600,
    },
    h5: {
      fontSize: "1.5rem",
      fontWeight: 800,
    },
    h6: {
      fontSize: "1.25rem",
      fontWeight: 800,
    },
  },
});

export default theme;
