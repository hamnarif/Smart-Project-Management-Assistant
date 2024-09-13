import React from "react";

import { Box, Container, CssBaseline, Typography } from "@mui/material";

import "../../Error/RouterLink.css";

import { Auth } from "@supabase/auth-ui-react";

import { useAuth } from "../../../middleware/AuthContext";


const SignInContent = () => {

  // the supabase object to be used for google login
  const { supabase } = useAuth()

  return (
    <Container component="main" maxWidth='xs' >
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",

        }}
      >
        <Box
          sx={{
            cursor: "pointer",
            width: "280px",
            height: "430px",
            display: "flex",
            flexDirection: "column",
            padding: "10px",
            justifyContent: "flex-start",
            alignItems: "center",
            mt: 5
          }}
        >
          <Typography
            variant="h4"
            sx={{
              lineHeight: "30px",
              textAlign: "center",
              ml: 1,
              height: "30px",
              alignItems: "center",
              fontWeight: "bold",
              color: "#5c7989",
            }}
          >
            Welcome!
          </Typography>
          <Typography variant="body2" sx={{ textAlign: "justify", my: 3 }}>
            Introducing the power of Large Language Models in the realm of project management. Here to simplify your project workflow, enhance efficiency, and elevate your overall project management experience. Log in now to get started.
          </Typography>
          <Auth supabaseClient={supabase}
            providers={["google"]}
            onlyThirdPartyProviders
            appearance={{
              style: {
                button: { background: 'white', color: 'black', padding: "10px", boxShadow: "0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)", borderColor: "transparent", borderRadius: "10px" },

              },
            }}
          />
        </Box>
      </Box>
    </Container>
  )


};

export default SignInContent;
