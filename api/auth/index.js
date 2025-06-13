const crypto = require('crypto');

module.exports = async (req, res) => {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { partner_id, path, timestamp, partner_key } = req.query;

    if (!partner_id || !path || !timestamp || !partner_key) {
      return res.status(400).json({ error: 'Missing parameters' });
    }

    const baseString = `${partner_id}${path}${timestamp}`;
    const sign = crypto
      .createHmac('sha256', Buffer.from(partner_key, 'hex'))
      .update(baseString)
      .digest('hex');

    return res.status(200).json({ sign });
  } catch (error) {
    console.error('Internal Server Error:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};
