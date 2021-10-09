import React, { useState, useMemo, useEffect } from "react";
import useSWRImmutable from "swr/immutable";
import Link from "next/link";
//Components
import { External_Image } from "../External_Image";
//Bootstrap
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
//Type
import { UserLikedType } from "../../types/UserType";

type MicropostLikeInfoPropsType = {
  id: number;
};

export const MicropostLikeInfo: React.FC<MicropostLikeInfoPropsType> = ({ id }) => {
  const Micropost_Liked_Url = process.env.NEXT_PUBLIC_BASE_URL + "microposts/" + id + "/liked";

  const [isShow, setIsShow] = useState(false);

  const toggleShow = () => setIsShow(!isShow);

  //Liked_UserをSWRで取得し、requestは表示時に行う
  const { data, error } = useSWRImmutable(isShow ? Micropost_Liked_Url : null);

  const InfoContent = useMemo((): React.ReactElement | null => {
    if (!isShow) {
      return null;
    }

    if (!data) {
      return <Spinner animation="border" variant="primary" />;
    }

    return (
      <Modal show={isShow} onHide={toggleShow}>
        <Modal.Header closeButton className="pb-0">
          <strong className="text-primary h4">いいねしたユーザー</strong>
        </Modal.Header>
        <Modal.Body className="py-0">
          <ul className="">
            {data?.users?.map(
              (user: UserLikedType): React.ReactElement => (
                <Link
                  href={{
                    pathname: "/users/[id]",
                    query: { id: user.id },
                  }}
                >
                  <li key={user.id} className="my-2 border-bottom" role="button">
                    <Container>
                      <Row>
                        <Col xs={2} md={2} lg={2} className="pl-2">
                          <External_Image
                            src={user.gravator_url}
                            alt="User icon"
                            width={50}
                            height={50}
                            className="rounded-circle"
                          />
                        </Col>
                        <Col xs={10} md={10} lg={10}>
                          <p className="text-primary mb-1">{user.name}</p>
                        </Col>
                      </Row>
                    </Container>
                  </li>
                </Link>
              )
            )}
          </ul>
        </Modal.Body>
      </Modal>
    );
  }, [isShow, data]);

  return (
    <>
      {InfoContent}
      <Button size="sm" variant="outline-info" onClick={toggleShow}>
        いいねしたユーザー
      </Button>
    </>
  );
};
