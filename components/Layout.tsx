import Head from "next/head";
import React from "react";

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
  const coverUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/cover.jpg`;

  const metaTags = [
    { name: "title", content: title },
    {
      name: "keywords",
      content:
        "webbidevaus, web dev, podcast, react, node, typescript, javascript",
    },
    {
      name: "description",
      content: description,
    },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:image", content: coverUrl },
    { property: "og:type", content: "website" },
    { property: "twitter:title", content: title },
    { property: "twitter:description", content: description },
    { property: "twitter:url", content: url },
    { property: "twitter:image", content: coverUrl },
    { property: "twitter:card", content: "summary_large_image" },
  ];

  return (
    <>
      <Head>
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
