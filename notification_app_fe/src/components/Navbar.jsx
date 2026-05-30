import { useMemo, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import InboxIcon from "@mui/icons-material/Inbox";
import {
  AppBar,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { Log } from "../utils/logger";

const drawerWidth = 280;

const navItems = [
  { label: "All Notifications", to: "/", icon: <NotificationsIcon fontSize="small" /> },
  { label: "Priority Inbox", to: "/priority", icon: <InboxIcon fontSize="small" /> },
];

export default function Navbar() {
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width:900px)");
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentLabel = useMemo(() => {
    return navItems.find((item) => item.to === location.pathname)?.label ?? "Campus Notifications";
  }, [location.pathname]);

  const handleDrawerToggle = () => {
    setMobileOpen((open) => !open);
    Log("Navbar.handleDrawerToggle", "info", "notification_app_fe", "Drawer toggled", {
      open: !mobileOpen,
    });
  };

  const drawerContent = (
    <Box sx={{ py: 2 }}>
      <Box sx={{ px: 2, pb: 2 }}>
        <Typography variant="h6" fontWeight={700}>
          Campus Notifications
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Stay updated with placements, results, and events
        </Typography>
      </Box>
      <List>
        {navItems.map((item) => {
          const active = location.pathname === item.to;
          return (
            <ListItemButton
              key={item.to}
              component={Link}
              to={item.to}
              selected={active}
              onClick={() => {
                if (isMobile) setMobileOpen(false);
                Log("Navbar.navigation", "info", "notification_app_fe", "Navigation clicked", {
                  to: item.to,
                });
              }}
              sx={{ mx: 1, borderRadius: 2 }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" elevation={0} color="transparent" sx={{ backdropFilter: "blur(14px)" }}>
        <Toolbar sx={{ gap: 2, justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {isMobile ? (
              <IconButton edge="start" color="inherit" onClick={handleDrawerToggle} aria-label="open drawer">
                <MenuIcon />
              </IconButton>
            ) : null}
            <Box>
              <Typography variant="h6" fontWeight={800} lineHeight={1.1}>
                Campus Notifications
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {currentLabel}
              </Typography>
            </Box>
          </Box>
          {!isMobile ? (
            <Box sx={{ display: "flex", gap: 1 }}>
              {navItems.map((item) => (
                <Button
                  key={item.to}
                  component={Link}
                  to={item.to}
                  variant={location.pathname === item.to ? "contained" : "outlined"}
                  startIcon={item.icon}
                  onClick={() =>
                    Log("Navbar.navigation", "info", "notification_app_fe", "Navigation clicked", {
                      to: item.to,
                    })
                  }
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          ) : null}
        </Toolbar>
      </AppBar>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}
