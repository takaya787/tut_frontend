import { useState, useEffect, Dispatch, SetStateAction } from 'react'
//Hooks
import { useUserSWR } from '../../hooks/useUserSWR'
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

  //ユーザー情報をHookから呼び出し
  const { user_data, has_user_key } = useUserSWR()

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
        <Button variant="outline-primary" onClick={() => setIsEdit(true)}>Edit</Button>
      )}
      {showButton && isEdit && (
        <Button variant="outline-secondary" onClick={() => setIsEdit(false)}>Close</Button>
      )}
    </>
  )
}
