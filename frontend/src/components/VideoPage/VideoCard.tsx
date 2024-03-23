import { Link } from "react-router-dom";

function VideoCard({ video }: { video: any }) {

    function secondsToTime(seconds: number) {
        seconds = Math.floor(seconds);
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        let formattedTime = "";
        if (hours > 0) {
            formattedTime += hours + ":";
        }
        // if (minutes > 0 || hours > 0) {
        formattedTime += minutes + ":";
        // }
        formattedTime += remainingSeconds;
        return formattedTime;
    }

    return (
        <div className="m-2 w-[400px] max-[470px]:w-[300px] bg-red-200 h-[300px] max-[470px]:h-[270px] flex items-center justify-center flex-col rounded-lg" >
            <Link to={`/video/${video._id}`}>
                <div className="flex items-center justify-center w-[360px] max-[470px]:w-[260px] h-[200px] max-[470px]:h-[170px] relative">
                    <img src={video?.thumbnail} alt="video thumbnail." className="w-[100%] h-[100%] rounded-lg" />
                    <span className="absolute bg-white px-[2px] rounded-md bottom-[10px] right-[10px]">{secondsToTime(video?.duration)}</span>
                </div>
            </Link>
            <div className="flex items-start justify-between w-[360px] max-[470px]:w-[260px]">
                <h1 className="text-2xl">{video?.title}</h1>
                <h1 className="text-xl text-center">views : {video?.views}</h1>
            </div>
            <div className="flex items-start justify-between w-[360px] max-[470px]:w-[260px]">
                <div className="flex flex-row gap-[10px]">
                    <img src={video?.owner[0].avatar} className="w-[35px] h-[35px] rounded-full" alt="video owner image." />
                    <h1 className="text-xl">{video?.owner[0].fullName}</h1>
                </div>
                <h1 className="text-xl text-center">{video?.createdAt.substring(0, 10)}</h1>
            </div>
        </div>
    )
}

export default VideoCard

