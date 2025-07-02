import requests
from bs4 import BeautifulSoup
import re
import time

HEADERS = {
    "User-Agent": "Mozilla/5.0"
}

def search_duckduckgo(query, max_results=10):
    url = f"https://html.duckduckgo.com/html/?q={query}"
    response = requests.get(url, headers=HEADERS)
    if response.status_code != 200:
        print("DuckDuckGo search failed.")
        return []

    soup = BeautifulSoup(response.text, "html.parser")
    links = []

    for a in soup.find_all("a", class_="result__a", href=True):
        if len(links) >= max_results:
            break
        href = a['href']
        if href.startswith("http"):
            links.append(href)

    return links

def extract_emails(text):
    return list(set(re.findall(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}", text)))

def extract_phones(text):
    return list(set(re.findall(r"\+?\d[\d\s\-().]{7,}\d", text)))

def scrape_site(url):
    try:
        response = requests.get(url, headers=HEADERS, timeout=10)
        if response.status_code != 200:
            return None

        soup = BeautifulSoup(response.text, "html.parser")
        text = soup.get_text()

        emails = extract_emails(text)
        phones = extract_phones(text)

        return {
            "url": url,
            "emails": emails,
            "phones": phones
        }

    except requests.RequestException as e:
        print(f"Failed to scrape {url}: {e}")
        return None

def main():
    query = "marketing agencies in USA"
    print(f"Searching DuckDuckGo for: {query}\n")
    links = search_duckduckgo(query)

    leads = []
    for link in links:
        print(f"Scraping {link} ...")
        data = scrape_site(link)
        if data:
            leads.append(data)
            print(f"✅ Found: {data['emails']} | {data['phones']}")
        else:
            print("❌ No data found.")
        time.sleep(2)  # delay to avoid hitting servers too fast

    print("\n📋 Final Leads Collected:")
    for lead in leads:
        print(lead)

if _name_ == "_main_":
    main()
