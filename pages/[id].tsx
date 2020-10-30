import classNames from "classnames";
import { GetStaticPaths, GetStaticProps } from "next";
import React from "react";
import Markdown from "react-markdown";
import { Header } from "../components/Header";
import { Player } from "../components/Player";
import { Footer } from "../components/Footer";
import { Meta } from "../components/Meta";
import { Layout } from "../components/Layout";
import path from "path";
import fs from "fs";
import { Maybe } from "purify-ts/Maybe";
import { getEpisodes, getEpisode } from "../util/episodes";

function episodeTitleWithoutNumber(title?: string) {
  return Maybe.fromNullable(title)
    .map((t) => t.replace(/^\d*. /, ""))
    .orDefault("");
}

export default function Episode(episode: Episode) {
  return (
    <Layout episode={episode}>
      <div className="hero hero--single">
        <Header className={classNames("hero__header", "wrap")} />
      </div>

      <section className="episode">
        <h3 className="episode__number small-title">Jakso {episode.number}</h3>
        <div className="episode__body">
          <h1 className="episode__title">
            {episodeTitleWithoutNumber(episode.title)}
          </h1>

          <Meta
            publishedAt={new Date(episode.published_at)}
            duration={episode.duration}
          />

          <div className="episode__player">
            <Player audioSrc={episode.audio_file.url} isDark />
          </div>

          <div className="episode__shownotes">
            <Markdown
              escapeHtml={false}
              source={episode.long_description}
              linkTarget="_blank"
            />
          </div>
        </div>
      </section>

      <Footer isSingle />
    </Layout>
  );
}

const FILE_NAME = "episodes.json.tmp";

export const getStaticProps: GetStaticProps = async (context) => {
  const filePath = path.join("./", FILE_NAME);
  const epi = await getEpisode(filePath, context.params?.id as string);

  return {
    props: epi.caseOf({
      Just: (e) => e,
      Nothing: () => ({}),
    }),
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  // Fetch the master episode list from Simplecast, return numeric episode IDs
  const episodes = await getEpisodes(process.env.SIMPLECAST_PODCAST_ID);

  const filePath = path.join("./", FILE_NAME);
  await fs.promises.writeFile(filePath, JSON.stringify(episodes, null, 2));

  return {
    paths: episodes.collection.map((epi) => ({
      params: {
        id: epi.number + "",
      },
    })),
    fallback: false,
  };
};
