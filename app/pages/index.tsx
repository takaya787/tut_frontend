import React, { useState, useContext, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useForm } from 'react-hook-form';
import { mutate } from 'swr'
//components
import { Layout } from '../components/Layout'
import { Modal } from '../components/Modal/Modal'
import { External_Image } from '../components/External_Image'
import { MicropostCard } from '../components/Micropost/MicropostCard'
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
import { useRelationshipsSWR } from '../hooks/useRelationshipsSWR'
import { useFeedSWR, AutoFeedUrl } from '../hooks/useFeedSWR'
import { usePagination } from '../hooks/usePagination'
import { useFlashReducer } from '../hooks/useFlashReducer';

//Micropost送信先用のUrl
const Micropost_Url = process.env.NEXT_PUBLIC_BASE_URL + 'microposts'

export default function Home() {
  //State一覧
  const [errorContent, setErrorContent] = useState('')
  //投稿画像データを所持するstate
  const [micropostImage, setMicropostImage] = useState<File>()
  //写真変更のonChange
  const handleSetImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const imageFile: File = e.target.files[0]
    setMicropostImage(imageFile)
  }

  //useFlashReducerを読み込み
  const { FlashReducer } = useFlashReducer()

  //ユーザー情報をHookから呼び出し
  const { user_data, has_user_key } = useUserSWR()

  //Relationships情報をHookから呼び出し
  const { relationships_data, has_following_key, has_followers_key } = useRelationshipsSWR()

  //Feed情報をHookから呼び出し
  const { feed_data, has_microposts_key } = useFeedSWR()

  //Pagination用のstate管理
  const { pageState, setPageState } = usePagination({ maxPerPage: 30 })
  //各keyを定数として固定しておく
  const { currentPage, maxPerPage } = pageState
  //Paginationの開始と終了時点を計算する
  const start_index = (currentPage - 1) * maxPerPage;
  const end_index = start_index + maxPerPage;


  //useForm関連メソッド
  const { register, handleSubmit } = useForm();
  const onSubmit = (value: { content: string }): void => {
    const formData = new FormData()
    formData.append('micropost[content]', value.content)
    if (micropostImage) {
      formData.append('micropost[image]', micropostImage)
    }

    const config = {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${Auth.getToken()}`
      },
      body: formData,
    }

    fetch(Micropost_Url, config)
      .then(response => {
        if (!response.ok) {
          response.json()
            .then((res): any => {
              if (res.hasOwnProperty('message')) {
                //authentication関連のエラー処理
                FlashReducer({ type: "DANGER", message: res.message })
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
        mutate(AutoFeedUrl)
        FlashReducer({ type: "SUCCESS", message: data.message })
      })
      .catch((error) => {
        console.error(error)
        FlashReducer({ type: "DANGER", message: "Error" })
      });
  }

  // const onTestSubmit = (value) => {
  //   const formData = new FormData()
  //   formData.append('micropost[content]', value.content)
  //   formData.append('micropost[image]', micropostImage)
  //   console.log(formData.get('micropost[content]'))
  //   console.log(formData.get('micropost[image]'))
  // }

  useEffect(function () {
    if (feed_data && has_microposts_key()) {
      // console.log({ user_data })
      const totalPage = Math.ceil(feed_data.microposts.length / maxPerPage);
      setPageState(Object.assign({ ...pageState }, { totalPage }));
    } else {
      // console.log("not use data")
      return
    }
  }, [feed_data])

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
                    <Col sm={4} md={4}>
                      <External_Image alt="User icon"
                        src={user_data.user.gravator_url} width={70} height={70}
                      />
                    </Col>
                    <Col sm={4} md={8}>
                      <div className="align-baseline">
                        <h5 className="text-secondary mb-1">{user_data.user.name}</h5>
                        <Link href={`users/${user_data.user.id}`}><a>View my profile</a></Link>
                      </div>
                    </Col>
                  </Row>
                  {relationships_data && has_following_key() && has_followers_key() && (
                    <Row className="p-2 border border-info rounded">
                      <Col sm={5} xs={5} className="text-secondary border-right">
                        <Link href={`users/${user_data.user.id}/following`}>
                          <div className="hover" role="button">
                            <p className="text-secondary m-0">{relationships_data.relationships.following.length}</p>
                            <p className="text-secondary m-0">following</p>
                          </div>
                        </Link>
                      </Col>
                      <Col sm={6} xs={5}>
                        <Link href={`users/${user_data.user.id}/followers`}>
                          <div className="hover" role="button">
                            <p className="text-secondary m-0">{relationships_data.relationships.followers.length}</p>
                            <p className="text-secondary m-0">followers</p>
                          </div>
                        </Link>
                      </Col>
                    </Row>
                  )}
                  <Row>
                    <div className="mt-3 p-3" style={{ width: "100%" }}>
                      <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: "500px" }}>
                        <textarea
                          id="content"
                          // name="content"
                          placeholder="What's happening to you ?"
                          style={{ maxWidth: "500px", height: "100px", fontSize: "16px", width: "100%" }}
                          className="p-2 "
                          {...register('content', { required: true })}
                        />
                        {errorContent && (
                          <>
                            <br />
                            <p className="text-danger m-0">{errorContent}</p>
                          </>
                        )}
                        <input className="my-2" type="file" accept="image/*" name="image" onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSetImage(e)} />

                        <Button style={{ maxWidth: "500px", width: "100%" }} className="mt-3" variant="outline-primary" type="submit">Submit</Button>
                      </form>
                    </div>
                  </Row>
                </Container>
              </Col>
              <Col md={7}>
                <>
                  <h3 className="border-bottom p-2">Micropost Feed</h3>
                  <Pagination_Bar pageState={pageState} setPageState={setPageState} />
                  {feed_data && has_microposts_key() && (
                    <section>
                      <ul className="microposts">
                        {feed_data.microposts.slice(start_index, end_index).map(post =>
                        (<li key={post.id} id={`micropost-${post.id}`}>
                          <MicropostCard post={post} gravator_url={post.gravator_url} name={post.name} />
                        </li>
                        ))
                        }
                      </ul>
                    </section>
                    // <UserMicropostList microposts={user_data.user.microposts} gravator_url={user_data.user.gravator_url} name={user_data.user.name} currentPage={currentPage} maxPerPage={maxPerPage} count={false} />
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
