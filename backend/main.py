from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import openai
import requests

# OpenAI key
openai.api_key = "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"

app = FastAPI()

app = FastAPI()

# Allow frontend to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  
    allow_methods=["*"],
    allow_headers=["*"],
)

class Question(BaseModel):
    question: str



def get_weather():
    try:
        # Example: OpenWeatherMap API for Tempe, AZ
        api_key = "231e78f156e2f25565444df8c7b7b277"
        url = f"http://api.openweathermap.org/data/2.5/weather?q=Tempe,US&units=imperial&appid={api_key}"
        res = requests.get(url).json()

        weather = {
            "description": res["weather"][0]["description"],
            "temp": res["main"]["temp"],
            "wind_speed": res["wind"]["speed"],
            "dust_alert": "dust" in res["weather"][0]["description"].lower(),
            "rain_alert": "rain" in res["weather"][0]["description"].lower()
        }
        return weather
    except:
        return None



@app.post("/gpt")
async def get_gpt_answer(q: Question):
    weather = get_weather()
    system_message = "You are a transportation safety assistant for ASU students."
    
    if weather:
        system_message += (
            f" The current weather is {weather['description']}, "
            f"temperature {weather['temp']}°F, wind {weather['wind_speed']} mph. "
        )
        if weather['dust_alert']:
            system_message += "There is a dust alert active. "
        if weather['rain_alert']:
            system_message += "There is a rain/flooding alert active. "
    
    try:
        response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": q.question},
            ],
            temperature=0.4,
            max_tokens=300,
        )
        answer = response.choices[0].message.content
        return {"answer": answer, "weather": weather}
    except Exception as e:
        return {"answer": f"Error: {str(e)}", "weather": weather}
