import React, { useState, useRef, useEffect } from "react";

import { Box, Stack, CircularProgress, Button, Typography } from "@mui/material";

import PC1MessageContainer from "./PC1MessageContainer";

import PC1TextField from "./PC1TextField";

import axios from "axios";

import { Typewriter } from "react-simple-typewriter";

import SendIcon from '@mui/icons-material/Send';


const AutoExpandTextarea = ({ id, name, value, onChange }) => {

    const textareaRef = useRef(null);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, [value]);

    return (
        <textarea
            ref={textareaRef}
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', resize: 'none' }}
        />
    );
};

const PC1Container = () => {
    const [input, setInput] = useState("");
    const [displayingMsg, setDisplayingMsg] = useState(false);
    const [keyValPairs, setKeyValPairs] = useState({})
    const [fetching, setFetching] = useState(false)
    const [msg, setMsg] = useState([
        {
            text: "To get started with creating a PC1 document, write the text that you want inserted in the document. Make sure the text is in the form of paragraphs.",
            sender: "bot",
        },
    ]);
    const [cancelToken, setCancelToken] = useState('')

    useEffect(() => {
        console.log("key vals length")
        console.log(Object.keys(keyValPairs).length === 0)
    }, [keyValPairs])


    useEffect(() => {
        scrollToBottom();
    }, [msg]);


    const messageContainerRef = useRef(null);

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


    const fetchApi = async (newMessages) => {

        console.log(Object.keys(keyValPairs).length === 0)

        console.log(newMessages)

        if (cancelToken) {
            cancelToken.cancel("Canceling previous request")
        }

        const source = axios.CancelToken.source()
        setCancelToken(source)

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

            setFetching(true)

            await axios.post("http://127.0.0.1:8000/pc_gen", { text: input }, { cancelToken: source.token }).then((response) => {
                console.log(response.data)
                setMsg([
                    ...newMessages,
                    {
                        text: <Typewriter words={[response.data.text]} typeSpeed={1} />,
                        sender: "bot",
                    },
                ]);
                setKeyValPairs((response.data.json_dict))
                console.log(keyValPairs)
            }).finally(() => {
                setFetching(false)
                setDisplayingMsg(() => {
                    console.log(displayingMsg);
                });
            })

        } catch (error) {
            console.error(error);
            if (axios.isCancel(error)) {
                console.log('API request cancelled');
                alert("Api request has been cancelled")
            } else {
                console.error(error);
                alert("There was an error. Try again")
                setMsg([
                    ...newMessages,
                    {
                        text: <Typewriter words={["There was an Issue"]} typeSpeed={5} />,
                        sender: "bot",
                    },
                ]);
            }
        }

    };

    const handleSend = async () => {
        if (input !== "" || input !== undefined) {

            console.log(input)

            setDisplayingMsg(true);
            const newMsg = { text: input, sender: "user" };
            const newMsgs = [...msg, newMsg];
            setMsg(newMsgs);
            fetchApi(newMsgs);

            scrollToBottom();
            setInput("");

        }
    };

    const handleInputChange = (event) => {
        if (event !== undefined && event.target !== undefined) {
            setInput(event.target.value);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setKeyValPairs({ ...keyValPairs, [name]: value });
    };


    // Method to download the PC1 document
    const downloadPC1 = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/pc1_download", {
                responseType: "arraybuffer"
            });

            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', "pc1_actual.docx");

            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);

        } catch (error) {
            alert("There was an error. Try again")
            console.log("masla agaya bhai")
        }
    }

    // Method to create PC1 document based on the text from the form
    const handleCreatePC1 = async () => {
        console.log(keyValPairs)

        try {
            await axios.post("http://127.0.0.1:8000/pc1_doc_creation", keyValPairs).then((response) => {
                console.log(response.data)
                downloadPC1()
            })
        } catch (error) {
            console.log("error in handlecreatepc1", error)
        }
    }


    return (
        <>
            <Box
                sx={{
                    width: { xs: "100%", sm: "100%", md: "95%" },
                    flexGrow: 1,
                    padding: "10px 10px 50px 10px",
                    marginTop: "15px",
                    bgcolor: "white",
                    borderRadius: "25px",
                    boxShadow:
                        "rgba(0, 0, 0, 0.1) 0rem 0.25rem 0.375rem -0.0625rem, rgba(0, 0, 0, 0.06) 0rem 0.125rem 0.25rem -0.0625rem",
                    overflow: "auto",
                    "&::-webkit-scrollbar": {
                        display: "none",
                        scrollBehavior: "smooth",
                    },
                    position: "relative",
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: { xs: 'column', sm: 'row' },
                }}
                ref={messageContainerRef}
            >


                <Box
                    sx={{
                        height: "100%",
                        width: { xs: '0%', sm: '0%', md: "52%" },
                        display: { xs: "none", sm: "none", md: "block" },
                        borderRadius: "25px 0px 0px 25px",
                        padding: "10px",
                        overflowY: "auto",
                        "&::-webkit-scrollbar": {
                            width: "1px",
                            height: "1px",
                        },
                        "&::-webkit-scrollbar-thumb": {
                            background: "white",
                            borderRadius: "6px",
                        },
                        "&::-webkit-scrollbar-button": {
                            display: "none",
                        },
                    }}
                >
                    {msg.map((message, index) => (
                        <PC1MessageContainer key={index} message={message} />
                    ))}
                </Box>
                <Box
                    sx={{
                        backgroundColor: "#6785f3",
                        height: "100%",
                        width: { xs: '100%', sm: '100%', md: "47%" },
                        borderRadius: { xs: "0px 0px 25px 25px", sm: "0px 25px 25px 0px" },
                        overflowY: "auto",
                        padding: "20px",
                        color: "white",
                        "&::-webkit-scrollbar": {
                            width: "1px",
                            height: "1px",
                        },
                        "&::-webkit-scrollbar-thumb": {
                            background: "white",
                            borderRadius: "6px",
                        },
                        "&::-webkit-scrollbar-button": {
                            display: "none",
                        },

                    }}
                >
                    <Box
                        sx={{
                            backgroundColor: "white",
                            color: 'black',
                            borderRadius: "25px",
                            padding: "10px",
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: "20px",
                                fontWeight: "bold",
                                textAlign: "center",
                                color: "#6785f3"
                            }}
                        >PC1 Generation</Typography>
                        <Typography
                            sx={{
                                textAlign: "center"
                            }}
                        >To get started with PC1 generation, please follow the below steps:</Typography>
                        <ul>
                            <li>Give information about the project to the text box in the form of paragraphs.</li>
                            <li>Make sure the text is specific to make it easier for the model to understand.</li>
                            <li>After you're satisfied with your text, press Enter.</li>
                            <li>After processing, the filled fields will be displayed on the right side. These fields are to enable the edit functionality.</li>
                            <li>When you're satisfied with your changes, press CREATE PC1 and this will download the PC1 file. </li>
                        </ul>
                    </Box>

                    <Box
                        sx={{
                            mt: 2,
                            wordWrap: "break-word",
                        }}
                    >   {fetching && <Stack direction="row" alignItems="center" spacing={1}>
                        <CircularProgress size={25} sx={{ color: "white" }} />
                        <Typography>Processing...</Typography>
                    </Stack>}

                        <form>
                            {Object.entries(keyValPairs).map(([key, val], index) => (
                                <>
                                    <label>{key}:</label>

                                    <AutoExpandTextarea
                                        id={key}
                                        name={key}
                                        value={val}
                                        onChange={handleChange}
                                    />
                                </>
                            ))}
                        </form>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "end",
                            marginTop: "5px"
                        }}
                    >
                        {Object.keys(keyValPairs).length > 0 &&
                            <Button
                                endIcon={<SendIcon />}
                                sx={{
                                    backgroundColor: "white",
                                    '&:hover': {
                                        backgroundColor: '#f0f2f5'
                                    },
                                }}
                                onClick={handleCreatePC1}
                            >Create PC1</Button>
                        }


                    </Box>
                </Box>


            </Box>
            <PC1TextField
                handleSendMessage={handleSend}
                inputValue={input}
                handleInputChange={handleInputChange}
                handleSend={handleSend}
                displayingMsg={displayingMsg}
            />
        </>
    );
};

export default PC1Container;
