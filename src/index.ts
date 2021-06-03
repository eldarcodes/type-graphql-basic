import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import Express from "express";
import { createConnection } from "typeorm";

import session from "express-session";
import connectRedis from "connect-redis";
import { redis } from "./redis";
import cors from "cors";
import { MyContext } from "./types/MyContext";
import { createSchema } from "./utils/createSchema";
import {
  fieldExtensionsEstimator,
  getComplexity,
  simpleEstimator,
} from "graphql-query-complexity";
import { CALCULATED_COMPLEXITY_MAX } from "./modules/user/constants/complexity";

const start = async () => {
  await createConnection();

  const schema = await createSchema();

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }: MyContext) => ({ req, res }),
    plugins: [
      {
        requestDidStart: () => ({
          didResolveOperation({ request, document }) {
            const complexity = getComplexity({
              schema,
              operationName: request.operationName,
              query: document,
              variables: request.variables,
              estimators: [
                fieldExtensionsEstimator(),
                simpleEstimator({ defaultComplexity: 1 }),
              ],
            });
            if (complexity > CALCULATED_COMPLEXITY_MAX) {
              throw new Error(
                `Sorry, too complicated query! ${complexity} is over ${CALCULATED_COMPLEXITY_MAX} that is the max allowed complexity.`
              );
            }
            console.log("Used query complexity points:", complexity);
          },
        }),
      },
    ],
  });

  const RedisStore = connectRedis(session);

  const app = Express();

  app.use(
    cors({
      credentials: true,
      origin: "http://localhost:3000",
    })
  );
  app.use(
    session({
      store: new RedisStore({
        client: redis as any,
      }),
      name: "jid",
      secret: "secret_for_cookie777",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
      },
    })
  );

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(4000, () => {
    console.log("Server started on http://localhost:4000");
  });
};

start();
