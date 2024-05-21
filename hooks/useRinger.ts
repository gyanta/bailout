import { useMemo, useRef } from "react";

export const useRinger = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  return useMemo(() => {
    const start = () => {
      audioRef.current?.play();
    };
    const stop = () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };

    return {
      audioProps: {
        loop: true,
        // https://pixabay.com/sound-effects/telephone-ring-129620/
        src: "/audio/telephone-ring-129620.mp3",
        ref: audioRef,
      },
      start,
      stop,
    };
  }, []);
};
