const crypto = require('crypto');

// Vulnerable RSA
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048
});

// Vulnerable ECDSA
const sign = crypto.createSign('SHA256');
sign.update('test');
const signature = sign.sign(privateKey, 'hex');

console.log('Test file with vulnerable crypto');
