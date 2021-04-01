import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import * as Express from "express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";

import { Register } from "./modules/user/Register";

const start = async () => {
  await createConnection();

  const schema = await buildSchema({
    resolvers: [Register],
  });

  const apolloServer = new ApolloServer({
    schema,
  });

  const app = Express();

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () =>
    console.log("Server started on http://localhost:4000")
  );
};

start();
