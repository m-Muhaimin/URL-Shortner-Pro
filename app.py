from flask import Flask, render_template, request, redirect
from pymongo import MongoClient
import shortuuid

app = Flask(__name__)

# MongoDB connection
client = MongoClient("mongodb+srv://mongo:mongo1234@cluster0.mcicwho.mongodb.net/")
db = client["url_shortener"]
collection = db["urls"]

# Home route
@app.route("/")
def home():
    return render_template("index.html")

# Shorten URL route
@app.route("/shorten", methods=["POST"])
def shorten_url():
    original_url = request.form["url"]

    # Check if the original URL already exists in the database
    existing_url = collection.find_one({"original_url": original_url})

    if existing_url:
        short_id = existing_url["short_id"]
        short_url = request.host_url + short_id
    else:
        # Generate short URL
        short_id = generate_short_id()
        short_url = request.host_url + short_id

        # Store the mapping in the MongoDB collection
        collection.insert_one({"short_id": short_id, "original_url": original_url})

    return render_template("result.html", original_url=original_url, short_url=short_url)

# Redirection route for shortened URLs
@app.route("/<short_id>")
def redirect_url(short_id):
    # Retrieve the original URL from the MongoDB collection
    result = collection.find_one({"short_id": short_id})

    if result:
        original_url = result["original_url"]
        return redirect(original_url, code=302)  # Perform redirection
    else:
        return render_template("error.html", message="Short URL not found")

def generate_short_id():
    return shortuuid.uuid()[0:8]  # Generate a short ID using shortuuid

if __name__ == "__main__":
    app.run(debug=True)
