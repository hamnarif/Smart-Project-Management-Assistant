import { Paper, Typography } from "@mui/material";

const MessageBubble = ({ isBot, text }) => {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        marginRight: isBot ? "40px" : "0px",
        marginLeft: isBot ? "0px" : "40px",
        border: "none",
        background: isBot ? "rgba(201,223,255,1)" : "#6785f3",
        borderRadius: isBot ? "20px 20px 20px 8px" : "20px 20px 8px 20px",
      }}
    >
      <Typography
        variant="body1"
        component={"span"}
        sx={{ color: isBot ? "black" : "white", whiteSpace: "pre-wrap", }}
      >
        {text}
      </Typography>
    </Paper>
  );
};

export default MessageBubble;
