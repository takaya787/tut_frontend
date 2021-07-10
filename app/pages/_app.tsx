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

//Contexts
export const FlashMessageContext = createContext({} as { FlashState: FlashStateType, FlashDispatch: React.Dispatch<FlashActionType> })

function MyApp({ Component, pageProps }: AppProps) {
  //FlashMessageをContext化
  const initialflashstate: FlashStateType = { show: false, variant: "primary", message: "message" }
  const [FlashState, FlashDispatch] = useReducer(FlashReducer, initialflashstate);
  const FlashValue: { FlashState: FlashStateType, FlashDispatch: React.Dispatch<FlashActionType> } = { FlashState, FlashDispatch }

  return (
    <RecoilRoot>
      <FlashMessageContext.Provider value={FlashValue}>
        <Component {...pageProps} />
      </FlashMessageContext.Provider>
    </RecoilRoot>
  )
}

export default MyApp
