import { writeFileSync } from "fs";
import { getEpisodes } from "./util/episodes";

async function main() {
  const episodes = await getEpisodes(process.env.SIMPLECAST_PODCAST_ID);
  writeFileSync("./public/episodes.json", JSON.stringify(episodes.collection));
}

main();
