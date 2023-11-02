import { sm2 as sm2Fun, sm4 as sm4Fun } from 'sm-crypto';

const secretKey = 'e0da368a8fa3d9b3f691e82957ec5b75';
// const sm4Fun = require('sm-crypto').sm4;
// const sm2Fun = require('sm-crypto').sm2;

/**
 * SM4-ECB-PKCS5Padding对称加密
 * @param text {string} 要加密的明文
 * @param secretKey {string} 密钥，43位随机大小写与数字
 * @returns {string} 加密后的密文，Base64格式
 */
export function sm4(text: string) {
  return sm4Fun.encrypt(text, secretKey).toUpperCase();
}

// const publicKey = localStorage.getItem('publicKey');
// '049c706e5367254c3b25914653584bc0c0db43ee52266c2e9c628d439e1826f0260aff11a745dfd503be9d7902fa640a8740c99480f65c2a052f83c8ba20b651b0';
const cipherMode = 1; // 1 - C1C3C2，0 - C1C2C3，默认为1
export function sm2(text: string, publicKey: string) {
  return sm2Fun.doEncrypt(text, publicKey, cipherMode);
}
