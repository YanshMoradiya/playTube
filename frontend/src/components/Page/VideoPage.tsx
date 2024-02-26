import { useParams } from 'react-router-dom'
import Video from '../Video';

function VideoPage() {
  const { videoId } = useParams();

  return (
    <div className='w-[100%] h-[100%] mt-[-30px]'><Video videoId={videoId} /></div>
  )
}

export default VideoPage
