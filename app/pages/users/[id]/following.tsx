import { useState, useEffect } from 'react'
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
// type
import { FollowType } from '../../../types/FollowType'
//Bootstrap
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Alert from 'react-bootstrap/Alert'

type Following_State_Type = {
  user: { id: number, name: string, gravator_url: string },
  following: FollowType[]
}


const Following: React.FC = () => {
  //router機能を設定
  const router = useRouter()
  const { id } = router.query

  //state一覧
  const [following_state, setFollowing_State] = useState<Following_State_Type>()

  //ユーザー情報をHookから呼び出し
  const { user_data, has_user_key } = useUserSWR()

  //Relationships情報をHookから呼び出し
  const { relationships_data, has_following_key } = useRelationshipsSWR()

  // user_idとprop_idが等しいか確認する
  const id_checker = (prop_id: number, user_id: number): boolean => {
    return prop_id === user_id
  }

  //URLリンク
  const FollowingUrl = process.env.NEXT_PUBLIC_BASE_URL + 'users/' + id + '/following'

  //起動時にフォロー情報を取得
  useEffect(function () {
    if (id === undefined) {
      return
    }
    fetch(FollowingUrl, {
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log({ data })
        setFollowing_State(data)
      })
  }, [id])

  return (
    <Layout>
      <Head>
        <title>Following | Sample App</title>
      </Head>
      <Container>
        <Row>
          <Col md={5}>
            <Container>
              <Row>
                {following_state && (
                  <>
                    <Col sm={4}>
                      <External_Image alt="User icon"
                        src={following_state.user.gravator_url} width={70} height={70}
                      />
                    </Col>
                    <Col sm={8}>
                      <div className="align-baseline">
                        <h5 className="text-secondary mb-1">{following_state.user.name}</h5>
                        <Link href={{
                          pathname: '/users/[id]',
                          query: { id: following_state.user.id },
                        }}><a>View my profile</a></Link>
                      </div>
                    </Col>
                  </>
                )}
              </Row>
              {relationships_data && has_following_key() && user_data && has_user_key() && id_checker(Number(id), user_data.user.id) && (
                <>
                  <Row>
                    <Col sm={6} className="text-secondary m-0 ml-3 border-right">
                      <Link href={{
                        pathname: '/users/[id]/following',
                        query: { id: id },
                      }}>
                        <Alert variant="info" className="p-2">
                          <div className="hover" role="button">
                            <p className="text-info m-0">{relationships_data.relationships.following.length}</p>
                            <p className="text-info m-0">following</p>
                          </div>
                        </Alert>
                      </Link>
                    </Col>
                    <Col sm={5}>
                      <Link href={{
                        pathname: '/users/[id]/followers',
                        query: { id: id },
                      }}>
                        <div className="hover" role="button">
                          <p className="text-info m-0">{relationships_data.relationships.followers.length}</p>
                          <p className="text-info m-0">followers</p>
                        </div>
                      </Link>
                    </Col>
                  </Row>
                  <Row>
                    <div className="my-2 ml-3 pc-only">
                      {relationships_data.relationships.following.map((follower) => (
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
              {/* user_idとidが違う場合はリンクのみ */}
              {user_data && has_user_key() && !id_checker(Number(id), user_data.user.id) && (
                <Row className="mt-3">
                  <Col sm={6} className="text-secondary ml-3 border-right">
                    <Link href={{
                      pathname: '/users/[id]/following',
                      query: { id: id },
                    }}>
                      <Alert variant="info" className="p-2">
                        <div className="hover" role="button">
                          <p className="text-info m-0">following</p>
                        </div>
                      </Alert>
                    </Link>
                  </Col>
                  <Col sm={5}>
                    <Link href={{
                      pathname: '/users/[id]/followers',
                      query: { id: id },
                    }}>
                      <div className="hover m-2" role="button">
                        <p className="text-secondary m-0">followers</p>
                      </div>
                    </Link>
                  </Col>
                </Row>
              )}
            </Container>
          </Col>
          <Col md={7}>
            <h3 className="border-bottom p-2"> Following</h3>
            {/* user_idとprops_idが等しければSWRのデータを使用 */}
            {user_data && has_user_key() && id_checker(Number(id), user_data.user.id) && relationships_data && has_following_key() && (
              <UserFollowList follows={relationships_data.relationships.following} />
            )}
            {/* user_idとprops_idが異ればstateのデータを使用 */}
            {user_data && has_user_key() && !id_checker(Number(id), user_data.user.id) && following_state && (
              <UserFollowList follows={following_state.following} />
            )}

            {/* loginしてなくてもstateのデータを使用 */}
            {!Auth.isLoggedIn() && following_state && (
              <UserFollowList follows={following_state.following} />
            )}
          </Col>
        </Row>
      </Container>
    </Layout>
  )
}

export default Following
