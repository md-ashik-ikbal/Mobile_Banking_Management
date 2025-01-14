import CryptoJS from "crypto-js";


const useEncrypt = () => {
    const aes_encrypt = async (data: any, password: string = `${process.env.NEXT_PUBLIC_AES_DEFAUL_PASSWORD}`) => {
        // Derive a 256-bit key from the password using PBKDF2
        const key = CryptoJS.PBKDF2(password, CryptoJS.enc.Utf8.parse('salt'), {
            keySize: 256 / 32, // AES-256
            iterations: 1000
        });

        // Generate a random IV (Initialization Vector)
        const iv = CryptoJS.lib.WordArray.random(16); // 16 bytes = 128 bits IV

        // Encrypt the data using the key and IV
        const encrypted = CryptoJS.AES.encrypt(data, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

        // Concatenate the IV with the encrypted data (to be able to decrypt later)
        const ivHex = iv.toString(CryptoJS.enc.Base64);  // Base64 encoded IV
        const encryptedHex = encrypted.toString(); // Encrypted data as a string

        // Return both IV and encrypted data
        return `${ivHex}:${encryptedHex}`;
    }

    const aes_decrypt = async (encryptedData: string, password: string = `${process.env.NEXT_PUBLIC_AES_DEFAUL_PASSWORD}`) => {
        // Derive the same 256-bit key from the password
        const key = CryptoJS.PBKDF2(password, CryptoJS.enc.Utf8.parse('salt'), {
            keySize: 256 / 32, // AES-256
            iterations: 1000
        });

        // Split the IV and encrypted data
        const [ivHex, encryptedHex] = encryptedData.split(':');

        // Convert the IV from Base64 to WordArray
        const iv = CryptoJS.enc.Base64.parse(ivHex);

        // Decrypt the data using the key and IV
        const decrypted = CryptoJS.AES.decrypt(encryptedHex, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

        // Convert the decrypted WordArray to a UTF-8 string
        return decrypted.toString(CryptoJS.enc.Utf8);
    }

    return { aes_encrypt, aes_decrypt };
}

export default useEncrypt;