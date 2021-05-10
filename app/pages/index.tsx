import React, { useState, useContext, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useForm } from 'react-hook-form';
import { mutate } from 'swr'
//components
import { Layout } from '../components/Layout'
import { Modal } from '../components/Modal/Modal'
import { External_Image } from '../components/External_Image'
import { UserMicropostList } from '../components/Users/UserMicropostList'
import { Pagination_Bar } from '../components/Pagination_Bar'
//Bootstrap
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
//Moudle
import { Auth } from '../modules/Auth'
//hooks
import { useUserSWR, AutoLoginUrl } from '../hooks/useUserSWR'
import { usePagination } from '../hooks/usePagination'
//Context
import { FlashMessageContext } from './_app'

//Micropost送信先用のUrl
const Micropost_Url = process.env.NEXT_PUBLIC_BASE_URL + 'microposts'

export default function Home() {
  //State一覧
  const [errorContent, setErrorContent] = useState('')

  //Context呼び出し
  const { FlashDispatch } = useContext(FlashMessageContext)

  //ユーザー情報をHookから呼び出し
  const { user_data, has_user_key } = useUserSWR()

  //Pagination用のstate管理
  const { pageState, setPageState } = usePagination({ maxPerPage: 10 })
  //各keyを定数として固定しておく
  const { currentPage, maxPerPage } = pageState

  //useForm関連メソッド
  const { register, handleSubmit } = useForm();
  const onSubmit = (value: { content: string }): void => {
    fetch(Micropost_Url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Auth.getToken()}`
      },
      body: JSON.stringify({
        micropost: {
          content: value.content
        }
      }),
    })
      .then(response => {
        if (!response.ok) {
          response.json()
            .then((res): any => {
              if (res.hasOwnProperty('message')) {
                //authentication関連のエラー処理
                FlashDispatch({ type: "DANGER", message: res.message })
              }
            })
        } else {
          return response.json()
        }
      })
      .then((data) => {
        //statusがokayでなければ、dataがundefinedになる
        if (data == undefined) {
          return
        }
        // console.log({ data });
        mutate(AutoLoginUrl)
        FlashDispatch({ type: "SUCCESS", message: data.message })
      })
      .catch((error) => {
        console.error(error)
        FlashDispatch({ type: "DANGER", message: "Error" })
      });
  }

  useEffect(function () {
    if (user_data && has_user_key()) {
      // console.log({ user_data })
      const totalPage = Math.ceil(user_data.user.microposts.length / maxPerPage);
      setPageState(Object.assign({ ...pageState }, { totalPage }));
    } else {
      // console.log("not use data")
      return
    }
  }, [user_data])

  return (
    <>
      <Layout>
        <Head>
          <title>Sample App</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        {Auth.isLoggedIn() && user_data && has_user_key() && user_data.user.activated && (
          <Container>
            <Row>
              <Col md={5}>
                <Container>
                  <Row>
                    <Col md={4}>
                      <External_Image alt="User icon"
                        src={user_data.user.gravator_url} width={70} height={70}
                      />
                    </Col>
                    <Col md={8}>
                      <div className="align-baseline">
                        <h5 className="text-secondary mb-1">{user_data.user.name}</h5>
                        <Link href={`users/${user_data.user.id}`}><a>View my profile</a></Link>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <div className="mt-3 p-3">
                      <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: "500px" }}>
                        <textarea
                          id="content"
                          name="content"
                          placeholder="What's happening to you ?"
                          style={{ minWidth: "250px", maxWidth: "500px", height: "100px", fontSize: "16px", width: "100%" }}
                          className="p-2 "
                          {...register('content', { required: true })}
                        />
                        {errorContent && (
                          <>
                            <br />
                            <p className="text-danger m-0">{errorContent}</p>
                          </>
                        )}
                        <Button style={{ minWidth: "250px", maxWidth: "500px", width: "100%" }} className="mt-3" variant="outline-primary" type="submit">Submit</Button>
                      </form>
                    </div>
                  </Row>
                </Container>
              </Col>
              <Col md={7}>
                <>
                  <h3 className="border-bottom p-2">Micropost Feed</h3>
                  <Pagination_Bar pageState={pageState} setPageState={setPageState} />
                  {user_data && has_user_key() && (
                    <UserMicropostList microposts={user_data.user.microposts} gravator_url={user_data.user.gravator_url} name={user_data.user.name} currentPage={currentPage} maxPerPage={maxPerPage} count={false} />
                  )}
                  <Pagination_Bar pageState={pageState} setPageState={setPageState} />
                </>
              </Col>
            </Row>
          </Container>
        )}


        {!Auth.isLoggedIn() && (
          <div className="center jumbotron">
            <h1>Welcome to the Sample App</h1>
            <h2>This is the home page for the<br />
              <a href="https://railstutorial.jp/"> Ruby on Rails Tutorial </a>sample application.
            </h2>
            <Modal title="Sign up!" />
          </div>
        )}
      </Layout>
    </>
  )
}
