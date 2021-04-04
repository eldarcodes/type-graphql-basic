import { createConnection } from "typeorm";

export const testConn = (drop: boolean = false) => {
  return createConnection({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "mirzabekov",
    password: "eldar",
    database: "typegraphql-test",
    dropSchema: drop,
    synchronize: drop,
    entities: [__dirname + "/../entity/**/*.*"],
  });
};
