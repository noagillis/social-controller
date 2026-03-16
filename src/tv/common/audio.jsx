import { useEffect, useRef } from 'react';

function ToastAudio() {
  const audioRef = useRef(null);

  useEffect(() => {
    const audioElement = audioRef.current;

    const handleCanPlayThrough = () => {
      audioElement.play();
    };

    // Add event listener for 'canplaythrough' to ensure audio is ready
    audioElement.addEventListener('canplaythrough', handleCanPlayThrough);

    // Clean up: remove event listener and pause the audio when unmounted
    return () => {
      audioElement.removeEventListener('canplaythrough', handleCanPlayThrough);
      audioElement.pause();
      audioElement.currentTime = 0; // Reset to start
    };
  }, []);

  return (
    <div>
      <audio ref={audioRef}>
        <source
          src={import.meta.env.BASE_URL + 'audios/alert-1.wav'}
          type="audio/mpeg"
        />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}

export default ToastAudio;
