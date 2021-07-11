import { useState } from 'react'
import { useRouter } from 'next/router';
// Bootstrap
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
//Module
import { Auth } from '../../modules/Auth'
//hooks
import { useUserSWR } from '../../hooks/useUserSWR'
import { useFlashReducer } from '../../hooks/useFlashReducer'

type UserDeleteButtonProps = {
  id: number
}

export const UserDeleteButton: React.FC<UserDeleteButtonProps> = ({ id }) => {

  const [showModal, setShowModal] = useState(false);
  const UserDeleteUrl = process.env.NEXT_PUBLIC_BASE_URL + 'users/' + id
  const router = useRouter()

  // userdataをSWRから取り出す
  const { user_data } = useUserSWR()

  //useFlashReducerを読み込み
  const { FlashReducer } = useFlashReducer()

  const handleDelete = () => {
    fetch(UserDeleteUrl, {
      method: 'DELETE', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Auth.getToken()}`
      }
    }).then(res => {
      //statusがerrorだとそれを表示させる
      if (!res.ok) {
        res.json()
          .then((res_error): any => {
            //messageがあればFlashで表示させる
            if (res_error.hasOwnProperty('message')) {
              FlashReducer({ type: "DANGER", message: res_error.message })
            }
          })
      } else {
        return res.json()
      }
    })
      .then((data): any => {
        //statusがokayでなければ、dataがundefinedになる
        if (data == undefined) {
          return
        }
        console.log({ data });
        FlashReducer({ type: "SUCCESS", message: "User is deleted successfully" })
        if (user_data && user_data.user.id === id) {
          Auth.logout()
          router.push('/')
        }
      })
  }

  const ConfirmedClick = () => {
    setShowModal(false);
    handleDelete()
  }

  return (
    <>
      <Button variant="outline-danger" onClick={() => setShowModal(true)}>User Delite</Button>
      <Modal show={showModal} onHide={() => setShowModal(false)} backdrop="static">
        <Modal.Header closeButton><Modal.Title><h3 className="text-danger">Caution</h3></Modal.Title></Modal.Header>
        <Modal.Body>
          <p className="text-danger font-weight-bold">Are you really sure to delete this user?</p>
          <p>All information including posts is deleted.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" className="mr-auto" onClick={() => setShowModal(false)}>No, It's mistake</Button>
          <Button variant="primary" onClick={() => ConfirmedClick()}>Yes, I understand</Button>
        </Modal.Footer>
      </Modal>
    </>

  )
}
