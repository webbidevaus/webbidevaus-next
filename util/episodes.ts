import { EitherAsync } from "purify-ts/EitherAsync";
import { Left } from "purify-ts/Either";
import { Maybe } from "purify-ts/Maybe";
import { List } from "purify-ts/List";
import path from "path";
const fs = require("fs").promises;
import { ListingEpisodes, ListingEpisode, Episode } from "../types/Episode";
import { authFetch, plainFetchAuth } from "../util/fetch";

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

const findEpisode = (episodeId: number) => (epis: ListingEpisodes) => {
  return List.find((epi) => epi.number === episodeId, epis.collection).toEither(
    Left("Episode not found")
  );
};

const parseId = (id?: string) => {
  return Maybe.fromFalsy(id)
    .map((val) => parseInt(val, 10))
    .orDefault(-1);
};

const createEpisodeUrl = (e: ListingEpisode) =>
  `https://api.simplecast.com/episodes/${e.id}`;

/**
 * Load the episodes JSON from the given file path and return the
 * episode props for the given episode number. Returns { props: {} }
 * if not found.
 */
export async function loadEpisode(filePath: string, id?: string) {
  const episodeId = parseId(id);
  // Read the listing episode from the JSON on disk
  const listingEpisode = (await loadEpisodes(filePath)).chain(
    findEpisode(episodeId)
  );
  // Fetch the full episode information based on the Simplecast episode ID from `listingEpisode`
  const fullEpisode = await EitherAsync(async ({ liftEither }) =>
    liftEither(listingEpisode)
  )
    .map(createEpisodeUrl)
    .chain(authFetch)
    .chain((val) => EitherAsync.liftEither(Episode.decode(val)));

  return fullEpisode.toMaybe();
}

export async function getEpisodes(podcastId?: string) {
  const episodeListingUrl = `https://api.simplecast.com/podcasts/${podcastId}/episodes?limit=999`;

  return (
    await EitherAsync(() => plainFetchAuth(episodeListingUrl))
      .map((e) => e.json())
      .chain((val) => EitherAsync.liftEither(ListingEpisodes.decode(val)))
  ).orDefault({ collection: [] });
}
