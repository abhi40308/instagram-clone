import React, { useState, useRef } from "react";
import "../styles/App.css";
import { gql } from "apollo-boost";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { useAuth0 } from "../auth/react-auth0-wrapper";

const FETCH_LIKES = gql`
  query($id: Int!, $userId: String!) {
    Post(where: { id: { _eq: $id } }) {
      Likes_aggregate {
        aggregate {
          count
        }
      }
      Likes(where: { user_id: { _eq: $userId } }) {
        id
      }
    }
  }
`;

const LIKE_POST = gql`
  mutation($postId: Int!, $userId: String!) {
    insert_Like(objects: [{ post_id: $postId, user_id: $userId }]) {
      affected_rows
    }
  }
`;

const DELETE_LIKE = gql`
  mutation($postId: Int!, $userId: String!) {
    delete_Like(
      where: { user_id: { _eq: $userId }, post_id: { _eq: $postId } }
    ) {
      affected_rows
    }
  }
`;

function Like(props) {
  const { isAuthenticated, user } = useAuth0();

  // stores if the currently logged in user has liked the post
  const [liked, setLiked] = useState(false);
  // stores the number of likes
  const [countLikes, setCountLikes] = useState(-1);

  // will store value of userId for the lifetime of component
  const userId = useRef(null);

  if (isAuthenticated) {
    userId.current = user.sub;
  } else {
    userId.current = "none";
  }

  // like post mutation
  const [likePost] = useMutation(LIKE_POST, {
    variables: { postId: props.postId, userId: userId.current },
    refetchQueries: [
      {
        query: FETCH_LIKES,
        variables: { id: props.postId, userId: userId.current }
      }
    ]
  });

  // delete post mutation
  const [deleteLike] = useMutation(DELETE_LIKE, {
    variables: { postId: props.postId, userId: userId.current },
    refetchQueries: [
      {
        query: FETCH_LIKES,
        variables: { id: props.postId, userId: userId.current }
      }
    ]
  });

  // fetch number of likes and array with like_id if user has already liked the post or an empty array
  const { loading, error, data } = useQuery(FETCH_LIKES, {
    variables: { id: props.postId, userId: userId.current }
  });

  // if above useQuery data is not loaded
  if (loading) return "Loading...";
  // if data fetch failed
  if (error) return `Error! ${error.message}`;

  // countLikes is used to ensure that it should only run for the first time
  if (countLikes === -1) {
    // if the user has already liked the post, we know that data has loaded now so we can reference data.Post
    if (data.Post[0].Likes.length > 0) {
      setLiked(true);
    }

    // store value of number of likes in state, we are putting check conditions to prevent infinite loops
    setCountLikes(data.Post[0].Likes_aggregate.aggregate.count);
  }

  return (
    <div className="post-like-container">
      {isAuthenticated && (
        <>
          {!liked && (
            <button
              className="post-like-button-white button-nodec"
              onClick={() => {
                likePost();
                setLiked(true);
                setCountLikes(countLikes + 1);
              }}
            />
          )}
          {liked && (
            <button
              className="post-like-button-black button-nodec"
              onClick={() => {
                deleteLike();
                setLiked(false);
                setCountLikes(countLikes - 1);
              }}
            />
          )}
        </>
      )}
      {countLikes ? <span className="Post-likes">{countLikes} likes</span> : null}
    </div>
  );
}

export default Like;
