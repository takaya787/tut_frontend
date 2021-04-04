import Head from 'next/head'
import styles from '../styles/Home.module.scss'
import Link from 'next/link'
import Image from 'next/image'
//components
import { Layout } from '../components/Layout'
//Bootstrap
import { Nav } from 'react-bootstrap'

export default function Home() {
  return (
    <>
      <Layout>
        <Head>
          <title>Create Next App</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <header className={'navbar ' + 'navbar-fixed-top ' + 'navbar-inverse ' + styles.container}>
          <div className={"container "}>
            <Link href="#"><a id="logo">Sample App</a></Link>
            <Nav>
              <ul className={'nav' + " " + 'navbar-nav' + " " + 'navbar-right'}>
                <li><Link href="/"><a>Home</a></Link></li>
                <li><Link href="/help"><a>Help</a></Link></li>
                <li><Link href="/login"><a>Login</a></Link></li>
              </ul>
            </Nav>
          </div>
        </header>
        <div className="center jumbotron">
          <h1>Welcome to the Sample App</h1>
          <h2>This is the home page for the
            <a href="https://railstutorial.jp/">Ruby on Rails Tutorial</a>sample application.
          </h2>
          <Link href="/signup"><button className="btn btn-lg btn-primary">Sign up!</button></Link>
        </div>
        <Image src="/images/rails.svg" alt="log of rails" width={200} height={200} />
      </Layout>
    </>
  )
}
