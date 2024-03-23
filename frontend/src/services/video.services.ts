import axios from "axios";

const getVideos = async ({pageParam=1}:{pageParam : number}) => {
    try {
        return await axios.get(`/api/v1/video/get-videos?page=${pageParam}`).then((response) =>  response.data.data);;
    } catch (error) {
        throw error.response.data.message;
    }
};

const getVideoById = async (videoId:string) => {
    try {
        return await axios.get(`/api/v1/video/get-video-by-id/${videoId.toString()}`).then((response) =>  response.data.data);
    } catch (error) {
        throw error.response.data.message;
    }
};

const toggleLikeVideo = async (videoId:string) => {
    try{
        return await axios.post(`/api/v1/like/toggle-video-like/${videoId.toString()}`).then((response) =>  response.data.data);
    }catch(error) {
        throw error.response.data.message;
    }
};

const toggleDislikeVideo = async (videoId:string) => {
    try{
        return await axios.post(`/api/v1/dislike/toggle-video-dislike/${videoId.toString()}`).then((response) =>  response.data.data);
    }catch(error) {
        throw error.response.data.message;
    }
};

const getUserVideo = async (ownerId:string,pageNum : number ) => {
    try {
        return await axios.get(`/api/v1/video/get-users-video/${ownerId?.toString()}?page=${pageNum}`).then((response) => response.data.data);
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export default {getVideoById,toggleLikeVideo,toggleDislikeVideo,getUserVideo,getVideos};