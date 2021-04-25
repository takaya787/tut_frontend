import React, { useState, useEffect, useContext, Dispatch, SetStateAction } from 'react'
import Head from 'next/head'
import Link from 'next/link'
// import Image from 'next/image'
//components
import { Layout } from '../../components/Layout'
//Context
import { FlashMessageContext } from '../_app'
//Bootstrap
import Pagination from 'react-bootstrap/Pagination'

type UserIndexType = {
  id: number,
  name: string,
  email: string,
  gravator_url: string
}

type PageStateType = {
  currentPage: number,
  totalPage: number,
  maxPerPage: number
}

const UserIndexUrl = `${process.env.NEXT_PUBLIC_BASE_URL}users`

const User: React.FC = () => {
  // Contextを呼び出し
  const { FlashDispatch } = useContext(FlashMessageContext)
  // User情報をstateに取得する
  const [users, setUsers] = useState<UserIndexType[]>([])

  //Pagination用のstate管理
  const [pageState, setPageState] = useState<PageStateType>({
    currentPage: 1,
    totalPage: 0,
    maxPerPage: 30
  });

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
        const totalPage = Math.ceil(data.length / pageState.maxPerPage);
        setPageState(Object.assign({ ...pageState }, { totalPage }));
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

  //Paginationを表示
  // Paginationの各part
  const Each_Number = (pageNumber: number, currentPage: number, setPageState: Dispatch<SetStateAction<PageStateType>>): React.ReactElement => {
    return (
      <>
        { pageNumber === currentPage ? (
          <Pagination.Item active>{pageNumber}</Pagination.Item>
        ) : (
          <Pagination.Item onClick={() => setPageState(Object.assign({ ...pageState }, { currentPage: pageNumber }))}>{pageNumber}</Pagination.Item>
        )}
      </>
    )
  }

  // Paginationの全体の数
  const Pagination_Numbers = (totalpage: number, currentPage: number, setPageState: Dispatch<SetStateAction<PageStateType>>): React.ReactElement => {
    const pagination_array: number[] = []
    for (var i = 1; i <= totalpage; i++) {
      pagination_array.push(i);
    }
    return (
      <>
        {pagination_array.map((number) => (
          <>{Each_Number(number, currentPage, setPageState)}</>
        ))
        }
      </>
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
      <Pagination className="justify-content-center">
        <Pagination.First onClick={() => setPageState(Object.assign({ ...pageState }, { currentPage: 1 }))} />
        <Pagination.Prev onClick={() => setPageState(Object.assign({ ...pageState }, { currentPage: pageState.currentPage - 1 }))} />
        {Pagination_Numbers(pageState.totalPage, pageState.currentPage, setPageState)}
        <Pagination.Next onClick={() => setPageState(Object.assign({ ...pageState }, { currentPage: pageState.currentPage + 1 }))} />
        <Pagination.Last onClick={() => setPageState(Object.assign({ ...pageState }, { currentPage: pageState.totalPage }))} />
      </Pagination>
      {each_list(users)}
      <Pagination className="justify-content-center">
        <Pagination.First onClick={() => setPageState(Object.assign({ ...pageState }, { currentPage: 1 }))} />
        <Pagination.Prev onClick={() => setPageState(Object.assign({ ...pageState }, { currentPage: pageState.currentPage - 1 }))} />
        {Pagination_Numbers(pageState.totalPage, pageState.currentPage, setPageState)}
        <Pagination.Next onClick={() => setPageState(Object.assign({ ...pageState }, { currentPage: pageState.currentPage + 1 }))} />
        <Pagination.Last onClick={() => setPageState(Object.assign({ ...pageState }, { currentPage: pageState.totalPage }))} />
      </Pagination>
    </Layout>
  )
}

export default User
