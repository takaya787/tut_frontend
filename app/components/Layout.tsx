import { useCallback, useEffect, useContext, useState } from 'react'
import Head from 'next/head';
import React from 'react';
import styles from './Layout.module.scss';
//Bootstrap
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
//components
import { Header } from './Header'
import { Footer } from './Footer'
//context
import { FlashMessageContext } from '../pages/_app'
//Moudle
import { Auth } from '../modules/Auth'
//hooks
import { useUserSWR } from '../hooks/useUserSWR'

export const Layout: React.FC<{
  children: React.ReactNode
}> = ({
  children
}) => {
    // userdataをSWRから取り出す
    const { user_data, has_user_key } = useUserSWR()

    //Flash messageのContextを使用
    const { FlashState, FlashDispatch } = useContext(FlashMessageContext)

    //Scrollでのy座標を状態として所持する
    const [scrollY, setScrollY] = useState(0)

    const FlashClose = useCallback(() => {
      // console.log("close")
      FlashDispatch({ type: "HIDDEN" })
    }, [])

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

    const Resend_Email_Url = process.env.NEXT_PUBLIC_BASE_URL + 'account_activations/resend_email'

    //resend_requestを作成するClick関数
    const click_resend_email = () => {
      fetch(Resend_Email_Url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Auth.getToken()}`
        }
      })
        .then((response) => response.json())
        .then((data) => {
          console.log({ data })
          FlashDispatch({ type: "SUCCESS", message: data.message })
        })
    }

    //React.Element関連
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

    const Activation_Warning = (): React.ReactElement => {
      return (
        <>
          <Alert variant="warning">
            <Alert.Heading>Your account is not still activated!</Alert.Heading>
            <p className="font-weight-bold text-danger">Please confirm your email and activate your Account by clicking the Link in the email</p>
          </Alert>
          <Alert variant="info">
            <Alert.Heading>Resend the activation email</Alert.Heading>
            <p className="font-weight-bold text-info">If you can't confirm the activation email in your account, the email can be resent by here</p>
            <Button variant="outline-primary" onClick={click_resend_email}>Resend</Button>
          </Alert>
        </>
      )
    }

    //use Effect関連
    //flash messageを5秒後に消す
    useEffect(function () {
      if (FlashState.show) {
        setTimeout(FlashClose, 5000);
      }
    }, [FlashState.show])

    //scrollのeventListenerを設置しておく
    useEffect(function () {
      document.addEventListener("scroll", scrollHandler);
      return (): void => document.removeEventListener("scroll", scrollHandler);
    })



    return (
      <div className={styles.container}>
        <Head>
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <meta charSet="UTF-8" />
          <title>Ruby on Rails tutorial</title>

          {/* favicon関連 */}
          <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
          <link rel="manifest" href="/favicons/site.webmanifest" />
          <link rel="mask-icon" href="/favicons/safari-pinned-tab.svg" color="#000000" />
          <link rel="shortcut icon" href="/favicons/favicon.ico" />
          <meta name="msapplication-TileColor" content="#ffffff" />
          <meta name="msapplication-config" content="/favicons/browserconfig.xml" />
          <meta name="theme-color" content="#ffffff" />
        </Head>

        <Header />
        {Alert_Block()}
        {/* activataされていないユーザーには通知する */}
        {Auth.isLoggedIn() && user_data && has_user_key() && !user_data.user.activated &&
          (<> {Activation_Warning()}</>)
        }
        <main className={styles.main}>{children}</main>
        <Footer />
      </div>
    )
  }
