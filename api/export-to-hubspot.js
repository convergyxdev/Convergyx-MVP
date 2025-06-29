export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  const HUBSPOT_API_KEY = process.env.HUBSPOT_API_KEY;

  const leads = req.body.leads;

  if (!leads || !Array.isArray(leads)) {
    return res.status(400).json({ message: 'Invalid leads data' });
  }

  const hubspotUrl = 'https://api.hubapi.com/crm/v3/objects/contacts';

  const results = [];

  for (const lead of leads) {
    const data = {
      properties: {
        email: lead.email,
        firstname: lead.name || lead.decisionMaker || 'Lead',
        phone: lead.phone || '',
        website: lead.website || '',
        company: lead.company || '',
      },
    };

    try {
      const response = await fetch(`${hubspotUrl}?hapikey=${HUBSPOT_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      results.push(result);
    } catch (error) {
      results.push({ error: error.message });
    }
  }

  res.status(200).json({ message: 'Export complete', results });
}
