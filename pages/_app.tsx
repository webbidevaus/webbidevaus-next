import { AppProps } from "next/app";
import Head from "next/head";
import "../styles/global.scss";

function WebbidevausApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <link
          href="https://fonts.googleapis.com/css?family=Montserrat:400,400i,700,700i,900&display=swap"
          rel="stylesheet"
        />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Webbidevaus.fi RSS"
          href="https://feeds.simplecast.com/wFD5mVlw"
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default WebbidevausApp;
