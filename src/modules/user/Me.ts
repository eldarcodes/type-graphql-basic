import { MyContext } from "src/types/MyContext";
import { Ctx, Query, Resolver } from "type-graphql";
import { User } from "./../../entity/User";

@Resolver()
export class MeResolver {
  @Query(() => User, { nullable: true })
  me(@Ctx() ctx: MyContext): Promise<User | undefined> | null {
    const id = ctx.req.session.userId;

    if (!id) {
      return null;
    }
    return User.findOne(id);
  }
}
