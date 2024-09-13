import React, { useState, useEffect } from "react";

import {
  Typography,
  Toolbar,
  Box,
  IconButton,
  AppBar,
  Tooltip,
} from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import LogoutSharpIcon from "@mui/icons-material/LogoutSharp";

import { Link, useLocation } from "react-router-dom";

import "../Error/RouterLink.css";

import { useAuth } from "../../middleware/AuthContext";

export default function SecondaryAppBar() {
  const [link, setLink] = useState("");

  const { pathname } = useLocation();

  const { session, supabase } = useAuth()

  // getting username from the supaabse session object
  const user = session?.user.identities[0].identity_data.full_name.split(" ")[0]

  console.log(user)

  // getting the profile picture from the supabase session object
  const avatar = session?.user.identities[0].identity_data.avatar_url

  console.log(avatar)

  // use to set the text of the breadcrumb in the navbar
  useEffect(() => {
    if (pathname === "/") {
      setLink("Assistant");
    } else {
      const parts = pathname.split("/");
      setLink(parts[parts.length - 1]);
    }
  }, [pathname]);

  const handleLogout = () => {
    supabase.auth.signOut()
  }

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
          background: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "saturate(200%) blur(1.875rem)",
          color: "black",
          justifyContent: "center",
          height: "40px",
          boxShadow:
            "rgba(0, 0, 0, 0.1) 0rem 0.25rem 0.375rem -0.0625rem, rgba(0, 0, 0, 0.06) 0rem 0.125rem 0.25rem -0.0625rem",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", width: "100%" }}>
            <Link to="/Assistant" className="custom-link">
              <HomeIcon
                sx={{
                  mr: 0.5,
                  color: "rgb(52, 71, 103)",
                  margin: "auto",
                }}
                fontSize="inherit"
              />
            </Link>
            /
            <Typography
              sx={{
                color: "#7b809a",
                marginLeft: "5px",
              }}
            >
              {decodeURIComponent(link)}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "end",
                width: "120px",
                height: "100%",
                paddingX: "5px",
                borderRadius: "20px",
              }}
            >

              <Box
                sx={{
                  width: "30px",
                  height: "30px",

                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  src={avatar}
                  alt="Profile"
                  style={{
                    width: '90%',
                    height: '90%',
                    borderRadius: "50%",
                    objectFit: 'cover'
                  }}
                />
              </Box>
              <Typography
                sx={{
                  marginY: "auto",
                  marginLeft: "5px",
                  color: "#7b809a",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user}
              </Typography>
            </Box>
            <Box
              sx={{
                padding: "5px",
                borderRadius: "10px",
              }}
              onClick={handleLogout}
            >
              <Tooltip title="Logout" arrow>
                <IconButton size="medium" edge="end" sx={{ cursor: "default" }}>
                  <LogoutSharpIcon
                    sx={{
                      padding: "0px",
                      fontSize: "1.23rem",
                      color: "rgb(52, 71, 103)",
                      cursor: "pointer",
                    }}
                  />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
