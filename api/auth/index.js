const crypto = require('crypto');

module.exports = (req, res) => {
  const { partner_id, path, timestamp } = req.query;

  if (!partner_id || !path || !timestamp) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  const partner_key = 'SUA_CHAVE_AQUI'; // coloque sua chave real aqui
  const baseString = `${partner_id}${path}${timestamp}`;
  const sign = crypto
    .createHmac('sha256', Buffer.from(partner_key, 'utf-8'))
    .update(baseString)
    .digest('hex');

  res.status(200).json({ sign });
};
