import React, { useEffect, useState } from 'react';
import '../styles/App.css';
import Header from './Header.js';
import Post from './Post.js';
import Profile from './Profile.js';
import Feed from './Feed.js';
import Upload from './Upload.js';

// for authentication using auth0
import { useAuth0 } from '../auth/react-auth0-wrapper';

// for routing
import { Switch, Route } from 'react-router-dom';
import SecuredRoute from './SecuredRoute';

// for apollo client
import { ApolloProvider } from '@apollo/react-hooks';
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost';
import { setContext } from 'apollo-link-context';

// for toast notifications
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const httpLink = new HttpLink({
  uri: 'https://instagram-clone-3.herokuapp.com/v1/graphql',
});

function App() {
  const { isAuthenticated } = useAuth0();
  // used state to get accessToken through getTokenSilently(), the component re-renders when state changes, thus we have
  // our accessToken in apollo client instance.
  const [accessToken, setAccessToken] = useState('');
  const [client, setClient] = useState();
  const { getTokenSilently, loading } = useAuth0();

  useEffect(() => {
    const getAccessToken = async () => {
      try {
        const token = await getTokenSilently();
        setAccessToken(token);
        console.log(token);
      } catch (e) {
        console.log(e);
      }
    };
    getAccessToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const authLink = setContext((_, { headers }) => {
      const token = accessToken;
      if (token) {
        return {
          headers: {
            ...headers,
            authorization: `Bearer ${token}`,
          },
        };
      } else {
        return {
          headers: {
            ...headers,
          },
        };
      }
    });

    const client = new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache(),
    });
    setClient(client);
  }, [accessToken]);

  // used for toast notifications
  toast.configure();

  if (loading) {
    return 'Loading...';
  }

  return (
    <ApolloProvider client={client}>
      <Header />
      {isAuthenticated && <Upload />}
      <Switch>
        <Route exact path='/' component={Feed} />
        <Route path={'/post/:id'} component={Post} />
        <SecuredRoute path={'/user/:id'} component={Profile} />
      </Switch>
    </ApolloProvider>
  );
}

export default App;
