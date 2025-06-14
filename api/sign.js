const crypto = require('crypto');

module.exports = (req, res) => {
  try {
    const { partner_id, path, timestamp, access_token, shop_id } = req.query;
    const partnerKey = process.env.PARTNER_KEY;

    if (!partner_id || !path || !timestamp || !partnerKey) {
      return res.status(400).json({ error: 'Missing required parameters or partner key env not set.' });
    }

    // Monta a base string correta dependendo se tem access_token e shop_id (pedido) ou não (auth)
    let baseString = `${partner_id}${path}${timestamp}`;
    if (access_token && shop_id) {
      baseString += `${access_token}${shop_id}`;
    }

    const sign = crypto
      .createHmac('sha256', partnerKey)
      .update(baseString)
      .digest('hex');

    res.status(200).json({ sign });
  } catch (error) {
    console.error('Erro ao gerar sign:', error);
    res.status(500).json({ error: 'Erro interno na geração do sign', details: error.message });
  }
};
