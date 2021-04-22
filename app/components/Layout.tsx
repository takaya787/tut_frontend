import { useCallback, useEffect, useContext } from 'react'
import Head from 'next/head';
import React from 'react';
import styles from './Layout.module.scss';
//Bootstrap
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
  //Flash messageのContextを使用
  const { FlashState, FlashDispatch } = useContext(FlashMessageContext)

  const FlashClose = useCallback(() => {
    // console.log("close")
    FlashDispatch({ type: "HIDDEN" })
  }, [])

  //flash messageを２秒後に消す
  useEffect(function () {
    if (FlashState.show) {
      setTimeout(FlashClose, 5000);
    }
  }, [FlashState.show])

  return (
    <div className={styles.container}>
      <Head>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta charSet="UTF-8" />
        <title>Ruby on Rails tutorial</title>
      </Head>

      <Header />
      {/* Flash Messageを設置 */}
      <Alert show={FlashState.show} variant={FlashState.variant} onClose={() => FlashDispatch({ type: "HIDDEN" })} transition={true} dismissible>
        <div className={styles.flash_message}>
          {FlashState.message}
        </div>
      </Alert>
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  )
}
