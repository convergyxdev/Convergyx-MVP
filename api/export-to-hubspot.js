// api/export-to-hubspot.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const leads = req.body.leads || [];

  try {
    // Dummy log; replace this with your HubSpot API integration
    console.log('Exporting leads to HubSpot:', leads.length);

    // Simulate successful export
    return res.status(200).json({ message: `Exported ${leads.length} leads to HubSpot.` });
  } catch (err) {
    console.error('HubSpot Export Error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
