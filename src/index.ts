import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import * as Express from "express";
import { buildSchema, Query, Resolver } from "type-graphql";

@Resolver()
class SampleResolver {
  @Query(() => String)
  hello() {
    return "hello!";
  }
}

const start = async () => {
  const schema = await buildSchema({
    resolvers: [SampleResolver],
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
