import React from "react";
import classNames from "classnames";

// Using a <a href="#subscribe"> caused an overflowing content bug
function scrollToBottom() {
  window.scrollTo(0, document.body.scrollHeight);
}

export const Header = ({ className }: { className?: string }) => (
  <header className={classNames("site-header", className)}>
    <a className="logo-link" href="/">
      <div className="logo">&lt;fi/&gt;</div>
    </a>

    <section className="social">
      <div className="social__links-wrap">
        <a className="social__link" href="https://twitter.com/webbidevaus">
          Twitter
        </a>

        <button className="social__link" onClick={scrollToBottom}>
          Tilaa
        </button>
      </div>
      <a className="button" href="http://bit.ly/webbidevaus">
        Kysy kysymys!
      </a>
    </section>
  </header>
);
