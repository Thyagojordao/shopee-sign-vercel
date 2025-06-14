const crypto = require('crypto');

module.exports = (req, res) => {
  try {
    const { partner_id, path, timestamp } = req.query;
    const partnerKeyHex = process.env.PARTNER_KEY;

    if (!partner_id || !path || !timestamp || !partnerKeyHex) {
      console.error('❌ Faltando parâmetros obrigatórios:', { partner_id, path, timestamp, partnerKeyHex });
      return res.status(400).json({ error: 'Missing required parameters or partner key env not set.' });
    }

    const baseString = `${partner_id}${path}${timestamp}`;
    const partnerKeyBuffer = Buffer.from(partnerKeyHex, 'hex');

    const sign = crypto
      .createHmac('sha256', partnerKeyBuffer)
      .update(baseString)
      .digest('hex');

    console.log('🔍 BaseString:', baseString);
    console.log('🔑 PartnerKey (HEX):', partnerKeyHex);
    console.log('✅ Sign gerado:', sign);

    res.status(200).json({
      sign,
      debug: {
        baseString,
        partnerKeyHex,
        timestamp,
        path
      }
    });
  } catch (error) {
    console.error('❌ Erro ao gerar sign:', error);
    res.status(500).json({ error: 'Erro interno na geração do sign', details: error.message });
  }
};
