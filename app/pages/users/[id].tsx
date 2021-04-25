import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect, useContext } from 'react'
import Button from 'react-bootstrap/Button'
//components
import { Layout } from '../../components/Layout'
import { UserEditForm } from '../../components/Users/UserEditForm'
//others
import Spinner from 'react-bootstrap/Spinner'
import { UserContext } from '../_app'

type ProfileProps = {
  id: string
}

type ProfileDataType = {
  email: string, id: number | null, gravator_url: string, name: string
}

const Profile: React.FC<ProfileProps> = ({ id }) => {
  const [isEdit, setIsEdit] = useState(false)

  const [isLoading, setIsLoading] = useState(true)
  const [profileData, setProfileData] = useState<ProfileDataType>({ email: "", id: null, gravator_url: "", name: "" })

  const { user } = useContext(UserContext)
  const BaseUrl = process.env.NEXT_PUBLIC_BASE_URL + 'users/' + id

  // user_idとprop_idが等しいか確認する
  const id_checker = (prop_id: number, user_id: number): boolean => {
    return prop_id === user_id
  }

  // function id_checker(prop_id: number, user_id: number ) :boolean{
  //   return prop_id === user_id
  // }

  //profileのユーザー情報を取得
  useEffect(function () {
    setIsLoading(true);
    fetch(BaseUrl, {
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log({ data })
        setProfileData(data)
        setIsLoading(false)
      })
  }, [id])
  return (
    <>
      <Layout>
        <Head>
          <title>Profile</title>
        </Head>
        <div className="d-flex">
          {isLoading ? (
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          ) : (
            <>
              <img src={profileData.gravator_url} alt="User icon"
                width={100} height={100} className="mr-3" />
              <p>{profileData.name}</p>
            </>
          )}
        </div>
        {isEdit && (
          <>
            <Button variant="secondary" onClick={() => setIsEdit(false)} className="mt-3">close</Button>
            <UserEditForm id={Number(id)} email={profileData.email} name={profileData.name} gravator_url={profileData.gravator_url} setIsEdit={setIsEdit}
            />
          </>
        )}
        {!isEdit && id_checker(Number(id), user.id) && (
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
