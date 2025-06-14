const crypto = require('crypto');

module.exports = (req, res) => {
  try {
    const { partner_id, path, timestamp } = req.query;
    
    // Fazendo sanitização da Partner Key para remover quebras invisíveis
    let partnerKey = process.env.PARTNER_KEY || '';
    partnerKey = partnerKey.replace(/(\r\n|\n|\r)/gm, '').trim();

    if (!partner_id || !path || !timestamp || !partnerKey) {
      return res.status(400).json({ error: 'Missing required parameters or partner key env not set.' });
    }

    const baseString = `${partner_id}${path}${timestamp}`;
    const sign = crypto.createHmac('sha256', partnerKey).update(baseString).digest('hex');

    console.log('📝 BaseString:', baseString);
    console.log('🔑 Partner Key (limpo):', partnerKey);
    console.log('✅ Sign gerado:', sign);

    res.status(200).json({ sign });
  } catch (error) {
    console.error('❌ Erro ao gerar sign:', error);
    res.status(500).json({ error: 'Erro interno ao gerar sign', details: error.message });
  }
};
