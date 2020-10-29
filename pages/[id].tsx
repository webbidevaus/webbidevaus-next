import classNames from "classnames";
import { GetStaticPaths, GetStaticProps } from "next";
import React from "react";
import Markdown from "react-markdown";
import { Header } from "../components/Header";
import { Player } from "../components/Player";
import { Footer } from "../components/Footer";
import { Meta } from "../components/Meta";
import { Layout } from "../components/Layout";

function episodeTitleWithoutNumber(title: string) {
  return title.replace(/^\d*. /, "");
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

export const getStaticProps: GetStaticProps = async (context) => {
  const { loadEpisode } = require("../util/episodes");
  const path = require("path");

  const filePath = path.join("./", "episodes.json.tmp");
  const epi = await loadEpisode(filePath, context.params?.id);

  return {
    props: epi.orDefault({}),
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  // Fetch the master episode list from Simplecast, return numeric episode IDs
  const path = require("path");
  const { writeFile } = require("fs").promises;

  const episodeListingUrl = `https://api.simplecast.com/podcasts/${process.env.SIMPLECAST_PODCAST_ID}/episodes?limit=999`;
  const result = await fetch(episodeListingUrl).then((r) => r.json());
  const filePath = path.join("./", "episodes.json.tmp");
  await writeFile(filePath, JSON.stringify(result, null, 2));

  return {
    paths: result.collection.map((epi: ListingEpisode) => ({
      params: {
        id: epi.number + "",
      },
    })),
    fallback: false,
  };
};
