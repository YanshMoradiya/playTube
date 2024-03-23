import ReactPlayer from "react-player";
import LikeDislike from "./LikeDislike";
import videoServices from "../../services/video.services";
import { useQuery } from "@tanstack/react-query";
import { LoadingOutlined } from "@ant-design/icons";
import { IonIcon } from "@ionic/react";
import { useState } from "react";

type status = "Link" | "Copied!";


function Video({ videoId }: { videoId: string }) {
    const { data, isLoading } = useQuery({ queryKey: ['video'], queryFn: async () => await videoServices.getVideoById(videoId) });
    const [copyLink, setCopyLink] = useState<status>("Link");
    if (isLoading) {
        return (
            <LoadingOutlined />
        );
    }

    const copyTextToClipboard = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopyLink("Copied!");
        setTimeout(() => {
            setCopyLink("Link");
        }, 1000)
    };

    return (
        <div className="h-[100%] w-[100%] mt-[30px] flex flex-row  p-[30px] max-xl:flex-col max-sm:p-[10px] overflow-scroll">
            <div className="w-[65%] xl:h-[70vh] max-xl:w-[100%]">
                <div className="xl:w-[100%] xl:h-[70vh]">
                    <ReactPlayer
                        url={data?.videoFile}
                        className="react-player"
                        width="100%"
                        height="100%"
                        title="video player"
                        controls
                    />
                </div>
                <div className="w-[100%] py-[20px] flex flex-row justify-between px-[10px] items-center max-sm:flex-col max-sm:items-baseline">
                    <h1 className="text-3xl max-md:text-xl">{data.title}</h1>
                    <div className="text-end max-sm:flex max-sm:flex-col max-sm:items-baseline">
                        <h3 className="flex flex-row"><span>createdAt : </span><span>{data?.createdAt?.substring(0, 10)}</span></h3>
                        <h5>view : {data?.views}</h5>
                    </div>
                </div>
                <div className="w-[100%] py-[20px] px-[10px] flex flex-row justify-between max-sm:flex-col max-sm:gap-[40px]">
                    <div className="flex flex-row">
                        <img
                            src={data?.owner?.avatar}
                            className="rounded-full h-[60px] w-[60px] max-sm:h-[45px] max-sm:w-[45px]"
                            alt="video owner image"
                        />
                        <div className="mx-[30px]">
                            <h1 className="text-2xl">{data?.owner?.fullName}</h1>
                            <h2>Subscribers : {data?.owner?.subscribers}</h2>
                        </div>
                    </div>
                    <div className="flex gap-[40px] text-[25px] items-center max-md:gap-[20px]">
                        <div className="flex flex-col items-center w-[20px]">
                            <button className="flex flex-col items-center" onClick={copyTextToClipboard}>
                                <IonIcon name="link-outline" />
                            </button>
                            <span className="text-[15px]">{copyLink}</span>
                        </div>
                        <LikeDislike like={data?.like} dislike={data?.dislike} Id={data?._id} isDisLiked={data?.isDisLiked} isLiked={data?.isLiked} />
                        <button className="h-[50px] w-[120px] rounded-[30px] bg-[#a52a2a] text-[20px]">
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
