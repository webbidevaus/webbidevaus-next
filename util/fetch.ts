import fetch from "cross-fetch";
import { EitherAsync } from "purify-ts/EitherAsync";

const requestOpts = {
  headers: {
    Authorization: `Basic ${process.env.SIMPLECAST_API_KEY}`,
  },
};

export const authFetch = (url: string) => {
  return EitherAsync.liftPromise(() => fetch(url, requestOpts)).map((e) =>
    e.json()
  );
};

export const plainFetchAuth = (url: string) => {
  return fetch(url, requestOpts);
};
