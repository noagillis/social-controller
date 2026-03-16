import { useRef, useState } from 'react';
import { useUIContext } from '.@/contexts/ui';

export default function Ident({ overlapTime = 0.5 }) {
  const { setStartToProfileStatus, startToProfileStatus } = useUIContext();

  const [videoDuration, setVideoDuration] = useState(4.022);
  const videoDurationRef = useRef(videoDuration);
  const overlapTimeRef = useRef(overlapTime);

  const videoRef = useRef();
  let transitionedRef = useRef(false);
  return (
    <video
      ref={videoRef}
      width='100%'
      autoPlay
      src={import.meta.env.BASE_URL + 'videos/indent.mp4'}
      type='video/mp4'
      onLoadedData={(e) => {
        setVideoDuration(e.target.duration);
      }}
      onTimeUpdate={(e) => {
        const transitionTime =
          videoDurationRef.current - overlapTimeRef.current;
        if (e.target.currentTime >= transitionTime) {
          transitionedRef.current = true;

          setStartToProfileStatus({
            ...startToProfileStatus,
            showProfile: true,
          });
        }
      }}
      onEnded={() => {
        setStartToProfileStatus({
          showIntro: false,
          showProfile: true,
        });
      }}
    />
  );
}
