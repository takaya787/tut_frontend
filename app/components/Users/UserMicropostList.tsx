import React from "react";
import Link from 'next/link'
import TimeAgo from 'react-timeago'
//日本語に翻訳するなら必要
// import japaneseStrings from 'react-timeago/lib/language-strings/ja'
// import buildFormatter from 'react-timeago/lib/formatters/buildFormatter'
//Component
import { External_Image } from '../External_Image'
//types
import { MicropostType } from '../../types/Micropost'
//others
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

type MicropostListProps = {
  microposts: MicropostType[],
  gravator_url: string,
  name: string,
  currentPage: number,
  maxPerPage: number,
  count: boolean
}

export const UserMicropostList: React.FC<MicropostListProps> = ({ microposts, gravator_url, name, currentPage, maxPerPage, count }) => {
  //MicroPostの個数を計算
  const count_Microposts = (): number => {
    if (microposts) {
      return microposts.length
    } else {
      return 0
    }
  }

  //Paginationの開始と終了時点を計算する
  const start_index = (currentPage - 1) * maxPerPage
  const end_index = start_index + maxPerPage

  return (
    <section>
      {count && (
        <h3>Microposts  ({count_Microposts()})</h3>
      )}
      <ul className="microposts">
        {microposts.slice(start_index, end_index).map(post =>
        (<li key={post.id} id={`micropost-${post.id}`}>
          <Card className="my-3" border='secondary'>
            <Card.Body className="p-1">
              <Link href={`/microposts/${post.id}`}>
                <div className="hover" role="button">
                  <Container>
                    <Row>
                      <Col md={2} className="ml-2 p-0">
                        <External_Image src={gravator_url} alt="User icon" width={50} height={50} className="rounded-circle" />
                      </Col>
                      <Col md={9}>
                        <p className="text-primary mb-1">{name}</p>
                        <p className="mb-1">{post.content}</p>
                      </Col>
                    </Row>
                  </Container>
                </div>
              </Link>
              <footer className="blockquote-footer mt-1">
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
