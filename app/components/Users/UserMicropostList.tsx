import React from "react";
import Link from 'next/link'
import TimeAgo from 'react-timeago'
//日本語に翻訳するなら必要
// import japaneseStrings from 'react-timeago/lib/language-strings/ja'
// import buildFormatter from 'react-timeago/lib/formatters/buildFormatter'
//types
import { MicropostType } from '../../types/Micropost'
//others
import Card from 'react-bootstrap/Card'

type MicropostListProps = {
  Microposts: MicropostType[],
  gravator_url: string,
  name: string
}

export const UserMicropostList: React.FC<MicropostListProps> = ({ Microposts, gravator_url, name }) => {
  //MicroPostの個数を計算
  const count_Microposts = (): number => {
    if (Microposts) {
      return Microposts.length
    } else {
      return 0
    }
  }

  return (
    <section>
      <h3>Microposts  ({count_Microposts()})</h3>
      <ul className="microposts">
        {Microposts.map(post =>
        (<li key={post.id} id={`micropost-${post.id}`}>
          <Card className="my-3" border='secondary'>
            <Card.Body className="p-3">
              <Link href={`/microposts/${post.id}`}>
                <div className="hover" role="button">
                  <Card.Title className="text-primary">{name}</Card.Title>
                  <div className="d-flex">
                    <img src={`${gravator_url}?s=50`} alt="User icon" width={50} height={50} className="mr-3" />
                    <p>{post.content}</p>
                  </div>
                </div>
              </Link>
              <footer className="blockquote-footer mt-3">
                Posted <TimeAgo date={new Date(post.created_at)} />
              </footer>
            </Card.Body>
          </Card>
        </li>
        ))
        }
      </ul>
    </section>
  )
}
