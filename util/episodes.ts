import { EitherAsync } from "purify-ts/EitherAsync";
import { Left } from "purify-ts/Either";
import { Maybe } from "purify-ts/Maybe";
import { List } from "purify-ts/List";
import path from "path";
import { promises as fs } from "fs";
import { ListingEpisodes, ListingEpisode, Episode } from "../types/Episode";
import { authFetch, plainFetchAuth } from "../util/fetch";
import { GetType } from "purify-ts";

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
  return List.find<ListingEpisodes["collection"][number]>(
    (epi) => epi.number === episodeId,
    epis.collection
  ).toEither(Left("Episode not found"));
};

const parseId = (id?: string) => {
  return Maybe.fromFalsy(id)
    .map((val) => parseInt(val, 10))
    .orDefault(-1);
};

export type Episode = GetType<typeof Episode>;

const createEpisodeUrl = (e: ListingEpisode) =>
  `https://api.simplecast.com/episodes/${e.id}`;

/**
 * Load the episodes JSON from the given file path and return the
 * episode props for the given episode number. Returns { props: {} }
 * if not found.
 */
export async function getEpisode(filePath: string, id?: string) {
  const episodeId = parseId(id);
  // Read the listing episode from the JSON on disk
  const listingEpisode = (await loadEpisodes(filePath)).chain(
    findEpisode(episodeId)
  );

  // Fetch the full episode information based on the Simplecast episode ID from `listingEpisode`
  const fullEpisode = await EitherAsync.liftEither(listingEpisode)
    .map(createEpisodeUrl)
    .chain(authFetch)
    .chain((val) => EitherAsync.liftEither(Episode.decode(val)));

  return fullEpisode.toMaybe();
}

/**
 * Fetch the list of all episodes from Simplecast, returning a `ListingEpisodes`
 */
export async function getEpisodes(podcastId?: string) {
  const episodeListingUrl = `https://api.simplecast.com/podcasts/${podcastId}/episodes?limit=999`;

  return (
    await EitherAsync(() => plainFetchAuth(episodeListingUrl))
      .map((e) => e.json())
      .chain((val) => EitherAsync.liftEither(ListingEpisodes.decode(val)))
  ).orDefault({ collection: [] });
}

export function episodeTitleWithoutNumber(title: string) {
  return title.replace(/^\d*. /, "");
}
