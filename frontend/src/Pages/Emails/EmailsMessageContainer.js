import { Box } from "@mui/material";

import EmailsMessageBubble from "./EmailMessageBubble";

const EmailsMessageContainer = ({ message }) => {
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
                <EmailsMessageBubble isBot={isBot} text={message.text} />
            </Box>
        </Box>
    );
};

export default EmailsMessageContainer;
