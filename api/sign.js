const crypto = require('crypto');

module.exports = (req, res) => {
  try {
    const { partner_id, path, timestamp } = req.query;
    const partnerKey = process.env.PARTNER_KEY;

    if (!partner_id || !path || !timestamp || !partnerKey) {
      return res.status(400).json({ error: 'Missing required parameters or partner key env not set.' });
    }

    // Limpar a PartnerKey para evitar espaços ou quebras invisíveis
    const cleanPartnerKey = partnerKey.trim().replace(/(\r\n|\n|\r|\s)/gm, '');

    // BaseString SEM encode
    const baseString = `${partner_id}${path}${timestamp}`;

    // Gerar o SIGN usando Buffer HEX
    const sign = crypto
      .createHmac('sha256', Buffer.from(cleanPartnerKey, 'hex'))
      .update(baseString)
      .digest('hex');

    // Log detalhado no console da Vercel
    console.log('========= DEBUG SIGN SHOPEE =========');
    console.log('PartnerId:', partner_id);
    console.log('Path:', path);
    console.log('Timestamp:', timestamp);
    console.log('BaseString:', baseString);
    console.log('PartnerKey limpa:', cleanPartnerKey);
    console.log('SIGN final:', sign);
    console.log('=====================================');

    res.status(200).json({ sign });

  } catch (error) {
    console.error('❌ Erro ao gerar o SIGN:', error);
    res.status(500).json({ error: 'Erro interno ao gerar SIGN', details: error.message });
  }
};
