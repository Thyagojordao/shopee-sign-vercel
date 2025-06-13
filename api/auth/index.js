const crypto = require('crypto');

module.exports = async (req, res) => {
  try {
    const { partner_id, path, timestamp, partner_key } = req.query;

    if (!partner_id || !path || !timestamp || !partner_key) {
      return res.status(400).json({ error: 'Missing parameters' });
    }

    const baseString = `${partner_id}${path}${timestamp}`;
    const sign = crypto.createHmac('sha256', Buffer.from(partner_key, 'hex'))
                       .update(baseString)
                       .digest('hex');

    res.status(200).json({ sign });
  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
