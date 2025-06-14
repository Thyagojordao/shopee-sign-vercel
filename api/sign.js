const crypto = require('crypto');

module.exports = (req, res) => {
  const { partner_id, path, timestamp } = req.query;
  const partnerKey = process.env.PARTNER_KEY;

  if (!partner_id || !path || !timestamp || !partnerKey) {
    return res.status(400).json({ error: 'Missing required parameters or partner key not set.' });
  }

  const baseString = `${partner_id}${path}${timestamp}`;

  const sign = crypto
    .createHmac('sha256', partnerKey)
    .update(baseString)
    .digest('hex');

  res.status(200).json({ sign });
};
