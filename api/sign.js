const crypto = require('crypto');

module.exports = (req, res) => {
  try {
    const partner_id = req.query.partner_id;
    const path = req.query.path;
    const timestamp = req.query.timestamp;
    const partner_key = req.query.partner_key;

    if (!partner_id || !path || !timestamp || !partner_key) {
      return res.status(400).json({ error: 'Missing parameters' });
    }

    const baseString = `${partner_id}${path}${timestamp}`;

    const sign = crypto
      .createHmac('sha256', Buffer.from(partner_key, 'hex'))  // Aqui a correção crítica
      .update(baseString)
      .digest('hex');

    return res.json({ sign });
  } catch (error) {
    console.error('Erro ao gerar sign:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
