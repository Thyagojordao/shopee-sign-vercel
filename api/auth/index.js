const crypto = require('crypto');

export default function handler(req, res) {
  try {
    const { partner_id, path, timestamp } = req.query;
    let partnerKey = process.env.PARTNER_KEY;

    if (!partner_id || !path || !timestamp || !partnerKey) {
      return res.status(400).json({ error: 'Missing required parameters or partner key' });
    }

    // Remover quebras e espaços invisíveis do partnerKey
    partnerKey = partnerKey.trim().replace(/\s/g, '');

    // String base exatamente como a Shopee pede: partner_id + path (sem encode) + timestamp
    const baseString = `${partner_id}${path}${timestamp}`;

    console.log("📌 BaseString:", baseString);
    console.log("🔑 PartnerKey limpo:", partnerKey);

    const sign = crypto.createHmac('sha256', Buffer.from(partnerKey, 'hex'))
                       .update(baseString)
                       .digest('hex');

    console.log("✅ Sign gerado:", sign);

    res.status(200).json({ sign });

  } catch (error) {
    console.error('❌ Erro ao gerar sign:', error);
    res.status(500).json({ error: 'Erro interno na geração do sign', details: error.message });
  }
}