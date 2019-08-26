import React, { useState } from "react";
import "../styles/App.css";
import Header from "./Header.js";
import Post from "./Post.js";
import Profile from "./Profile.js";
import Feed from "./Feed.js";
import Upload from "./Upload.js"

// for authentication using auth0
import { useAuth0 } from "../auth/react-auth0-wrapper";

// for routing
import { Switch, Route } from "react-router-dom";
import SecuredRoute from "./SecuredRoute";

// for apollo client
import { ApolloProvider } from "@apollo/react-hooks";
import { ApolloClient, HttpLink, InMemoryCache } from "apollo-boost";
import { setContext } from "apollo-link-context";

function App() {

  const { isAuthenticated, user } = useAuth0();

  // used state to get accessToken through getTokenSilently(), the component re-renders when state changes, thus we have
  // our accessToken in apollo client instance.
  const [accessToken, setAccessToken] = useState("");

  const { getTokenSilently, loading } = useAuth0();
  if (loading) {
    return "Loading...";
  }

  // get access token
  const getAccessToken = async () => {
    // getTokenSilently() returns a promise
    try {
      const token = await getTokenSilently();
      setAccessToken(token);
      // console.log(token);
    } catch (e) {
      console.log(e);
    }
  };
  getAccessToken();

  // for apollo client
  const httpLink = new HttpLink({
    uri: "https://instagram-clone-3.herokuapp.com/v1/graphql"
  });

  const authLink = setContext((_, { headers }) => {
    const token = accessToken;
    if (token) {
      return {
        headers: {
          ...headers,
          authorization: `Bearer ${token}`
        }
      };
    } else {
      return {
        headers: {
          ...headers
        }
      };
    }
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
  });

  return (
    <ApolloProvider client={client}>
      <Header />
      {isAuthenticated && <Upload />}
      <Switch>
        <Route exact path="/" component={Feed} />
        <Route path={"/post/:id"} component={Post} />
        <SecuredRoute path={"/user/:id"} component={Profile} />
        {/* <SecuredRoute path="/new-post" component={NewPost} />
        <SecuredRoute path={"/user/:id"} component={Profile} /> */}
      </Switch>
    </ApolloProvider>
  );
}

export default App;