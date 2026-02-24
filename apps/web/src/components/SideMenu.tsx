import Drawer, { drawerClasses } from "@mui/material/Drawer";
import MenuContent from "./MenuContent";
import Stack from "@mui/material/Stack";

const WIDTH = 240;

export default function SideMenu() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        [`& .${drawerClasses.paper}`]: {
          width: WIDTH,
        },
        width: WIDTH,
      }}
    >
      <Stack
        sx={{
          overflow: "auto",
          height: "100%",
        }}
      >
        <MenuContent />
      </Stack>
    </Drawer>
  );
}
