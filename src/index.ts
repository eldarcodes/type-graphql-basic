import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import Express from "express";
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
    // formatError: (error: GraphQLError): GraphQLFormattedError => {
    //   if (error && error.extensions) {
    // error.extensions.code = "GRAPHQL_VALIDATION_FAILED";
    //   }
    //   return error;
    // },
  });

  const app = Express();

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () =>
    console.log("Server started on http://localhost:4000")
  );
};

start();
