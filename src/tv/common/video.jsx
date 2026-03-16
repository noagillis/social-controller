import {
  useState,
  useRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
} from 'react';
import { useUIContext } from '@/contexts/ui';
import classNames from 'classnames';
import { useHotkeys } from 'react-hotkeys-hook';
import './video.scss';

const Video = forwardRef(function Video(
  { className, isReadytoPlay = true, ...props },
  ref
) {
  const { isMuted } = useUIContext();
  const videoRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const hasVideo = typeof props.src === 'string';

  useImperativeHandle(ref, () => ({
    play: () => {
      playVideo();
    },
    pause: () => {
      videoRef.current?.pause();
    },
    playFromStart: () => {
      videoRef.current.currentTime = 0;
      playVideo();
    },
    isLoaded,
  }));

  useHotkeys('1', () => {
    videoRef.current.currentTime = 0;
    playVideo();
  });

  useEffect(() => {
    isReadytoPlay ? playVideo() : videoRef.current?.pause();
  }, [isReadytoPlay]);

  useEffect(() => {
    const videoElement = videoRef.current;

    const handleLoadedData = () => {
      setIsLoaded(true);
      if (isReadytoPlay) {
        playVideo();
      }
    };

    videoElement.addEventListener('loadeddata', handleLoadedData);

    return () => {
      videoElement.removeEventListener('loadeddata', handleLoadedData);
    };
  }, [props]);

  async function playVideo() {
    try {
      await videoRef.current?.play();
    } catch (error) {
      switch (error.name) {
        case 'NotAllowedError':
          console.log('Autoplay Not Allowed');
          break;
        case 'AbortError':
          videoRef.current?.pause();
          console.log('Media playback aborted');
          break;
        case 'NotSupportedError':
          console.log('Media format not supported');
          break;
        case 'InterruptedError':
          console.log('Media playback interrupted');
          break;
        default:
          console.log('Unknown media error');
      }
    }
  }

  return (
    <video
      {...props}
      ref={videoRef}
      className={classNames('video', className, { hide: !hasVideo })}
      muted={isMuted}
      autoPlay={true}
      loop={false}
    >
      <source src={props?.src} />
    </video>
  );
});

export default Video;
