import React from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.scss'
import Link from 'next/link'
import Image from 'next/image'
//components
import { Layout } from '../components/Layout'
import { Modal } from '../components/Modal/Modal'
//Bootstrap
import Nav from 'react-bootstrap/Nav'

export default function Home() {

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
          <Modal title="Sign up!" />
        </div>
        {/* <Link href="https://rubyonrails.org/"><a><Image src="/images/rails.svg" alt="log of rails" width={200} height={200} /></a></Link> */}
        <Image src="/images/rails.svg" alt="log of rails" width={200} height={200} />
      </Layout>
    </>
  )
}
