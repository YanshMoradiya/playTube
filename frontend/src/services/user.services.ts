import axios from "axios";
import { removeToken } from "../store/authSlice";



const login = async (email:string,password:string) => {
    // const dispatch = useDispatch();
    try {
        return await axios.post('/api/v1/user/login',{email,password}).then(response => response.data.data);
    } catch (error) {
        throw error.response.data.message;
    }
};

const logout = async () => {
    try {
        return await axios.get('/api/v1/user/logout');
    } catch (error) {
        throw error.response.data.message;
    }
};

const refershAccessToken = async () => {
    try {
        return await axios.post('/api/v1/user/refresh-access-token').then(response => response.data.data);
    } catch (error) {
        throw error.response.data.message;
    }
};

const userProfile = async () => {
    try {
        return await axios.get('/api/v1/user/get-current-user').then(responce => responce.data.data);
    } catch (error) {
        throw error.response.data.message;
    }
};

export default {login,logout,refershAccessToken,userProfile};