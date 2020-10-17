interface ListingEpisode {
  updated_at: Date;
  type: string;
  token: string;
  title: string;
  status: string;
  slug: string;
  season: Season;
  scheduled_for: null;
  published_at: Date;
  number: number;
  is_hidden: boolean;
  image_url: string;
  image_path: string;
  id: string;
  href: string;
  guid: string;
  enclosure_url: string;
  duration: number;
  description: string;
  days_since_release: number;
  audio_status: string;
  analytics: null;
}

interface Season {
  href: string;
  number: number;
}

interface Episode {
  audio_file_name: string;
  audio_file: AudioFile;
  schedule: null;
  href: string;
  published_at: Date;
  id: string;
  upload_complete: null;
  updated_at: Date;
  image_url: string;
  unschedule: null;
  recast_color: null;
  number: number;
  sponsors: Sponsors;
  analytics: null;
  created_at: Date;
  audio_file_path: string;
  type: string;
  enclosure_url: string;
  authors: Authors;
  audio_status: string;
  title: string;
  scheduled_for: null;
  warnings: any[];
  audio_file_path_tc: string;
  audio_content_type: string;
  days_since_release: number;
  keywords: Authors;
  is_published: boolean;
  description: string;
  guid: string;
  is_hidden: boolean;
  episode_url: string;
  is_explicit: boolean;
  season: Season;
  dashboard_link: string;
  waveform_json: string;
  audio_file_url: string;
  delete: null;
  publish: null;
  podcast: Podcast;
  token: string;
  update: null;
  custom_url: null;
  recast_image_url: null;
  sign_url: null;
  slug: string;
  long_description: string;
  status: string;
  transcription: null;
  audio_file_size: number;
  feeds: null;
  duration: number;
  waveform_pack: string;
  image_path: string;
  recast_image: null;
}

interface AudioFile {
  url: string;
  size: number;
  path_tc: string;
  path: string;
  name: string;
  delete: null;
}

interface Authors {
  href: string;
  create: null;
  collection: Collection[];
  associate?: null;
}

interface Collection {
  href: string;
  remove: null;
  name: string;
  id: string;
}

interface Podcast {
  href: string;
  title: string;
  status: string;
  is_migration: boolean;
  import: null;
  image_url: string;
  id: string;
  episodes: Episodes;
  account: null;
}

interface Episodes {
  count: number;
}

interface Sponsors {
  href: string;
}
