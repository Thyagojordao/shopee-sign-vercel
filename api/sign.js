const crypto = require('crypto');

module.exports = (req, res) => {
  try {
    const { partner_id, path, timestamp } = req.query;
    let partnerKey = process.env.PARTNER_KEY;

    if (!partner_id || !path || !timestamp || !partnerKey) {
      return res.status(400).json({ error: 'Missing required parameters or partner key env not set.' });
    }

    // Limpeza TOTAL da partnerKey: Remove espaços, quebras de linha, tabs e tudo invisível
    partnerKey = partnerKey.replace(/\s+/g, '').trim();

    const baseString = `${partner_id}${path}${timestamp}`;

    const sign = crypto
      .createHmac('sha256', Buffer.from(partnerKey, 'hex'))
      .update(baseString)
      .digest('hex');

    console.log('👉 BaseString:', baseString);
    console.log('👉 PartnerKey Limpo:', partnerKey);
    console.log('👉 Sign gerado:', sign);

    res.status(200).json({ sign });
  } catch (error) {
    console.error('Erro ao gerar sign:', error);
    res.status(500).json({ error: 'Erro interno na geração do sign', details: error.message });
  }
};
