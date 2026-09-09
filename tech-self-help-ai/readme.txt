# Tech Self-Help AI

A lightweight AI-powered troubleshooting assistant built with:
- Python Flask backend
- HTML/CSS/JavaScript frontend
- Render deployment
- GitHub version control

## ?? Project Structure

tech-self-help-ai/
+-- backend/
¦   +-- app.py
¦   +-- requirements.txt
¦   +-- config_example.py
+-- frontend/
¦   +-- index.html
¦   +-- style.css
¦   +-- script.js
+-- render.yaml
+-- README.md

## ?? Features
- AI-driven troubleshooting responses
- Supports Windows, Azure AD, Intune, Office 365, MFA, networking, and printers
- Clean chat-style web interface
- Backend + frontend fully separated for easy deployment

## ?? Backend (Flask)
The backend exposes:
- `POST /ask` ? sends user message to the AI model
- `GET /` ? health check endpoint

Environment variable required:
- `OPENAI_API_KEY`

## ?? Frontend
Simple HTML/CSS/JS interface that:
- Sends user messages to the backend
- Displays AI responses in a chat UI

Update `script.js` with your Render backend URL:

Get Outlook for iOS