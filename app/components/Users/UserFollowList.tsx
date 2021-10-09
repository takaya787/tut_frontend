import Link from "next/link";
//Components
import { External_Image } from "../External_Image";
//types
import { FollowType } from "../../types/FollowType";
//Bootstrap
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

type UserFollowListProps = {
  follows: FollowType[];
};

export const UserFollowList: React.FC<UserFollowListProps> = ({ follows }) => {
  return (
    <section>
      <ul className="follows">
        {follows.map((follow) => (
          <Link
            href={{
              pathname: "/users/[id]",
              query: { id: follow.id },
            }}
          >
            <li key={follow.id} className="my-2 border-bottom" role="button">
              <Container>
                <Row>
                  <Col xs={2} md={2} lg={2} className="pl-2">
                    <External_Image
                      src={follow.gravator_url}
                      alt="User icon"
                      width={50}
                      height={50}
                      className="rounded-circle"
                    />
                  </Col>
                  <Col xs={10} md={10} lg={10}>
                    <p className="text-primary mb-1">{follow.name}</p>
                  </Col>
                </Row>
              </Container>
            </li>
          </Link>
        ))}
      </ul>
    </section>
  );
};
