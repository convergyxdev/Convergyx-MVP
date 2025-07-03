export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const event = req.body;

  console.log('🔔 PayPal Webhook Event:', event.event_type);

  // Handle different event types
  switch (event.event_type) {
    case 'BILLING.SUBSCRIPTION.CREATED':
      console.log('✅ Subscription Created:', event.resource.id);
      break;
    case 'BILLING.SUBSCRIPTION.ACTIVATED':
      console.log('✅ Subscription Activated:', event.resource.id);
      break;
    case 'BILLING.SUBSCRIPTION.CANCELLED':
      console.log('❌ Subscription Cancelled:', event.resource.id);
      break;
    case 'PAYMENT.SALE.COMPLETED':
      console.log('💰 Payment Completed:', event.resource.amount.total);
      break;
    default:
      console.log('ℹ️ Unhandled Event:', event.event_type);
  }

  // Always respond quickly to PayPal
  res.status(200).json({ received: true });
}
