import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv('oceanlk-backend/.env')

# Get MongoDB URI
mongo_uri = os.getenv('MONGO_URI')
if not mongo_uri:
    print("MONGO_URI not found in .env, trying default local URI")
    mongo_uri = "mongodb://localhost:27017/oceanlk"

try:
    client = MongoClient(mongo_uri)
    db = client.get_database() # Uses database from connection string
    
    print(f"Connected to database: {db.name}")
    
    # 1. List all Admin Users
    print("\n--- Admin Users ---")
    users = db.admin_users.find({}, {'username': 1, 'email': 1, 'role': 1})
    user_map = {}
    for user in users:
        print(f"Username: {user.get('username')}, Email: {user.get('email')}, Role: {user.get('role')}")
        user_map[user.get('username')] = user

    # 2. List all Pending Changes
    print("\n--- Pending Changes ---")
    changes = db.pending_changes.find({})
    count = 0
    for change in changes:
        count += 1
        submitted_by = change.get('submittedBy')
        print(f"ID: {change.get('_id')}")
        print(f"  Entity: {change.get('entityType')}")
        print(f"  Action: {change.get('action')}")
        print(f"  Status: {change.get('status')}")
        print(f"  SubmittedBy: '{submitted_by}'")
        
        if submitted_by in user_map:
            print(f"  -> MATCHES existing user: {submitted_by}")
        else:
            print(f"  -> WARNING: Does NOT match any known username")
            
    if count == 0:
        print("No pending changes found.")

except Exception as e:
    print(f"Error: {e}")
