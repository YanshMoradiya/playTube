import { useContext } from "react";
import { context } from "../ProfilePage/ProfilePage";

function TweetCard({ tweet }: { tweet: any }) {
    const id = useContext(context);
    return (
        <div className='p-[20px]'>
            <span className='absolute text-[12px] right-[20px] top-[0px]'>createdAt : {tweet?.createdAt?.substring(0, 10)}</span>
            <div>
                <div className=" bg-[#a66363] rounded-md px-[15px] py-[12px]" >
                    {tweet?.content}
                </div>
                <div className="pt-[12px] flex flex-row gap-[20px]">
                    <img src={tweet?.owner[0]?.avatar} alt="image owner" className="w-[40px] h-[40px] rounded-full" />
                    <div className="flex-row flex justify-between w-[100%]">
                        <div>
                            <p className="text-[15px]">{tweet?.owner[0]?.fullName}</p>
                            <p className="text-[10px]">subscribers : {tweet?.owner[0]?.subscribers}</p>
                        </div>
                        {tweet?.owner[0]?._id !== id &&
                            <button className={`h-[30px] w-[100px] rounded-[30px] ${tweet?.owner[0]?.isSubscribed ? "bg-[#b3b3b3]" : "bg-[#a52a2a]"}  text-[15px] my-[auto]`}>
                                {tweet?.owner[0]?.isSubscribed ? "Subscribed" : "Subscribe"}
                            </button>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TweetCard