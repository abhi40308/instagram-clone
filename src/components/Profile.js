import { useQuery } from "@apollo/react-hooks";
import React from "react";
import { withRouter } from "react-router";
import { Container, Row, Col, Button } from "react-bootstrap";
import { gql } from "apollo-boost";
import { useAuth0 } from "../auth/react-auth0-wrapper";
import { Link } from "react-router-dom";
import Follow from "./Follow.js";

export const USER_INFO = gql`
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

export const NUMBER_OF_FOLLOWING = gql`
  query($id: String!) {
    Follow_aggregate(where: { follower_id: { _eq: $id } }) {
      aggregate {
        count
      }
    }
  }
`;

export const NUMBER_OF_FOLLOWERS = gql`
  query($id: String!) {
    Follow_aggregate(where: { following_id: { _eq: $id } }) {
      aggregate {
        count
      }
    }
  }
`;

function Profile(props) {
  const { isAuthenticated, logout, user } = useAuth0();

  const isLoggedUser = () => {
    if (user.sub === props.match.params.id) {
      return true;
    } else {
      return false;
    }
  };

  const { loading, error, data } = useQuery(USER_INFO, {
    variables: { id: props.match.params.id }
  });

  const dataFollowers = useQuery(NUMBER_OF_FOLLOWERS, {
    variables: { id: props.match.params.id }
  });

  const dataFollowing = useQuery(NUMBER_OF_FOLLOWING, {
    variables: { id: props.match.params.id }
  });

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  if (dataFollowing.loading) return "Loading...";
  if (dataFollowers.loading) return "Loading...";

  if (dataFollowing.error) return `Error! ${error.message}`;
  if (dataFollowers.error) return `Error! ${error.message}`;

  return (
    <>
      <Container className="container">
        <Container className="profile-details">
          {data.User.map((user, index) => (
            <Row key={index}>
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
                        {isLoggedUser() && (
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
                        {!isLoggedUser() && (
                          <Follow id={props.match.params.id} />
                        )}
                      </>
                    )}
                  </Col>
                </Row>
                <Row>
                  <Col className="profile-stats" xs="auto">
                    <strong>{user.Posts_aggregate.aggregate.count}</strong>{" "}
                    posts
                  </Col>
                  <Col className="profile-stats" xs="auto">
                    <strong>
                      {dataFollowers.data.Follow_aggregate.aggregate.count}
                    </strong>{" "}
                    followers
                  </Col>
                  <Col className="profile-stats" xs="auto">
                    <strong>
                      {dataFollowing.data.Follow_aggregate.aggregate.count}
                    </strong>{" "}
                    following
                  </Col>
                </Row>
              </Col>
            </Row>
          ))}
        </Container>
        <hr />
        <Row>
          {data.Post.map((post, index) => (
            <Link to={"/post/" + post.id} key={index}>
              <Col xs={4} className="profile-grid">
                <div class="profile-post-image">
                  <img
                    className="profile-post-image"
                    alt={post.caption}
                    src={post.url}
                  />
                </div>
              </Col>
            </Link>
          ))}
        </Row>
      </Container>
    </>
  );
}

export default withRouter(Profile);
