import React, { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useForm } from 'react-hook-form';
//components
import { Layout } from '../components/Layout'
import { Modal } from '../components/Modal/Modal'
import { External_Image } from '../components/External_Image'
//Bootstrap
import Button from 'react-bootstrap/Button'
//Moudle
import { Auth } from '../modules/Auth'
//hooks
import { useUserSWR } from '../hooks/useUserSWR'
//Context
import { FlashMessageContext } from './_app'

export default function Home() {
  //ユーザー情熱
  const { user_data, has_user_key } = useUserSWR()

  //useFormからメソッドをimport
  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => console.log({ content: data.content });
  //Error内容の状態関数
  const [errorContent, setErrorContent] = useState('')

  return (
    <>
      <Layout>
        <Head>
          <title>Sample App</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        {Auth.isLoggedIn() && user_data && has_user_key() && user_data.user.activated && (
          <>
            <div className="d-flex px-3">
              <External_Image alt="User icon"
                src={user_data.user.gravator_url} width={50} height={50}
              />
              <div className="px-3">
                <h5 className="text-secondary mb-1">{user_data.user.name}</h5>
                <Link href={`users/${user_data.user.id}`}><a>View my profile</a></Link>
              </div>
            </div>
            <div className="mt-3 p-3">
              <form onSubmit={handleSubmit(onSubmit)}>
                <textarea
                  id="content"
                  name="content"
                  placeholder="What's happening to you ?"
                  style={{ width: "300px", height: "100px", fontSize: "16px" }}
                  className="p-2 "
                  {...register('content', { required: true })}
                />
                {errorContent && (
                  <>
                    <br />
                    <p className="text-danger m-0">{errorContent}</p>
                  </>
                )}
                <Button style={{ width: "300px" }} className="mt-3" variant="primary" type="submit">Submit</Button>
              </form>
            </div>
          </>
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
