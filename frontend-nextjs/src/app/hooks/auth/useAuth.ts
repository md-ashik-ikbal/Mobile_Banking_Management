import API_ENDPOINTS from "@/app/routes/api";
import axios from "axios";

const useAuth = async (phone: string, password: string) => {
    try {
        const jwt_token = await axios.post(API_ENDPOINTS.Login, {
            phone: phone,
            password: password
        }, {
            withCredentials: true
        });

        return await jwt_token.data.jwt_token;
    
    } catch (error: any) {
        console.log(error);
    }
}

export default useAuth;