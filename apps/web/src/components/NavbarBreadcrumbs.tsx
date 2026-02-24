import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";

export default function NavbarBreadcrumbs() {
  return (
    <Breadcrumbs aria-label="breadcrumb">
      <Typography variant="body1">sml-gateway</Typography>
      <Typography
        variant="body1"
        sx={{ color: "text.primary", fontWeight: 600 }}
      >
        Home
      </Typography>
    </Breadcrumbs>
  );
}
