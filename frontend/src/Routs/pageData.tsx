import App from "../App";
import HomePage from "../components/HomePage/HomePage";
import Subscription from "../components/SubscriptionPage/SubscriptionPage";
import SearchPage from "../components/SearchPage/SearchPage";
import Histroy from "../components/HistoryPage/HistroyPage";
import Tweets from "../components/TweetPage/TweetsPage";
import RegisterPage from "../components/Register/RegisterPage";
import LoginPage from "../components/Login/LoginPage";
import VideoPage from "../components/VideoPage/VideoPage";
import ProfilePage from "../components/ProfilePage/ProfilePage";
import UserVideoPage from "../components/VideoPage/UserVideoPage";


export interface routerType {
    path: string;
    title: string;
    element: JSX.Element;
    children?: Array<routerType>;
}

const pagesData: routerType[] = [
    {
        path: "",
        element: <App />,
        title: "main page",
        children: [{
            path: "",
            element: <HomePage />,
            title: "home page",
        },
        {
            path: "/subscriptions",
            element: <Subscription />,
            title: "subscriptions page",
        },
        {
            path: "/search",
            element: <SearchPage />,
            title: "search page",
        },
        {
            path: "/history",
            element: <Histroy />,
            title: "history page",
        },
        {
            path: "/tweets",
            element: <Tweets />,
            title: "tweets page",
        },
        {
            path: "/video/:videoId",
            element: <VideoPage />,
            title: "video page",
        },
        {
            path: "/profile",
            element: <ProfilePage />,
            title: "profile page",
            children: [
                {
                    path: "/profile/",
                    element: <UserVideoPage />,
                    title: "video page",
                },
                {
                    path: "/profile/videos",
                    element: <UserVideoPage />,
                    title: "video page",
                },
                {
                    element: <Tweets />,
                    title: "tweets page",
                    path: "/profile/tweets",
                }
            ]
        }
        ]
    },
    {
        path: "/register",
        element: <RegisterPage />,
        title: "register page",
    },
    {
        path: "/login",
        element: <LoginPage closeButton={false} />,
        title: "login page",
    },
    {
        path: "/login-window",
        element: <LoginPage closeButton={true} />,
        title: "login window",
    },
];

export default pagesData;