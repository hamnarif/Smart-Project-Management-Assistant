// Sign in component's main container

import React from "react";
import { Box, Typography } from "@mui/material";

import SignAppBar from "../../AppBar/SignAppBar";
import SignInContent from "./SignInContent";

import mountain from "../../../Assets/Images/mountain.jpg";

import logo from "../../../Assets/Images/logov3.png";
import { useAuth } from "../../../middleware/AuthContext";
import { Navigate } from "react-router-dom";


const SignIn = () => {

  const { session, loading } = useAuth()

  // These two ifs check if the user is signed-in, then they should not be able to access this component
  if (session !== null) {
    return <Navigate replace to={"/"} />
  }
  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <Box
      sx={{
        backgroundColor: "#f0f2f5",
        height: "100vh",
        overflow: "hidden",
        backgroundImage: `url(${mountain})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <Box sx={{ padding: "10px" }}>
        <SignAppBar option={"Sign In"} />
      </Box>

      <Box
        sx={{
          display: "flex",
          height: "92.4vh",
          width: "100vw",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            height: "500px",
            width: { xs: "320px", sm: "340px", md: "350px", lg: "350px" },
            margin: "10px",
            borderRadius: "10px",
            backgroundColor: "rgba(255,255,255,0.92)",
            position: "relative",
            boxShadow: "0px 5px 30px -10px rgba(255,255,255,1)",
          }}
        >
          <Box
            sx={{
              height: "100px",
              width: { xs: "320px", sm: "340px", md: "350px", lg: "350px" },
              backgroundColor: "transparent",
              borderRadius: "10px",
              marginTop: "-40px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100px",
                width: { xs: "270px", sm: "290px", md: "300px", lg: "300px" },
                backgroundColor: "#779baf",
                borderRadius: "10px",
                margin: "auto",
                paddingX: "20px"
              }}
            >
              <img
                src={logo}
                alt="Smart Assistant Image"
                style={{
                  borderRadius: "50%",
                  width: "15%",
                  backgroundColor: "white",
                  padding: "5px",
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  color: "white",
                  textAlign: "left",
                  marginLeft: "10px",

                }}
              >
                Smart Project Management Assistant
              </Typography>
            </Box>
            <SignInContent />
          </Box>
        </Box>
      </Box>
    </Box>
  );

};

export default SignIn;
