import { useState, useContext } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
//components
import { Layout } from '../../../components/Layout'
import { External_Image } from '../../../components/External_Image'
import { UserFollowList } from '../../../components/Users/UserFollowList'
//Module
import { Auth } from '../../../modules/Auth'
// Hooks
import { useUserSWR, AutoLoginUrl } from '../../../hooks/useUserSWR'
import { useRelationshipsSWR, AutoRelationshipsUrl } from '../../../hooks/useRelationshipsSWR'
import { usePagination } from '../../../hooks/usePagination'
//Bootstrap
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const Followers: React.FC = () => {
  //router機能を設定
  const router = useRouter()
  const { id, email } = router.query

  //ユーザー情報をHookから呼び出し
  const { user_data, has_user_key } = useUserSWR()

  //Relationships情報をHookから呼び出し
  const { relationships_data, has_followers_key, has_following_key } = useRelationshipsSWR()

  return (
    <Layout>
      <Head>
        <title>Followers | Sample App</title>
      </Head>
      {Auth.isLoggedIn() && user_data && has_user_key() && user_data.user.activated && (
        <Container>
          <Row>
            <Col md={5}>
              <Container>
                <Row>
                  <Col sm={4}>
                    <External_Image alt="User icon"
                      src={user_data.user.gravator_url} width={70} height={70}
                    />
                  </Col>
                  <Col sm={8}>
                    <div className="align-baseline">
                      <h5 className="text-secondary mb-1">{user_data.user.name}</h5>
                      <Link href={{
                        pathname: '/users/[id]',
                        query: { id: user_data.user.id },
                      }}><a>View my profile</a></Link>
                    </div>
                  </Col>
                </Row>
                {relationships_data && has_followers_key() && (
                  <>
                    <Row>
                      <Col sm={6} className="text-secondary m-0 ml-3 border-right">
                        <Link href={{
                          pathname: '/users/[id]/following',
                          query: { id: user_data.user.id },
                        }}>
                          <div className="hover m-2" role="button">
                            <p className="text-secondary m-0">{relationships_data.relationships.following.length}</p>
                            <p className="text-secondary m-0">following</p>
                          </div>
                        </Link>
                      </Col>
                      <Col sm={5}>
                        <Link href={{
                          pathname: '/users/[id]/followers',
                          query: { id: user_data.user.id },
                        }}>
                          <Alert variant="info" className="p-2">
                            <div className="hover" role="button">
                              <p className="text-info m-0">{relationships_data.relationships.followers.length}</p>
                              <p className="text-info m-0">followers</p>
                            </div>
                          </Alert>

                        </Link>
                      </Col>
                    </Row>
                    <Row>
                      <div className="my-2 ml-3 pc-only">
                        {relationships_data.relationships.followers.map((follower) => (
                          <Link href={{
                            pathname: '/users/[id]',
                            query: { id: follower.id },
                          }}>
                            <a>
                              <External_Image alt="User icon"
                                src={follower.gravator_url} width={30} height={30}
                              />
                            </a>
                          </Link>
                        ))}
                      </div>
                    </Row>
                  </>
                )}
              </Container>
            </Col>
            <Col md={7}>
              <h3 className="border-bottom p-2"> Followers</h3>
              {relationships_data && has_followers_key() && (
                <UserFollowList follows={relationships_data.relationships.followers} />
              )}
            </Col>
          </Row>
        </Container>
      )}
    </Layout>
  )
}

export default Followers
