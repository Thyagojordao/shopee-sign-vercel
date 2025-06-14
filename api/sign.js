const crypto = require('crypto');

module.exports = (req, res) => {
  try {
    const { partner_id, path, timestamp } = req.query;
    let partnerKey = process.env.PARTNER_KEY;

    if (!partner_id || !path || !timestamp || !partnerKey) {
      return res.status(400).json({ error: 'Missing required parameters or partner key env not set.' });
    }

    // Garantindo que não tem espaços nem quebras de linha na partnerKey
    partnerKey = partnerKey.trim();

    const baseString = `${partner_id}${path}${timestamp}`;

    console.log('🔑 Chave do parceiro (após trim):', JSON.stringify(partnerKey));
    console.log('🔗 BaseString:', baseString);

    const sign = crypto.createHmac('sha256', partnerKey).update(baseString).digest('hex');

    res.status(200).json({ sign });
  } catch (error) {
    console.error('❌ Erro ao gerar sign:', error);
    res.status(500).json({ error: 'Erro interno na geração do sign', details: error.message });
  }
};
