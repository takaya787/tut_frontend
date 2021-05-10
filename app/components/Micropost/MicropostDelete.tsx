import { useState, useContext, useEffect } from 'react'
import { mutate } from 'swr'
//Module
import { Auth } from '../../modules/Auth'
//Hooks
import { useUserSWR, AutoLoginUrl } from '../../hooks/useUserSWR'
//Context
import { FlashMessageContext } from '../../pages/_app'
//Bootstarap
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

type MicropostDeleteProps = {
  id: number,
  user_id: number
}
export const MicropostDelete: React.FC<MicropostDeleteProps> = ({ id, user_id }) => {
  //State一覧
  const [showButton, setShowButton] = useState(false)
  const [showModal, setShowModal] = useState(false);

  //Context呼び出し
  const { FlashDispatch } = useContext(FlashMessageContext)

  //ユーザー情報をHookから呼び出し
  const { user_data, has_user_key } = useUserSWR()
  //Micropost送信先用のUrl
  const Micropost_Delete_Url = process.env.NEXT_PUBLIC_BASE_URL + 'microposts/' + id

  //Delete処理の関数
  const handleDelete = () => {
    fetch(Micropost_Delete_Url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Auth.getToken()}`
      }
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

  //確認時に実行する関数
  const ConfirmedClick = () => {
    setShowModal(false);
    handleDelete()
  }

  //オープン時に、DeleteButtonを表示するかを決定
  useEffect(function () {
    if (user_data && has_user_key() && user_data.user.id === user_id) {
      setShowButton(true)
    } else {
      setShowButton(false)
    }
  }, [])

  return (
    <>
      { showButton && (
        <>
          <Button variant="danger" onClick={() => setShowModal(true)}>Delite</Button>
          <Modal show={showModal} onHide={() => setShowModal(false)} backdrop="static">
            <Modal.Header closeButton><Modal.Title><h3 className="text-danger">Caution</h3></Modal.Title></Modal.Header>
            <Modal.Body className="pb-1 m-0">
              <p className="text-danger font-weight-bold">Are you really sure to delete this micropost?</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="outline-secondary" className="mr-auto" onClick={() => setShowModal(false)}>No, It's mistake</Button>
              <Button variant="primary" onClick={() => ConfirmedClick()}>Yes, I understand</Button>
            </Modal.Footer>
          </Modal>
        </>
      )
      }
    </>
  )
}
