import { useCallback, useEffect, useContext, useState } from 'react'
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

  //Scrollでのy座標を状態として所持する
  const [scrollY, setScrollY] = useState(0)

  const FlashClose = useCallback(() => {
    // console.log("close")
    FlashDispatch({ type: "HIDDEN" })
  }, [])

  //flash messageを5秒後に消す
  useEffect(function () {
    if (FlashState.show) {
      setTimeout(FlashClose, 5000);
    }
  }, [FlashState.show])

  const scrollTop = (): number => { // scroll位置を取る関数。
    return Math.max(              // なんかブラウザによってとり方が違うようなので全部もってきてMaxをとる
      window.pageYOffset,
      document.documentElement.scrollTop,
      document.body.scrollTop);
  };

  const scrollHandler = (): void => {
    const position = scrollTop();
    setScrollY(position)
  }

  //scrollのeventListenerを設置しておく
  useEffect(function () {
    document.addEventListener("scroll", scrollHandler);
    return (): void => document.removeEventListener("scroll", scrollHandler);
  })

  //scrollによる条件分けを含んだAlertの構文
  const Alert_Block = (): React.ReactElement => {
    return (
      <>
        {/* Flash Messageを設置 */}
        {
          scrollY >= 130 ? (
            <div className="fixed-top m-3">
              <Alert show={FlashState.show} variant={FlashState.variant} onClose={() => FlashDispatch({ type: "HIDDEN" })} transition={true} bsPrefix="alert" dismissible>
                <div className={`${styles.flash_message}`}>
                  {FlashState.message}
                </div>
              </Alert>
            </div>) : (
            <div className="shadow">
              <Alert show={FlashState.show} variant={FlashState.variant} onClose={() => FlashDispatch({ type: "HIDDEN" })} transition={true} bsPrefix="alert" dismissible>
                <div className={`${styles.flash_message}`}>
                  {FlashState.message}
                </div>
              </Alert>
            </div>
          )
        }
      </>
    )
  }

  return (
    <div className={styles.container}>
      <Head>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta charSet="UTF-8" />
        <title>Ruby on Rails tutorial</title>
      </Head>

      <Header />
      {Alert_Block()}
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  )
}
