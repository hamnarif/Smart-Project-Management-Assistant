import React, { useState } from "react";
import { Box, Drawer, Typography } from "@mui/material";

import SideNavContent from "./SideNavContent";

import DescriptionSharpIcon from "@mui/icons-material/DescriptionSharp";
import MailIcon from "@mui/icons-material/Mail";
import Dashboard from "@mui/icons-material/Dashboard";

import logo from "../../Assets/Images/logov3.png";

const drawerWidthFull = 230;
const drawerWidthHalf = 230;


// The main components to be displayed at the sidebar
const components = [
  {
    text: "Assistant",
    icon: <Dashboard sx={{ fontSize: "20px", color: "white" }} />,
  },
  {
    text: "PC1",
    icon: <DescriptionSharpIcon sx={{ fontSize: "20px", color: "white" }} />,
  },
  {
    text: "Meeting Scheduling",
    icon: <MailIcon sx={{ fontSize: "20px", color: "white" }} />,
  },
  {
    text: "Minutes of Meeting",
    icon: <DescriptionSharpIcon sx={{ fontSize: "20px", color: "white" }} />,
  },
  {
    text: "Authorization of Funds",
    icon: <DescriptionSharpIcon sx={{ fontSize: "20px", color: "white" }} />,
  },
];

const SideNavBar = ({ phoneOpen, setPhoneOpen }) => {
  const handleDrawerToggle = () => {
    setPhoneOpen(!phoneOpen);
  };

  const navContent = (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          margin: "20px 0px",
        }}
      >
        <img
          src={logo}
          alt="Smart Assistant Image"
          style={{ borderRadius: "50%", width: "30%", marginRight: "5px" }}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            fontSize: "0.1rem"
          }}
        >
          <Typography sx={{ color: "white", fontWeight: "bold" }}>
            SPMA
          </Typography>
        </Box>
      </Box>
      <SideNavContent components={components} />
    </>
  );

  return (
    <Box
      component="nav"
      sx={{
        width: { md: drawerWidthFull + 15 },
        flexShrink: { sm: 0 },
        backgroundColor: "#f0f2f5",
      }}
    >
      <Drawer
        variant="temporary"
        open={phoneOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", sm: "block" },
          "& .MuiDrawer-paper": {
            width: drawerWidthHalf,
            background:
              "linear-gradient(49deg, rgba(25,25,25,1) 15%, rgba(66,66,74,1) 85%)",
            height: "95vh",
            borderRadius: "15px",
            borderColor: "#f0f2f5",
            margin: "20px 15px",
            boxShadow:
              "rgba(0, 0, 0, 0.1) 0rem 0.25rem 0.375rem -0.0625rem, rgba(0, 0, 0, 0.06) 0rem 0.125rem 0.25rem -0.0625rem",
            "&::-webkit-scrollbar": {
              width: "12px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#333",
              borderRadius: "6px",
            },
          },
        }}
      >
        {navContent}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "none", md: "block" },
          backgroundColor: "#f0f2f5",
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidthFull,
            background:
              "linear-gradient(49deg, rgba(25,25,25,1) 15%, rgba(66,66,74,1) 85%)",
            height: "95vh",
            borderRadius: "15px",
            borderColor: "#f0f2f5",
            border: "none",
            margin: "20px 15px",
            boxShadow:
              "rgba(0, 0, 0, 0.1) 0rem 0.25rem 0.375rem -0.0625rem, rgba(0, 0, 0, 0.06) 0rem 0.125rem 0.25rem -0.0625rem",
            "&::-webkit-scrollbar": {
              width: "12px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#333",
              borderRadius: "6px",
            },
          },
        }}
        open
      >
        {navContent}
      </Drawer>
    </Box>
  );
};

export default SideNavBar;
