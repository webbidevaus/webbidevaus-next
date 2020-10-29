import React from "react";
import classNames from "classnames";

export function Footer({ isSingle = false }) {
  return (
    <footer
      className={classNames({
        footer: true,
        "footer--single": isSingle,
        padded: true,
      })}
    >
      <h1 className="footer__slogan">
        “Puheradiota webbikehityksestä, suomeksi!”
      </h1>
      <p className="footer__copy">
        Webbidevaus.fi -podcast on internetissä suunnilleen viikoittain
        ilmestyvä, web-kehityksestä kertova suomenkielinen puheradio-ohjelma.
      </p>
      <p className="footer__copy">Webbidevaus.fi on lisensoitu CC BY-NC.</p>

      <h1 className="footer__title small-title">Juontajasi</h1>
      <ul className="hosts">
        <li className="host">
          <img
            src="https://avatars2.githubusercontent.com/u/162899?s=460&v=4"
            alt="Antti Mattila"
          />
          <div className="host-details">
            <h2>Antti Mattila</h2>
            <a href="https://twitter.com/anttti">@anttti</a>
          </div>
        </li>
        <li className="host">
          <img
            src="https://avatars3.githubusercontent.com/u/1206987?s=460&v=4"
            alt="Riku Rouvila"
          />
          <div className="host-details">
            <h2>Riku Rouvila</h2>
            <a href="https://twitter.com/rikurouvila">@rikurouvila</a>
          </div>
        </li>
      </ul>

      <h1 className="subscribe small-title">Tilaa Webbidevaus.fi -podcast!</h1>
      <div className="subscribe-buttons">
        <a
          className="subscribe-button"
          href="https://itunes.apple.com/fi/podcast/webbidevaus-fi/id1350226932"
        >
          <img
            className="subscribe-button__image"
            src="/itunes.svg"
            alt="Webbidevaus Apple Podcastsissa"
          />
        </a>
        <a
          className="subscribe-button"
          href="https://overcast.fm/itunes1350226932/webbidevaus-fi"
        >
          <img
            className="subscribe-button__image"
            src="overcast.svg"
            alt="Webbidevaus Overcastissa"
          />
        </a>
        <a
          className="subscribe-button"
          href="https://pca.st/podcast/60a538e0-f84f-0135-c260-7d73a919276a"
        >
          <img
            className="subscribe-button__image"
            src="pocketcasts.svg"
            alt="Webbidevaus Pocket Castsissa"
          />
        </a>
      </div>
    </footer>
  );
}
