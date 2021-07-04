import { writeFileSync } from "fs";

import { getEpisode, getEpisodes } from "./util/episodes";
import TurndownService from "turndown";
import { MaybeAsync } from "purify-ts/MaybeAsync";

async function main() {
  const episodes = await getEpisodes(process.env.SIMPLECAST_PODCAST_ID);
  writeFileSync("episodes.json.tmp", JSON.stringify(episodes));

  const episodeRequests = episodes.collection.map(async (episode) =>
    getEpisode("episodes.json.tmp", episode.number.toString())
  );

  const fullEpisodeDetails = await MaybeAsync.catMaybes(
    episodeRequests.map((request) => MaybeAsync.fromPromise(() => request))
  );

  const episodesWithMarkdownDescription = fullEpisodeDetails.map((episode) => {
    // Episodes before 55 have description in markdown, others are in HTML
    return {
      ...episode,
      long_description: new TurndownService().turndown(
        episode.long_description
      ),
    };
  });

  writeFileSync(
    "public/episodes.json",
    JSON.stringify(episodesWithMarkdownDescription)
  );
}

main();
