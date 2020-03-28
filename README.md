# Instagram Clone using React, Apollo-React-Client and Hasura GraphQl Engine

Note: This project was build as a part of a tutorial blog post, check out the tutorial [here](https://hasura.io/blog/instagram-clone-react-graphql-hasura-part1/).

See live demo [here](https://priceless-goldstine-20854c.netlify.com/)(may be slow to load due to free hosting). This application demonstrates consuming GraphQl Api provided by [Hasura GraphQL Engine](https://hasura.io) using a react app. Uses react-apollo GraphQL client to make requests to the api. Users can create account using [Auth0 JWT authentication](https://auth0.com/) which is then verified by Hasura. React-router is used to provide SPA experience.

Authenticated users can:
* Create new posts
* Like posts
* Follow user profiles
* Realtime updates when other users upvote a post, create a new post or follow user profile (updating apollo cache).

## Installation

Installing and running on local system require:
* [Setting up Hasura Server](https://docs.hasura.io/1.0/graphql/manual/getting-started/heroku-simple.html) (deployed on Heroku), and creating required tables
* [Setting up Auth0](https://auth0.com/docs/quickstart/spa/react/01-login#configure-auth0)
* See [this](https://docs.hasura.io/1.0/graphql/manual/guides/integrations/auth0-jwt.html) guide for Auth0 JWT Integration with Hasura
* Clone or download this repo, install the required packages and run `npm start`

## npm packages:

You will need the following npm packages:
* [react-router-dom](https://www.npmjs.com/package/react-router-dom)
* [react-bootstrap](https://www.npmjs.com/package/react-bootstrap)
* [apollo-boost](https://www.npmjs.com/package/apollo-boost)
* [@apollo/react-hooks](https://www.npmjs.com/package/@apollo/react-hooks)
* [apollo-link-context](https://www.npmjs.com/package/apollo-link-context)
* [@apollo/react-hoc](https://www.npmjs.com/package/@apollo/react-hoc)
* [graphql](https://www.npmjs.com/package/graphql)
* [@auth0/auth0-spa-js](https://www.npmjs.com/package/@auth0/auth0-spa-js)


## Creating tables 

Following tables required to be created:
```
type Post {
id - integer, primary key
caption - text
url - text
created_at - timestamp with time zone
user_id - text
}
 
type User {
name - text
last_seen - timestamp with time zone
avatar - text
email - text
id - text, primary key
}

type Like {
id - integer, primary key
user_id - text
post_id - integer
}

type Follow {
id - integer, primary key
follower_id - text
following_id - text
}
```
`Post.user_id` and `User.id` have object relationship in table `Post` and array relationship in table `User`. `Like.post_id` and `Post.id` have array relationship in table `Post`. Row and Column permissions should be given accordingly.

## User Authentication

See [Setting up Auth0 with react](https://auth0.com/docs/quickstart/spa/react/01-login#configure-auth0) and [this](https://docs.hasura.io/1.0/graphql/manual/guides/integrations/auth0-jwt.html) guide for Auth0 JWT Integration with Hasura. Here we are using Auth0 Universal Login.

## Realtime updates

Using apollo cache and react state, we can give realtime updates for likes, new posts and follows. Apollo `refetchQueries` function updates apollo cache with refetched data.

## Preview
App: 
![App](https://blog.hasura.io/content/images/2019/08/Final_app.png)  

User Profile:
![User Profile](https://blog.hasura.io/content/images/2019/08/Now_app3.png)
