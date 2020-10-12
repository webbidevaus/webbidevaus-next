import React, { useState } from "react";

interface SeekBarProps {
  duration: number;
  audioRef: any;
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  currentTime: number;
}

const SeekBar = React.memo(
  ({
    duration,
    audioRef,
    isPlaying,
    setIsPlaying,
    currentTime,
  }: SeekBarProps) => {
    const [isPlayingOnRangeMouseDown, setIsPlayingOnRangeMouseDown] = useState(
      false
    );
    const [onRangeChangeUsed, setOnRangeChangeUsed] = useState(false);
    const [rangeCurrentValue, setRangeCurrentValue] = useState(currentTime);

    const seekTo = (time: number) => {
      if (audioRef.current.readyState > 0) {
        audioRef.current.currentTime = Math.round(time);
      }

      setRangeCurrentValue(time);
    };

    const onRangeMouseDown = () => {
      setIsPlayingOnRangeMouseDown(isPlaying);

      audioRef.current.pause();
      setIsPlaying(false);
    };

    const onRangeMouseUp = (val: any) => {
      // seek on mouseUp as well because of this bug in <= IE11
      // https://github.com/facebook/react/issues/554
      if (!onRangeChangeUsed) {
        seekTo(val.target.value);
      }

      // only play if media was playing prior to mouseDown
      if (isPlayingOnRangeMouseDown) {
        audioRef.current.play();
        setIsPlaying(true);
      }

      // Somewhat ugly fix for FF with setTimeout :shrug:
      setTimeout(() => setOnRangeChangeUsed(false));
    };

    const onRangeChange = (val: React.ChangeEvent<HTMLInputElement>) => {
      seekTo(parseInt(val.target.value, 10));
      setOnRangeChangeUsed(true);
    };

    return (
      <input
        disabled={duration === 0}
        className="podcast-player__range"
        type="range"
        step="any"
        max={duration.toFixed(4)}
        value={onRangeChangeUsed ? rangeCurrentValue : currentTime}
        onMouseDown={onRangeMouseDown}
        onMouseUp={onRangeMouseUp}
        onChange={onRangeChange}
      />
    );
  }
);

export default SeekBar;
