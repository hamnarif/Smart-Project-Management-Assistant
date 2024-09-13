from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import FileResponse
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os
from docxtpl import DocxTemplate
from pydantic import BaseModel
import uvicorn
from fastapi import BackgroundTasks
import glob
from rag import query_engine
from fastapi.encoders import jsonable_encoder
from aof import aof_gen
from pc import pc1
from mins import mins_gen
from MeetingScheduling import process_query, create_document, send_email_with_attachment
import time
from transformers import AutoTokenizer

app = FastAPI()


# origins that can communicate with the backend
origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://127.0.0.1:3000"
]

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Fixed people to be used in Meeting scheduling component
fixed_people = [
    'chairmanPunjab@gmail.com', 'chairmanSindh@gmail.com', 
    'AS.DEV.KPESE@gmail.com', 'AS.DEV.BAL@gmail.com', 
    'AS.DEV.PNDAJK@gmail.com', 'AS.DEV.GILBAL@gmail.com'
]


class UserInputRequest(BaseModel):
    user_input: str

@app.post("/process_user_input/")
async def process_user_input(request: UserInputRequest):
    user_input = request.user_input
    
        # Start timing
    start_time = time.time()

    # Perform the query
    window_response = query_engine.query(user_input)

    # End timing
    end_time = time.time()

    # Calculate time taken
    time_taken = end_time - start_time

    # Load the tokenizer
    tokenizer = AutoTokenizer.from_pretrained("BAAI/bge-small-en")  # Replace with your specific tokenizer if needed

    window_response = query_engine.query( user_input )
    
        # Tokenize the response and count the number of tokens
    response_text = str(window_response)
    response_tokens = tokenizer.tokenize(response_text)
    num_tokens = len(response_tokens)

    # Calculate tokens per second
    tokens_per_second = num_tokens / time_taken
    
    # Print the required information with spacing
    print("\n" + "="*40)
    print(f"Number of tokens: {num_tokens}")
    print(f"Time taken (seconds): {time_taken:.2f}")
    print(f"Tokens per second: {tokens_per_second:.2f}")
    print("="*40 + "\n")


    result_dict = jsonable_encoder(window_response)

    # result = chain.invoke(user_input)
    # result_dict = jsonable_encoder(result)
    return JSONResponse(content={"answer":result_dict['response']})  


# A method that clears the created files after they have been sent to the frontend.
class FileResponseWithCleanup(FileResponse):
    def __init__(self, path: str, filename: str = None, media_type: str = None, background: BackgroundTasks = None):
        self.path = path
        task = BackgroundTasks()
        task.add_task(self.cleanup_files)
        super().__init__(path, filename=filename, media_type=media_type, background=task)

    async def cleanup_files(self):
        files = glob.glob('files/*')
        for file in files:
            try:
                os.remove(file) 
                print(f"Removed file: {file}")
            except Exception as e:
                print(f"Error removing file {file}: {e}")


class StringRequest(BaseModel):
    text: str

@app.get("/")
def read_root():
    return {"Hello": "World"}


# AOF MAIN API METHODS

# The api post method that calls the aof function where all the processing happens.
@app.post('/aof')
async def aof(file: UploadFile = File(...)):

    print(file.filename)

    file_location = f"files/{file.filename}"
    
    with open(file_location, "wb+") as file_object:
        file_object.write(file.file.read())

    aof_gen()

    return "file uploaded"


# The api method that sends the created aof file to the frontend
@app.get('/aof_download')
async def downloadFile():
    filePath = "files/aof_actual.docx"
    return FileResponseWithCleanup(filePath, media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document")


# PC1 MAIN API METHODS

# The api post method that calls the pc function where all the processing happens.
# This method returns the llm response to be displayed at the frontend.
@app.post('/pc_gen')
async def pc1_gen(data: StringRequest):
    
    print(data.text)
        
    response = pc1(data.text)

    print(response)
    
    text = response['text']
    text_dict = response["text_dict"]

    return {"text": text, "json_dict": text_dict}

    # return "hi"

    # return response

# The api method that creates the pc1 document from the information provided in the frontend.
@app.post("/pc1_doc_creation")
async def pc1_doc_creation(info: dict):
    print(info)
    
    doc = DocxTemplate("documents/pc1_template.docx")
    doc.render(info)
    doc.save("files/pc1_actual.docx")
    
    return {"message": "successully edited pc1"}

# The api method that sends the created pc1 file to the frontend
@app.get("/pc1_download")
async def downloadPC():
    filePath = "files/pc1_actual.docx"
    
    return FileResponseWithCleanup(filePath, media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document")


# MINUTES OF MEETING MAIN API METHODS

# The api post method that calls the mins_gen function where all the processing happens.
# This method returns the llm response to be displayed at the frontend.
@app.post('/mins_gen')
async def mins_meeting_gen(data: StringRequest):
    
    print(data.text)    
    
    response = mins_gen(data.text)
    
    text = response['text']
    text_dict = response["json_dict"]
    
    return {"text": text, "json_dict": text_dict}

# The api method that creates the mins document from the information provided in the frontend.
@app.post("/mins_doc_creation")
async def mins_edit(info: dict):
    print(info)
    
    doc = DocxTemplate("documents/min_template.docx")
    doc.render(info)
    doc.save("files/mins_actual.docx")
    
    return {"message": "successully edited pc1"}
    
# The api method that sends the created mins file to the frontend
@app.get("/mins_download")
async def downloadMins():
    filePath = "files/mins_actual.docx"
    
    return FileResponseWithCleanup(filePath, media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document")


#  MEETING SCHEDULING MAIN API METHODS

@app.get("/email_download")
async def downloadLetter():
    filePath = "files/Letter.docx"
    
    return FileResponseWithCleanup(filePath, media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document")

# The api post method that returns the email of a single personnel
@app.post("/run-query/")
async def run_query(query_str: str = Form(...)):
    result = process_query(query_str)
    return JSONResponse(result)


@app.post("/create-document/")
async def create_document_endpoint(
    date: str = Form(...),
    letter_number: str = Form(...),
    subject: str = Form(...),
    first_paragraph: str = Form(...),
    emails: str = Form(...)
):
    email_list = [email.strip() for email in emails.split(",")]
    email_list = [email for email in email_list if email not in fixed_people]
    print(f"Creating document with emails: {email_list}")
    placeholders = ["[DATE]", "[LETTER_NUMBER]", "[SUBJECT]", "[FIRST_PARAGRAPH]"]
    replacements = [date, letter_number, subject, first_paragraph]
    doc_path = create_document(placeholders, replacements, email_list)
    return JSONResponse({"status": "success", "message": "Document created", "doc_path": doc_path})


# The api methods responsible for sending the meeting letter to the relevant selected personnel

@app.post("/send-email/")
async def send_email_endpoint(
    subject: str = Form(...),
    to_emails: str = Form(...),
    file: UploadFile = File(...)
):
    email_list = [email.strip() for email in to_emails.split(",")]
    to_emails_str = ", ".join(email_list) 

    # Ensure the 'files' directory exists
    os.makedirs("files", exist_ok=True)
    
    # Save the uploaded file
    file_location = f"files/{file.filename}"
    with open(file_location, "wb") as file_object:
        file_object.write(file.file.read())

    print(f"Sending email to: {to_emails_str} with document path: {file_location}")
    result = send_email_with_attachment(subject, to_emails_str, file_location)
    return JSONResponse(result)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
