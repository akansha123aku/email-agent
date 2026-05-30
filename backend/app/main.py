from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from app.models import EmailRequest, EmailResponse
from app.agent import EmailAgent

# Load .env from current directory
load_dotenv()

app = FastAPI(title="Email Auto-Responder Agent", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY not found")

email_agent = EmailAgent(groq_api_key=GROQ_API_KEY)

@app.get("/")
async def root():
    return {"message": "Email Agent API is running!", "status": "healthy"}

@app.post("/process", response_model=EmailResponse)
async def process_email(email: EmailRequest):
    try:
        result = email_agent.process_email(email)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "ok", "agent_ready": True}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)