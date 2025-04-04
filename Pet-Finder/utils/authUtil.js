import * as Crypto from 'expo-crypto';

export const hashPassword = async (password) => {
  const hashed = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password
  );
  return hashed;
};
