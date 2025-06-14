const crypto = require('crypto');

module.exports = (req, res) => {
  try {
    const { partner_id, path, timestamp } = req.query;
    let partnerKey = process.env.PARTNER_KEY;

    if (!partner_id || !path || !timestamp || !partnerKey) {
      return res.status(400).json({ error: 'Missing required parameters or partner key env not set.' });
    }

    // Limpeza da partner key (remove espaços e quebras de linha invisíveis)
    partnerKey = partnerKey.replace(/(\r\n|\n|\r)/gm, '').trim();

    const baseString = `${partner_id}${path}${timestamp}`;

    console.log('🔑 BaseString:', baseString);
    console.log('🔑 PartnerKey limpo:', partnerKey);

    const sign = crypto.createHmac('sha256', Buffer.from(partnerKey, 'utf-8'))
                       .update(baseString)
                       .digest('hex');

    res.status(200).json({ sign });
  } catch (error) {
    console.error('Erro ao gerar sign:', error);
    res.status(500).json({ error: 'Erro interno ao gerar o sign', details: error.message });
  }
};
