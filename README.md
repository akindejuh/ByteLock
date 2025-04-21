# 🔐 ByteLock
ByteLock is a lightweight utility for encrypting and decrypting messages using a simple cipher key generated from two unique IDs.

## 🚀 Features
- 🔑 Generate a cipher key from sender and receiver IDs
- 🔒 Encrypt messages
- 🔓 Decrypt messages

## 📦 Usage
Import and use the `ByteLock` class:
```ts
import ByteLock from './src';
```

### 🔑 Generate Cipher Key
Generates a numeric key from two string IDs.
```ts
const key = ByteLock.generateCipherKey('sender_id', 'receiver_id');
```

### 🔒 Encrypt Message
Encrypts a plain text message using the provided key.
```ts
const encrypted = ByteLock.cipherMessage('Hello!', key);
```

### 🔓 Decrypt Message
Decrypts an encrypted message using the same key.
```ts
const original = ByteLock.decipherMessage(encrypted, key);
```

## 🛠️ Notes
- Only ASCII/ANSI characters (32–255) are encrypted.
- Encryption is reversible only with the same key.
- Not designed for production-grade security.
