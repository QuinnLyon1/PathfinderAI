from fastapi import FastAPI
from pydantic import BaseModel
import openai
from fastapi.middleware.cors import CORSMiddleware

# Replace with your OpenAI API key
openai.api_key = "YOUR_API_KEY_HERE"

app = FastAPI()

# Allow React frontend to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with frontend URL in production
    allow_methods=["*"],
    allow_headers=["*"],
)

class Question(BaseModel):
    question: str

@app.post("/gpt")
async def get_gpt_answer(q: Question):
    response = openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a transportation safety assistant for ASU students."},
            {"role": "user", "content": q.question},
        ],
        temperature=0.4,
        max_tokens=300,
    )
    answer = response.choices[0].message["content"]
    return {"answer": answer}
