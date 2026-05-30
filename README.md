# 📧 Email Auto-Responder Agent

Multi-Agent System for intelligent email response automation.

## Architecture

- **Classifier Agent** - Identifies email type
- **Decision Agent** - Decides auto-reply vs human review  
- **Writer Agent** - Drafts professional responses

## Quick Start

### Backend
cd backend
pip install -r requirements.txt
cp .env.example .env
# Add GROQ_API_KEY
uvicorn app.main:app --reload

### Frontend
cd frontend
npm install
npm start
