import React, { useEffect, useState, useRef } from "react";
import classNames from "classnames";
import SeekBar from "../SeekBar";
import { useHash } from "./useHash";

type Animate = SVGAnimateElement & { beginElement: () => void };
type Direction = "FAST_FORWARD" | "REWIND";

const SPEEDS = [0.5, 0.8, 1, 1.1, 1.25, 1.5, 2];
const STORAGE_KEY = "webbidevaus-player-config-v1";

const formatTime = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds - hours * 3600) / 60);
  const seconds = totalSeconds % 60;
  const padZero = (num: number) => (num < 10 ? `0${num}` : num);
  return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
};

type Config = {
  episodePositions: { [episodeMP3URL: string]: number };
};

function getPlayerConfig(): Config {
  if (typeof window === "undefined") {
    return {
      episodePositions: {},
    };
  }

  const conf = window.localStorage.getItem(STORAGE_KEY);
  if (conf) {
    const storedConfig = JSON.parse(conf);
    return storedConfig;
  }

  return {
    episodePositions: {},
  };
}

function storePlayerConfig(config: Object) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

function getStoredPlayPosition(
  locationHash: string,
  audioSrc: string
): number | undefined {
  return (
    getCurrentTimeFromHash(locationHash) ||
    getPlayerConfig().episodePositions[audioSrc]
  );
}

function getCurrentTimeFromHash(hash: string) {
  const matches = (hash || "").match(/t=(\d+)/);
  if (!matches) {
    return null;
  }
  const currentTimeInHash = parseInt(matches[1], 10);
  return currentTimeInHash;
}

export function Player({
  audioSrc,
  isDark = false,
}: {
  audioSrc: string;
  isDark?: boolean;
}) {
  const [hash, setHash] = useHash();
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(1);
  const [currentTime, setCurrentTime] = useState(
    getStoredPlayPosition(hash, audioSrc) || 0
  );
  const audioRef = useRef<HTMLAudioElement>(null);
  const fromPlayToPauseAnimationTriangleRef = useRef<Animate>(null);
  const fromPauseToPlayAnimationTriangleRef = useRef<Animate>(null);
  const fromPlayToPauseAnimationLineRef = useRef<Animate>(null);
  const fromPauseToPlayAnimationLineRef = useRef<Animate>(null);

  const onPlayPauseClicked = () => {
    if (isPlaying) {
      audioRef.current!.pause();
      setIsPlaying(false);
      fromPlayToPauseAnimationTriangleRef.current!.beginElement();
      fromPlayToPauseAnimationLineRef.current!.beginElement();
    } else {
      audioRef.current!.play();
      setIsPlaying(true);
      fromPauseToPlayAnimationTriangleRef.current!.beginElement();
      fromPauseToPlayAnimationLineRef.current!.beginElement();
    }
  };

  useEffect(() => {
    const currentTimeInHash = getCurrentTimeFromHash(hash);

    if (currentTimeInHash !== null) {
      audioRef.current!.currentTime = currentTimeInHash;
      setCurrentTime(currentTimeInHash);
    }
  }, [hash]);

  // Persist current play position when currentTime changes
  useEffect(() => {
    const config = getPlayerConfig();
    config.episodePositions[audioSrc] = currentTime;
    storePlayerConfig(config);
  }, [currentTime]);

  // Force player's play position if there's a stored position
  useEffect(() => {
    const storedPosition = getStoredPlayPosition(hash, audioSrc);
    if (storedPosition) {
      audioRef.current!.currentTime = storedPosition;
    }
  }, []);

  const onSpeedChanged = (val: any) => {
    setCurrentSpeed(val.target.value);
    audioRef.current!.playbackRate = val.target.value;
  };

  const onTimeUpdate = () => {
    setCurrentTime(Math.round(audioRef.current!.currentTime));
  };

  const onDurationChange = () => {
    setDuration(audioRef.current!.duration);
  };

  const seek = (direction: Direction) => {
    const newTime =
      direction === "FAST_FORWARD"
        ? audioRef.current!.currentTime + 15
        : audioRef.current!.currentTime - 15;
    if (audioRef.current && audioRef.current.fastSeek) {
      audioRef.current!.fastSeek(newTime);
    } else {
      audioRef.current!.currentTime = newTime;
    }
  };

  const on15Fwd = () => {
    seek("FAST_FORWARD");
  };

  const on15Rev = () => {
    seek("REWIND");
  };

  const playerClasses = classNames({
    "podcast-player": true,
    "podcast-player--dark": isDark,
  });

  return (
    <div className={playerClasses}>
      <div className="podcast-player__essentials">
        <audio
          ref={audioRef}
          preload="none"
          onTimeUpdate={onTimeUpdate}
          onDurationChange={onDurationChange}
        >
          <source src={audioSrc} type="audio/mpeg" />
        </audio>

        <button
          className="podcast-player__play-pause-button"
          onClick={onPlayPauseClicked}
        >
          <span className="visually-hidden">
            {isPlaying ? "Pysäytä" : "Toista"}
          </span>
          <svg
            className="podcast-player__play-pause"
            width="52"
            height="52"
            viewBox="0 0 104 104"
          >
            <circle
              cx="51"
              cy="51"
              r="48"
              strokeDasharray="314"
              strokeDashoffset="0"
              style={{
                strokeWidth: "6px",
                stroke: "var(--playerPrimaryColor)",
                fill: "transparent",
              }}
            />
            <path
              id="triangle"
              d="M 40 30 L 40 30 L 71 50 L 40 70 L 40 30"
              rx="10"
              ry="10"
              style={{
                strokeWidth: "8px",
                stroke: "var(--playerPrimaryColor)",
                strokeLinejoin: "round",
                strokeLinecap: "round",
                fill: "var(--playerPrimaryColor)",
              }}
            >
              <animate
                attributeName="d"
                dur="50ms"
                from="M 40 30 L 40 30 L 71 50 L 40 70 L 40 30"
                to="M 38 30 L 38 30 L 38 50 L 38 70 L 38 30"
                begin="indefinite"
                fill="freeze"
                id="triangle-from-pause-to-play"
                ref={fromPauseToPlayAnimationTriangleRef}
              />
              <animate
                attributeName="d"
                dur="50ms"
                to="M 40 30 L 40 30 L 71 50 L 40 70 L 40 30"
                from="M 38 30 L 38 30 L 38 50 L 38 70 L 38 30"
                begin="indefinite"
                fill="freeze"
                ref={fromPlayToPauseAnimationTriangleRef}
              />
            </path>

            <path
              id="line"
              d="M 68 50 L 68 50 L 68 50"
              rx="10"
              ry="10"
              style={{
                strokeWidth: "8px",
                stroke: "var(--playerPrimaryColor)",
                strokeLinejoin: "round",
                strokeLinecap: "round",
                fill: "var(--playerPrimaryColor)",
              }}
            >
              <animate
                attributeName="d"
                dur="50ms"
                from="M 68 50 L 68 50 L 68 50"
                to="M 66 30 L 66 50 L 66 70"
                begin="indefinite"
                fill="freeze"
                ref={fromPauseToPlayAnimationLineRef}
              />
              <animate
                attributeName="d"
                dur="50ms"
                to="M 68 50 L 68 50 L 68 50"
                from="M 66 30 L 66 50 L 66 70"
                begin="indefinite"
                fill="freeze"
                ref={fromPlayToPauseAnimationLineRef}
              />
            </path>
          </svg>
        </button>

        <div className="podcast-player__controls">
          <button
            className="podcast-player__control podcast-player__button"
            onClick={on15Rev}
            disabled={!isPlaying}
          >
            <span className="visually-hidden">Taaksepäin 15 sekuntia</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="var(--playerPrimaryColor)"
              stroke="var(--playerPrimaryColor)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-rewind"
            >
              <polygon points="11 19 2 12 11 5 11 19" />
              <polygon points="22 19 13 12 22 5 22 19" />
            </svg>
          </button>

          <button
            className="podcast-player__control podcast-player__button"
            onClick={on15Fwd}
            disabled={!isPlaying}
          >
            <span className="visually-hidden">Eteenpäin 15 sekuntia</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="var(--playerPrimaryColor)"
              stroke="var(--playerPrimaryColor)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-fast-forward"
            >
              <polygon points="13 19 22 12 13 5 13 19" />
              <polygon points="2 19 11 12 2 5 2 19" />
            </svg>
          </button>
          <div className="podcast-player__control podcast-player__speed">
            <label htmlFor="speed" className="visually-hidden">
              Toistonopeus
            </label>
            <select id="speed" value={currentSpeed} onChange={onSpeedChanged}>
              {SPEEDS.map((speed) => (
                <option key={speed} value={speed}>
                  {speed}
                  {String.fromCharCode(10799)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="podcast-player__control podcast-player__time">
          {formatTime(currentTime)}
        </div>
      </div>

      <SeekBar
        duration={duration}
        audioRef={audioRef}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        currentTime={currentTime}
      />
    </div>
  );
}
