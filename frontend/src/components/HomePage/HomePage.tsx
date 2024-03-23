import { useState, useEffect, useRef } from "react";
import VideoCard from "../VideoPage/VideoCard";
import axios from "axios";
import { LoadingOutlined } from "@ant-design/icons";


function HomePage(): JSX.Element {
  const [loading, setLoading] = useState(true);
  const [pageNum, setPageNum] = useState<number>(1);
  const [videos, setVideos] = useState<any>([]);
  const [lastElement, setLastElement] = useState(null);

  const observer = useRef(
    new IntersectionObserver((entries) => {
      const first = entries[0];
      if (first.isIntersecting) {
        setPageNum(page => page + 1);
      }
    })
  );

  const callVideo = async () => {
    setLoading(true);
    const responce = await axios.get(`/api/v1/video/get-videos?page=${pageNum}`);
    setVideos([...videos, ...responce.data.data]);
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
  }, [pageNum])

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

export default HomePage;


// import { Fragment, useEffect } from "react";
// import VideoCard from "../VideoPage/VideoCard";
// import { LoadingOutlined } from "@ant-design/icons";
// import { useInfiniteQuery } from "@tanstack/react-query";
// import { useInView } from "react-intersection-observer";
// import videoServices from "../../services/video.services";


// function HomePage(): JSX.Element {
//   const { ref, inView } = useInView();
//   const {
//     status,
//     data,
//     fetchNextPage,
//   } = useInfiniteQuery({
//     queryKey: ['projects'],
//     queryFn: async ({ pageParam }) => {
//       return await videoServices.getVideos(pageParam);
//     },
//     initialPageParam: 1,
//     getPreviousPageParam: (firstPage) => { console.log("f", firstPage); return firstPage.previousId },
//     getNextPageParam: (lastPage) => { console.log("l", lastPage); return lastPage.nextId++ },
//   });
//   { console.log(data) }
//   useEffect(() => {
//     if (inView) {
//       fetchNextPage()
//     }
//   }, [inView])
//   return (
//     <div className="grid grid-cols-3 max-xl:grid-cols-2 max-[886px]:grid-cols-1 items-center justify-center">
//       {status === 'pending' ? (
//         <LoadingOutlined />
//       ) : status === 'error' ? (
//         <span>Error</span>
//       ) :
//         <>
//           {data.pages.map((page) => (
//             <Fragment key={page.nextId}>
//               {page?.map((project, index) => (
//                 <div ref={ref} className="w-full flex justify-center" key={index}><VideoCard video={project} key={Math.random()} /></div>
//               ))}
//             </Fragment>
//           ))}
//         </>
//       }
//     </div>
//   )
// }

// export default HomePage;
