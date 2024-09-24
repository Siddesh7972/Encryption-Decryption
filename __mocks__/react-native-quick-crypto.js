const crypto = require('crypto');

const ALGORITHM = 'aes-256-cbc';
const KEY = crypto.randomBytes(32); // 256-bit key

const createCipheriv = (algorithm, key, iv) => {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  return {
    update: data => cipher.update(data, 'utf8', 'hex'),
    final: () => cipher.final('hex'),
  };
};

const createDecipheriv = (algorithm, key, iv) => {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  return {
    update: data => decipher.update(data, 'hex', 'utf8'),
    final: () => decipher.final('utf8'),
  };
};

const randomBytes = size => crypto.randomBytes(size);

export {createCipheriv, createDecipheriv, randomBytes};
