import React, { useState, useRef, useEffect } from "react";

import { Box, Stack, CircularProgress, Button, Typography, useMediaQuery, useTheme } from "@mui/material";

import SendIcon from '@mui/icons-material/Send';

import Checkbox from '@mui/material/Checkbox';

import FormControlLabel from '@mui/material/FormControlLabel';

import TextField from '@mui/material/TextField';

import EmailsMessageContainer from "./EmailsMessageContainer";

import EmailsTextField from "./EmailsTextField";

import axios from "axios";

import { Typewriter } from "react-simple-typewriter";



const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

const EmailsContainer = () => {
    const [input, setInput] = useState("");
    const [displayingMsg, setDisplayingMsg] = useState(false);
    const [msg, setMsg] = useState([
        {
            text: "To get started with scheduling an email, please enter the names of the the personnal to whom the email will be sent to. Make sure you enter the personnel one by one. e.g. write: \"give me the email of xyz\" then press enter and then ask for another email.",
            sender: "bot",
        },
    ]);

    const [show, setShow] = useState(false)

    const [emails, setEmails] = useState([])

    const formList = ["date", "letterNumber", "subject", "firstParagraph", "selectedEmails"]

    const [file, setFile] = useState(null);


    useEffect(() => {
        scrollToBottom();
    }, [msg]);


    const messageContainerRef = useRef(null);

    const fixedEmails = ['chairmanPunjab@gmail.com', 'chairmanSindh@gmail.com', 'AS.DEV.KPESE@gmail.com', 'AS.DEV.BAL@gmail.com', 'AS.DEV.PNDAJK@gmail.com', 'AS.DEV.GILBAL@gmail.com']

    const [formData, setFormData] = useState({
        date: '',
        letterNumber: '',
        subject: '',
        firstParagraph: '',
        selectedEmails: fixedEmails.join(', '),
    });

    const [fetching, setFetching] = useState(false)

    const theme = useTheme()
    const isXs = useMediaQuery(theme.breakpoints.only('sm'));

    // A function that checks the inputs of the form
    const isFormDataComplete = () => {
        // Check if all fields are not empty
        const allFieldsNotEmpty = Object.values(formData).every(value => value.trim() !== '');

        // Check if selectedEmails contains valid emails
        const emails = formData.selectedEmails.split(',').map(email => email.trim());
        const validEmails = emails.every(email => isValidEmail(email) || email === '');

        return allFieldsNotEmpty && validEmails;
    };

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


    // The main function that handle the api call to the LLM
    const fetchApi = async (newMessages) => {

        console.log(input)

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


            await axios.post("http://127.0.0.1:8000/run-query", { query_str: input }, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then((response) => {
                console.log(response.data)
                console.log(response.data.emails[0])
                setMsg([
                    ...newMessages,
                    {
                        text: <Typewriter words={[response.data.response]} typeSpeed={1} />,
                        sender: "bot",
                    },
                ]);

                // storing unique emails that aren't empty
                const filteredEmails = response.data.emails.filter(email => email && email.trim() !== "");
                const uniqueFilteredEmails = [...new Set(filteredEmails)];

                // Filter out emails that are in fixedEmails
                const nonFixedEmails = uniqueFilteredEmails.filter(email => !fixedEmails.includes(email));

                // Combine unique non-fixed emails with fixedEmails
                const newEmails = [...new Set([...emails, ...nonFixedEmails])].filter(email => !fixedEmails.includes(email));

                if (newEmails.length > 0) {
                    setEmails(newEmails);
                }

                console.log(emails)

            }).finally(() => {
                setFetching(false)
                setDisplayingMsg(() => {
                    console.log(displayingMsg);
                });
            })

        } catch (error) {
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

    };


    const handleSend = async () => {
        console.log("this is the input", input)
        if (input?.trim()) {

            setDisplayingMsg(true);
            const newMsg = { text: input, sender: "user" };
            const newMsgs = [...msg, newMsg];
            setMsg(newMsgs);
            fetchApi(newMsgs);

            scrollToBottom();
            setInput("");

        }
        else {
            setInput("")
            alert("input cannot be empty")
        }
    };

    const handleInputChange = (event) => {
        if (event !== undefined && event.target !== undefined) {
            setInput(event.target.value);
        }
    };


    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    // Add the checked emails to the selectedEmails string separated by a comma (,)
    const handleCheckboxChange = (email) => (event) => {
        const { checked } = event.target;

        setFormData((prevFormData) => {
            let newSelectedEmailsArray = prevFormData.selectedEmails ? prevFormData.selectedEmails.split(', ') : [];
            if (checked) {
                newSelectedEmailsArray.push(email);
            } else {
                newSelectedEmailsArray = newSelectedEmailsArray.filter((e) => e !== email);
            }
            return {
                ...prevFormData,
                selectedEmails: newSelectedEmailsArray.join(', '),
            };
        });
    };

    const handleFormInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    // Method to call the document creation api call
    const handleSubmit = (e) => {
        e.preventDefault();

        if (isFormDataComplete()) {

            console.log(formData)

            try {
                axios.post("http://127.0.0.1:8000/create-document/", { date: formData.date, first_paragraph: formData.firstParagraph, letter_number: formData.letterNumber, emails: formData.selectedEmails, subject: formData.subject }, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then((response) => {
                    downloadLetter()
                    console.log(response.data)
                })
            } catch (error) {
                console.log("error")
                alert("there was an error")
            }
        } else {
            alert("fields cannot be left empty or have the wrong information. Check again")
        }

    };

    // Method to call the letter document download api call
    const downloadLetter = async () => {

        try {
            const response = await axios.get("http://127.0.0.1:8000/email_download", {
                responseType: "arraybuffer"
            });

            // This code creates an href link to the downloaded file and this link is automatically pressed
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', "Letter.docx");

            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);

            setShow(true)

        } catch (error) {
            alert("There was an error. Try again")
        }
    }

    // Method to send email letter to selected emails.
    const handleFileSubmit = async (e) => {

        e.preventDefault()
        console.log(file)

        if (!file) {
            alert("No file chosen");
            return;
        }

        if (file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            alert("Please upload a valid DOCX file");
            return;
        }

        try {
            axios.post("http://127.0.0.1:8000/send-email/", { subject: formData.subject, to_emails: formData.selectedEmails, file: file }, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then((response) => {
                console.log(response.data)
                alert("email sent successfully")
            })
        } catch (error) {
            alert("There was an error. Please try again.")
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
                        <EmailsMessageContainer key={index} message={message} />
                    ))}
                </Box>

                <Box
                    sx={{
                        backgroundColor: "#6785f3",
                        height: "100%",
                        width: { xs: '100%', sm: '100%', md: "47%" },
                        borderRadius: { xs: "25px", sm: "25px", md: "0px 25px 25px 0px" },
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
                        >Meeting Scheduling component</Typography>
                        <Typography
                            sx={{
                                textAlign: "center"
                            }}
                        >To get started with Email Scheduling, please follow the below steps:</Typography>
                        <ul>
                            <li>Ask for emails of personnel one by one.</li>
                            <li>The emails will be shown below in the form of checkboxes.</li>
                            <li>Some emails will be un-checkable as they are mandatory for every letter. </li>
                            <li>Some empty fields will be shown below that you have to fill. These fields contain information to be inerted into the document </li>
                            <li>After all the fields have been filled, click download document. This will download the document for proof reading. </li>
                            <li>After the document has been reviewed, upload the document from your computer.</li>
                            <li>The last step is to click on Send Email. This will send the letter to the relevant personnel.</li>
                            <li>The already checked emails below belong to fixed meeting personnel</li>

                        </ul>
                    </Box>
                    <Box>
                        <Box
                            sx={{
                                color: "black",
                                mt: 2,
                                borderRadius: "25px",
                                padding: "10px",
                            }}
                        >

                            <Box
                                sx={{
                                    backgroundColor: "white",
                                    padding: "10px",
                                    borderRadius: "25px",
                                    mb: 1,
                                    width: "100%",
                                }}
                            >
                                <Typography
                                    sx={{ textAlign: "center" }}
                                >Emails:</Typography>
                                {fixedEmails.map((option, index) => (
                                    <Box key={index}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    defaultChecked
                                                    onChange={handleCheckboxChange(option)}
                                                />
                                            }
                                            label={option}

                                        />
                                    </Box>
                                ))}
                                {emails.map((email, index) => (
                                    <Box>
                                        <FormControlLabel
                                            key={index}
                                            control={
                                                <Checkbox
                                                    onChange={handleCheckboxChange(email)}
                                                />
                                            }
                                            label={email}
                                        />
                                    </Box>
                                ))}
                            </Box>

                            <Box
                                sx={{
                                    backgroundColor: "white",
                                    boxShadow: "rgba(0, 0, 0, 0.1) 0rem 0.25rem 0.375rem -0.0625rem,rgba(0, 0, 0, 0.06) 0rem 0.125rem 0.25rem -0.0625rem",
                                    padding: "10px",
                                    borderRadius: "25px"
                                }}
                            >
                                <form noValidate autoComplete="off" onSubmit={handleSubmit}>
                                    {formList.map((form, index) => (
                                        <Box
                                            key={index}
                                            sx={{
                                                margin: "2px"
                                            }}
                                        >
                                            <label>{form}:</label>
                                            <TextField
                                                required
                                                name={form}
                                                value={formData[form]}
                                                onChange={handleFormInputChange}
                                                variant="outlined"
                                                size="small"
                                                multiline
                                                style={{
                                                    width: '100%', boxSizing: 'border-box',
                                                }}
                                                sx={{
                                                    "& .MuiInputBase-root": {
                                                        height: "auto",
                                                        '& textarea': {
                                                            overflow: "auto !important"
                                                        }
                                                    },
                                                }}
                                            />
                                        </Box>

                                    ))}

                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "end",
                                            mt: 1
                                        }}
                                    >
                                        <Button endIcon={<SendIcon />}
                                            sx={{
                                                backgroundColor: "#6785f3",
                                                color: "white",
                                                '&:hover': {
                                                    backgroundColor: '#6785f3'
                                                },
                                            }}
                                            type="submit" >
                                            Generate document
                                        </Button>

                                    </Box>
                                </form>
                            </Box>

                            {fetching && isXs && <Stack sx={{ mb: 3, mt: 3 }} direction="row" alignItems="center" spacing={1}>
                                <CircularProgress size={25} sx={{ color: "white" }} />
                                <Typography sx={{
                                    color: "white",
                                }} >Processing...</Typography>
                            </Stack>}


                        </Box>

                        {show &&
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "end",
                                    justifyContent: "center"
                                }}
                            >
                                <Box
                                    component="form"
                                    onSubmit={handleFileSubmit}

                                    sx={{

                                        display: "flex",
                                        justifyContent: "center",
                                        backgroundColor: "white",
                                        margin: "10px",
                                        padding: "10px",
                                        borderRadius: '25px',
                                        mb: 1,
                                        height: "70%",
                                        boxShadow: "rgba(0, 0, 0, 0.1) 0rem 0.25rem 0.375rem -0.0625rem,rgba(0, 0, 0, 0.06) 0rem 0.125rem 0.25rem -0.0625rem"
                                    }}

                                >

                                    <Button variant="outlined" component="label"
                                        sx={{

                                            backgroundColor: "white",
                                            color: "black",
                                            '&:hover': {
                                                backgroundColor: '#f0f2f5'
                                            },
                                            borderRadius: "15px 0px 0px 15px"


                                        }}
                                    >
                                        Choose File
                                        <input type="file" hidden onChange={handleFileChange}
                                            sx={{
                                                backgroundColor: "white"
                                            }}
                                        />
                                    </Button>
                                    <TextField
                                        variant="outlined"
                                        disabled
                                        value={file ? file.name : ''}
                                        placeholder="No file chosen"
                                        sx={{
                                            backgroundColor: "white",
                                            color: "black",

                                        }}
                                        InputProps={{
                                            sx: {
                                                textAlign: 'center',
                                                '& .MuiInputBase-input': {
                                                    textAlign: 'center',
                                                },
                                                height: "100%"
                                            },
                                        }}

                                    />
                                    <Button type="submit" variant="outlined" endIcon={<SendIcon />}
                                        sx={{
                                            backgroundColor: "#6785f3",
                                            color: "white",
                                            '&:hover': {
                                                backgroundColor: '#6785f3'
                                            },
                                            borderRadius: "0px 15px 15px 0px"

                                        }}
                                    >
                                        Send Email
                                    </Button>
                                </Box>
                            </Box>
                        }

                    </Box>
                </Box>

            </Box>
            <EmailsTextField
                handleSendMessage={handleSend}
                inputValue={input}
                handleInputChange={handleInputChange}
                handleSend={handleSend}
                displayingMsg={displayingMsg}
            />
        </>
    );
};

export default EmailsContainer;
