import React, { useState, useRef } from "react";
import "../styles/App.css";
import { gql } from "apollo-boost";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { useAuth0 } from "../auth/react-auth0-wrapper";
import { Button } from "react-bootstrap";
import { NUMBER_OF_FOLLOWERS, NUMBER_OF_FOLLOWING } from "./Profile.js";

const FETCH_FOLLWERS = gql`
  query($followingId: String!, $userId: String!) {
    Follow(
      where: {
        follower_id: { _eq: $userId }
        following_id: { _eq: $followingId }
      }
    ) {
      id
    }
  }
`;

const FOLLOW_USER = gql`
  mutation($followingId: String!, $userId: String!) {
    insert_Follow(
      objects: [{ follower_id: $userId, following_id: $followingId }]
    ) {
      affected_rows
    }
  }
`;

const UNFOLLOW_USER = gql`
  mutation($followingId: String!, $userId: String!) {
    delete_Follow(
      where: {
        follower_id: { _eq: $userId }
        following_id: { _eq: $followingId }
      }
    ) {
      affected_rows
    }
  }
`;

function Follow(props) {
  const { isAuthenticated, user } = useAuth0();

  // stores if the currently logged in user has followed the user
  const [followed, setFollowed] = useState(false);

  // stores if this is the first render of component
  const firstRun = useRef(true);

  // will store value of userId for the lifetime of component
  const userId = useRef(null);

  if (isAuthenticated) {
    userId.current = user.sub;
  } else {
    userId.current = "none";
  }

  // follow user mutation
  const [followUser] = useMutation(FOLLOW_USER, {
    variables: { followingId: props.id, userId: userId.current },
    refetchQueries: [
      {
        query: FETCH_FOLLWERS,
        variables: { followingId: props.id, userId: userId.current }
      },
      {
        query: NUMBER_OF_FOLLOWERS,
        variables: { id: props.id }
      },
      {
        query: NUMBER_OF_FOLLOWING,
        variables: { id: userId.current }
      }
    ]
  });

  // unfollow user mutation
  const [unfollowUser] = useMutation(UNFOLLOW_USER, {
    variables: { followingId: props.id, userId: userId.current },
    refetchQueries: [
      {
        query: FETCH_FOLLWERS,
        variables: { followingId: props.id, userId: userId.current }
      },
      {
        query: NUMBER_OF_FOLLOWERS,
        variables: { id: props.id }
      },
      {
        query: NUMBER_OF_FOLLOWING,
        variables: { id: userId.current }
      }
    ]
  });

  // fetch array with id if current user already follows the user or an empty array
  const { loading, error, data } = useQuery(FETCH_FOLLWERS, {
    variables: { followingId: props.id, userId: userId.current }
  });

  // if above useQuery data is not loaded
  if (loading) return "Loading...";
  // if data fetch failed
  if (error) return `Error! ${error.message}`;

  // firstRun is used to ensure that it should only run for the first time
  if (firstRun.current) {
    // if current user already follows, set followed state variable to true
    if (data.Follow.length > 0) {
      setFollowed(true);
    }

    firstRun.current = false;
  }

  return (
    <div className="post-like-container">
      {!followed && (
        <Button
          variant="outline-secondary"
          className="profile-logout"
          onClick={() => {
            followUser();
            setFollowed(true);
          }}
        >
          Follow
        </Button>
      )}
      {followed && (
        <Button
          variant="outline-success"
          className="profile-logout"
          onClick={() => {
            unfollowUser();
            setFollowed(false);
          }}
        >
          Following
        </Button>
      )}
    </div>
  );
}

export default Follow;
