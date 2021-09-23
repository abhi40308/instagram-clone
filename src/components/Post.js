import React from "react";
import "../styles/App.css";
import { gql } from "apollo-boost";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import Like from "./Like.js";
import { timeDifferenceForDate, showBeforeDate } from "../utils/TimeDifference.js";
import { Container } from "react-bootstrap";

export const POST_INFO = gql`
  query($id: Int!) {
    Post(where: { id: { _eq: $id } }) {
      id
      caption
      created_at
      url
      User {
        avatar
        id
        name
      }
    }
  }
`;

function Post(props) {
  let postId = props.id ? props.id : props.match.params.id;

  const { loading, error, data } = useQuery(POST_INFO, {
    variables: { id: postId }
  });

  if (loading) return "";
  if (error) return `Error! ${error.message}`;

  return (
    <>
      <Container>
        {data.Post.filter(post => showBeforeDate(post.created_at) ).map((post, index) => (
          <article className="Post" key={index}>
            <header>
              <div className="Post-user">
                <div className="Post-user-avatar">
                  <Link to={"/user/" + post.User.id}>
                    <img alt={post.User.name} src={post.User.avatar} />
                  </Link>
                </div>
                <div className="Post-user-nickname">
                  <Link className="anchor-nodec" to={"/user/" + post.User.id}>
                    <span>{post.User.name}</span>
                  </Link>
                </div>
              </div>
            </header>
            <div className="Post-image">
              <div className="Post-image-bg">
                <img alt={post.caption} src={post.url} />
              </div>
            </div>
            <Like postId={postId} />
            <div className="Post-caption">
              <Link className="anchor-nodec" to={"/user/" + post.User.id}>
                <strong>{post.User.name}</strong>
              </Link>
              &nbsp;{post.caption}
            </div>
            <div className="Post-time">
              {timeDifferenceForDate(post.created_at)}
            </div>
          </article>
        ))}
      </Container>
    </>
  );
}

export default Post;
