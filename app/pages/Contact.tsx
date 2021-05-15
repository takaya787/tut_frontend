import Head from 'next/head'
// import styles from '../styles/Home.module.scss'
import Link from 'next/link'
// import Image from 'next/image'
//components
import { Layout } from '../components/Layout'

const Contact: React.FC = () => {
  return (
    <Layout>
      <Head>
        <title>Contact | Sample App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>Contact</h1>
      <p>
        Contact the Ruby on Rails Tutorial about the sample app at the
        <a href="https://railstutorial.jp/contact">contact page</a>.
      </p>
    </Layout>
  )
}

export default Contact
