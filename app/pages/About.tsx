import Head from 'next/head'
// import styles from '../styles/Home.module.scss'
import Link from 'next/link'
// import Image from 'next/image'
//components
import { Layout } from '../components/Layout'

const About: React.FC = () => {
  return (
    <Layout>
      <Head>
        <title>About | Sample App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>About</h1>
      <p>
        <Link href="https://railstutorial.jp/"><a>Ruby on Rails Tutorial</a></Link>
      is a <Link href="https://railstutorial.jp/#ebook"><a>book</a></Link> and
      <a href="https://railstutorial.jp/screencast">screencast</a>
      to teach web development with
      <a href="https://rubyonrails.org/">Ruby on Rails</a>.
      This is the sample application for the tutorial.
    </p>
    </Layout>
  )
}

export default About
