from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from pymongo import MongoClient
import os
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:5173", "http://localhost:5174"]}})

# Load environment variables from .env file
load_dotenv()

# Setup Gemini API
def setup_gemini():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("API key is missing! Check your .env file.")
    genai.configure(api_key=api_key)
    print("✅ Gemini API configured successfully!")

# Initialize the Gemini model
model = genai.GenerativeModel("gemini-pro")
print("✅ Gemini Model initialized!")

# Connect to MongoDB using the URI from .env
mongo_uri = os.getenv("MONGO_URI")
if not mongo_uri:
    raise ValueError("MongoDB URI is missing! Check your .env file.")

client = MongoClient(mongo_uri)
db = client["test"]
trips_collection = db["submissions"]

@app.route("/generate-itinerary", methods=["POST"])
def generate_itinerary():
    data = request.json
    trip_id = data.get("trip_id")

    trip = trips_collection.find_one({"_id": trip_id}, {"_id": 0})
    
    if not trip:
        return jsonify({"response": "Trip not found."})

    from_location = trip.get("from")
    destination = trip.get("destination")
    num_people = trip.get("numPeople")
    budget = trip.get("budget")
    mode_of_transport = trip.get("mode")

    prompt = f"""
    You are a travel assistant. The user is planning a trip with the following details:

    - From: {from_location}
    - Destination: {destination}
    - Number of people: {num_people}
    - Budget: ${budget}
    - Mode of transport: {mode_of_transport}

    Create a detailed day-wise itinerary for the user, considering their mode of transport, budget, and group size. The itinerary should include:
    - Daily activities
    - Recommended accommodations
    - Transport suggestions
    - Attractions and activities in {destination}
    """

    response = model.generate_content(prompt)
    itinerary = response.text

    return jsonify({"itinerary": itinerary})

if __name__ == "__main__":
    setup_gemini()
    app.run(debug=True, port=5001)
