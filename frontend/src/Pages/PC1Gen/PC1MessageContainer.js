import { Box } from "@mui/material";
import PC1MessageBubble from "./PC1MessageBubble";

const PC1MessageContainer = ({ message }) => {
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
                <PC1MessageBubble isBot={isBot} text={message.text} />
            </Box>
        </Box>
    );
};

export default PC1MessageContainer;
