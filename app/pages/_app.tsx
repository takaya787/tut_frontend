import React, { useReducer, createContext } from 'react';
//reducers
import { FlashReducer } from '../reducers/FlashReducer'
// import TimeAgo from 'javascript-time-ago'
// import en from 'javascript-time-ago/locale/en'
// TimeAgo.addDefaultLocale(en)
//types
import { FlashStateType, FlashActionType } from '../types/FlashType'
//css関連
import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css';

//Contexts
export const FlashMessageContext = createContext({} as { FlashState: FlashStateType, FlashDispatch: React.Dispatch<FlashActionType> })

function MyApp({ Component, pageProps }) {
  //FlashMessageをContext化
  const initialflashstate: FlashStateType = { show: false, variant: "primary", message: "message" }
  const [FlashState, FlashDispatch] = useReducer(FlashReducer, initialflashstate);
  const FlashValue: { FlashState: FlashStateType, FlashDispatch: React.Dispatch<FlashActionType> } = { FlashState, FlashDispatch }

  return (
    <FlashMessageContext.Provider value={FlashValue}>
      <Component {...pageProps} />
    </FlashMessageContext.Provider>
  )
}

export default MyApp
