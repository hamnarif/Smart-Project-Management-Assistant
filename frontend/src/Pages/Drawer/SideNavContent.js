import { useState } from "react";

import { Box, Paper, Stack, Typography } from "@mui/material";

import { Link, useLocation } from "react-router-dom";

import "../Error/RouterLink.css";

import { useAuth } from "../../middleware/AuthContext";

function SideNavContent({ components }) {
  const [selectedChat, setSelectedChat] = useState();

  const setChatIndex = (index) => {
    setSelectedChat(index);
  };

  const { session, role } = useAuth()

  console.log(session)

  const { pathname } = useLocation();

  return (
    <Box
      sx={{
        overflow: "auto",
        "&::-webkit-scrollbar": {
          width: "8px",
          marginRight: "20px",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "gray",
          borderRadius: "6px",
        },
        "&::-webkit-scrollbar-button": {
          display: "none",
        },
      }}
    >
      {session ? components.map((component, index) => {

        console.log(component.text)

        // Displaying components based on the user's role.
        if (role === "Research Officer" && (component.text === "PC1" || component.text === "Authorization of Funds" || component.text === "Minutes of Meeting")) {
          return null
        }
        else if (role === "Executive dept official" && (component.text === "Meeting Scheduling" || component.text === "Authorization of Funds")) {
          return null;
        }
        else if (role === "Cheif P & D" && (component.text === "PC1" || component.text === "Minutes of Meeting" || component.text === "Meeting Scheduling")) {
          return null;
        }
        else if (role === "Normal" && (component.text === "PC1" || component.text === "Meeting Scheduling" || component.text === "Minutes of Meeting" || component.text === "Authorization of Funds")) {
          return null;
        }
        else {

          return (
            <Link
              to={`${component.text}`}
              className="custom-link"
              key={index}
            >
              <Paper
                elevation={3}
                sx={{
                  margin: "20px 10px",
                  padding: "15px",
                  borderRadius: "10px",
                  background: "transparent",
                  background:
                    component.text === "Assistant" && pathname === "/"
                      ? "#6785f3"
                      : component.text ===
                        decodeURIComponent(pathname.slice(1)) ||
                        component.text ===
                        decodeURIComponent(pathname.slice(11)) ||
                        component.text === ""
                        ? "#6785f3"
                        : "none",
                  cursor: "pointer",
                  boxShadow: "none",
                  "&:hover": {
                    backgroundColor: index != selectedChat ? "#5c636b" : "none",
                  },
                }}
                onClick={() => {
                  setChatIndex(index);
                }}
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  {component.icon}
                  <Box
                    sx={{
                      display: "flex",
                      width: "100%",
                      // flexDirection: "column",
                      justifyContent: "space-between",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Typography
                      fontSize={"0.8754rem"}
                      sx={{
                        color: "white",
                        fontWeight: "normal",
                      }}
                    >
                      {component.text}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Link>
          );
        }

      }) : null}
    </Box>
  );
}

export default SideNavContent;
