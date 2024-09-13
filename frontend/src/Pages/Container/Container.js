// The Container of the whole website

import { useState } from "react";

import { Box, IconButton, CssBaseline } from "@mui/material";

import MenuOpenIcon from "@mui/icons-material/MenuOpen";

import SideNavBar from "../Drawer/SideNavBar";

import SecondaryAppBar from "../AppBar/SecondaryAppBar";
import { Outlet } from "react-router-dom";

import "./Container.css"

const drawerWidth = 300;

function Container() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };


  return (
    <Box
      sx={{
        display: "flex",
        backgroundColor: "#f0f2f5",
        height: "100vh",
        overflow: "auto"
      }}
    >
      <CssBaseline />
      <SideNavBar phoneOpen={mobileOpen} setPhoneOpen={setMobileOpen} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{
            backgroundColor: "white",
            borderRadius: "25px",
            position: "fixed",
            bottom: 10,
            left: 20,
            mr: 2,
            zIndex: "2",
            display: { md: "none" },
          }}
        >
          <MenuOpenIcon sx={{ color: "black" }} />
        </IconButton>

        <Box
          sx={{
            position: "relative",
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            paddingTop: "20px",
            paddingBottom: "54px",
            paddingX: { xs: "10px", sm: "10px", md: "24px" },
          }}
        >
          <Box
            sx={{
              width: "100%",
            }}
          >
            <SecondaryAppBar />
          </Box>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default Container;
