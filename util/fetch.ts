import { EitherAsync } from "purify-ts/EitherAsync";

export const authFetch = (url: string) => {
  const requestOpts = {
    headers: {
      Authorization: `Basic ${process.env.SIMPLECAST_API_KEY}`,
    },
  };
  return EitherAsync.liftPromise(() => fetch(url, requestOpts));
};
