import Head from 'next/head'
import React, { useState, useEffect } from 'react'
//components
import { Layout } from '../../../components/Layout'
import { UserEditForm } from '../../../components/Users/UserEditForm'
import { UserMicropostList } from '../../../components/Users/UserMicropostList'
import { UserDeleteButton } from '../../../components/Users/UserDeleteButton'
import { Pagination_Bar } from '../../../components/Pagination_Bar'
import { External_Image } from '../../../components/External_Image'
//hooks
import { useUserSWR } from '../../../hooks/useUserSWR'
import { usePagination } from '../../../hooks/usePagination'
//Module
import { Auth } from '../../../modules/Auth'
//types
import { MicropostType } from '../../../types/Micropost'
//Bootstrap
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

type ProfileProps = {
  id: string
}

type ProfileDataType = {
  email: string, id: number | null, gravator_url: string, name: string, microposts: MicropostType[]
}

const Profile: React.FC<ProfileProps> = ({ id }) => {
  //ユーザー情報をSWRから取得
  const { user_data, has_user_key } = useUserSWR()

  //State一覧
  //Profile用のState設定
  const [createdDate, setCreatedDate] = useState<Date | null>(null)
  const [isEdit, setIsEdit] = useState(false)
  //IdからUserのデータを取得する
  const [profileData, setProfileData] = useState<ProfileDataType>({ email: "", id: null, gravator_url: "", name: "", microposts: [] })

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
        const totalPage = Math.ceil(data.microposts.length / maxPerPage);
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
        <Container>
          {profileData && profileData.gravator_url && (
            <Row>
              <Col sm={3} md={2}>
                <External_Image src={profileData.gravator_url} alt="User icon" width={100} height={100} className="rounded-circle shadow" />
              </Col>
              <Col sm={6}>
                <>
                  <p className="mx-3 my-0 font-weight-bold">{profileData.name}</p>
                  {createdDate && (
                    <p className="mx-3 text-secondary">This acount has been used since {createdDate.getFullYear()}/ {createdDate.getMonth() + 1}/ {createdDate.getDate()}</p>
                  )}
                </>
              </Col>
            </Row>
          )}
          <Row>
            <Col sm={11} lg={10}>
              {isEdit && (
                <>
                  <Button variant="secondary" onClick={() => setIsEdit(false)}>close</Button>
                  <UserEditForm id={Number(id)} email={profileData.email} name={profileData.name} gravator_url={profileData.gravator_url} setIsEdit={setIsEdit}
                  />
                </>
              )}
              {!isEdit && user_data && has_user_key() && id_checker(Number(id), user_data.user.id) && (
                <Button variant="primary" className="mb-3" onClick={() => setIsEdit(true)}>edit profile</Button>
              )}
            </Col>

          </Row>
          {user_data && has_user_key() && id_checker(Number(id), user_data.user.id) && (
            <UserDeleteButton id={Number(id)} />
          )}
        </Container>
        <div className="col-md-10 mx-auto">
          <Pagination_Bar pageState={pageState} setPageState={setPageState} />
          {/* login Userとprofile userのIDが等しかったら、micropostはswrから取得させる*/}
          {user_data && has_user_key() && user_data.user.id === Number(id) && (
            <UserMicropostList microposts={user_data.user.microposts} gravator_url={user_data.user.gravator_url} name={user_data.user.name} currentPage={currentPage} maxPerPage={maxPerPage} count={false} />
          )}
          {/* こっちが普通のstateからMicropostを表示 */}
          {user_data && has_user_key() && user_data.user.id !== Number(id) && (
            <UserMicropostList microposts={profileData.microposts} gravator_url={profileData.gravator_url} name={profileData.name} currentPage={currentPage} maxPerPage={maxPerPage} count={true} />
          )}
          {/* loginしてなくてもstateからMicropostを表示 */}
          {!Auth.isLoggedIn() && (
            <UserMicropostList microposts={profileData.microposts} gravator_url={profileData.gravator_url} name={profileData.name} currentPage={currentPage} maxPerPage={maxPerPage} count={true} />
          )}
          <Pagination_Bar pageState={pageState} setPageState={setPageState} />
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
