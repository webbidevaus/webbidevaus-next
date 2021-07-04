import { writeFileSync } from "fs";
import { Episode } from "./types/Episode";
import { getEpisode, getEpisodes } from "./util/episodes";
import { GetInterface } from "purify-ts";
import TurndownService from "turndown";

async function main() {
  const episodes = await getEpisodes(process.env.SIMPLECAST_PODCAST_ID);
  writeFileSync("episodes.json.tmp", JSON.stringify(episodes));

  let fullEpisodeDetails: Array<GetInterface<typeof Episode>> = [];

  for (const episode of episodes.collection) {
    const mEpisode = await getEpisode(
      "episodes.json.tmp",
      episode.number.toString()
    );

    fullEpisodeDetails = mEpisode.caseOf({
      Just: (e) => {
        // Episodes before 55 have description in markdown, others are in HTML
        const episodeWithDescriptionAsHTML = {
          ...e,
          long_description: new TurndownService().turndown(e.long_description),
        };
        return fullEpisodeDetails.concat(episodeWithDescriptionAsHTML);
      },
      Nothing: () => fullEpisodeDetails,
    });
  }
  writeFileSync("public/episodes.json", JSON.stringify(fullEpisodeDetails));
}

main();
