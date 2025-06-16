const crypto = require('crypto');

module.exports = (req, res) => {
  try {
    const { partner_id, path, timestamp } = req.query;
    const partnerKey = process.env.PARTNER_KEY;

    if (!partner_id || !path || !timestamp || !partnerKey) {
      return res.status(400).json({ error: 'Missing required parameters or partner key env not set.' });
    }

    // Limpar a partner key de quebras, espaços, invisíveis
    const cleanPartnerKey = partnerKey.trim().replace(/(\r\n|\n|\r|\s)/gm, '');

    // Montar a Base String sem encode (conforme documentação Shopee)
    const baseString = `${partner_id}${path}${timestamp}`;

    // Criar o SIGN com Buffer HEX
    const sign = crypto
      .createHmac('sha256', Buffer.from(cleanPartnerKey, 'hex'))
      .update(baseString)
      .digest('hex');

    console.log('🔑 PartnerKey limpa:', cleanPartnerKey);
    console.log('📝 BaseString:', baseString);
    console.log('✅ Sign gerado:', sign);

    res.status(200).json({ sign });
  } catch (error) {
    console.error('❌ Erro na geração de SIGN:', error);
    res.status(500).json({ error: 'Erro interno ao gerar SIGN', details: error.message });
  }
};
