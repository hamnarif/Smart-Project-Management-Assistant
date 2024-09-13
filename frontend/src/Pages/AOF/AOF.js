// Authorization of funds component

import React, { useState } from "react";

import { Box, Typography, Button, TextField } from "@mui/material";

import SendIcon from '@mui/icons-material/Send';

import axios from 'axios'

const AOF = () => {


    const [file, setFile] = useState(null);

    const handleChange = (event) => {
        setFile(event.target.files[0]);
    };

    // Main function to handle api call
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!file) {
            alert("No file chosen");
            return;
        }

        console.log(file);

        if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            alert("Please upload a valid XLSX file");
            return;
        }

        const formData = new FormData();

        formData.append("file", file)

        try {
            await axios.post("http://127.0.0.1:8000/aof", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },

            }).then((uploadResponse) => {
                if (uploadResponse.status === 200) {
                    downloadFile()
                } else {
                    alert("file upload error")
                }
            })

        } catch (error) {
            console.log("error uploading the file", error)
            alert("Error, please make sure you're uploading the right policies excel file")
        }

    };

    // function to automatically download the files sent from the backend
    const downloadFile = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/aof_download", {
                responseType: "arraybuffer"
            });

            // This code creates an href link to the downloaded file and this link is automatically pressed
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', "aof_actual.docx");

            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);

        } catch (error) {
            console.log("masla agaya bhai")
        }
    }


    return (
        <Box
            sx={{

                height: "100%",
                width: "95%",
                marginTop: "15px",
                padding: "5px",
                borderRadius: "25px",
                backgroundColor: "white",
                overflow: "auto",
                boxShadow:
                    "rgba(0, 0, 0, 0.1) 0rem 0.25rem 0.375rem -0.0625rem, rgba(0, 0, 0, 0.06) 0rem 0.125rem 0.25rem -0.0625rem",
                "&::-webkit-scrollbar": {
                    display: "none",
                    scrollBehavior: "smooth",
                },
            }}
        >
            <Box
                sx={{
                    height: "100%",
                    width: "100%",
                    backgroundColor: "#f0f2f5",
                    borderRadius: "25px",
                    display: 'flex',
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Box
                    sx={{
                        backgroundColor: "white",
                        width: { xs: "90%", sm: "70%", md: "65%", lg: "50%" },
                        height: "90%",
                        borderRadius: "25px",
                        padding: "5px",
                        boxShadow:
                            "rgba(0, 0, 0, 0.1) 0rem 0.25rem 0.375rem -0.0625rem, rgba(0, 0, 0, 0.06) 0rem 0.125rem 0.25rem -0.0625rem",
                        overflow: "auto",
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
                    <Typography
                        sx={{
                            color: "#6785f3",
                            textAlign: "center",
                            fontSize: "25px",
                            fontWeight: "bold"
                        }}
                    >Authorization of Funds Generation</Typography>

                    <Box
                        sx={{
                            padding: "20px 20px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center"
                        }}
                    >
                        <Typography
                            sx={{
                                textAlign: "center"
                            }}
                        >To get started with generating the document, please follow these steps:</Typography>
                        <Box
                            sx={{
                                backgroundColor: "#6785f3",
                                borderRadius: "25px",
                                color: "white",
                                margin: "20px 0px"
                            }}
                        >
                            <ul>
                                <li>Select the policy excel file from your files (e.g. policy.xlsx).</li>
                                <li>Upload the file.</li>
                                <li>Your document will be downloaded in the form of Ms Word docx file.</li>
                                <li>After reviewing the contents of the file, you can further convert the file into a pdf (optional). However, this will require you to upload your word .docx file.</li>
                            </ul>
                        </Box>
                        <Box
                            sx={{
                                backgroundColor: "#6785f3",
                                borderRadius: "25px",
                                width: "100%",
                                padding: "20px 20px",
                                display: 'flex',
                                flexDirection: 'column',
                                gap: "10px"
                            }}
                            component="form"
                            onSubmit={handleSubmit}
                        >
                            <Button variant="outlined" component="label"
                                sx={{
                                    backgroundColor: "white",
                                    color: "black",
                                    '&:hover': {
                                        backgroundColor: '#f0f2f5'
                                    },
                                    borderRadius: "15px 15px 0px 0px"
                                }}>
                                Upload policy file
                                <input type="file" hidden onChange={handleChange}

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
                                    },
                                }}

                            />
                            <Button type="submit" variant="outlined" endIcon={<SendIcon />}
                                sx={{
                                    backgroundColor: "white",
                                    color: "black",
                                    '&:hover': {
                                        backgroundColor: '#f0f2f5'
                                    },
                                    borderRadius: "0px 0px 25px 25px"
                                }}
                            >
                                Download AOF
                            </Button>
                            
                        </Box>

                    </Box>

                </Box>
            </Box>
        </Box>
    );

};

export default AOF;
