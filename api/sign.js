const crypto = require('crypto');

module.exports = (req, res) => {
  try {
    const { partner_id, path, timestamp, access_token, shop_id } = req.query;
    const partnerKey = process.env.PARTNER_KEY;

    if (!partner_id || !path || !timestamp || !partnerKey) {
      return res.status(400).json({ error: 'Missing required parameters or partner key not set.' });
    }

    let baseString = `${partner_id}${path}${timestamp}`;
    if (access_token && shop_id) {
      baseString += `${access_token}${shop_id}`;
    }

    console.log('Base String usada para o SIGN:', baseString);  // <-- LOG IMPORTANTE

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
