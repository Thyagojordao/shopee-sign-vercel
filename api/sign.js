const crypto = require('crypto');

module.exports = (req, res) => {
  try {
    const { partner_id, path, timestamp } = req.query;
    const partnerKey = process.env.PARTNER_KEY;

    if (!partner_id || !path || !timestamp || !partnerKey) {
      return res.status(400).json({ error: 'Missing required parameters or partner key env not set.' });
    }

    // Limpeza da Partner Key
    const cleanPartnerKey = partnerKey.trim().replace(/(\r\n|\n|\r|\s)/gm, '');

    // Montar Base String (sem encode)
    const baseString = `${partner_id}${path}${timestamp}`;

    // Criar assinatura
    const sign = crypto
      .createHmac('sha256', Buffer.from(cleanPartnerKey, 'hex'))
      .update(baseString)
      .digest('hex');

    console.log('--- DEBUG ---');
    console.log('PartnerId:', partner_id);
    console.log('Path:', path);
    console.log('Timestamp:', timestamp);
    console.log('BaseString:', baseString);
    console.log('PartnerKey limpa:', cleanPartnerKey);
    console.log('SIGN final:', sign);
    console.log('--- END DEBUG ---');

    res.status(200).json({ sign });
  } catch (error) {
    console.error('Erro na geração do SIGN:', error);
    res.status(500).json({ error: 'Erro interno ao gerar SIGN', details: error.message });
  }
};
