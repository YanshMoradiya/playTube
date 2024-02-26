import App from "../../../App";
import HomePage from "./../HomePage";
import Subscription from "../SubscriptionPage";
import SearchPage from "../SearchPage";
import Histroy from "../HistroyPage";
import Tweets from "../TweetsPage";
import RegisterPage from "../RegisterPage";
import LoginPage from "../LoginPage";
import VideoPage from "../VideoPage";

export interface routerType{
    path : string;
    title : string;
    element : JSX.Element;
    children ?: Array<routerType>;
}

const pagesData : routerType[] = [
    {
        path : "",
        element : <App/>,
        title : "main page",
        children : [{
            path: "",
            element : <HomePage/>,
            title : "home page",
        },
        {
            path: "/subscriptions",
            element : <Subscription/>,
            title: "subscriptions page",
        },
        {   
            path: "/search",
            element : <SearchPage/>,
            title : "search page",
        },
        {
            path : "/history",
            element : <Histroy/>,
            title:"history page",
        },
        {
            path: "/tweets",
            element : <Tweets/>,
            title:"tweets page",
        },
        {
            path: "/video/:videoId",
            element : <VideoPage/>,
            title:"video page",
        }
    ]
    },
    {
        path: "/register",
        element : <RegisterPage/>,
        title:"register page", 
    },
    {
        path: "/login",
        element : <LoginPage/>,
        title : "login page",
    }
];

export default pagesData;