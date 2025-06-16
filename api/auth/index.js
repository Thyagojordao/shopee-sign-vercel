const crypto = require('crypto');

module.exports = (req, res) => {
  try {
    const { partner_id, path, timestamp } = req.query;
    let partnerKey = process.env.PARTNER_KEY;

    // Limpar espaços e quebras de linha invisíveis
    partnerKey = partnerKey.trim().replace(/(\r\n|\n|\r)/gm, "");

    // Verificar base string
    const baseString = `${partner_id}${path}${timestamp}`;
    console.log("🔑 Chave do parceiro (limpo):", partnerKey);
    console.log("🧱 BaseString:", baseString);

    // Gerar assinatura usando Buffer HEX
    const sign = crypto
      .createHmac('sha256', Buffer.from(partnerKey, 'hex'))
      .update(baseString)
      .digest('hex');

    console.log("✅ Sign gerado:", sign);

    res.status(200).json({ sign });
  } catch (error) {
    console.error("❌ Erro ao gerar sign:", error);
    res.status(500).json({ error: "Erro interno", details: error.message });
  }
};
