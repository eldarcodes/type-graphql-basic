import { Arg, Mutation, Resolver } from "type-graphql";
import { User } from "./../../entity/User";
import { redis } from "./../../redis";
import { confirmationPrefix } from "./constants/redisPrefixes";

declare module "express-session" {
  export interface SessionData {
    userId: number;
  }
}

@Resolver()
export class ConfirmUserResolver {
  @Mutation(() => Boolean)
  async confirmUser(
    @Arg("token") token: string
    // @Ctx() ctx: MyContext
  ): Promise<boolean> {
    const userId = await redis.get(confirmationPrefix + token);

    if (!userId) {
      return false;
    }

    User.update({ id: parseInt(userId, 10) }, { confirmed: true });
    redis.del(token);

    return true;
  }
}
