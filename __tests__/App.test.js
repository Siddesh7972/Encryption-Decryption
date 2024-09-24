// /**
//  * @format
//  */

// import 'react-native';
// import React from 'react';
// import App from '../App';

// // Note: import explicitly to use the types shipped with jest.
// import {it} from '@jest/globals';

// // Note: test renderer must be required after react-native.
// import renderer from 'react-test-renderer';

// it('renders correctly', () => {
//   renderer.create(<App />);
// });
import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
} from 'react-native-quick-crypto';
import {Buffer} from 'buffer';

const ALGORITHM = 'aes-256-cbc';
const KEY = randomBytes(32); // 256-bit key

const encryptData = data => {
  const IV = randomBytes(16); // Initialization vector
  const cipher = createCipheriv(ALGORITHM, KEY, IV);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${Buffer.from(IV).toString('hex')}:${encrypted}`;
};

const decryptData = data => {
  const parts = data.split(':');
  if (parts.length !== 2) {
    throw new Error('Invalid encrypted data format');
  }

  const [ivHex, encryptedText] = parts;
  const decipher = createDecipheriv(ALGORITHM, KEY, Buffer.from(ivHex, 'hex'));
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

describe('Encryption and Decryption', () => {
  test('should encrypt and decrypt data correctly', () => {
    const originalData = JSON.stringify({
      username: 'testUser',
      password: 'testPassword',
    });

    const encryptedData = encryptData(originalData);
    const decryptedData = decryptData(encryptedData);

    expect(decryptedData).toBe(originalData);
  });

  test('should throw an error when trying to decrypt invalid data', () => {
    expect(() => decryptData('invalidData')).toThrow(
      'Invalid encrypted data format',
    );
  });
});
