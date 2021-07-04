import {
  Codec,
  string,
  number,
  boolean,
  nullType,
  array,
  oneOf,
  GetType,
} from "purify-ts/Codec";

export const Season = Codec.interface({
  href: string,
  number: number,
});

export const ListingEpisode = Codec.interface({
  updated_at: string,
  type: string,
  token: string,
  title: string,
  status: string,
  slug: string,
  season: Season,
  scheduled_for: nullType,
  published_at: string,
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

export type ListingEpisode = GetType<typeof ListingEpisode>;

export const ListingEpisodes = Codec.interface({
  collection: array(ListingEpisode),
});

export type ListingEpisodes = GetType<typeof ListingEpisodes>;

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
