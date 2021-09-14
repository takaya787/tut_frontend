import Link from "next/link";
//Bootstrap
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
// hooks
import { useRelationshipsSWR } from "../../hooks/useRelationshipsSWR";

export const UserRelationshipModal: React.FC<{ user_id: number }> = ({ user_id }) => {
  //Relationships情報をHookから読み込み
  const { relationships_data } = useRelationshipsSWR();

  return (
    <>
      {relationships_data?.followers_index && relationships_data?.following_index && (
        <Row className="p-2 border border-info rounded">
          <Col sm={5} xs={5} className="text-secondary border-right">
            <Link href={`users/${user_id}/following`}>
              <div className="hover" role="button">
                <p className="text-secondary m-0">
                  {relationships_data.relationships.following.length}
                </p>
                <p className="text-secondary m-0">following</p>
              </div>
            </Link>
          </Col>
          <Col sm={6} xs={5}>
            <Link href={`users/${user_id}/followers`}>
              <div className="hover" role="button">
                <p className="text-secondary m-0">
                  {relationships_data.relationships.followers.length}
                </p>
                <p className="text-secondary m-0">followers</p>
              </div>
            </Link>
          </Col>
        </Row>
      )}
    </>
  );
};
