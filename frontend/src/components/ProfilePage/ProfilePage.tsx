import { useSelector } from "react-redux"
import userServices from "../../services/user.services";
import { Outlet, useLocation, useNavigate, Link } from "react-router-dom";
import { createContext, useEffect, useState } from "react";

export const context = createContext('');

function ProfilePage() {
    const logedinStatus = useSelector(state => state.auth?.logedinStatus);
    const navigate = useNavigate();
    const location = useLocation();
    const [data, setData] = useState([]);

    useEffect(() => {
        (async () => {
            await userServices.userProfile().then((response) => setData(response));
        })();
    }, []);

    if (!logedinStatus) {
        return (
            <div className="h-[100%] flex items-center flex-col">
                <h1 className="pt-[50px] pb-[15px]">You are Not logedin.please login.</h1>
                <button className="shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] bg-[#7b312D] px-[10px] py-[8px] rounded-md mx-[5px] w-[100px]" onClick={() => navigate('/login-window', { state: { from: location }, replace: true })}>Login</button>
            </div>
        );
    }
    return (
        <div>
            <div className="w-[100%] h-[200px]">
                <img src={data?.coverImage} alt="cover image" className="w-[100%] h-[100%]" />
            </div>
            <div className="flex  flex-row md:px-[100px] max-md:flex-col">
                <div className="w-[150px] h-[150px] p-[25px]">
                    <img src={data?.avatar} alt="avatar image" className="w-[100px] h-[100px] rounded-full" />
                </div>
                <div className="m-[25px]">
                    <h1>fullName : {data?.fullName}</h1>
                    <h2>username : {data?.username}</h2>
                    <h2>email : {data?.email}</h2>
                    <h2>createdAt : {data?.createdAt?.substring(0, 10)}</h2>
                    <h2>subscribedTo : {data?.subscribedToCount}</h2>
                    <h2>subscriber : {data?.subscriberCount}</h2>
                </div>
            </div>
            <div className="flex flex-row gap-[20px] px-[20px] my-[35px] flex-wrap">
                <Link to='/profile/videos' className='gap-3  shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] bg-[#7b312D] text-center w-[120px] py-[8px] rounded-md'>
                    <span className='text-xl'>Myvideo</span>
                </Link>
                <Link to='/profile/tweets' className='gap-3 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] bg-[#7b312D] text-center w-[120px] py-[8px] rounded-md'>
                    <span className='text-xl'>MyTweets</span>
                </Link>
                <Link to='/profile' className='gap-3 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] bg-[#7b312D] text-center w-[120px] py-[8px] rounded-md'>
                    <span className='text-xl'>Edit Profile</span>
                </Link>
                <Link to='/profile' className='gap-3 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] bg-[#7b312D] text-center w-[120px] py-[8px] rounded-md'>
                    <span className='text-xl'>Playlist</span>
                </Link>
            </div>
            <div>
                <context.Provider value={data?._id}>
                    <Outlet />
                </context.Provider>
            </div>
        </div>
    )
}

export default ProfilePage;