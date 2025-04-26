/**
 * This is the ByteLock class, which provides methods for encrypting and decrypting messages.
 */
declare class ByteLock {
    private JSONStringify;
    private JSONParse;
    private getCharCode;
    private reverseCharCode;
    private isASCIIOrANSIChar;
    private hashString;
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
    generateCipherKey(sender_id: string, receiver_id: string): number | null;
    /**
     * This function encrypts a message using a cipher key.
     * @param message - The message to be encrypted
     * @param secret_key - The cipher key to be used for encryption
     * @returns The encrypted message as a string
     * @example
     * const encrypted = ByteLock.cipherMessage('Hello!', key);
     * console.log(encrypted); // 140f80c80c80580860
     */
    cipherMessage(message: string, secret_key: number | null): string;
    /**
     * This function decrypts a message using a cipher key.
     * @param message - The message to be decrypted
     * @param secret_key - The cipher key to be used for decryption
     * @returns The decrypted message as a string
     * @example
     * const decrypted = ByteLock.decipherMessage('140f80c80c80580860', key);
     * console.log(decrypted); // Hello!
     */
    decipherMessage(message: string, secret_key: number | null): string;
}
declare const ByteLockInstance: ByteLock;
export default ByteLockInstance;
//# sourceMappingURL=index.d.ts.map