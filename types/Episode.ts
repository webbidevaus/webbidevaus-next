import {
  Codec,
  string,
  number,
  date,
  boolean,
  nullType,
  array,
  oneOf,
  GetInterface,
} from "purify-ts/Codec";

export const Season = Codec.interface({
  href: string,
  number: number,
});

export const ListingEpisode = Codec.interface({
  updated_at: date,
  type: string,
  token: string,
  title: string,
  status: string,
  slug: string,
  season: Season,
  scheduled_for: nullType,
  published_at: date,
  number: number,
  is_hidden: boolean,
  image_url: oneOf([string, nullType]),
  image_path: oneOf([string, nullType]),
  id: string,
  href: string,
  guid: string,
  enclosure_url: string,
  duration: number,
  description: string,
  days_since_release: number,
  audio_status: string,
  analytics: nullType,
});

export type ListingEpisode = GetInterface<typeof ListingEpisode>;

export const ListingEpisodes = Codec.interface({
  collection: array(ListingEpisode),
});

export type ListingEpisodes = GetInterface<typeof ListingEpisodes>;

const AudioFile = Codec.interface({
  url: string,
});

export const Episode = Codec.interface({
  number: number,
  title: string,
  duration: number,
  audio_file: AudioFile,
  published_at: string,
  long_description: string,
});
