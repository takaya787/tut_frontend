import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
//Bootstrap
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
//Moudle
import { Auth } from "../../modules/Auth";
//hooks
import { useFlashReducer } from "../../hooks/useFlashReducer";
import { useFeedFetch } from "../../hooks/useFeedFetch";

//Micropost送信先用のUrl
const Micropost_Url = process.env.NEXT_PUBLIC_BASE_URL + "microposts";

export const MicropostForm: React.FC = () => {
  //投稿画像データを所持するstate
  const [micropostImage, setMicropostImage] = useState<File>();

  //useFlashReducerを読み込み
  const { FlashReducer } = useFlashReducer();

  //useFeedFetchを読み込み
  const { reloadFetching } = useFeedFetch();

  //登校画像データのpreviewを表示
  const getPreviewMicropostImage = useMemo((): React.ReactElement | void => {
    if (!micropostImage) {
      return;
    }
    const PreviewUrl = URL.createObjectURL(micropostImage);
    return <img src={PreviewUrl} className="my-3" style={{ width: "100%" }} />;
  }, [micropostImage]);

  //写真変更のonChange
  const handleSetImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const imageFile: File = e.target.files[0];
    setMicropostImage(imageFile);
  };

  //input fileをButtonで押す
  const handleClickInputFile = () => {
    const target = document.getElementById("image");
    if (!target) {
      return;
    }
    target.click();
  };

  //useForm関連メソッド
  const { register, handleSubmit } = useForm();
  const onSubmit = (value: { content: string }): void => {
    const formData = new FormData();
    formData.append("micropost[content]", value.content);
    if (micropostImage) {
      formData.append("micropost[image]", micropostImage);
    }

    const config = {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${Auth.getToken()}`,
      },
      body: formData,
    };

    fetch(Micropost_Url, config)
      .then((response) => {
        if (!response.ok) {
          response.json().then((res): any => {
            if (res.hasOwnProperty("message")) {
              //authentication関連のエラー処理
              FlashReducer({ type: "DANGER", message: res.message });
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
        // Micropostimageを初期化
        setMicropostImage(undefined);
        reloadFetching();
        FlashReducer({ type: "SUCCESS", message: data.message });
      })
      .catch((error) => {
        console.error(error);
        FlashReducer({ type: "DANGER", message: "Error" });
      });
  };

  // const onTestSubmit = (value) => {
  //   const formData = new FormData()
  //   formData.append('micropost[content]', value.content)
  //   formData.append('micropost[image]', micropostImage)
  //   console.log(formData.get('micropost[content]'))
  //   console.log(formData.get('micropost[image]'))
  // }

  return (
    <Row>
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
            {...register("content", { required: true })}
          />
          <input
            className="my-2"
            type="file"
            accept="image/*"
            name="image"
            id="image"
            style={{ display: "none" }}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSetImage(e)}
          />
          {getPreviewMicropostImage}
          <Button
            style={{ maxWidth: "300px", width: "70%" }}
            variant="outline-secondary"
            onClick={handleClickInputFile}
          >
            ファイルを選択
          </Button>

          <Button
            style={{ maxWidth: "500px", width: "100%" }}
            className="mt-3"
            variant="outline-primary"
            type="submit"
          >
            Submit
          </Button>
        </form>
      </div>
    </Row>
  );
};
