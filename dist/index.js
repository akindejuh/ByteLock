"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This is the ByteLock class, which provides methods for encrypting and decrypting messages.
 */
class ByteLock {
    JSONStringify(data) {
        if (!data) {
            return null;
        }
        try {
            return JSON.stringify(data);
        }
        catch (error) {
            return null;
        }
    }
    JSONParse(data) {
        if (!data) {
            return null;
        }
        try {
            return JSON.parse(data);
        }
        catch (error) {
            return null;
        }
    }
    // Helper function to get the character code of a character
    getCharCode(char) {
        return char.charCodeAt(0);
    }
    // Helper function to get the character from a character code
    reverseCharCode(charCode) {
        return String.fromCharCode(charCode);
    }
    // Helper function to check if a character is an ASCII or ANSI character
    isASCIIOrANSIChar(char) {
        const charCode = this.getCharCode(char);
        return charCode >= 32 && charCode <= 255;
    }
    hashString(data) {
        let hash = 0;
        for (let i = 0; i < data.length; i++) {
            const char = data.charCodeAt(i);
            hash = (hash << 5) - hash + char; // eslint-disable-line no-bitwise
            hash = hash & hash; // eslint-disable-line no-bitwise
        }
        return hash;
    }
    /**
     * This function generates a cipher key offset based on the sender and receiver IDs.
     * @param sender_id - The ID of the sender
     * @param receiver_id - The ID of the receiver
     * @returns A number representing the cipher key, or null if either ID is missing
     * @example
     * const sender_id = '66abe1cc11f58bf19a8dcef7';
     * const receiver_id = '66b1097c4ede2430559fa193';
     * const key = ByteLock.generateCipherKey(sender_id, receiver_id);
     * console.log(key); // 32
     */
    generateCipherKey(sender_id, receiver_id) {
        if (!sender_id || !receiver_id) {
            return null;
        }
        const combined_string = sender_id + receiver_id;
        const hash_value = this.hashString(combined_string);
        const random_number = Math.abs(hash_value) % 10000;
        const check_number = random_number < 1 ? 1 : random_number;
        return parseInt(check_number.toString().padStart(4, '0'), 10) % 50;
    }
    /**
     * This function encrypts a message using a cipher key.
     * @param message - The message to be encrypted
     * @param secret_key - The cipher key to be used for encryption
     * @returns The encrypted message as a string
     * @example
     * const encrypted = ByteLock.cipherMessage('Hello!', key);
     * console.log(encrypted); // 140f80c80c80580860
     */
    cipherMessage(message, secret_key) {
        if (!secret_key) {
            return '';
        }
        let cipheredMessage = '';
        for (let i = 0; i < message.length; i++) {
            const char = message[i];
            if (this.isASCIIOrANSIChar(char)) {
                const charCode = this.getCharCode(char);
                const newKey = charCode + secret_key;
                const hashed = `${Math.floor(newKey / 255)}${(newKey % 255).toString(16)}`;
                cipheredMessage += hashed;
            }
            else {
                cipheredMessage += char;
            }
        }
        return (this.JSONStringify(cipheredMessage.split('').reverse().join('')) || '');
    }
    /**
     * This function decrypts a message using a cipher key.
     * @param message - The message to be decrypted
     * @param secret_key - The cipher key to be used for decryption
     * @returns The decrypted message as a string
     * @example
     * const decrypted = ByteLock.decipherMessage('140f80c80c80580860', key);
     * console.log(decrypted); // Hello!
     */
    decipherMessage(message, secret_key) {
        if (!secret_key) {
            return '';
        }
        const textMsg = this.JSONParse(message)?.split('')?.reverse()?.join('');
        if (textMsg) {
            let deciphered_message = '';
            let index = 0;
            while (index < textMsg.length) {
                if (this.isASCIIOrANSIChar(textMsg[index])) {
                    const charToReverse = textMsg.substring(index, index + 3);
                    let getCharDec = parseInt(charToReverse.substring(1, 3), 16);
                    if (charToReverse[0] === '1') {
                        getCharDec = getCharDec + 255;
                    }
                    const newCharCode = getCharDec - secret_key;
                    deciphered_message += this.reverseCharCode(newCharCode);
                    index += 3;
                }
                else {
                    deciphered_message += textMsg[index];
                    index++;
                }
            }
            return String(deciphered_message);
        }
        else {
            return '';
        }
    }
}
const ByteLockInstance = new ByteLock();
exports.default = ByteLockInstance;
