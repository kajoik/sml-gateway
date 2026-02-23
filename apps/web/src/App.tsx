import AppTheme from "./theme/AppTheme";
import SideMenu from "./components/SideMenu";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";

function App() {
  return (
    <AppTheme>
      <CssBaseline />
      <Box sx={{ display: "flex" }}>
        <SideMenu />
      </Box>
    </AppTheme>
  );
}

export default App;
