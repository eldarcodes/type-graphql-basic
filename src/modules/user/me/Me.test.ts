import { testConn } from "../../../test-utils/testConn";
import { Connection } from "typeorm";
import { gCall } from "./../../../test-utils/gCall";
import faker from "faker";
import { User } from "./../../../entity/User";

let conn: Connection;
beforeAll(async () => {
  conn = await testConn();
});

afterAll(async () => {
  await conn.close();
});

const meQuery = `{
    me {
      id
      firstName
      lastName
      email
    }
}`;

describe("Me", () => {
  it("get user", async () => {
    const user = await User.create({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    }).save();

    const response = await gCall({
      source: meQuery,
      userId: user.id,
    });

    expect(response).toMatchObject({
      data: {
        me: {
          id: String(user.id),
          firstName: user.firstName,
          email: user.email,
        },
      },
    });
  });

  it("return null", async () => {
    const response = await gCall({
      source: meQuery,
    });

    expect(response).toMatchObject({
      data: {
        me: null,
      },
    });
  });
});
