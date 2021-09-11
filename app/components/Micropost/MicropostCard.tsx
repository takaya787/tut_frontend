import React, { useState } from "react";
import Link from "next/link";
import TimeAgo from "react-timeago";
import { useForm } from "react-hook-form";
import { mutate } from "swr";
//日本語に翻訳するなら必要
// import japaneseStrings from 'react-timeago/lib/language-strings/ja'
// import buildFormatter from 'react-timeago/lib/formatters/buildFormatter'
//Component
import { External_Image } from "../External_Image";
import { MicropostDelete } from "../Micropost/MicropostDelete";
import { MicropostEdit } from "../Micropost/MicropostEdit";
//Module
import { Auth } from "../../modules/Auth";
//Hooks
import { useFlashReducer } from "../../hooks/useFlashReducer";
import { useFeedFetch } from "../../hooks/useFeedFetch";
//types
import { MicropostType } from "../../types/Micropost";
//others
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

type MicropostCardProps = {
  name: string;
  gravator_url: string;
  post: MicropostType;
};

export const MicropostCard: React.FC<MicropostCardProps> = ({ post, name, gravator_url }) => {
  //useFlashReducerを読み込み
  const { FlashReducer } = useFlashReducer();

  //useFeedFetchを読み込み
  const { reloadFetching } = useFeedFetch();

  //State一覧
  const [isEdit, setIsEdit] = useState(false);
  //投稿画像データを所持するstate
  const [micropostImage, setMicropostImage] = useState<File>();

  //写真変更のonChange
  const handleSetImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const imageFile: File = e.target.files[0];
    setMicropostImage(imageFile);
  };

  //Micropost送信先用のUrl
  const Micropost_Edit_Url = process.env.NEXT_PUBLIC_BASE_URL + "microposts/" + post.id;

  //useForm関連メソッド
  const { register, handleSubmit } = useForm();
  const onSubmit = (value: { content: string }): void => {
    const formData = new FormData();
    formData.append("micropost[content]", value.content);
    if (micropostImage) {
      formData.append("micropost[image]", micropostImage);
    }

    const config = {
      method: "PUT",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${Auth.getToken()}`,
      },
      body: formData,
    };
    fetch(Micropost_Edit_Url, config)
      .then((response) => {
        if (!response.ok) {
          response.json().then((res): any => {
            if (res.hasOwnProperty("message")) {
              //authentication関連のエラー処理
              FlashReducer({ type: "DANGER", message: res.message });
              setIsEdit(false);
            }
          });
        } else {
          return response.json();
        }
      })
      .then((data) => {
        //statusがokayでなければ、dataがundefinedになる
        if (data == undefined) {
          return;
        }
        // console.log({ data });
        setIsEdit(false);
        reloadFetching();
        FlashReducer({ type: "SUCCESS", message: data.message });
      })
      .catch((error) => {
        console.error(error);
        FlashReducer({ type: "DANGER", message: "Error" });
      });
  };

  return (
    <Card className="my-3" border="secondary">
      <Card.Body className="p-1">
        <Link href={`/microposts/${post.id}`}>
          <div className="hover" role="button">
            <Container>
              <Row>
                <Col sm={2} md={2} lg={2} className="pl-2">
                  <External_Image
                    src={gravator_url}
                    alt="User icon"
                    width={50}
                    height={50}
                    className="rounded-circle"
                  />
                </Col>
                <Col sm={10} md={10} lg={10}>
                  <p className="text-primary mb-1">{name}</p>
                  <p className="mb-1" style={{ whiteSpace: "pre-line" }}>
                    {post.content}
                  </p>
                </Col>
              </Row>
              {/* 投稿に写真があれば表示 */}
              {post.image_url && (
                <Row className="justify-content-center mb-3">
                  <External_Image
                    src={post.image_url}
                    alt="Micropost Image"
                    width={200}
                    height={200}
                    className="mx-auto"
                  />
                </Row>
              )}
            </Container>
          </div>
        </Link>
        <footer
          className="py-2  w-80 my-0 mx-auto d-flex flex-row justify-content-around"
          style={{ maxHeight: "70px" }}
        >
          <div className="float-left h6 align-self-center">
            Posted <TimeAgo date={new Date(post.created_at)} />
          </div>
          <br className="sp-only" />
          <div className="p-2">
            <MicropostEdit
              id={post.id}
              user_id={post.user_id}
              isEdit={isEdit}
              setIsEdit={setIsEdit}
            />
          </div>
          <div className="p-2">
            <MicropostDelete id={post.id} user_id={post.user_id} />
          </div>
        </footer>
        {isEdit && (
          <div className="mt-3 p-3" style={{ width: "100%" }}>
            <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: "500px" }}>
              <textarea
                id="content"
                // name="content"
                placeholder="What's happening to you ?"
                style={{
                  maxWidth: "500px",
                  height: "100px",
                  fontSize: "16px",
                  width: "100%",
                }}
                className="p-2 "
                defaultValue={post.content}
                {...register("content", { required: true })}
              />
              <input
                className="my-2"
                type="file"
                accept="image/*"
                name="image"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSetImage(e)}
              />

              <Button
                style={{ maxWidth: "500px", width: "100%" }}
                className="mt-3"
                variant="outline-primary"
                type="submit"
              >
                Update
              </Button>
            </form>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};
