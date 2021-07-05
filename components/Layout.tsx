import Head from "next/head";
import React from "react";
import { episodeTitleWithoutNumber } from "../util/episodes";

interface ILayout {
  children: React.ReactNode;
  episode: Episode;
}

export const Layout = ({ children, episode }: ILayout) => {
  const title = episode
    ? `${episode.title} - ${process.env.NEXT_PUBLIC_SITE_TITLE}`
    : process.env.NEXT_PUBLIC_SITE_TITLE;

  const description = episode
    ? episode.description
    : "Puheradiota web-kehityksestä Suomeksi! Suomen kovin koodausaiheinen podcast - ääninä Riku Rouvila ja Antti Mattila";

  const url = episode
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/${episode.number}`
    : process.env.NEXT_PUBLIC_SITE_URL;
  const coverUrl = `https://og-webbidevaus.vercel.app/${`**${encodeURIComponent(
    `Jakso ${episode.number}`
  )}**: ${encodeURIComponent(
    episodeTitleWithoutNumber(episode.title)
  )}`}?theme=${
    episode.number % 2 === 0 ? "light" : "dark"
  }&md=1&fontSize=100px`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="title" content={title} />
        <meta name="description" content={description} />
        <meta
          name="keywords"
          content={
            "webbidevaus, web dev, podcast, react, node, typescript, javascript"
          }
        />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={coverUrl} />
        <meta property="og:type" content="website" />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:url" content={url} />
        <meta property="twitter:image" content={coverUrl} />
        <meta property="twitter:card" content="summary_large_image" />
      </Head>

      {children}
    </>
  );
};
