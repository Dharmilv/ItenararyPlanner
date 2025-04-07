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

    genai.configure(api_key=api_key)  # Configure with the loaded API key
    print("✅ Gemini API configured successfully!")  # Debugging message

# Initialize the Gemini model
model = genai.GenerativeModel("gemini-pro")
print("✅ Gemini Model initialized!")

# Connect to MongoDB
MONGO_URI = "mongodb+srv://Janhavi:iHorrXDy0sjuw9P6@cluster0.pvho6w1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(MONGO_URI)
db = client["test"]

trips_collection = db["submissions"]  # Assuming this collection holds the trip data

@app.route("/generate-itinerary", methods=["POST"])
def generate_itinerary():
    data = request.json
    trip_id = data.get("trip_id")

    # Retrieve the trip data from MongoDB
    trip = trips_collection.find_one({"_id": trip_id}, {"_id": 0})
    
    if not trip:
        return jsonify({"response": "Trip not found."})

    # Extract trip details
    from_location = trip.get("from")
    destination = trip.get("destination")
    num_people = trip.get("numPeople")
    budget = trip.get("budget")
    mode_of_transport = trip.get("mode")

    # Construct the Gemini prompt using this trip data
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

    # Call the Gemini API to generate the itinerary
    response = model.generate_content(prompt)
    itinerary = response.text

    return jsonify({"itinerary": itinerary})

if __name__ == "__main__":
    setup_gemini()  # Ensure Gemini is configured before running
    app.run(debug=True, port=5001)
