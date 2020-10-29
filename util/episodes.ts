import { EitherAsync } from "purify-ts/EitherAsync";
import { Maybe } from "purify-ts/Maybe";
import { List } from "purify-ts/List";
import path from "path";
const fs = require("fs").promises;
import { ListingEpisodes } from "../types/Episode";
import { authFetch } from "../util/fetch";

function getFile(filename: string) {
  return (): Promise<Buffer> => {
    const filePath = path.join("./", filename);
    return fs.readFile(filePath);
  };
}

/**
 * Loads the list of episodes from the given file path.
 */
export async function loadEpisodes(filePath: string) {
  return EitherAsync(getFile(filePath))
    .map((buffer) => buffer.toString())
    .map(JSON.parse)
    .chain((val) => EitherAsync.liftEither(ListingEpisodes.decode(val)));
}

/**
 * Load the episodes JSON from the given file path and return the
 * episode props for the given episode number. Returns { props: {} }
 * if not found.
 */
export async function loadEpisode(filePath: string, id?: string) {
  const episodeId = Maybe.fromFalsy(id)
    .map((val) => parseInt(val, 10))
    .orDefault(-1);
  const episode = (await loadEpisodes(filePath)).chain((epis) =>
    List.find((epi) => epi.number === episodeId, epis.collection).toEither({
      props: {},
    })
  );

  return EitherAsync(async ({ liftEither }) => liftEither(episode))
    .map((e) => `https://api.simplecast.com/episodes/${e.id}`)
    .chain(authFetch)
    .map((e) => e.json());
}
