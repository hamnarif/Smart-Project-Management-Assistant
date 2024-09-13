import { Box } from "@mui/material";
import MinsMessageBubble from "./MinsMessageBubble" 

const MinsMessageContainer = ({ message }) => {
    const isBot = message.sender === "bot";

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: isBot ? "flex-start" : "flex-end",
                mb: 3,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: isBot ? "row" : "row-reverse",
                    alignItems: "center",
                    overflow: "auto",

                }}
            >
                <MinsMessageBubble isBot={isBot} text={message.text} />
            </Box>
        </Box>
    );
};

export default MinsMessageContainer;
