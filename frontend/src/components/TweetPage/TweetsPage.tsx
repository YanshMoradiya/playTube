import { useContext, useEffect, useRef, useState } from "react";
import tweetServices from "../../services/tweet.services";
import { context } from "../ProfilePage/ProfilePage";
import { LoadingOutlined } from "@ant-design/icons";
import TweetCard from "./TweetCard";

function Tweets() {
  const id = useContext(context);
  const [loading, setLoading] = useState(true);
  const [pageNum, setPageNum] = useState<number>(1);
  const [tweets, setTweets] = useState([]);
  const [lastElement, setLastElement] = useState(null);

  const observer = useRef(
    new IntersectionObserver((entries) => {
      const first = entries[0];
      if (first.isIntersecting) {
        setPageNum(pageNum => pageNum + 1);
      }
    })
  );

  const callTweets = async () => {
    setLoading(true);
    const responce = await tweetServices.getTweets(id, pageNum);
    console.log(responce);
    setTweets([...tweets, ...responce]);
    setLoading(false);
  };

  useEffect(() => {
    const currentElement = lastElement;
    const currentObserver = observer.current;

    if (currentElement) {
      currentObserver.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        currentObserver.unobserve(currentElement);
      }
    };

  }, [lastElement]);

  useEffect(() => {
    setLoading(true);
    callTweets();
    setLoading(false);
  }, [pageNum, id])

  if (!loading && !tweets.length) {
    return (<div>No tweet found.</div>);
  }

  return (
    <div className="flex items-center flex-col gap-[25px]">
      {tweets.length > 0 &&
        tweets.map((tweet, index: number) => {
          return index === tweets.length - 1 && !loading ? (<div ref={setLastElement} className="bg-red-200 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]  rounded-lg w-[90%] relative" key={index}><TweetCard tweet={tweet} key={Math.random()} /></div>) : (<div className="bg-red-200 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]  rounded-lg w-[90%] relative" key={index}><TweetCard tweet={tweet} key={Math.random()} /></div>);
        })
      }
      {
        !loading && <LoadingOutlined />
      }
    </div>
  )
}

export default Tweets