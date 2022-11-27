### Description

This is the hasura cli backend for the app. This directory can be used to run the backend locally, and serve requests made by client. 

From the root of the `/hasura` directory we can run `hasura console` to open the 
console UI, which will be opened by default on `http://localhost:9695`.
You will need a hasura instance running at `http://localhost:8080` which will be serving as your 
graphql-engine server, to run this simplest way is to use docker image, which can be downloaded [here](https://hub.docker.com/r/hasura/graphql-engine).

Or use this docker compose file:
<details>
<summary>docker-compose.yaml</summary>

```
services:
  postgres:
    image: postgres:12
    restart: always
    volumes:
      - db_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    environment:
      POSTGRES_PASSWORD: postgrespassword
  graphql-engine:
    image: hasura/graphql-engine:v2.15.2
    ports:
      - "8080:8080"
    depends_on:
      - "postgres"
    extra_hosts:
      - "dockerhost:192.168.43.136"
    restart: always
    environment:
      HASURA_GRAPHQL_DATABASE_URL: postgres://postgres:postgrespassword@postgres:5432/postgres
      ## enable the console served by server
      HASURA_GRAPHQL_ENABLE_CONSOLE: "true" # set to "false" to disable console
      ## enable debugging mode. It is recommended to disable this in production
      HASURA_GRAPHQL_DEV_MODE: "true"
      HASURA_GRAPHQL_ENABLED_LOG_TYPES: startup, http-log, webhook-log, websocket-log, query-log
      ## uncomment next line to set an admin secret
      # HASURA_GRAPHQL_ADMIN_SECRET: myadminsecretkey
      HASURA_GRAPHQL_ENABLE_REMOTE_SCHEMA_PERMISSIONS: "true"
      HASURA_GRAPHQL_EXPERIMENTAL_FEATURES: inherited_roles
      HASURA_GRAPHQL_CONSOLE_ASSETS_DIR: "/srv/console-assets"
      MY_WEBHOOK: "https://6f03t.sse.codesandbox.io"
volumes:
  db_data:
```

</details>


This can be run against the react client (instagram front-end app) to run and test locally. Auth needs to be setup and pointed to your
local instance to get the whole flow working.
