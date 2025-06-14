const crypto = require('crypto');

module.exports = (req, res) => {
  try {
    const { partner_id, path, timestamp } = req.query;
    const partnerKey = process.env.PARTNER_KEY;  // Agora busca somente da variável de ambiente da Vercel

    if (!partner_id || !path || !timestamp || !partnerKey) {
      return res.status(400).json({ error: 'Missing parameters or partner_key env' });
    }

    const baseString = `${partner_id}${path}${timestamp}`;

    const sign = crypto
      .createHmac('sha256', Buffer.from(partnerKey, 'utf-8'))  // UTF-8 é correto para Shopee production
      .update(baseString)
      .digest('hex');

    res.status(200).json({ sign });
  } catch (error) {
    console.error('Erro ao gerar sign:', error);
    res.status(500).json({ error: 'Erro interno ao gerar sign', details: error.message });
  }
};
