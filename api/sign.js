const crypto = require('crypto');

module.exports = (req, res) => {
  try {
    const { partner_id, path, timestamp } = req.query;
    const partnerKey = process.env.PARTNER_KEY.trim().replace(/(\r\n|\n|\r)/gm, "");

    if (!partner_id || !path || !timestamp || !partnerKey) {
      return res.status(400).json({ error: 'Missing required parameters or partner key env not set.' });
    }

    const baseString = `${partner_id}${path}${timestamp}`;
    const sign = crypto.createHmac('sha256', Buffer.from(partnerKey, 'hex')).update(baseString).digest('hex');

    console.log('🔑 PartnerKey limpo:', partnerKey);
    console.log('🔗 BaseString:', baseString);
    console.log('✅ Sign gerado:', sign);

    res.status(200).json({ sign });
  } catch (error) {
    console.error('Erro ao gerar sign:', error);
    res.status(500).json({ error: 'Erro interno na geração do sign', details: error.message });
  }
};
