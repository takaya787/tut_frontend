import Head from 'next/head'
import Link from 'next/link'
import { useContext, useState } from 'react'
// import Image from 'next/image'
//Bootstrap
import Button from 'react-bootstrap/Button'
//components
import { Layout } from '../../components/Layout'
import { UserEditForm } from '../../components/Users/UserEditForm'
//context
import { UserContext } from '../_app'

type ProfileProps = {
  id: number
}

const Profile: React.FC<ProfileProps> = ({ id }) => {
  const { user } = useContext(UserContext)
  const [isEdit, setIsEdit] = useState(false)
  return (
    <>
      <Layout>
        <Head>
          <title>Profile</title>
        </Head>
        <div className="d-flex">
          <img src={user.gravator_url} alt="User icon"
            width={100} height={100} className="mr-3" />
          <p>{user.name}</p>
        </div>
        {isEdit ? (
          <>
            <Button variant="secondary" onClick={() => setIsEdit(false)} className="mt-3">close</Button>
            <UserEditForm id={id} email={user.email} name={user.name} gravator_url={user.gravator_url} />
          </>
        ) : (
          <Button variant="primary" onClick={() => setIsEdit(true)} className="mt-3">edit profile</Button>
        )}
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
