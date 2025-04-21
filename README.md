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
or
```ts
const ByteLock = require("./src");
```

### 🔑 Generate Cipher Key
Generates a numeric key from two string IDs (Best use-case: MongoDB ObjectIds).
```ts
const sender_id = '66abe1cc11f58bf19a8dcef7';
const receiver_id = '66b1097c4ede2430559fa193';

const key = ByteLock.generateCipherKey(sender_id, receiver_id);
console.log(key); // 32
```

### 🔒 Encrypt Message
Encrypts a plain text message using the provided key.
```ts
const encrypted = ByteLock.cipherMessage('Hello!', key);
console.log(encrypted); // 140f80c80c80580860
```

### 🔓 Decrypt Message
Decrypts an encrypted message using the same key.
```ts
const original = ByteLock.decipherMessage(encrypted, key);
console.log(original); // Hello!
```

## 🛠️ Notes
- Only ASCII/ANSI characters (32–255) are encrypted.
- Encryption is reversible only with the same key.
- Not designed for production-grade security.
