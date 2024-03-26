import axios from "axios";

const getTweets = async(tweetId:string,pageNum : number) => {
    try {
        return await axios.get(`/api/v1/tweet/get-user-tweets/${tweetId?.toString()}?page=${pageNum}`).then((response) => response.data.data);
    } catch (error) {
        throw error.response.data.message;
    }
};

export default {getTweets};