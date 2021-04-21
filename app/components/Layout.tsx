import { useReducer, useCallback, createContext } from 'react'
import Head from 'next/head';
import React from 'react';
import styles from './Layout.module.scss';
import Alert from 'react-bootstrap/Alert'
//components
import { Header } from './Header'
import { Footer } from './Footer'
//reducers
import { FlashReducer } from '../reducers/FlashReducer'
//types
import { FlashStateType, FlashActionType } from '../types/FlashType'
import context from 'react-bootstrap/esm/AccordionContext';

//ContextAPIでflash messageを作成できるように設定
export const FlashDispatchContext = createContext({} as { dispatch: React.Dispatch<FlashActionType> })

export const Layout: React.FC = ({
  children,
  home
}: {
  children: React.ReactNode,
  home?: boolean
}) => {
  //LayoutにFlashMessageを
  const initialflashstate: FlashStateType = { show: false, variant: "primary", message: "message" }

  const [FlashState, FlashDispatch] = useReducer(FlashReducer, initialflashstate);

  const FlashClose = useCallback(() => {
    FlashDispatch({ type: "HIDDEN" })
  }, [])

  return (
    <div className={styles.container}>
      <Head>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta charSet="UTF-8" />
        <title>Ruby on Rails tutorial</title>
      </Head>

      <Header />
      {FlashState.show && (
        <Alert variant={FlashState.variant} onClose={() => FlashClose} dismissible>
          {FlashState.message}
        </Alert>
      )}
      <FlashDispatchContext.Provider value={{ dispatch: FlashDispatch }}>
        <main className={styles.main}>{children}</main>
      </FlashDispatchContext.Provider>
      <Footer />
    </div>
  )
}
