const crypto = require('crypto');

module.exports = (req, res) => {
  try {
    const { partner_id, path, timestamp } = req.query;
    const partnerKey = process.env.PARTNER_KEY;

    if (!partner_id || !path || !timestamp || !partnerKey) {
      return res.status(400).json({ error: 'Missing required parameters or partner key env not set.' });
    }

    // Corrigindo espaços, quebras e invisíveis na partnerKey
    const cleanPartnerKey = partnerKey.trim().replace(/(\r\n|\n|\r)/gm, '');

    // Montando a Base String
    const baseString = `${partner_id}${path}${timestamp}`;

    // Criando o SIGN
    const sign = crypto
      .createHmac('sha256', Buffer.from(cleanPartnerKey, 'hex'))
      .update(baseString)
      .digest('hex');

    // Log opcional (você pode remover na produção)
    console.log('🔑 PartnerKey limpa:', cleanPartnerKey);
    console.log('📝 BaseString:', baseString);
    console.log('✅ Sign gerado:', sign);

    res.status(200).json({ sign });
  } catch (error) {
    console.error('❌ Erro ao gerar SIGN:', error);
    res.status(500).json({ error: 'Erro interno na geração de SIGN', details: error.message });
  }
};
