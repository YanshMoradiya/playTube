import axios from "axios";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";

function Video({ videoId }: { videoId: string }) {
    const [videoData, setVideoData] = useState({});
    useEffect(() => {
        const controller = new AbortController();
        (async () => {
            axios
                .get(`/api/v1/video/get-video-by-id/${videoId.toString()}`)
                .then((responce) => {
                    setVideoData(responce.data.data);
                })
                .catch((error) => console.log(error));
        })();

        return () => {
            controller.abort();
        };
    }, []);

    return (
        <div className="h-[100%] w-[100%] mt-[30px] flex flex-row  p-[30px] max-xl:flex-col max-sm:p-[10px]">
            <div className="w-[65%] xl:h-[70vh] max-xl:w-[100%]">
                <div className="xl:w-[100%] xl:h-[70vh]">
                    <ReactPlayer
                        url={videoData?.videoFile}
                        className="react-player"
                        width="100%"
                        height="100%"
                        controls
                    />
                </div>
                <div className="w-[100%] py-[20px] flex flex-row justify-between px-[10px] items-center">
                    <h1 className="text-3xl max-md:text-xl">{videoData.title}</h1>
                    <div className="text-end">
                        <h3 className="flex flex-row max-sm:flex-col"><span>createdAt : </span><span>{videoData?.createdAt?.substring(0, 10)}</span></h3>
                        <h5>view : {videoData?.views}</h5>
                    </div>
                </div>
                <div className="w-[100%] py-[20px] px-[10px] flex flex-row justify-between max-sm:flex-col max-sm:gap-[40px]">
                    <div className="flex flex-row">
                        <img
                            src={videoData?.owner?.avatar}
                            className="rounded-full h-[60px] w-[60px] max-sm:h-[45px] max-sm:w-[45px]"
                            alt="video owner image"
                        />
                        <div className="mx-[30px]">
                            <h1 className="text-2xl">{videoData?.owner?.fullName}</h1>
                            <h2>Subscribers : {videoData?.owner?.subscribers}</h2>
                        </div>
                    </div>
                    <div className="flex gap-[40px] text-[25px] items-center max-md:gap-[20px]">
                        <button className="flex flex-col items-center">
                            <ion-icon name="heart-outline"></ion-icon>
                            {/* <ion-icon name="heart"></ion-icon> */}
                            <span className="text-[15px]">{videoData?.like}</span>
                        </button>
                        <button className="flex flex-col items-center">
                            <ion-icon name="heart-dislike-outline"></ion-icon>
                            {/* <ion-icon name="heart-dislike"></ion-icon> */}
                            <span className="text-[15px]">{videoData?.dislike}</span>
                        </button>
                        <button className="h-[60px] w-[150px] rounded-[30px] bg-[#a52a2a]">
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>
            <div className="w-[35%]"></div>
        </div>
    );
}

export default Video;
