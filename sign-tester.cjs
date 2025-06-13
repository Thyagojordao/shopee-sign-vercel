


const crypto = require('crypto');

const partner_id = '2011535';
const partner_key = '4f415055726e715a63554872747673427a5373646244726e5841694874587666';
const redirect_uri = 'https://script.google.com/macros/s/AKfycbxYZB6hEJrIgaNkEziNP_QrV5KbXCvRLXG_z-NoAizTg_PAb7hYrrvKyixk747pRdP6/exec';

const timestamp = Math.floor(Date.now() / 1000);
const path = '/api/v2/shop/auth_partner';
const baseString = `${partner_id}${path}${timestamp}`;

// 1️⃣ Sign como HEX
const sign_hex = crypto.createHmac('sha256', Buffer.from(partner_key, 'hex'))
                       .update(baseString)
                       .digest('hex');

const url_hex = `https://partner.shopeemobile.com/api/v2/shop/auth_partner?partner_id=${partner_id}&timestamp=${timestamp}&sign=${sign_hex}&redirect=${encodeURIComponent(redirect_uri)}`;

// 2️⃣ Sign como UTF-8
const sign_utf8 = crypto.createHmac('sha256', Buffer.from(partner_key, 'utf8'))
                        .update(baseString)
                        .digest('hex');

const url_utf8 = `https://partner.shopeemobile.com/api/v2/shop/auth_partner?partner_id=${partner_id}&timestamp=${timestamp}&sign=${sign_utf8}&redirect=${encodeURIComponent(redirect_uri)}`;

console.log('\n🔐 TESTE COM HEXADECIMAL:');
console.log(url_hex);

console.log('\n🔐 TESTE COM UTF-8:');
console.log(url_utf8);
