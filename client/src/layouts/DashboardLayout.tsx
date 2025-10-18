import { Box, Drawer, List, ListItemButton, ListItemText, Toolbar } from "@mui/material";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

const drawerWidth = 220;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const nav = useNavigate();

  const menu = [
    { label: "Today", path: "/" },
    { label: "Habits", path: "/habits" },
    { label: "Pomodoro", path: "/focus" },
    { label: "Journal", path: "/journal" },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <Header />
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            background: "rgba(255,255,255,0.04)",
            borderRight: "1px solid rgba(255,255,255,0.08)",
          },
        }}
      >
        <Toolbar />
        <List>
          {menu.map(item => (
            <ListItemButton key={item.path} onClick={() => nav(item.path)}>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}