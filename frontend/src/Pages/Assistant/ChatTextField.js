import React from "react";

import { Box, TextField, InputAdornment, Tooltip } from "@mui/material";

import SendOutlinedIcon from "@mui/icons-material/SendOutlined";

import "../Error/RouterLink.css";

const ChatTextField = ({
  handleSendMessage,
  inputValue,
  handleInputChange,
  handleSend,
  displayingMsg,
}) => {
  return (
    <Box
      sx={{
        margin: "0px auto",
        width: "85%",
        boxSizing: "border-box",
        background: "transparent",
        padding: "20px 20px 20px 20px",
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
      }}
    >
      <TextField
        multiline
        InputProps={{
          style: {
            borderRadius: "25px",
            boxShadow:
              "rgba(0, 0, 0, 0.1) 0rem 0.25rem 0.375rem -0.0625rem, rgba(0, 0, 0, 0.06) 0rem 0.125rem 0.25rem -0.0625rem",
            margin: "auto",
            backgroundColor: "#f0f2f5",
            padding: "20px",
            fontSize: "0.875rem",
          },
          endAdornment: (
            <InputAdornment position="end">
              <Tooltip title="Send Message" arrow>
                <SendOutlinedIcon
                  style={{
                    cursor: "pointer",
                    padding: "6px",
                    color: "#7b809a",
                    fontSize: "30px",
                  }}
                  onClick={handleSendMessage}
                />
              </Tooltip>
            </InputAdornment>
          ),
        }}
        size="small"
        fullWidth
        placeholder="Send a message"
        variant="outlined"
        value={inputValue}
        onChange={handleInputChange}
        onKeyUp={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            handleSend();
          } else if (event.key === "Enter" && event.shiftKey) {
            handleInputChange((prevInput) => prevInput + "\n");
          }
        }}
        disabled={displayingMsg}
        sx={{
          "& .MuiInputBase-root": {
            height: "auto",
            bgcolor: "tomato",
            '& textarea': {
              overflow: "auto !important"
            }
          },
          "& textarea": {
            maxHeight: "200px",
          },
          "&:hover": {
            "& fieldset": {
              borderWidth: 0,
              borderColor: "transparent",
            },
          },
        }}
      />
    </Box>
  );
};

export default ChatTextField;
