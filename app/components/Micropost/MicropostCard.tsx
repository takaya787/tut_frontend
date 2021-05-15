import React, { useState } from "react";
import Link from 'next/link'
import TimeAgo from 'react-timeago'
//日本語に翻訳するなら必要
// import japaneseStrings from 'react-timeago/lib/language-strings/ja'
// import buildFormatter from 'react-timeago/lib/formatters/buildFormatter'
//Component
import { External_Image } from '../External_Image'
import { MicropostDelete } from '../Micropost/MicropostDelete'
import { MicropostEdit } from '../Micropost/MicropostEdit'
//types
import { MicropostType } from '../../types/Micropost'
//others
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

type MicropostCardProps = {
  name: string,
  gravator_url: string
  post: MicropostType
}

export const MicropostCard: React.FC<MicropostCardProps> = ({ post, name, gravator_url }) => {

  //State一覧
  const [isEdit, setIsEdit] = useState(false)
  return (
    <Card className="my-3" border='secondary'>
      <Card.Body className="p-1">
        <Link href={`/microposts/${post.id}`}>
          <div className="hover" role="button">
            <Container>
              <Row>
                <Col sm={2} md={2} lg={2} className="pl-2">
                  <External_Image src={gravator_url} alt="User icon" width={50} height={50} className="rounded-circle" />
                </Col>
                <Col sm={10} md={10} lg={10}>
                  <p className="text-primary mb-1">{name}</p>
                  <p className="mb-1">{post.content}</p>
                </Col>
              </Row>
              {/* 投稿に写真があれば表示 */}
              {post.image_url && (
                <Row className="justify-content-center mb-3">
                  <External_Image src={post.image_url} alt="Micropost Image" width={200} height={200} className="mx-auto" />
                </Row>
              )}
            </Container>
          </div>
        </Link>
        <footer className="blockquote-footer py-2 my-0 mx-auto" style={{ width: "80%" }}>
          Posted <TimeAgo date={new Date(post.created_at)} />
          <span className="float-center mx-3"><MicropostEdit id={post.id} user_id={post.user_id} isEdit={isEdit} setIsEdit={setIsEdit} /></span>
          <span className="float-right"><MicropostDelete id={post.id} user_id={post.user_id} /></span>
        </footer>
        {isEdit && (
          <p>editfrom</p>
        )}
      </Card.Body>
    </Card>
  )
}
