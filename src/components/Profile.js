import { useQuery } from "@apollo/react-hooks";
import React from "react";
import { withRouter } from "react-router";
import { Container, Row, Col, Button } from "react-bootstrap";
import { gql } from "apollo-boost";
import { useAuth0 } from "../auth/react-auth0-wrapper";
import { Link } from "react-router-dom";

const USER_INFO = gql`
  query($id: String!) {
    User(where: { id: { _eq: $id } }) {
      email
      avatar
      last_seen
      name
      Posts_aggregate {
        aggregate {
          count
        }
      }
    }
    Post(where: { user_id: { _eq: $id } }) {
      url
      caption
      id
    }
  }
`;

function Profile(props) {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();

  const { loading, error, data } = useQuery(USER_INFO, {
    variables: { id: props.match.params.id }
  });

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  return (
    <>
      <Container className="container">
        {data.User.map((user, index) => (
          <Container className="profile-details">
            <Row>
              <Col xs={4}>
                <img
                  className="profile-avatar"
                  alt={user.name}
                  src={user.avatar}
                />
              </Col>
              <Col>
                <Row>
                  <Col className="profile-username" xs="auto">
                    {user.name}
                  </Col>

                  <Col className="profile-logout" xs={4}>
                    {isAuthenticated && (
                      <>
                        <Button
                          variant="outline-secondary"
                          className="profile-logout"
                          onClick={() => logout()}
                        >
                          Log Out
                        </Button>
                      </>
                    )}
                  </Col>
                  {/* <Col xs={4} /> */}
                </Row>
                <Row>
                  <Col className="profile-stats" xs="auto">
                    {user.Posts_aggregate.aggregate.count} posts
                  </Col>
                  <Col className="profile-stats" xs="auto">
                    followers
                  </Col>
                  <Col className="profile-stats" xs="auto">
                    following
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container>
        ))}
        <hr />
        <Row>
          {data.Post.map((post, index) => (
            <Link to={"/post/" + post.id}>
              <Col xs={4} className="profile-grid">
                <img
                  className="profile-post-image"
                  alt={post.caption}
                  src={post.url}
                />
              </Col>
            </Link>
          ))}
        </Row>
      </Container>
    </>
  );
}

export default withRouter(Profile);
