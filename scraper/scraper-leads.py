import os
import requests
from bs4 import BeautifulSoup

# --- Load the dashboard HTML file
def load_dashboard_html():
    with open("dashboard.html", "r", encoding="utf-8") as file:
        return file.read()

# --- Extract leads from the HTML table
def extract_leads(html):
    soup = BeautifulSoup(html, "html.parser")
    table = soup.find("table", {"id": "leads-table"})
    leads = []

    if not table:
        print("❌ No table with id='leads-table' found.")
        return leads

    rows = table.find_all("tr")[1:]  # skip header row
    for row in rows:
        cols = row.find_all("td")
        if len(cols) >= 3:
            name = cols[0].text.strip()
            email = cols[1].text.strip()
            phone = cols[2].text.strip()
            leads.append({"name": name, "email": email, "phone": phone})

    return leads

# --- Send a single lead to HubSpot
def send_to_hubspot(lead, api_key):
    url = "https://api.hubapi.com/crm/v3/objects/contacts"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    data = {
        "properties": {
            "firstname": lead["name"],
            "email": lead["email"],
            "phone": lead["phone"]
        }
    }

    response = requests.post(url, headers=headers, json=data)
    return response.status_code, response.text

# --- Main function
def main():
    api_key = os.getenv("HUBSPOT_API_KEY")
    if not api_key:
        print("❌ HUBSPOT_API_KEY environment variable not set.")
        return

    html = load_dashboard_html()
    leads = extract_leads(html)

    if not leads:
        print("⚠️ No leads found.")
        return

    print(f"📤 Sending {len(leads)} leads to HubSpot...")

    for lead in leads:
        status, response = send_to_hubspot(lead, api_key)
        if status == 201:
            print(f"✅ Sent {lead['email']} successfully.")
        else:
            print(f"❌ Failed to send {lead['email']}: {status}")
            print(response)

if _name_ == "_main_":
    main()
