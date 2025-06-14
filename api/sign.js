const crypto = require('crypto');

module.exports = (req, res) => {
  const { partner_id, path, timestamp } = req.query;
  const partner_key = process.env.PARTNER_KEY;

  if (!partner_id || !path || !timestamp || !partner_key) {
    return res.status(400).json({ error: 'Missing parameters or partner_key' });
  }

  const baseString = `${partner_id}${path}${timestamp}`;

  try {
    const sign = crypto
      .createHmac('sha256', Buffer.from(partner_key, 'utf-8'))  // ESSA LINHA É O PONTO CRÍTICO
      .update(baseString)
      .digest('hex');

    return res.status(200).json({ sign });
  } catch (error) {
    console.error('Erro ao gerar sign:', error);
    return res.status(500).json({ error: 'Erro ao gerar sign' });
  }
};
