from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import openai

# Replace with your OpenAI API key
openai.api_key = "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"

app = FastAPI()

# Allow frontend to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with your frontend URL in production
    allow_methods=["*"],
    allow_headers=["*"],
)

class Question(BaseModel):
    question: str

@app.post("/gpt")
async def get_gpt_answer(q: Question):
    try:
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
    except Exception as e:
        return {"answer": f"Error: {str(e)}"}

# Optional GET route for browser testing
@app.get("/gpt")
def read_root():
    return {"message": "Use POST /gpt with a JSON body to get a response."}
