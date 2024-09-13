import { Box } from "@mui/material";
import MessageBubble from "./MessageBubble";

const Message = ({ message }) => {
  const isBot = message.sender === "bot";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isBot ? "row" : "row-reverse",
        alignItems: "center",
        mb: 3
      }}
    >
    <MessageBubble isBot={isBot} text={message.text} />
    </Box> 
  );
};

export default Message;
