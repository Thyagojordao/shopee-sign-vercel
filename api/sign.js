const crypto = require('crypto');

module.exports = (req, res) => {
  const { partner_id, path, timestamp, partner_key, payload } = req.query;

  if (!partner_id || !path || !timestamp || !partner_key) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  let baseString = `${partner_id}${path}${timestamp}`;
  if (payload) {
    baseString += payload;
  }

  const sign = crypto
    .createHmac('sha256', Buffer.from(partner_key, 'hex'))
    .update(baseString)
    .digest('hex');

  res.status(200).json({ sign });
};
