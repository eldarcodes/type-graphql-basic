import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { User } from "./../../entity/User";
import { compare } from "bcryptjs";
import { MyContext } from "src/types/MyContext";

declare module "express-session" {
  export interface SessionData {
    userId: number;
  }
}

@Resolver()
export class LoginResolver {
  @Mutation(() => User, { nullable: true })
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() ctx: MyContext
  ): Promise<User | null> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return null;
    }

    const valid = await compare(password, user.password);

    if (!valid) {
      return null;
    }

    if (!user.confirmed) {
      return null;
    }

    ctx.req.session.userId = user.id;

    return user;
  }
}
