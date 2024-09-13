// Main Assitant component's container

import React, { useState, useRef, useEffect } from "react";

import { Box, Stack, CircularProgress } from "@mui/material";

import Message from "./Message";

import ChatTextField from "./ChatTextField";

import axios from "axios";

import { Typewriter } from "react-simple-typewriter";

const MessageContainer = () => {
  const [showUpload, setShowUpload] = useState(false);
  const [input, setInput] = useState("");
  const [displayingMsg, setDisplayingMsg] = useState(false);
  //msg stores all the incoming messages from the api
  const [msg, setMsg] = useState([
    {
      text: "How can I help you today?",
      sender: "bot",
    },
  ]);

  const messageContainerRef = useRef(null);

  // Function to scroll to the bottom of the messages when there is a new message
  const scrollToBottom = () => {
    const container = messageContainerRef.current;

    if (container) {
      container.scrollTop = container.scrollHeight - container.clientHeight;
      container.style.scrollBehavior = "smooth";

      setTimeout(() => {
        container.style.scrollBehavior = "auto";
      }, 300);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [msg]);

  // The main function where the api call is made
  const fetchApi = async (newMessages) => {
    try {
      setMsg([
        ...newMessages,
        {
          text: (
            <Stack direction="row" alignItems="center" spacing={1}>
              <CircularProgress size={25} sx={{ color: "black" }} />
            </Stack>
          ),
          sender: "bot",
        },
      ]);

      await axios
        .post(
          `http://127.0.0.1:8000/process_user_input/`, {
          user_input: input,
        }
        )
        .then((response) => {
          let message = response.data.answer;
          if (message === undefined) {
            message = "I'm sorry I couldn't find what you were looking for.";
          }
          setMsg([
            ...newMessages,
            {
              text: <Typewriter words={[message]} typeSpeed={3} />,
              sender: "bot",
            },
          ]);
        })
        .finally(() => {
          setDisplayingMsg(() => {
            console.log(displayingMsg);
          });
        });


    } catch (error) {
      console.error(error);
      setMsg([
        ...newMessages,
        {
          text: <Typewriter words={["There was an Issue"]} typeSpeed={5} />,
          sender: "bot",
        },
      ]);
    }
  };

  const handleSend = () => {
    if (input?.trim()) {
      setDisplayingMsg(true);
      const newMsg = { text: input, sender: "user" };
      const newMsgs = [...msg, newMsg];
      setMsg(newMsgs);
      setInput("");

      scrollToBottom();

      fetchApi(newMsgs);
    } else {
      setInput("")
      alert("input cannot be empty")
    }
  };

  const handleInputChange = (event) => {
    if (event !== undefined && event.target !== undefined) {
      setInput(event.target.value);
    }
  };

  return (
    <>
      <Box
        sx={{
          width: { xs: "100%", sm: "100%", md: "95%" },
          flexGrow: 1,
          padding: "10px 10px 100px 10px",
          marginTop: "15px",
          bgcolor: "white",
          borderRadius: "25px",
          boxShadow:
            "rgba(0, 0, 0, 0.1) 0rem 0.25rem 0.375rem -0.0625rem, rgba(0, 0, 0, 0.06) 0rem 0.125rem 0.25rem -0.0625rem",
          overflow: showUpload ? "hidden" : "auto",
          "&::-webkit-scrollbar": {
            display: "none",
            scrollBehavior: "smooth",
          },
          position: "relative",
        }}
        ref={messageContainerRef}
      >
        
        {msg.map((message, index) => (
          <Message key={index} message={message} />
        ))}
      </Box>
      <ChatTextField
        handleSendMessage={handleSend}
        inputValue={input}
        handleInputChange={handleInputChange}
        handleSend={handleSend}
        displayingMsg={displayingMsg}
      />
    </>
  );
};

export default MessageContainer;
