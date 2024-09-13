import React from "react";
import { useRouteError } from "react-router-dom";

import { Box, Typography } from "@mui/material";

const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <Box
      sx={{
        height: "97.5vh",
        backgroundColor: "#f0f2f5",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          backgroundColor: "white",
          padding: "40px 20px",
          borderRadius: "25px",
          boxShadow:
            "rgba(0, 0, 0, 0.1) 0rem 0.25rem 0.375rem -0.0625rem, rgba(0, 0, 0, 0.06) 0rem 0.125rem 0.25rem -0.0625rem",
          overflow: "hidden",
        }}
      >
        <Typography variant="h5" sx={{ width: "100%" }}>
          Sorry, an unexpected error has occured
        </Typography>
        <Typography variant="h9">
          {error.statusText || error.message}
        </Typography>
      </Box>
    </Box>
  );
};

export default ErrorPage;
