import React, { useState, useEffect, useContext } from 'react'
import Head from 'next/head'
import Link from 'next/link'
// import Image from 'next/image'
//Context
import { FlashMessageContext } from '../_app'
//Bootstrap
//hooks
import { usePagination } from '../../hooks/usePagination'
//components
import { Layout } from '../../components/Layout'
import { Pagination_Bar } from '../../components/Pagination_Bar'
import { UserDeleteButton } from '../../components/Users/UserDeleteButton'

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

  //Pagination用のstate管理
  const { pageState, setPageState } = usePagination({ maxPerPage: 10 })
  //各keyを定数として固定しておく
  const { currentPage, maxPerPage } = pageState

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
        const totalPage = Math.ceil(data.length / maxPerPage);
        setPageState(Object.assign({ ...pageState }, { totalPage }));
        setUsers(data);
      })
  }, [maxPerPage])

  //user情報をListとして表示する
  const each_list = (IndexState: UserIndexType[], currentPage: number, maxPerPage: number): React.ReactElement => {
    const start_index = (currentPage - 1) * maxPerPage
    // .slice()での接続を意識して,indexを設定する
    const end_index = start_index + maxPerPage
    console.log({ start_index, end_index })
    return (
      <ul className="users">
        {IndexState.slice(start_index, end_index).map((user) => (
          <li className="users_li" key={user.id.toString()}>
            <img src={user.gravator_url} width={50} height={50} className="mr-3" />
            <Link href={`/users/${user.id}`}><a>{user.name}</a></Link>
            <span className="mx-3">|</span>
            <UserDeleteButton id={user.id} />
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
      <Pagination_Bar pageState={pageState} setPageState={setPageState} />

      {/* usersのListを表示 */}
      {each_list(users, currentPage, maxPerPage)}

      <Pagination_Bar pageState={pageState} setPageState={setPageState} />
    </Layout>
  )
}

export default User
