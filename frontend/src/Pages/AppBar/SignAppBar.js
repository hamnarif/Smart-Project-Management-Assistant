import * as React from "react";

import { Typography, IconButton, Box, AppBar, Toolbar } from "@mui/material";

import AccountCircle from "@mui/icons-material/AccountCircle";

import "../Error/RouterLink.css";

export default function SignAppBar() {
  return (
    <Box
      sx={{
        flexGrow: 1,
      }}
    >
      <AppBar
        position="static"
        elevation={3}
        sx={{
          borderRadius: "10px",
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "saturate(200%) blur(1.875rem)",
          boxShadow: "none",
          color: "black",
          justifyContent: "center",
          height: "40px",
          boxShadow:
            "rgba(0, 0, 0, 0.1) 0rem 0.25rem 0.375rem -0.0625rem, rgba(0, 0, 0, 0.06) 0rem 0.125rem 0.25rem -0.0625rem",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            height: "100px",
          }}
        >
          <Box sx={{ width: "150px" }}>
            <Typography
              sx={{
                display: "flex",
                alignItems: "center",
                color: "white",
              }}
            >
              Login
            </Typography>
          </Box>

          <Box
            sx={{
              width: "100%",
              justifyContent: "center",
              display: { xs: "none", sm: "flex", md: "flex", lg: "flex" },
            }}
          ></Box>

          <Box sx={{ flexGrow: 1 }} />

          <Box
            sx={{
              display: "flex",
              width: "100px",
              justifyContent: "end",
            }}
          >
            <IconButton size="medium" edge="end" color="inherit">
              <AccountCircle sx={{ fontSize: "1.23rem", color: "white" }} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
