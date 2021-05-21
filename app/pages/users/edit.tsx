import { useState } from 'react'
import Head from 'next/head'
//Components
import { Layout } from '../../components/Layout'
import { UserEditForm } from '../../components/Users/UserEditForm'
//Hooks
import { useUserSWR } from '../../hooks/useUserSWR'

const Edit: React.FC = () => {
  //ユーザー情報をSWRから取得
  const { user_data, has_user_key } = useUserSWR()
  const [isEdit, setIsEdit] = useState(false)

  return (
    <Layout>
      <Head><title>Edit Profile</title></Head>
      {
        user_data && has_user_key() && (
          <UserEditForm id={Number(user_data.user.id)} email={user_data.user.email} name={user_data.user.name} gravator_url={user_data.user.gravator_url} setIsEdit={setIsEdit}
          />
        )
      }
    </Layout>
  )
}

export default Edit
