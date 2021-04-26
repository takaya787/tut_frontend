import React, { useContext } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.scss'
import Link from 'next/link'
import Image from 'next/image'
//components
import { Layout } from '../components/Layout'
import { Modal } from '../components/Modal/Modal'
//Bootstrap
import Nav from 'react-bootstrap/Nav'
//Moudle
import { Auth } from '../modules/Auth'

//Context
import { UserContext } from './_app'
import { FlashMessageContext } from './_app'

export default function Home() {
  //ユーザー情熱
  const { user } = useContext(UserContext)
  //Flash message表示
  const { FlashDispatch } = useContext(FlashMessageContext)

  const handleClick = (type: "PRIMARY" | "SUCCESS" | "DANGER" | "INFO" | "HIDDEN"): void => {
    FlashDispatch({ type: type, message: type + " is clicked!" });
  }


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
          {Auth.isLoggedIn() ?
            (
              <>
                <p>{user.name}</p>
                <img src={user.gravator_url} alt="User icon"
                  width={50} height={50} />
              </>
            ) : (<Modal title="Sign up!" />)
          }
        </div>
        {/* <Link href="https://rubyonrails.org/"><a><Image src="/images/rails.svg" alt="log of rails" width={200} height={200} /></a></Link> */}
        <ul>
          <li><button onClick={() => {
            handleClick("INFO")
          }
          }>INFO</button></li>
          <li><button onClick={() => {
            handleClick("PRIMARY")
          }
          }>PRYMARY</button></li>
          <li><button onClick={() => {
            handleClick("SUCCESS")
          }
          }>SUCCESS</button></li>
          <li><button onClick={() => {
            handleClick("DANGER")
          }
          }>DANGER</button></li>
          <li><button onClick={() => {
            handleClick("HIDDEN")
          }
          }>HIDDEN</button></li>
        </ul>
        <Image src="/images/rails.svg" alt="log of rails" width={200} height={200} />
      </Layout>
    </>
  )
}
