import { ThemeProvider, createTheme } from "@mui/material/styles";

interface AppThemeProps {
  children: React.ReactNode;
}

export default function AppTheme(props: AppThemeProps) {
  const { children } = props;
  const theme = createTheme();

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
