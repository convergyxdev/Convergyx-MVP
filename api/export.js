// api/export.js

import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fetch from "node-fetch";

// Initialize Firebase Admin SDK only once
let app;
if (!app) {
  app = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore(app);

// HubSpot settings
const HUBSPOT_API_KEY = process.env.HUBSPOT_API_KEY;
const HUBSPOT_CONTACTS_ENDPOINT = 'https://api.hubapi.com/crm/v3/objects/contacts';

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Fetch leads from Firestore (example collection: 'leads')
    const snapshot = await db.collection("leads").limit(10).get();

    const results = [];

    for (const doc of snapshot.docs) {
      const lead = doc.data();

      const payload = {
        properties: {
          email: lead.email || "",
          firstname: lead.name || "",
          phone: lead.phone || "",
          website: lead.website || "",
          company: lead.company || "",
        }
      };

      // Send to HubSpot
      const response = await fetch(`${HUBSPOT_CONTACTS_ENDPOINT}?hapikey=${HUBSPOT_API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const hubspotResponse = await response.json();
      results.push(hubspotResponse);
    }

    return res.status(200).json({ success: true, exported: results.length, details: results });
  } catch (err) {
    console.error("Export error:", err);
    return res.status(500).json({ error: "Export failed", details: err.message });
  }
}
