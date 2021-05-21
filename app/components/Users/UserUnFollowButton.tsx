import React, { Dispatch, SetStateAction } from 'react'
import { mutate } from 'swr'
// Hooks
import { AutoRelationshipsUrl } from '../../hooks/useRelationshipsSWR'
//Module
import { Auth } from '../../modules/Auth'
//Bootstrap
import Button from 'react-bootstrap/Button'

// reload処理をさせる場合は,stateを変更する関数をPropさせる
type UnFollowButtonProps = {
  id: string,
  className?: string,
  reload_func: Dispatch<SetStateAction<boolean>>
}

export const UserUnFollowButton: React.FC<UnFollowButtonProps> = ({ id, className, reload_func }) => {
  const FollowRequestUrl = `${process.env.NEXT_PUBLIC_BASE_URL}relationships/${id}`

  const config = {
    method: "DELETE",
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${Auth.getToken()}`
    }
  }

  const handleClick = () => {

    fetch(FollowRequestUrl, config)
      .then((res) => res.json())
      .then((data) => {
        // console.log({ FollowRequestUrl })
        // console.log({ data })
        mutate(AutoRelationshipsUrl)
        reload_func(true)
      })
  }
  if (className === undefined) {
    return (<Button variant="secondary" style={{ width: "100%" }} onClick={handleClick}>UnFollow</Button >)
  } else {
    return (<Button variant="secondary" className={className} style={{ width: "100%" }} onClick={handleClick}>UnFollow</Button >)
  }
}
