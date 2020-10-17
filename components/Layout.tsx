import React from 'react'

interface ILayout {
  children: React.ReactNode
  episode: Episode
}

export const Layout = ({ children, episode }: ILayout) => {
  const title = episode
    ? `${episode.title} - ${process.env.SITE_TITLE}`
    : process.env.SITE_TITLE

  const description = episode
    ? episode.description
    : 'Puheradiota web-kehityksestä Suomeksi! Suomen kovin koodausaiheinen podcast - mikissä Riku Rouvila ja Antti Mattila'

  const url = episode ? `${process.env.SITE_URL}/${episode.number}` : process.env.SITE_URL
  const coverUrl = `${process.env.SITE_URL}/cover.jpg`

  const metaTags = [
    { name: 'title', content: title },
    { name: 'keywords', content: 'webbidevaus, web dev, podcast' },
    {
      name: 'description',
      content: description,
    },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: url },
    { property: 'og:image', content: coverUrl },
    { property: 'og:type', content: 'website' },
    { property: 'twitter:title', content: title },
    { property: 'twitter:description', content: description },
    { property: 'twitter:url', content: url },
    { property: 'twitter:image', content: coverUrl },
    { property: 'twitter:card', content: 'summary_large_image' },
  ]

  return (
    <>
      {/* <Helmet title={title} meta={metaTags}>
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Webbidevaus.fi RSS"
          href="https://feeds.simplecast.com/wFD5mVlw"
        />
        <html lang="en" />
      </Helmet> */}

      {children}
    </>
  )
}
