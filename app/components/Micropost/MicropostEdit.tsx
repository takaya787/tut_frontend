import { useState, useContext, useEffect, Dispatch, SetStateAction } from 'react'
//Module
import { Auth } from '../../modules/Auth'
//Hooks
import { useUserSWR } from '../../hooks/useUserSWR'
//Context
import { FlashMessageContext } from '../../pages/_app'
//others
import Button from 'react-bootstrap/Button'


type MicropostEditProps = {
  id: number,
  user_id: number,
  isEdit: boolean,
  setIsEdit: Dispatch<SetStateAction<boolean>>,
}
export const MicropostEdit: React.FC<MicropostEditProps> = ({ id, user_id, isEdit, setIsEdit }) => {
  //State一覧
  const [showButton, setShowButton] = useState(false)

  //Context呼び出し
  const { FlashDispatch } = useContext(FlashMessageContext)

  //ユーザー情報をHookから呼び出し
  const { user_data, has_user_key } = useUserSWR()
  //Micropost送信先用のUrl
  const Micropost_Edit_Url = process.env.NEXT_PUBLIC_BASE_URL + 'microposts/' + id

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
      {showButton && !isEdit && (
        <Button variant="primary" onClick={() => setIsEdit(true)}>Edit</Button>
      )}
      {showButton && isEdit && (
        <Button variant="primary" onClick={() => setIsEdit(false)}>Close</Button>
      )}
    </>
  )
}
