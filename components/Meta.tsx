import React from "react";
import classNames from "classnames";

function formatDate(date: Date, isShort: boolean) {
  const monthNames = [
    "tammikuuta",
    "helmikuuta",
    "maaliskuuta",
    "huhtikuuta",
    "toukokuuta",
    "kesäkuuta",
    "heinäkuuta",
    "elokuuta",
    "syyskuuta",
    "lokakuuta",
    "marraskuuta",
    "joulukuuta",
  ];

  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  if (isShort) {
    return `${day}.${monthIndex + 1}.${year}`;
  }
  return `${day}. ${monthNames[monthIndex]} ${year}`;
}

const formatTime = (durationInSeconds: number) => {
  const hours = Math.floor(durationInSeconds / 3600);
  const minutes = Math.floor((durationInSeconds - hours * 3600) / 60);
  const seconds = durationInSeconds % 60;

  const pad = (n: number) => (n < 10 ? `0${n}` : n);
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

interface MetaProps {
  publishedAt: Date;
  duration: number;
  isShort?: boolean;
  isLight?: boolean;
}

export function Meta({
  publishedAt,
  duration,
  isShort = true,
  isLight = false,
}: MetaProps) {
  const primaryColor = isLight ? "white" : "#373868";
  const secondaryColor = isLight ? "#650025" : "white";

  const titleClasses = classNames({
    meta__section: true,
    "small-title": true,
    "meta__section-short": isShort,
  });

  const labelClasses = classNames({
    "meta__section-title": true,
    "meta__section-title--light": isLight,
  });

  return (
    <div className="meta">
      <h2 className={titleClasses}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="meta__section-icon"
        >
          <path
            className="primary"
            fill={primaryColor}
            d="M5 4h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6c0-1.1.9-2 2-2zm0 5v10h14V9H5z"
          />
          <path
            className="secondary"
            fill={primaryColor}
            d="M7 2a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1zm10 0a1 1 0 0 1 1 1v3a1 1 0 0 1-2 0V3a1 1 0 0 1 1-1z"
          />
        </svg>
        <span className={labelClasses}>{formatDate(publishedAt, isShort)}</span>
      </h2>

      <h2 className={titleClasses}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="meta__section-icon"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            className="primary"
            fill={primaryColor}
          />
          <path
            className="secondary"
            fill={secondaryColor}
            d="M13 11.59l3.2 3.2a1 1 0 0 1-1.4 1.42l-3.5-3.5A1 1 0 0 1 11 12V7a1 1 0 0 1 2 0v4.59z"
          />
        </svg>
        <span className={labelClasses}>{formatTime(duration)}</span>
      </h2>
    </div>
  );
}
