from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import openai

app = Flask(__name__)
CORS(app)

openai.api_key = os.getenv("OPENAI_API_KEY")

SYSTEM_PROMPT = """
You are a professional IT support assistant.
Provide clear, step-by-step troubleshooting for issues involving:
- Windows
- WiFi/networking
- Azure AD login
- Intune device issues
- Office 365 apps
- MFA problems
- Printer issues
Keep answers simple, actionable, and avoid jargon.
"""

@app.route("/ask", methods=["POST"])
def ask():
    data = request.json
    user_message = data.get("message", "")

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_message}
            ]
        )

        answer = response["choices"][0]["message"]["content"]
        return jsonify({"reply": answer})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/", methods=["GET"])
def home():
    return "Tech Self-Help AI Backend Running"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

