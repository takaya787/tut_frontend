import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import { SWRConfig } from "swr";
import React from "react";
//Module
import { Auth } from "../modules/Auth";

//css関連
import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        fetcher: (url) =>
          fetch(url, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${Auth.getToken()}`,
              "Content-Type": "application/json",
            },
          }).then((res) => res.json()),
      }}
    >
      <RecoilRoot>
        <Component {...pageProps} />
      </RecoilRoot>
    </SWRConfig>
  );
}

export default MyApp;
