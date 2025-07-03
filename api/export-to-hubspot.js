export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const HUBSPOT_API_KEY = process.env.HUBSPOT_API_KEY; // secure it in .env
  const leads = req.body.leads;

  if (!Array.isArray(leads) || leads.length === 0) {
    return res.status(400).json({ error: 'No leads provided' });
  }

  try {
    const results = [];

    for (const lead of leads) {
      const response = await fetch(https://api.hubapi.com/crm/v3/objects/contacts?hapikey=${HUBSPOT_API_KEY}, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          properties: {
            firstname: lead.decisionMaker || '',
            email: lead.email || '',
            phone: lead.phone || '',
            company: lead.company || '',
            website: lead.website || '',
            verified__c: lead.verified ? 'true' : 'false'
          }
        })
      });

      const result = await response.json();

      if (!response.ok) {
        results.push({ success: false, error: result.message || result, lead });
      } else {
        results.push({ success: true, id: result.id });
      }
    }

    return res.status(200).json({ message: ${results.length} lead(s) processed, results });

  } catch (error) {
    console.error('HubSpot Export Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
