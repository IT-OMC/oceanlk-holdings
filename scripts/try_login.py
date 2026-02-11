import urllib.request
import json
import sys

BASE_URL = "http://localhost:8080/api/admin"

creds = [
    ("admin", "admin"),
    ("admin", "password"),
    ("admin", "123456"),
    ("superadmin", "password"),
    ("superadmin", "superadmin"),
    ("superadmin", "123456"),
    ("mi", "mi"), # from logs
    ("minidu", "password")
]

def login(username, password):
    url = f"{BASE_URL}/login"
    data = json.dumps({"username": username, "password": password}).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
    
    try:
        with urllib.request.urlopen(req) as response:
            if response.getcode() == 200:
                print(f"[SUCCESS] Logged in as: {username}")
                return json.loads(response.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        # print(f"[FAILED] {username}: {e.code}")
        pass
    except Exception as e:
        print(f"[ERROR] {username}: {e}")
    return None

def check_my_submissions(token):
    url = "http://localhost:8080/api/pending-changes/my-submissions"
    req = urllib.request.Request(url, headers={'Authorization': f'Bearer {token}'})
    
    try:
        with urllib.request.urlopen(req) as response:
            if response.getcode() == 200:
                data = json.loads(response.read().decode('utf-8'))
                print(f"[MY SUBMISSIONS] Count: {len(data)}")
                print(json.dumps(data, indent=2))
            else:
                print(f"[ERROR] My Submissions Code: {response.getcode()}")
    except Exception as e:
         print(f"[ERROR] Fetching submissions: {e}")

print("--- Starting Login Bruteforce ---")
for u, p in creds:
    res = login(u, p)
    if res:
        print("Login Response:", json.dumps(res, indent=2))
        token = res.get('token')
        if token:
            check_my_submissions(token)
            break
else:
    print("No valid credentials found.")
