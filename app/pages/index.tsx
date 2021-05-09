import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
//components
import { Layout } from '../components/Layout'
import { Modal } from '../components/Modal/Modal'
import { External_Image } from '../components/External_Image'
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

  return (
    <>
      <Layout>
        <Head>
          <title>Sample App</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        {Auth.isLoggedIn() && user_data && has_user_key() && user_data.user.activated && (
          // <div className="left jumbotron pt-3">
          //   <h3 className="text-info ">{user_data.user.name}</h3>
          //   <img className="rounded-circle shadow" src={user_data.user.gravator_url} alt="User icon" width={100} height={100} />
          // </div>
          <div className="d-flex px-3">
            {/* <img className="rounded-circle shadow" src={user_data.user.gravator_url} alt="User icon" width={50} height={50} /> */}
            <External_Image alt="User icon"
              src={user_data.user.gravator_url} width={50} height={50}
            />
            <div className="px-3">
              <h5 className="text-secondary mb-1">{user_data.user.name}</h5>
              <Link href={`users/${user_data.user.id}`}><a>My profile</a></Link>
            </div>

          </div>
        )}
        {!Auth.isLoggedIn() && (
          <div className="center jumbotron">
            <h1>Welcome to the Sample App</h1>
            <h2>This is the home page for the<br />
              <a href="https://railstutorial.jp/"> Ruby on Rails Tutorial </a>sample application.
                </h2>
            <Modal title="Sign up!" />
          </div>
        )}
      </Layout>
    </>
  )
}
