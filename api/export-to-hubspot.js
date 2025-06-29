// /api/export-to-hubspot.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const leads = req.body.leads || [];
  const HUBSPOT_TOKEN = process.env.HUBSPOT_ACCESS_TOKEN; // 🔐 Secret token from env

  if (!HUBSPOT_TOKEN) {
    return res.status(500).json({ error: 'HubSpot token missing' });
  }

  try {
    const results = [];

    for (const lead of leads) {
      const response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${HUBSPOT_TOKEN}`
        },
        body: JSON.stringify({
          properties: {
            email: lead.email,
            firstname: lead.decisionMaker,
            phone: lead.phone,
            company: lead.company,
            website: lead.website
          }
        })
      });

      const data = await response.json();
      results.push(data);
    }

    res.status(200).json({ message: `Exported ${results.length} leads to HubSpot.` });
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'HubSpot export failed.' });
  }
}
