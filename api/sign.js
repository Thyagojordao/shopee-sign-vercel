const crypto = require('crypto');

module.exports = (req, res) => {
  try {
    const { partner_id, path, timestamp } = req.query;
    const partnerKey = process.env.PARTNER_KEY;

    if (!partner_id || !path || !timestamp || !partnerKey) {
      return res.status(400).json({ error: 'Missing required parameters or partner key env not set.' });
    }

    const baseString = `${partner_id}${path}${timestamp}`;

    console.log('📝 BaseString:', baseString);
    console.log('🔑 Partner Key:', partnerKey);

    const sign = crypto.createHmac('sha256', Buffer.from(partnerKey, 'utf-8'))
      .update(baseString)
      .digest('hex');

    res.status(200).json({ sign, baseString });
  } catch (error) {
    console.error('❌ Erro ao gerar sign:', error);
    res.status(500).json({ error: 'Erro interno na geração do sign', details: error.message });
  }
};
