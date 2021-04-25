import React, { useState, useEffect, useContext } from 'react'
import Head from 'next/head'
import Link from 'next/link'
// import Image from 'next/image'
//components
import { Layout } from '../../components/Layout'
//Context
import { FlashMessageContext } from '../_app'

type UserIndexType = {
  id: number,
  name: string,
  email: string,
  gravator_url: string
}
const UserIndexUrl = `${process.env.NEXT_PUBLIC_BASE_URL}users`

const User: React.FC = () => {
  // Contextを呼び出し
  const { FlashDispatch } = useContext(FlashMessageContext)
  // User情報をstateに取得する
  const [users, setUsers] = useState<UserIndexType[]>([])

  //indexからUser情報を取得する
  useEffect(function () {
    fetch(UserIndexUrl, {
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log('dataを表示')
        console.log({ data })
        if (data.error) {
          FlashDispatch({ type: "DANGER", message: 'ページをreloadしてください' });
          return
        }
        setUsers(data);
      })
  }, [])

  //user情報をListとして表示する
  const each_list = (IndexState: UserIndexType[]): React.ReactElement => {
    return (
      <ul className="users">
        {IndexState.map((user) => (
          <li className="users_li" key={user.id}>
            <img src={user.gravator_url} width={50} height={50} className="mr-3" />
            <Link href={`/users/${user.id}`}><a>{user.name}</a></Link>
          </li>
        ))
        }
      </ul>
    )
  }

  return (
    <Layout>
      <Head>
        <title>Users | Sample App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>All Users</h1>
      {/* usersのListを表示 */}
      {each_list(users)}
    </Layout>
  )
}

export default User
