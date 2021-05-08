import Head from 'next/head'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button'
//components
import { Layout } from '../../components/Layout'
import { UserEditForm } from '../../components/Users/UserEditForm'
//hooks
import { useUserSWR } from '../../hooks/useUserSWR'
//types
import { MicropostType } from '../../types/Micropost'
//others
import Spinner from 'react-bootstrap/Spinner'
import Card from 'react-bootstrap/Card'
type ProfileProps = {
  id: string
}

type ProfileDataType = {
  email: string, id: number | null, gravator_url: string, name: string, Microposts: MicropostType[]
}

const Profile: React.FC<ProfileProps> = ({ id }) => {
  //ユーザー情熱
  const { user_data, has_user_key } = useUserSWR()
  //State設定
  const [createdDate, setCreatedDate] = useState<Date | null>(null)
  const [isEdit, setIsEdit] = useState(false)
  const [profileData, setProfileData] = useState<ProfileDataType>({ email: "", id: null, gravator_url: "", name: "", Microposts: [] })

  const BaseUrl = process.env.NEXT_PUBLIC_BASE_URL + 'users/' + id

  // user_idとprop_idが等しいか確認する
  const id_checker = (prop_id: number, user_id: number): boolean => {
    return prop_id === user_id
  }

  //MicroPostの個数を計算
  const count_Microposts = (): number => {
    if (profileData.Microposts) {
      return profileData.Microposts.length
    } else {
      return 0
    }
  }

  //MicroPostを一覧表示

  const Showlist_Microposts = (Posts: MicropostType[]): any => {
    return (
      <ul className="microposts">
        { profileData.Microposts && profileData.Microposts.map(post =>
        (<li key={post.id} id={`micropost-${post.id}`} role="button">
          <Link href={`/microposts/${post.id}`}>
            <Card className="my-3" border='secondary'>
              <Card.Body>
                <p>{post.content}</p>
                <footer className="blockquote-footer mt-0">
                  Posted ago
                </footer>
              </Card.Body>
            </Card>
          </Link>
        </li>
        ))
        }
      </ul>
    )
  }


  //profileのユーザー情報を取得
  useEffect(function () {
    if (id === undefined) {
      return
    }
    fetch(BaseUrl, {
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log({ data })
        setProfileData(data)
        let target_date = new Date(data.created_at);
        // console.log({ target_date })
        setCreatedDate(target_date)
      })
  }, [id])
  return (
    <>
      <Layout>
        <Head>
          <title>Profile</title>
        </Head>
        <div className="d-flex px-3">
          {profileData ? (
            <>
              <img src={profileData.gravator_url} alt="User icon" width={100} height={100} className="mr-3" />
              <p>{profileData.name}</p>
            </>
          ) : (
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          )}
          {createdDate && (
            <p className="mx-3 text-info">アカウント作成日:　{createdDate.getFullYear()}年 {createdDate.getMonth() + 1}月 {createdDate.getDate()}日</p>
          )}

        </div>
        <section className="m-3">
          {isEdit && (
            <>
              <Button variant="secondary" onClick={() => setIsEdit(false)}>close</Button>
              <UserEditForm id={Number(id)} email={profileData.email} name={profileData.name} gravator_url={profileData.gravator_url} setIsEdit={setIsEdit}
              />
            </>
          )}
          {!isEdit && user_data && has_user_key() && id_checker(Number(id), user_data.user.id) && (
            <Button variant="primary" onClick={() => setIsEdit(true)}>edit profile</Button>
          )}
        </section>

        <div className="col-md-8">
          <h3>Microposts  {count_Microposts()}</h3>
          {Showlist_Microposts(profileData.Microposts)}
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
