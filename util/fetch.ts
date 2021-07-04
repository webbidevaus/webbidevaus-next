import fetch from "cross-fetch";
import { Right } from "purify-ts";
import { EitherAsync } from "purify-ts/EitherAsync";

const requestOpts = {
  headers: {
    Authorization: `Basic ${process.env.SIMPLECAST_API_KEY}`,
  },
};

export const authFetch = (url: string) => {
  return EitherAsync.fromPromise(() => fetch(url, requestOpts).then(Right)).map(
    (e) => e.json()
  );
};

export const plainFetchAuth = (url: string) => {
  return fetch(url, requestOpts);
};
