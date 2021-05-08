import Head from 'next/head'
import React, { useState, useEffect } from 'react'
//components
import { Layout } from '../../components/Layout'
import { UserEditForm } from '../../components/Users/UserEditForm'
import { UserMicropostList } from '../../components/Users/UserMicropostList'
import { Pagination_Bar } from '../../components/Pagination_Bar'
//hooks
import { useUserSWR } from '../../hooks/useUserSWR'
import { usePagination } from '../../hooks/usePagination'
//types
import { MicropostType } from '../../types/Micropost'
//others
import Spinner from 'react-bootstrap/Spinner'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'

type ProfileProps = {
  id: string
}

type ProfileDataType = {
  email: string, id: number | null, gravator_url: string, name: string, Microposts: MicropostType[]
}

const Profile: React.FC<ProfileProps> = ({ id }) => {
  //ユーザー情熱
  const { user_data, has_user_key } = useUserSWR()
  //Profile用のState設定
  const [createdDate, setCreatedDate] = useState<Date | null>(null)
  const [isEdit, setIsEdit] = useState(false)
  const [profileData, setProfileData] = useState<ProfileDataType>({ email: "", id: null, gravator_url: "", name: "", Microposts: [] })

  //Pagination用のstate管理
  const { pageState, setPageState } = usePagination({ maxPerPage: 15 })
  //各keyを定数として固定しておく
  const { currentPage, maxPerPage } = pageState

  // user_idとprop_idが等しいか確認する
  const id_checker = (prop_id: number, user_id: number): boolean => {
    return prop_id === user_id
  }

  //URLリンク
  const BaseUrl = process.env.NEXT_PUBLIC_BASE_URL + 'users/' + id
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
        const totalPage = Math.ceil(data.Microposts.length / maxPerPage);
        setPageState(Object.assign({ ...pageState }, { totalPage }));
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
          {profileData && (
            <>
              <img src={profileData.gravator_url} alt="User icon" width={100} height={100} className="mr-3 rounded-circle shadow" />
              <p>{profileData.name}</p>
              {createdDate && (
                <p className="mx-3 text-info">Since: {createdDate.getFullYear()}/ {createdDate.getMonth() + 1}/ {createdDate.getDate()}</p>
              )}
            </>
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
          <Pagination_Bar pageState={pageState} setPageState={setPageState} />
          <UserMicropostList Microposts={profileData.Microposts} gravator_url={profileData.gravator_url} name={profileData.name} currentPage={currentPage} maxPerPage={maxPerPage} />
          {/* <Pagination_Bar pageState={pageState} setPageState={setPageState} /> */}
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
