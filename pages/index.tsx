import classNames from "classnames";
import Head from "next/head";
import Link from "next/link";
import Markdown from "react-markdown";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Meta } from "../components/Meta";
import { Player } from "../components/Player";
import { GetStaticProps } from "next";
import { episodeTitleWithoutNumber, getEpisodes } from "../util/episodes";
import { ListingEpisode } from "../types/Episode";

interface IHome {
  allEpisodes: ListingEpisode[];
}

export default function Home({ allEpisodes }: IHome) {
  const latestEpisode = allEpisodes[0];

  return (
    <>
      <Head>
        <title>Webbidevaus.fi</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="hero">
        <Header className={classNames("hero__header", "wrap")} />

        <section className="features padded wrap">
          <div className="feature feature--podcast">
            <h3 className="feature__title small-title">Uusin podcast-jakso</h3>
            <div className="newest-podcast">
              <a
                href={`/${latestEpisode.number}`}
                className="newest-podcast__block-link"
              >
                <h1 className="newest-podcast__number">
                  {latestEpisode.number}
                </h1>
              </a>

              <div className="newest-podcast__content">
                <a
                  href={`/${latestEpisode.number}`}
                  className="newest-podcast__block-link"
                >
                  <h1 className="newest-podcast__title">
                    <span className="newest-podcast__title-number">
                      {latestEpisode.number}.{" "}
                    </span>
                    {episodeTitleWithoutNumber(latestEpisode.title)}
                  </h1>
                </a>

                <Meta
                  publishedAt={new Date(latestEpisode.published_at)}
                  duration={latestEpisode.duration}
                  isLight
                  isShort
                />

                <p className="newest-podcast__description">
                  {latestEpisode.description}
                </p>

                <p className="newest-podcast__description">
                  <a href={`/${latestEpisode.number}`}>
                    Tarkempi kuvaus ja linkit...
                  </a>
                </p>

                <Player audioSrc={latestEpisode.enclosure_url} />
              </div>
            </div>
          </div>

          <div className="feature newest-vlog-entry">
            <h3 className="newest-vlog-entry__title small-title">
              Uusin videojakso
            </h3>
            <div className="newest-vlog-entry__container">
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.youtube.com/watch?v=aaWsv0h4lOg"
              >
                <img
                  src="https://i3.ytimg.com/vi/aaWsv0h4lOg/maxres3.jpg"
                  alt="WDS.11 - CSS Nuggets 8pcs"
                />
                <svg viewBox="0 0 459 459">
                  <circle cx="50%" cy="50%" r="25%" />
                  <path d="M229.5 0C102.751 0 0 102.751 0 229.5S102.751 459 229.5 459 459 356.249 459 229.5 356.249 0 229.5 0zm80.792 239.651l-111.764 76.084a12.281 12.281 0 0 1-19.19-10.151V153.416a12.281 12.281 0 0 1 19.19-10.151l111.764 76.084a12.28 12.28 0 0 1 0 20.302z" />
                </svg>
              </a>
            </div>
          </div>
        </section>
      </div>

      <section className="old-episodes">
        <div className="old-episodes__container padded wrap">
          {/* <div className="old-episodes__filter">
              Näytä:
              <button className="filter-button filter-button--active">
                Kaikki
              </button>
              <button className="filter-button">Podcast-jaksot</button>
              <button className="filter-button">Videojaksot</button>
              <button className="filter-button">Blogipostaukset</button>
            </div> */}
          <ol className="old-episode-list">
            {allEpisodes.map(({ id, number, title, description }) => (
              <li key={id} className="old-episode">
                <Link href={`/${number}`}>
                  <a>
                    <header className="old-episode__header small-title">
                      Podcast-jakso
                    </header>
                    <section className="old-episode__content">
                      <h3 className="old-episode__number">{number}</h3>
                      <div>
                        <h3 className="old-episode__title">
                          {episodeTitleWithoutNumber(title)}
                        </h3>
                        <Markdown
                          source={description}
                          linkTarget="_blank"
                          renderers={{
                            /*
                             * Only render link texts, as the episode box is already an anchor
                             */
                            link: (props) => props.children,
                          }}
                        />
                      </div>
                    </section>
                  </a>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Footer />
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const episodes = await getEpisodes(process.env.SIMPLECAST_PODCAST_ID);

  return {
    props: {
      allEpisodes: episodes.collection,
    },
  };
};
