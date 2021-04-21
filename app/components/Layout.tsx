import { useCallback, useEffect, useContext } from 'react'
import Head from 'next/head';
import React from 'react';
import styles from './Layout.module.scss';
import Alert from 'react-bootstrap/Alert'
//components
import { Header } from './Header'
import { Footer } from './Footer'
//context
import { FlashMessageContext } from '../pages/_app'

export const Layout: React.FC = ({
  children,
  home
}: {
  children: React.ReactNode,
  home?: boolean
}) => {
  const { FlashState, FlashDispatch } = useContext(FlashMessageContext)

  const FlashClose = useCallback(() => {
    console.log("close")
    FlashDispatch({ type: "HIDDEN" })
  }, [])
  useEffect(function () {
    if (FlashState.show) {
      setTimeout(FlashClose, 2000);
    }
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
        <Alert variant={FlashState.variant} transition={true} dismissible>
          {FlashState.message}
        </Alert>
      )}
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  )
}
