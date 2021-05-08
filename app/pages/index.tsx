import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
//components
import { Layout } from '../components/Layout'
import { Modal } from '../components/Modal/Modal'
//Bootstrap
//Moudle
import { Auth } from '../modules/Auth'
//hooks
import { useUserSWR, AutoLoginUrl } from '../hooks/useUserSWR'

//Context
// import { FlashMessageContext } from './_app'

export default function Home() {
  //ユーザー情熱
  const { user_data, user_error, has_user_key } = useUserSWR()
  //Flash message表示
  // const { FlashDispatch } = useContext(FlashMessageContext)

  return (
    <>
      <Layout>
        <Head>
          <title>Sample App</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="center jumbotron">
          <h1>Welcome to the Sample App</h1>
          <h2>This is the home page for the<br />
            <a href="https://railstutorial.jp/"> Ruby on Rails Tutorial </a>sample application.
          </h2>
          {Auth.isLoggedIn() && user_data && has_user_key() && user_data.user.activated && (
            <>
              <p>{user_data.user.name}</p>
              <img className="rounded-circle shadow" src={user_data.user.gravator_url} alt="User icon" width={150} height={150} />
            </>
          )}
          {Auth.isLoggedIn() && user_error && (
            <p>{user_error}</p>
          )}
          {!Auth.isLoggedIn() && (<Modal title="Sign up!" />)}

        </div>
        <Link href="https://rubyonrails.org/"><a><Image src="/images/rails.svg" alt="log of rails" width={200} height={200} /></a></Link>
      </Layout>
    </>
  )
}
