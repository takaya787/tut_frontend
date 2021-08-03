import React from "react";
import { RecoilRoot } from "recoil";
//css関連
import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <Component {...pageProps} />
    </RecoilRoot>
  );
}

export default MyApp;
