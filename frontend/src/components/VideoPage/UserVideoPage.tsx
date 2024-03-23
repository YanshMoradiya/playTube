import { LoadingOutlined } from "@ant-design/icons";
// import { useInfiniteQuery } from "@tanstack/react-query";
// import { Fragment, useContext, useEffect } from "react";
// import { useInView } from "react-intersection-observer";
import { context } from "../ProfilePage/ProfilePage";
import videoServices from "../../services/video.services";
import VideoCard from "./VideoCard";
import { useContext, useEffect, useRef, useState } from "react";

function UserVideoPage() {
    // const id = useContext(context);
    // const { ref, inView } = useInView();
    // const {
    //     status,
    //     data, error,
    //     fetchNextPage,
    // } = useInfiniteQuery({
    //     queryKey: ['projects'],
    //     queryFn: async ({ pageParam }) => {
    //         console.log(pageParam);
    //         return await videoServices.getUserVideo(id, pageParam);
    //     },
    //     initialPageParam: 1,
    //     getPreviousPageParam: (firstPage) => { console.log("f", firstPage); return firstPage.previousId },
    //     getNextPageParam: (lastPage) => { console.log("l", lastPage); return lastPage.nextId++ },
    // });
    // useEffect(() => {
    //     if (inView) {
    //         fetchNextPage()
    //     }
    // }, [inView])

    // return (
    //     <div className="grid grid-cols-3 max-xl:grid-cols-2 max-[886px]:grid-cols-1 items-center justify-center">
    //         {status === 'pending' ? (
    //             <LoadingOutlined />
    //         ) : status === 'error' ? (
    //             <span>{error}</span>
    //         ) :
    //             <>
    //                 {data.pages.map((page) => (
    //                     <Fragment key={page.nextId}>
    //                         {page?.map((project, index) => (
    //                             <div ref={ref} className="w-full flex justify-center" key={index}><VideoCard video={project} key={Math.random()} /></div>
    //                         ))}
    //                     </Fragment>
    //                 ))}
    //             </>
    //         }
    //     </div>
    // )

    const id = useContext(context);
    const [loading, setLoading] = useState(true);
    const [pageNum, setPageNum] = useState<number>(1);
    const [videos, setVideos] = useState([]);
    const [lastElement, setLastElement] = useState(null);

    const observer = useRef(
        new IntersectionObserver((entries) => {
            const first = entries[0];
            if (first.isIntersecting) {
                setPageNum(pageNum => pageNum + 1);
            }
        })
    );

    const callVideo = async () => {
        setLoading(true);
        const responce = await videoServices.getUserVideo(id, pageNum);
        setVideos([...videos, ...responce]);
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
        callVideo();
    }, [pageNum, id])

    if (!videos.length) {
        return (<div>No video found.</div>);
    }

    return (
        <div className="grid grid-cols-3 max-xl:grid-cols-2 max-[886px]:grid-cols-1 items-center justify-center">
            {videos.length > 0 &&
                videos.map((video, index: number) => {
                    return index === videos.length - 1 && !loading ? (<div ref={setLastElement} className="w-full flex justify-center" key={index}><VideoCard video={video} key={Math.random()} /></div>) : (<div className="w-full flex justify-center" key={index}><VideoCard video={video} key={Math.random()} /></div>);
                })
            }
            {
                !loading && <LoadingOutlined />
            }
        </div>
    )
}

export default UserVideoPage