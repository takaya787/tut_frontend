import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
//components
import { Layout } from "../../../components/Layout";
import { External_Image } from "../../../components/External_Image";
import { UserFollowList } from "../../../components/Users/UserFollowList";
//Module
import { Auth } from "../../../modules/Auth";
// Hooks
import { useUserSWR, AutoLoginUrl } from "../../../hooks/useUserSWR";
import { useRelationshipsSWR, AutoRelationshipsUrl } from "../../../hooks/useRelationshipsSWR";
// import { usePagination } from '../../../hooks/usePagination'
// type
import { FollowType } from "../../../types/FollowType";
//Bootstrap
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

type Followers_State_Type = {
  user: { id: number; name: string; gravator_url: string };
  followers: FollowType[];
};

const Followers: React.FC = () => {
  //router機能を設定
  const router = useRouter();
  const { id } = router.query;

  //state一覧
  const [followers_state, setFollowers_State] = useState<Followers_State_Type>();

  //ユーザー情報をHookから呼び出し
  const { user_data, id_checker } = useUserSWR();

  //Relationships情報をHookから呼び出し
  const { relationships_data, has_followers_key } = useRelationshipsSWR();

  //URLリンク
  const FollowersUrl = process.env.NEXT_PUBLIC_BASE_URL + "users/" + id + "/followers";

  //起動時にフォロー情報を取得
  useEffect(
    function () {
      if (id === undefined) {
        return;
      }
      fetch(FollowersUrl, {
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log({ data });
          setFollowers_State(data);
        });
    },
    [id]
  );

  return (
    <Layout>
      <Head>
        <title>Followers | Sample App</title>
      </Head>
      <Container>
        <Row>
          <Col md={5}>
            <Container>
              <Row>
                {followers_state && (
                  <>
                    <Col sm={4} xs={4}>
                      <External_Image
                        alt="User icon"
                        src={followers_state.user.gravator_url}
                        width={70}
                        height={70}
                      />
                    </Col>
                    <Col sm={8} xs={8}>
                      <div className="align-baseline">
                        <h5 className="text-secondary mb-1">{followers_state.user.name}</h5>
                        <Link
                          href={{
                            pathname: "/users/[id]",
                            query: { id: followers_state.user.id },
                          }}
                        >
                          <a>View my profile</a>
                        </Link>
                      </div>
                    </Col>
                  </>
                )}
              </Row>
              {relationships_data &&
                has_followers_key() &&
                id_checker(Number(id), user_data?.user?.id) && (
                  <>
                    <Row>
                      <Col sm={5} xs={5} className="text-secondary m-0 ml-3 border-right">
                        <Link
                          href={{
                            pathname: "/users/[id]/following",
                            query: { id: id },
                          }}
                        >
                          <div className="hover m-2" role="button">
                            <p className="text-secondary m-0">
                              {relationships_data.relationships.following.length}
                            </p>
                            <p className="text-secondary m-0">following</p>
                          </div>
                        </Link>
                      </Col>

                      <Col sm={6} xs={6}>
                        <Link
                          href={{
                            pathname: "/users/[id]/followers",
                            query: { id: id },
                          }}
                        >
                          <Alert variant="info" className="p-2">
                            <div className="hover" role="button">
                              <p className="text-info m-0">
                                {relationships_data.relationships.followers.length}
                              </p>
                              <p className="text-info m-0">followers</p>
                            </div>
                          </Alert>
                        </Link>
                      </Col>
                    </Row>
                    <Row>
                      <div className="my-2 ml-3 pc-only">
                        {relationships_data.relationships.followers.map((follower) => (
                          <Link
                            href={{
                              pathname: "/users/[id]",
                              query: { id: follower.id },
                            }}
                          >
                            <a>
                              <External_Image
                                alt="User icon"
                                src={follower.gravator_url}
                                width={30}
                                height={30}
                              />
                            </a>
                          </Link>
                        ))}
                      </div>
                    </Row>
                  </>
                )}
              {/* user_idとidが違う場合はリンクのみ */}
              {!id_checker(Number(id), user_data?.user?.id) && (
                <Row className="mt-3">
                  <Col sm={6} className="text-secondary m-0 ml-3 border-right">
                    <Link
                      href={{
                        pathname: "/users/[id]/following",
                        query: { id: id },
                      }}
                    >
                      <div className="hover m-2" role="button">
                        <p className="text-secondary m-0">following</p>
                      </div>
                    </Link>
                  </Col>
                  <Col sm={5}>
                    <Link
                      href={{
                        pathname: "/users/[id]/followers",
                        query: { id: id },
                      }}
                    >
                      <Alert variant="info" className="p-2">
                        <div className="hover" role="button">
                          <p className="text-info m-0">followers</p>
                        </div>
                      </Alert>
                    </Link>
                  </Col>
                </Row>
              )}
            </Container>
          </Col>
          <Col md={7}>
            <h3 className="border-bottom p-2"> Followers</h3>
            {/* user_idとprops_idが等しければSWRのデータを使用 */}
            {id_checker(Number(id), user_data?.user?.id) &&
              relationships_data &&
              has_followers_key() && (
                <UserFollowList follows={relationships_data.relationships.followers} />
              )}
            {/* user_idとprops_idが異ればstateのデータを使用 */}
            {!id_checker(Number(id), user_data?.user?.id) && followers_state && (
              <UserFollowList follows={followers_state.followers} />
            )}

            {/* loginしてなくてもstateのデータを使用 */}
            {!Auth.isLoggedIn() && followers_state && (
              <UserFollowList follows={followers_state.followers} />
            )}
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default Followers;
