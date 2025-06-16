const crypto = require('crypto');

module.exports = (req, res) => {
  try {
    const { partner_id, path, timestamp } = req.query;
    let partnerKey = process.env.PARTNER_KEY;

    if (!partner_id || !path || !timestamp || !partnerKey) {
      return res.status(400).json({ error: 'Missing required parameters or partner key env not set.' });
    }

    // Corrige a Partner Key: remove espaços, quebras de linha e invisíveis
    partnerKey = partnerKey.trim().replace(/(\r\n|\n|\r|\s)/gm, '');

    // Corrige o path: remove espaços invisíveis
    const cleanedPath = path.trim();

    // Monta a string base corretamente
    const baseString = `${partner_id}${cleanedPath}${timestamp}`;

    // Log para você ver no painel da Vercel
    console.log('🚩 PartnerKey limpo:', partnerKey);
    console.log('🚩 BaseString:', baseString);

    const sign = crypto.createHmac('sha256', Buffer.from(partnerKey, 'hex'))
                       .update(baseString)
                       .digest('hex');

    console.log('✅ Sign gerado:', sign);

    res.status(200).json({ sign });
  } catch (error) {
    console.error('❌ Erro ao gerar sign:', error);
    res.status(500).json({ error: 'Erro interno na geração do sign', details: error.message });
  }
};
