import API_ENDPOINTS from "@/app/routes/api";
import axios from "axios";

const useProfile = async (token: string | null) => {
    const response = await axios.get(API_ENDPOINTS.User_Profile,{
        headers: {
            Authorization: `Barrer ${token}`
        }
    });

    return response ? response.data : null;
}

export default useProfile;