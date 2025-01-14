import useEncrypt from "./useEncrypt";

const useLocalUsers = () => {
    const { aes_encrypt, aes_decrypt } = useEncrypt();

    const retrieve_data = async () => {
        const encryptedData = localStorage.getItem('REFS');
        let prev_users = [];

        if (encryptedData) {
            try {
                // Decrypt the data first
                const decryptedData = await aes_decrypt(encryptedData);

                // Now parse the decrypted data as JSON
                prev_users = JSON.parse(decryptedData);
            } catch (error) {
                console.error('Error during decryption or parsing:', error);
            }
        }

        return prev_users; // Return the array of users
    }

    const save_data = async (data: any) => {
        // Retrieve the existing users (if any)
        const prev_users = await retrieve_data();

        // Check if the user already exists in the array (assuming 'id' is unique for each user)
        const userExists = prev_users.includes(data);

        if (userExists) {
            // If the user already exists, don't add them
            return;
        }

        // Create a new array with the new user if it doesn't exist already
        const new_user = [...prev_users, data];

        // Encrypt the updated array and store it in localStorage
        const encryptedNewUserData = await aes_encrypt(JSON.stringify(new_user));
        localStorage.setItem('REFS', encryptedNewUserData);
    };

    return { retrieve_data, save_data };
}

export default useLocalUsers;