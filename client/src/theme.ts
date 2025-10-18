import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2", 
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#6c63ff", 
    },
    background: {
      default: "#f9fafc", 
      paper: "#ffffff",   
    },
    text: {
      primary: "#1a1a1a",
      secondary: "rgba(0, 0, 0, 0.65)",
    },
  },
  typography: {
    fontFamily: `"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`,
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    body1: { lineHeight: 1.6 },
    button: { textTransform: "none", fontWeight: 500 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          padding: "10px 16px",
          fontWeight: 500,
        },
        containedPrimary: {
          backgroundColor: "#1976d2",
          "&:hover": { backgroundColor: "#145ea8" },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 6,
          },
          "& .MuiInputBase-input": {
            backgroundColor: "#fffefc",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "transparent",
          color: "#1a1a1a",
          boxShadow: "none",
          borderBottom: "1px solid rgba(0,0,0,0.05)",
        },
      },
    },
  },
});