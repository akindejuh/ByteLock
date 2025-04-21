export class ByteLock {
  private JSONStringify(data: any): string | null {
    if (!data) {
      return null;
    }

    try {
      return JSON.stringify(data);
    } catch (error) {
      return null;
    }
  }

  private JSONParse(data: string | null): any {
    if (!data) {
      return null;
    }

    try {
      return JSON.parse(data);
    } catch (error) {
      return null;
    }
  }

  // Helper function to get the character code of a character
  private getCharCode(char: string): number {
    return char.charCodeAt(0);
  }

  // Helper function to get the character from a character code
  private reverseCharCode(charCode: number): string {
    return String.fromCharCode(charCode);
  }

  // Helper function to check if a character is an ASCII or ANSI character
  private isASCIIOrANSIChar(char: string): boolean {
    const charCode = this.getCharCode(char);
    return charCode >= 32 && charCode <= 255;
  }

  private hashString(data: string) {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = (hash << 5) - hash + char; // eslint-disable-line no-bitwise
      hash = hash & hash; // eslint-disable-line no-bitwise
    }
    return hash;
  }

  // Generate a key offset from the sender and receiver ids
  public generateCipherKey(
    sender_id: string,
    receiver_id: string,
  ): number | null {
    if (!sender_id || !receiver_id) {
      return null;
    }

    const combined_string = sender_id + receiver_id;
    const hash_value = this.hashString(combined_string);
    const random_number = Math.abs(hash_value) % 10000;

    const check_number = random_number < 1 ? 1 : random_number;
    return parseInt(check_number.toString().padStart(4, '0'), 10) % 50;
  }

  // Cipher function
  public cipherMessage(message: string, secret_key: number | null): string {
    if (!secret_key) {
      return '';
    }

    let cipheredMessage: string = '';

    for (let i = 0; i < message.length; i++) {
      const char = message[i];

      if (this.isASCIIOrANSIChar(char)) {
        const charCode = this.getCharCode(char);

        const newKey: number = charCode + secret_key;
        const hashed = `${Math.floor(newKey / 255)}${(newKey % 255).toString(
          16,
        )}`;
        cipheredMessage += hashed;
      } else {
        cipheredMessage += char;
      }
    }

    return (
      this.JSONStringify(cipheredMessage.split('').reverse().join('')) || ''
    );
  }

  // Decipher function
  public decipherMessage(message: string, secret_key: number | null): string {
    if (!secret_key) {
      return '';
    }

    const textMsg = this.JSONParse(message)?.split('')?.reverse()?.join('');

    if (textMsg) {
      let deciphered_message: string = '';

      let index: number = 0;

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
        } else {
          deciphered_message += textMsg[index];
          index++;
        }
      }

      return String(deciphered_message);
    } else {
      return '';
    }
  }
}

module.exports = new ByteLock();
