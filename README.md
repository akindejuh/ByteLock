# 🔐 ByteLock
ByteLock is a lightweight utility for encrypting and decrypting messages using a simple cipher key generated from two unique IDs.

## 🚀 Features
- 🔑 Generate a cipher key from sender and receiver IDs
- 🔒 Encrypt messages
- 🔓 Decrypt messages

## 📦 Usage
Import and use the `ByteLock` class:
```ts
import ByteLock from './ByteLock';
```

### 🔑 generateCipherKey(sender_id: string, receiver_id: string): number | null
Generates a numeric key (0–49) from two string IDs.
```ts
const key = ByteLock.generateCipherKey('user1', 'user2');
```
### 🔒 cipherMessage(message: string, secret_key: number | null): string
Encrypts a plain text message using the provided key.
```ts
const encrypted = ByteLock.cipherMessage('Hello!', key);
```
### 🔓 decipherMessage(message: string, secret_key: number | null): string
Decrypts an encrypted message using the same key.
```ts
const original = ByteLock.decipherMessage(encrypted, key);
```

## 🛠️ Notes
- Only ASCII/ANSI characters (32–255) are encrypted.
- Encryption is reversible only with the same key.
- Not designed for production-grade security.
