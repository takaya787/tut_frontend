import React, { useReducer, createContext, useEffect } from 'react';
import type { AppProps } from 'next/app'
import { RecoilRoot, useRecoilCallback } from 'recoil';
//reducers
import { FlashReducer } from '../reducers/FlashReducer'
//types
import { FlashStateType, FlashActionType } from '../types/FlashType'
//css関連
import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css';

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <RecoilRoot>
      <Component {...pageProps} />
    </RecoilRoot>
  )
}

export default MyApp
