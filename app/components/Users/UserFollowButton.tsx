import React, { Dispatch, SetStateAction } from 'react'
import { mutate } from 'swr'
// Hooks
import { AutoRelationshipsUrl } from '../../hooks/useRelationshipsSWR'
//Module
import { Auth } from '../../modules/Auth'
//Bootstrap
import Button from 'react-bootstrap/Button'

// reload処理をさせる場合は,stateを変更する関数をPropさせる
type FollowButtonProps = {
  id: string,
  className?: string
  reload_func: Dispatch<SetStateAction<boolean>>
}

export const UserFollowButton: React.FC<FollowButtonProps> = ({ id, className, reload_func }) => {
  const UnFollowRequestUrl = `${process.env.NEXT_PUBLIC_BASE_URL}relationships?id=${id}`

  const config = {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${Auth.getToken()}`
    }
  }

  const handleClick = () => {

    fetch(UnFollowRequestUrl, config)
      .then((res) => res.json())
      .then((data) => {
        // console.log({ FollowRequestUrl })
        // console.log({ data })
        mutate(AutoRelationshipsUrl)
        reload_func(true)
      })
  }
  if (className === undefined) {
    return (<Button variant="outline-primary" style={{ width: "100%" }} onClick={handleClick}>Follow</Button >)
  } else {
    return (<Button variant="outline-primary" className={className} style={{ width: "100%" }} onClick={handleClick}>Follow</Button >)
  }
}
