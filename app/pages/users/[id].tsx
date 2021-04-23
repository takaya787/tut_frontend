import Head from 'next/head'
import Link from 'next/link'
import { useContext } from 'react'
// import Image from 'next/image'
//components
import { Layout } from '../../components/Layout'
//context
import { UserContext } from '../_app'

type ProfileProps = {
  id: number
}

const Profile: React.FC<ProfileProps> = ({ id }) => {
  const { user } = useContext(UserContext)
  return (
    <>
      <Layout>
        <Head>
          <title>Profile</title>
        </Head>
        <div className="center jumbotron">
          <img src={user.gravator_url} alt="User icon"
            width={100} height={100} />
          <p>{user.name}</p>
        </div>
      </Layout>
    </>
  )
}

export default Profile

export async function getStaticPaths() {
  // Return a list of possible value for id
  const paths = []
  return {
    paths,
    fallback: true
  }
}

export async function getStaticProps({ params }) {
  // Fetch necessary data for the blog post using params.id
  return {
    props: {
      id: params.id
    }
  }
}
