const crypto = require('crypto');

const partner_id = '2011535';
const partner_key = '4f415055726e715a63554872747673427a5373646244726e5841694874587666';
const path = '/api/v2/shop/auth_partner';
const timestamp = '1748983680'; // substitua pelo timestamp exato do Apps Script

const baseString = `${partner_id}${path}${timestamp}`;
console.log('🧩 Base String:', baseString);

const sign = crypto
  .createHmac('sha256', Buffer.from(partner_key, 'hex'))
  .update(baseString)
  .digest('hex');

console.log('✅ SIGN gerado localmente:', sign);
