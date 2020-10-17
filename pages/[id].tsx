import classNames from "classnames";
import { GetStaticPaths, GetStaticProps } from "next";
import React from "react";
import Markdown from "react-markdown";
import {Header} from "../components/Header";
import {Player} from "../components/Player";
import {Footer} from "../components/Footer";
import {Meta} from "../components/Meta";
import {Layout} from "../components/Layout";

function episodeTitleWithoutNumber(title:string) {
  return title.replace(/^\d*. /, '')
}

export default function Episode(episode: Episode) {
  return (
    <Layout episode={episode}>
      <div className="hero hero--single">
        <Header className={classNames('hero__header', 'wrap')} />
      </div>

      <section className="episode">
        <h3 className="episode__number small-title">Jakso {episode.number}</h3>
        <div className="episode__body">
          <h1 className="episode__title">
            {episodeTitleWithoutNumber(episode.title)}
          </h1>

          {episode.description && (
            <p className="episode__description">{episode.description}</p>
          )}

          <Meta publishedAt={new Date(episode.published_at)} duration={episode.duration} />

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
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  const path = require('path');
  const { readFile } = require('fs').promises;

  const filePath = path.join("./", "episodes.json.tmp");
  const cachedFile = await readFile(filePath);
  const episodes = JSON.parse(cachedFile.toString()).collection as ListingEpisode[];

  const id = parseInt(context.params?.id as string, 10); // webbidevaus.fi/96 -> id = 96
  const listingEpisode = episodes.find((e: ListingEpisode) => e.number === id)
  if (!listingEpisode) {
    return { props: {} }
  }
  
  const requestOpts = {
    headers: {
      Authorization: `Basic ${process.env.SIMPLECAST_API_KEY}`,
    },
  }
  const episodeUrl = `https://api.simplecast.com/episodes/${listingEpisode.id}`;
  const episode = await fetch(episodeUrl, requestOpts).then((r) => r.json());
  
  return {
    props: episode,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  // Fetch the master episode list from Simplecast, return numeric episode IDs
  const path = require('path');
  const { writeFile } = require('fs').promises;

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
